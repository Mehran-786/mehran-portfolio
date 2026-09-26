import crypto from 'crypto';
import { sql, initDb } from '../../_lib/db.js';
import { verifyAdminSession, sendEmail, checkRateLimit, validateOrigin } from '../../_lib/utils.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Verify if caller has an active admin session
  const isAdmin = verifyAdminSession(req);

  // Rate limit: non-admin replies limited to 10 per hour per IP (Gap 3)
  if (!isAdmin) {
    const allowed = checkRateLimit(`reply-submit:${ip}`, 10, 60 * 60 * 1000);
    if (!allowed) {
      return res.status(429).json({ error: 'Too many replies submitted. Please try again later.' });
    }
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
    const effectiveIsOwner = Boolean(isOwner && isAdmin);
    const cleanRawName = typeof name === 'string' ? name.replace(/<[^>]*>?/gm, '').trim() : '';
    const effectiveName = effectiveIsOwner ? 'Mehran Rasool' : (cleanRawName ? cleanRawName.slice(0, 50) : 'Community Member');

    // Fetch parent review to ensure it exists and get reviewer email, name, and body
    const { rows: parentReviews } = await sql`
      SELECT id, name, email, body FROM reviews WHERE id = ${reviewId} LIMIT 1;
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

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehranrasool.me').replace(/\/+$/, '');
    const reviewsUrl = `${siteUrl}/reviews#${reviewId}`;

    const replierTitle = effectiveIsOwner ? 'Mehran Rasool (Portfolio Owner)' : effectiveName;
    const escapedReplierTitle = (cleanRawName ? `${cleanRawName}${effectiveIsOwner ? ' (Verified Owner)' : ''}` : replierTitle)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const escapedParentName = (parentReview.name || 'there')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const escapedReplyBody = cleanBody
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const parentSnippet = parentReview.body ? (parentReview.body.slice(0, 160) + (parentReview.body.length > 160 ? '...' : '')) : '';
    const escapedParentSnippet = parentSnippet
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // 1. Send email notification to parent reviewer if they provided an email address
    const targetEmail = typeof parentReview.email === 'string' ? parentReview.email.trim() : '';
    if (targetEmail && targetEmail.includes('@')) {
      const emailSubject = effectiveIsOwner
        ? 'Mehran Rasool replied to your review — Portfolio'
        : `New Reply on Your Review from ${effectiveName} — Mehran Rasool's Portfolio`;

      const mailOptions = {
        to: targetEmail,
        replyTo: process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com',
        subject: emailSubject,
        text: `Hello ${parentReview.name || 'there'},\n\n` +
          `${effectiveName} has replied to your review on Mehran Rasool's Portfolio.\n\n` +
          `Reply from ${effectiveName}:\n"${cleanBody}"\n\n` +
          (parentSnippet ? `In response to your review:\n"${parentSnippet}"\n\n` : '') +
          `Click the link below to view the reply and join the conversation:\n${reviewsUrl}\n\n` +
          `Best regards,\nMehran Rasool • Full-Stack Developer & Software Engineer\nhttps://mehranrasool.me\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #050f09; color: #f1f5f9; border-radius: 14px; border: 1px solid #10b981; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <span style="font-size: 26px;">💬</span>
              <h2 style="color: #10b981; margin: 0; font-size: 20px;">New Reply on Your Review</h2>
            </div>
            
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Hello <strong style="color: #f8fafc;">${escapedParentName}</strong>,
            </p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              <strong style="color: #34d399;">${escapedReplierTitle}</strong> has responded to your review on <a href="${siteUrl}" style="color: #10b981; text-decoration: none; font-weight: 600;">Mehran Rasool's Portfolio</a>:
            </p>

            <div style="background: #0a1e12; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #6ee7b7; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0;">${escapedReplierTitle} wrote:</p>
              <p style="color: #f1f5f9; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">"${escapedReplyBody}"</p>
            </div>

            ${escapedParentSnippet ? `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">In response to your review:</p>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-style: italic;">"${escapedParentSnippet}"</p>
              </div>
            ` : ''}

            <div style="margin: 28px 0 16px 0; text-align: center;">
              <a href="${reviewsUrl}" style="background: #10b981; color: #041209; padding: 13px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(16,185,129,0.35);">
                View Reply on Mehran's Portfolio →
              </a>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 24px; border-top: 1px solid #173822; padding-top: 16px;">
              You received this email because you shared a verified review on <a href="${siteUrl}" style="color: #10b981; text-decoration: none;">mehranrasool.me</a>
            </p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } else {
      console.warn(`[Reply Email Notice] Cannot notify author of review #${reviewId}: no valid email address on file.`);
    }

    // 2. If a community member replied (not owner), also notify Mehran so he is informed
    if (!effectiveIsOwner) {
      const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';

      const adminMailOptions = {
        to: adminEmail,
        subject: `[New Reply] ${effectiveName} replied on review #${reviewId}`,
        text: `Hello Mehran,\n\n${effectiveName} has posted a reply on review #${reviewId} (by ${parentReview.name || 'a client'}):\n\n"${cleanBody}"\n\nView at: ${reviewsUrl}\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
            <h2 style="color: #10b981; margin-top: 0;">💬 New Reply on Your Portfolio</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
              <strong>${escapedReplierTitle}</strong> replied to review by <strong>${escapedParentName}</strong>:
            </p>
            <div style="background: #0a1e12; border-left: 3px solid #10b981; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">
              <p style="margin: 0; color: #f8fafc; font-size: 14px; white-space: pre-wrap;">"${escapedReplyBody}"</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${reviewsUrl}" style="background: #10b981; color: #041209; padding: 10px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 13px; display: inline-block;">
                View on Portfolio →
              </a>
            </div>
          </div>
        `,
      };

      await sendEmail(adminMailOptions);
    }

    return res.status(201).json(createdReply);
  } catch (error) {
    console.error('[Reply Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to post reply.' });
  }
}
