import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keys } = req.body || {};

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ error: 'Keys array is required.' });
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
    return res.status(200).json({ success: true, deleted: result.Deleted || [] });
  } catch (error) {
    console.error('[R2 Delete Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to delete objects from storage.' });
  }
}
