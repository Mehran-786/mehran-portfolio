import crypto from 'crypto';
import { sql, initDb } from '../../_lib/db.js';
import { verifyAdminSession, sendEmail, checkRateLimit, validateOrigin, escapeHtml } from '../../_lib/utils.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  // Extract reviewId from query or url path
  const reviewId = req.query?.id || req.url?.split('/')?.filter(Boolean)?.slice(-2, -1)?.[0];
  if (!reviewId) {
    return res.status(400).json({ error: 'Missing review ID.' });
  }

  await initDb();

  // ------------------------- DELETE: Admin Reply Deletion -------------------------
  if (req.method === 'DELETE') {
    const isAdmin = verifyAdminSession(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
    }
    const { replyId } = req.body || req.query || {};
    if (!replyId) {
      return res.status(400).json({ error: 'Missing reply ID.' });
    }
    try {
      await sql`
        DELETE FROM review_replies
        WHERE id = ${replyId} AND review_id = ${reviewId};
      `;
      return res.status(200).json({ success: true, message: 'Reply deleted successfully.' });
    } catch (err) {
      console.error('[Delete Reply Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to delete reply.' });
    }
  }

  // ------------------------- POST: Create Reply (Threaded & Targeted) -------------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const isAdmin = verifyAdminSession(req);

  // Rate limit: non-admin replies limited to 10 per hour per IP
  if (!isAdmin) {
    const allowed = checkRateLimit(`reply-submit:${ip}`, 10, 60 * 60 * 1000);
    if (!allowed) {
      return res.status(429).json({ error: 'Too many replies submitted. Please try again later.' });
    }
  }

  try {
    const { name, email, body, isOwner, parentReplyId, replyToName } = req.body || {};

    const cleanBody = typeof body === 'string' ? body.replace(/<[^>]*>?/gm, '').trim() : '';
    if (!cleanBody || cleanBody.length < 2 || cleanBody.length > 1000) {
      return res.status(400).json({ error: 'Reply text must be between 2 and 1000 characters.' });
    }

    // Verify if caller claims to be owner (admin)
    const effectiveIsOwner = Boolean(isOwner && isAdmin);
    const cleanRawName = typeof name === 'string' ? name.replace(/<[^>]*>?/gm, '').trim() : '';
    const effectiveName = effectiveIsOwner ? 'Mehran Rasool' : (cleanRawName ? cleanRawName.slice(0, 50) : 'Community Member');

    const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
    const cleanEmail = effectiveIsOwner
      ? adminEmail
      : (typeof email === 'string' && email.includes('@') ? email.trim().toLowerCase() : null);

    // Fetch parent review to ensure it exists
    const { rows: parentReviews } = await sql`
      SELECT id, name, email, body FROM reviews WHERE id = ${reviewId} LIMIT 1;
    `;

    if (parentReviews.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const parentReview = parentReviews[0];

    // Determine target recipient for targeted email notification
    let targetEmail = '';
    let targetName = '';
    let targetContextSnippet = '';
    let isReplyToAComment = false;
    let effectiveReplyToName = typeof replyToName === 'string' ? replyToName.replace(/<[^>]*>?/gm, '').trim().slice(0, 50) : null;

    if (parentReplyId) {
      const { rows: parentReplies } = await sql`
        SELECT id, name, email, body, is_owner
        FROM review_replies
        WHERE id = ${parentReplyId} AND review_id = ${reviewId}
        LIMIT 1;
      `;
      if (parentReplies.length > 0) {
        const parentReply = parentReplies[0];
        isReplyToAComment = true;
        targetEmail = parentReply.email ? parentReply.email.trim() : '';
        targetName = parentReply.name || 'there';
        targetContextSnippet = parentReply.body ? (parentReply.body.slice(0, 160) + (parentReply.body.length > 160 ? '...' : '')) : '';
        if (!effectiveReplyToName) {
          effectiveReplyToName = parentReply.name;
        }
      }
    }

    // Fallback if not replying to a specific comment OR parent comment had no email
    if (!isReplyToAComment || !targetEmail) {
      if (!isReplyToAComment) {
        targetEmail = parentReview.email ? parentReview.email.trim() : '';
        targetName = parentReview.name || 'there';
        targetContextSnippet = parentReview.body ? (parentReview.body.slice(0, 160) + (parentReview.body.length > 160 ? '...' : '')) : '';
      } else if (!targetEmail && parentReview.email) {
        // Fallback: notify main review author if parent comment has no email on file
        targetEmail = parentReview.email.trim();
        targetName = parentReview.name || 'there';
      }
    }

    const replyId = `rep-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const createdAt = new Date().toISOString();

    // Insert reply with parent_reply_id, reply_to_name, and author's email
    await sql`
      INSERT INTO review_replies (id, review_id, parent_reply_id, reply_to_name, name, email, is_owner, body, created_at)
      VALUES (${replyId}, ${reviewId}, ${parentReplyId || null}, ${effectiveReplyToName || null}, ${effectiveName}, ${cleanEmail}, ${effectiveIsOwner}, ${cleanBody}, ${createdAt});
    `;

    const createdReply = {
      id: replyId,
      reviewId,
      parentReplyId: parentReplyId || null,
      replyToName: effectiveReplyToName || null,
      name: effectiveName,
      isOwner: effectiveIsOwner,
      body: cleanBody,
      createdAt,
    };

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehranrasool.me').replace(/\/+$/, '');
    const reviewsUrl = `${siteUrl}/reviews#${reviewId}`;

    const replierTitle = effectiveIsOwner ? 'Mehran Rasool (Portfolio Owner)' : effectiveName;
    const escapedReplierTitle = escapeHtml(replierTitle);
    const escapedTargetName = escapeHtml(targetName);
    const escapedReplyBody = escapeHtml(cleanBody);
    const escapedSnippet = escapeHtml(targetContextSnippet);
    const escapedReviewerName = escapeHtml(parentReview.name || 'a client');

    const contextDescText = isReplyToAComment
      ? `to your comment on ${parentReview.name || 'a client'}'s review`
      : `to your review`;

    const contextDescHtml = isReplyToAComment
      ? `to your comment on <strong style="color: #f8fafc;">${escapedReviewerName}</strong>'s review`
      : `to your review`;

    const snippetHeading = isReplyToAComment
      ? 'In response to your comment:'
      : 'In response to your review:';

    // 1. Send targeted notification email to the author of the comment or review being replied to
    const isSelfReply = cleanEmail && targetEmail && cleanEmail.toLowerCase() === targetEmail.toLowerCase();
    if (targetEmail && targetEmail.includes('@') && !isSelfReply) {
      const emailSubject = effectiveIsOwner
        ? (isReplyToAComment ? 'Mehran Rasool replied to your comment — Portfolio' : 'Mehran Rasool replied to your review — Portfolio')
        : (isReplyToAComment
            ? `${effectiveName} replied to your comment on ${parentReview.name || 'client'}'s review — Mehran Rasool's Portfolio`
            : `New Reply on Your Review from ${effectiveName} — Mehran Rasool's Portfolio`);

      const mailOptions = {
        to: targetEmail,
        replyTo: adminEmail,
        subject: emailSubject,
        text: `Hello ${targetName},\n\n` +
          `${effectiveName} has replied ${contextDescText} on Mehran Rasool's Portfolio.\n\n` +
          `Reply from ${effectiveName}:\n"${cleanBody}"\n\n` +
          (targetContextSnippet ? `${snippetHeading}\n"${targetContextSnippet}"\n\n` : '') +
          `Click the link below to view the reply and join the conversation:\n${reviewsUrl}\n\n` +
          `Best regards,\nMehran Rasool • Full-Stack Developer & Software Engineer\nhttps://mehranrasool.me\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #050f09; color: #f1f5f9; border-radius: 14px; border: 1px solid #10b981; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <span style="font-size: 26px;">💬</span>
              <h2 style="color: #10b981; margin: 0; font-size: 20px;">${isReplyToAComment ? 'New Reply on Your Comment' : 'New Reply on Your Review'}</h2>
            </div>
            
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Hello <strong style="color: #f8fafc;">${escapedTargetName}</strong>,
            </p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              <strong style="color: #34d399;">${escapedReplierTitle}</strong> has responded ${contextDescHtml} on <a href="${siteUrl}" style="color: #10b981; text-decoration: none; font-weight: 600;">Mehran Rasool's Portfolio</a>:
            </p>

            <div style="background: #0a1e12; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #6ee7b7; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0;">${escapedReplierTitle} wrote:</p>
              <p style="color: #f1f5f9; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">"${escapedReplyBody}"</p>
            </div>

            ${escapedSnippet ? `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">${snippetHeading}</p>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-style: italic;">"${escapedSnippet}"</p>
              </div>
            ` : ''}

            <div style="margin: 28px 0 16px 0; text-align: center;">
              <a href="${reviewsUrl}" style="background: #10b981; color: #041209; padding: 13px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(16,185,129,0.35);">
                View Reply on Mehran's Portfolio →
              </a>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 24px; border-top: 1px solid #173822; padding-top: 16px;">
              You received this email because you participated in the discussion on <a href="${siteUrl}" style="color: #10b981; text-decoration: none;">mehranrasool.me</a>
            </p>
          </div>
        `,
      };

      try {
        await sendEmail(mailOptions);
      } catch (err) {
        console.error('[Reply Recipient Email Error]', err?.message || err);
      }
    }

    // 2. If a community member replied and Admin was not the target recipient, also notify Mehran
    const isAdminTarget = targetEmail && targetEmail.toLowerCase() === adminEmail.toLowerCase();
    if (!effectiveIsOwner && !isAdminTarget) {
      const adminMailOptions = {
        to: adminEmail,
        subject: `[New Reply] ${effectiveName} replied ${contextDescText} on review #${reviewId}`,
        text: `Hello Mehran,\n\n${effectiveName} has posted a reply ${contextDescText} on review #${reviewId}:\n\n"${cleanBody}"\n\nView at: ${reviewsUrl}\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
            <h2 style="color: #10b981; margin-top: 0;">💬 New Reply on Your Portfolio</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
              <strong>${escapedReplierTitle}</strong> replied ${contextDescHtml}:
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

      try {
        await sendEmail(adminMailOptions);
      } catch (err) {
        console.error('[Reply Admin Email Error]', err?.message || err);
      }
    }

    return res.status(201).json(createdReply);
  } catch (error) {
    console.error('[Reply Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to post reply.' });
  }
}
