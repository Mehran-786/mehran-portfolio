import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { sql, initDb } from '../../_lib/db.js';
import { verifyAdminSession, getR2Client, validateOrigin } from '../../_lib/utils.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  // 1. Verify admin authorization for all item moderation actions
  const isAdmin = verifyAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }

  const reviewId = req.query?.id || req.url?.split('/')?.filter(Boolean)?.pop();
  if (!reviewId) {
    return res.status(400).json({ error: 'Missing review ID.' });
  }

  await initDb();

  // ------------------------- PATCH: Moderate / Approve Review -------------------------
  if (req.method === 'PATCH') {
    try {
      const { approved = true } = req.body || {};
      const { rowCount } = await sql`
        UPDATE reviews
        SET approved = ${Boolean(approved)}
        WHERE id = ${reviewId};
      `;

      if (rowCount === 0) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      return res.status(200).json({
        success: true,
        message: `Review ${approved ? 'approved' : 'unapproved'} successfully.`,
      });
    } catch (error) {
      console.error('[Patch Review Error]', error?.message || error);
      return res.status(500).json({ error: 'Failed to update review status.' });
    }
  }

  // ------------------------- DELETE: Remove Review & Storage Attachments -------------------------
  if (req.method === 'DELETE') {
    try {
      // Query review to retrieve attachment keys before deletion
      const { rows: reviewRows } = await sql`
        SELECT id, attachments FROM reviews WHERE id = ${reviewId} LIMIT 1;
      `;

      if (reviewRows.length === 0) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      const review = reviewRows[0];
      const attachments = typeof review.attachments === 'string'
        ? JSON.parse(review.attachments)
        : (review.attachments || []);

      const r2Keys = attachments.map(a => a.key).filter(Boolean);

      // Delete from PostgreSQL (review_replies cascade delete automatically)
      await sql`
        DELETE FROM reviews WHERE id = ${reviewId};
      `;

      // Delete associated objects from Cloudflare R2 bucket if present
      if (r2Keys.length > 0) {
        try {
          const r2 = getR2Client();
          const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';
          const deleteParams = {
            Bucket: bucket,
            Delete: {
              Objects: r2Keys.map(k => ({ Key: k })),
              Quiet: true,
            },
          };
          await r2.send(new DeleteObjectsCommand(deleteParams));
        } catch (r2Err) {
          console.error('[R2 Cleanup Error on Review Delete]', r2Err?.message || r2Err);
        }
      }

      return res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    } catch (error) {
      console.error('[Delete Review Error]', error?.message || error);
      return res.status(500).json({ error: 'Failed to delete review.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
