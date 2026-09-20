import { getReplyTransporter, sendEmailWithRetry } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reviewerEmail } = req.body || {};

  if (!reviewerEmail || !reviewerEmail.includes('@')) {
    // Reviewer did not provide email or invalid, skip gracefully
    return res.status(200).json({ success: true, message: 'No valid reviewer email provided, skipped notification.' });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');
  const reviewsUrl = `${siteUrl}/reviews`;

  const transporter = getReplyTransporter();

  // Deliberately minimal email as specified in B2
  const mailOptions = {
    from: `"Mehran Rasool" <${process.env.GMAIL_REPLY_USER}>`,
    to: reviewerEmail,
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

  // Send with exponential backoff (G3) asynchronously
  sendEmailWithRetry(transporter, mailOptions).catch(err => {
    console.error('[Reply Email Failed]', err);
  });

  return res.status(200).json({ success: true, message: 'Reply notification queued.' });
}
