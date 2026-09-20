import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, checkRateLimit } from '../_lib/utils.js';

const ALLOWED_EXTENSIONS = {
  // Images (max 5MB)
  jpg: { mime: ['image/jpeg'], maxSize: 5 * 1024 * 1024, type: 'image' },
  jpeg: { mime: ['image/jpeg'], maxSize: 5 * 1024 * 1024, type: 'image' },
  png: { mime: ['image/png'], maxSize: 5 * 1024 * 1024, type: 'image' },
  webp: { mime: ['image/webp'], maxSize: 5 * 1024 * 1024, type: 'image' },
  gif: { mime: ['image/gif'], maxSize: 5 * 1024 * 1024, type: 'image' },
  // Videos (max 50MB)
  mp4: { mime: ['video/mp4'], maxSize: 50 * 1024 * 1024, type: 'video' },
  webm: { mime: ['video/webm'], maxSize: 50 * 1024 * 1024, type: 'video' },
  mov: { mime: ['video/quicktime', 'video/mp4'], maxSize: 50 * 1024 * 1024, type: 'video' },
  // Documents (max 10MB)
  pdf: { mime: ['application/pdf'], maxSize: 10 * 1024 * 1024, type: 'file' },
  zip: { mime: ['application/zip', 'application/x-zip-compressed'], maxSize: 10 * 1024 * 1024, type: 'file' },
  doc: { mime: ['application/msword'], maxSize: 10 * 1024 * 1024, type: 'file' },
  docx: { mime: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], maxSize: 10 * 1024 * 1024, type: 'file' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Client IP extraction
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit: max 20 presign requests per IP per hour (G2)
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
      return res.status(400).json({ error: `Unsupported file extension .${ext}` });
    }

    if (fileSize > config.maxSize) {
      const maxMb = config.maxSize / (1024 * 1024);
      return res.status(400).json({ error: `File exceeds maximum allowed size of ${maxMb}MB for this file type.` });
    }

    // Generate random UUID object key (never use raw user filename)
    const uuid = crypto.randomUUID();
    const safeReviewId = reviewId.replace(/[^a-zA-Z0-9-_]/g, '');
    const objectKey = `reviews/${safeReviewId}/${uuid}.${ext}`;

    const r2 = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: mimeType,
    });

    // Presigned PUT URL valid for 10 minutes (600 seconds)
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

    const r2PublicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
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
