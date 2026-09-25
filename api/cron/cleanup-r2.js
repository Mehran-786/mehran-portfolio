import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '../_lib/utils.js';

export default async function handler(req, res) {
  // Protect cron endpoint: verify Vercel Cron authorization header if CRON_SECRET is configured
  const authHeader = req.headers?.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized cron request.' });
  }

  try {
    const r2 = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';

    // List objects under reviews/
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: 'reviews/',
      MaxKeys: 1000,
    });

    const listResult = await r2.send(listCommand);
    const objects = listResult.Contents || [];

    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    // Filter objects older than 24 hours in draft or temporary directories
    const toDelete = objects.filter(obj => {
      const isOld = obj.LastModified && obj.LastModified.getTime() < twentyFourHoursAgo;
      const isDraftOrOrphan = obj.Key && (obj.Key.includes('/draft/') || obj.Key.includes('/temp/'));
      return isOld && isDraftOrOrphan;
    });

    if (toDelete.length === 0) {
      return res.status(200).json({ success: true, message: 'No orphaned objects found to clean up.' });
    }

    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: toDelete.map(obj => ({ Key: obj.Key })),
        Quiet: false,
      },
    };

    const deleteResult = await r2.send(new DeleteObjectsCommand(deleteParams));

    return res.status(200).json({
      success: true,
      cleanedCount: deleteResult.Deleted?.length || 0,
      deletedKeys: deleteResult.Deleted?.map(d => d.Key) || [],
    });
  } catch (error) {
    console.error('[R2 Cleanup Cron Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to run R2 cleanup cron.' });
  }
}
