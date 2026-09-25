import crypto from 'crypto';
import { PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, checkRateLimit, validateOrigin, verifyAdminSession } from '../_lib/utils.js';

const ALLOWED_EXTENSIONS = {
  // Images (max 5MB)
  jpg: { mime: ['image/jpeg'], maxSize: 5 * 1024 * 1024, type: 'image' },
  jpeg: { mime: ['image/jpeg'], maxSize: 5 * 1024 * 1024, type: 'image' },
  png: { mime: ['image/png'], maxSize: 5 * 1024 * 1024, type: 'image' },
  webp: { mime: ['image/webp'], maxSize: 5 * 1024 * 1024, type: 'image' },
  // Videos (max 25MB)
  mp4: { mime: ['video/mp4'], maxSize: 25 * 1024 * 1024, type: 'video' },
  webm: { mime: ['video/webm'], maxSize: 25 * 1024 * 1024, type: 'video' },
  // Documents (max 5MB)
  pdf: { mime: ['application/pdf'], maxSize: 5 * 1024 * 1024, type: 'file' },
};

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  const action = req.query?.action || req.url?.split('/')?.filter(Boolean)?.pop()?.split('?')?.[0];

  if (action === 'presign') {
    return handlePresign(req, res);
  }
  if (action === 'delete') {
    return handleDelete(req, res);
  }

  return res.status(404).json({ error: `R2 action '${action}' not found.` });
}

// ------------------------- 1. Presign Upload -------------------------
async function handlePresign(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  const allowed = checkRateLimit(`presign:${ip}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded: maximum 20 upload requests per hour.' });
  }

  try {
    const { filename, mimeType, fileSize, reviewId = 'draft' } = req.body || {};

    if (!filename || !mimeType || !fileSize) {
      return res.status(400).json({ error: 'Missing required file metadata (filename, mimeType, fileSize).' });
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    const config = ALLOWED_EXTENSIONS[ext];

    if (!config) {
      return res.status(400).json({ error: `Unsupported file extension .${ext}. Allowed formats: jpg, jpeg, png, webp, mp4, webm, pdf.` });
    }

    if (!config.mime.includes(mimeType)) {
      return res.status(400).json({ error: `Declared file type does not match extension .${ext}.` });
    }

    if (fileSize > config.maxSize) {
      const maxMb = config.maxSize / (1024 * 1024);
      return res.status(400).json({ error: `File exceeds maximum allowed size of ${maxMb}MB for this file type.` });
    }

    const uuid = crypto.randomUUID();
    const rawReviewId = typeof reviewId === 'string' ? reviewId.replace(/[^a-zA-Z0-9-_]/g, '') : '';
    const safeReviewId = rawReviewId && rawReviewId.length <= 64 ? rawReviewId : `draft-${crypto.randomBytes(4).toString('hex')}`;
    const objectKey = `reviews/${safeReviewId}/${uuid}.${ext}`;

    const r2 = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: mimeType,
    });

    // Short-lived presigned upload window: 180 seconds (3 minutes)
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 180 });

    const r2PublicUrl = (process.env.VITE_R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
    const publicUrl = r2PublicUrl ? `${r2PublicUrl}/${objectKey}` : `/${objectKey}`;

    return res.status(200).json({
      uploadUrl,
      key: objectKey,
      publicUrl,
      type: config.type,
      filename,
    });
  } catch (error) {
    console.error('[R2 Presign Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to generate upload presigned URL.' });
  }
}

// ------------------------- 2. Delete Objects (Admin Only) -------------------------
async function handleDelete(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Destruction operation requires authenticated admin session
  const isAdmin = verifyAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required to delete storage objects.' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const allowed = checkRateLimit(`r2-delete:${ip}`, 30, 60 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded for storage deletions.' });
  }

  try {
    const { keys } = req.body || {};

    if (!Array.isArray(keys) || keys.length === 0 || keys.length > 10) {
      return res.status(400).json({ error: 'Keys array is required and must contain between 1 and 10 items.' });
    }

    // STRICT VALIDATION: Only allow deletion of keys within reviews/ folder matching UUID pattern
    const keyRegex = /^reviews\/[a-zA-Z0-9-_]+\/[a-f0-9-]+\.[a-z0-9]+$/;
    for (const k of keys) {
      if (typeof k !== 'string' || !keyRegex.test(k)) {
        return res.status(400).json({ error: 'Unauthorized key path pattern.' });
      }
    }

    const r2 = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';

    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: keys.map(k => ({ Key: k })),
        Quiet: false,
      },
    };

    const result = await r2.send(new DeleteObjectsCommand(deleteParams));
    return res.status(200).json({ success: true, deletedCount: (result.Deleted || []).length });
  } catch (error) {
    console.error('[R2 Delete Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to delete objects from storage.' });
  }
}
