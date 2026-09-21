import crypto from 'crypto';
import { sql, initDb } from '../../_lib/db.js';
import { verifyAdminSession, getReplyTransporter, sendEmailWithRetry } from '../../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initDb();

    // Extract reviewId from query (set by Vercel or dev middleware)
    const reviewId = req.query?.id || req.url?.split('/')?.filter(Boolean)?.slice(-2, -1)?.[0];
    if (!reviewId) {
      return res.status(400).json({ error: 'Missing review ID.' });
    }

    const { name, body, isOwner } = req.body || {};

    const cleanBody = typeof body === 'string' ? body.replace(/<[^>]*>?/gm, '').trim() : '';
    if (!cleanBody || cleanBody.length < 2 || cleanBody.length > 1000) {
      return res.status(400).json({ error: 'Reply text must be between 2 and 1000 characters.' });
    }

    // Verify if caller claims to be owner (admin)
    const isAdmin = verifyAdminSession(req);
    const effectiveIsOwner = Boolean(isOwner && isAdmin);
    const effectiveName = effectiveIsOwner ? 'Mehran Rasool' : (typeof name === 'string' && name.trim() ? name.trim().slice(0, 50) : 'Community Member');

    // Fetch parent review to ensure it exists and get reviewer email
    const { rows: parentReviews } = await sql`
      SELECT id, email FROM reviews WHERE id = ${reviewId} LIMIT 1;
    `;

    if (parentReviews.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const parentReview = parentReviews[0];
    const replyId = `rep-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const createdAt = new Date().toISOString();

    await sql`
      INSERT INTO review_replies (id, review_id, name, is_owner, body, created_at)
      VALUES (${replyId}, ${reviewId}, ${effectiveName}, ${effectiveIsOwner}, ${cleanBody}, ${createdAt});
    `;

    const createdReply = {
      id: replyId,
      reviewId,
      name: effectiveName,
      isOwner: effectiveIsOwner,
      body: cleanBody,
      createdAt,
    };

    // If owner replied and parent review had an email, send minimal notification email (B2)
    if (effectiveIsOwner && parentReview.email && parentReview.email.includes('@')) {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');
      const reviewsUrl = `${siteUrl}/reviews`;
      const senderEmail = process.env.GMAIL_REPLY_USER || 'mehranrasool.sp24@gmail.com';
      const transporter = getReplyTransporter();

      const mailOptions = {
        from: `"Mehran Rasool" <${senderEmail}>`,
        to: parentReview.email,
        subject: 'Mehran replied to your review',
        text: `Mehran Rasool has replied to the review you left on his portfolio site.\n\nYou can read the reply on the reviews page:\n${reviewsUrl}\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
            <h3 style="color: #10b981; margin-top: 0;">Mehran replied to your review</h3>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              Mehran Rasool has replied to the review you left on his portfolio site.
            </p>
            <div style="margin: 24px 0;">
              <a href="${reviewsUrl}" style="background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                View Reply on Site
              </a>
            </div>
          </div>
        `,
      };

      try {
        const mailResult = await sendEmailWithRetry(transporter, mailOptions);
        if (!mailResult.success) {
          console.warn('[Reply Email Warning]', mailResult.error);
        }
      } catch (err) {
        console.error('[Reply Notification Error]', err?.message || err);
      }
    }

    return res.status(201).json(createdReply);
  } catch (error) {
    console.error('[Reply Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to post reply.' });
  }
}
