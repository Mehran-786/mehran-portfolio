import crypto from 'crypto';
import { sql, initDb } from '../_lib/db.js';
import { getNotifyTransporter, sendEmailWithRetry, checkRateLimit, escapeHtml, verifyAdminSession, validateOrigin } from '../_lib/utils.js';

const ALLOWED_VERDICTS = ["Excellent", "Good", "Average", "Needs work"];
const ATTACHMENT_KEY_REGEX = /^reviews\/[a-zA-Z0-9-_]+\/[a-f0-9-]+\.[a-z0-9]+$/;

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  await initDb();

  // ------------------------- GET: Fetch reviews -------------------------
  if (req.method === 'GET') {
    try {
      const isAdmin = verifyAdminSession(req);
      const showAll = isAdmin && req.query?.admin === 'true';

      // Only return approved reviews to the public; admin can inspect pending reviews via ?admin=true
      const { rows: reviewRows } = showAll
        ? await sql`
            SELECT id, name, rating, verdict, body, attachments, approved, created_at
            FROM reviews
            ORDER BY created_at DESC;
          `
        : await sql`
            SELECT id, name, rating, verdict, body, attachments, approved, created_at
            FROM reviews
            WHERE approved = true
            ORDER BY created_at ASC;
          `;

      // Fetch replies
      const { rows: replyRows } = await sql`
        SELECT id, review_id, name, is_owner, body, created_at
        FROM review_replies
        ORDER BY created_at ASC;
      `;

      // Nest replies under reviews
      const repliesMap = new Map();
      replyRows.forEach(rep => {
        const list = repliesMap.get(rep.review_id) || [];
        list.push({
          id: rep.id,
          name: rep.name,
          isOwner: rep.is_owner,
          body: rep.body,
          createdAt: rep.created_at,
        });
        repliesMap.set(rep.review_id, list);
      });

      const formatted = reviewRows.map(r => ({
        id: r.id,
        name: r.name,
        // STRICT PRIVACY: Reviewer email, IP, and internal moderation metadata are NEVER returned
        rating: r.rating,
        verdict: r.verdict,
        body: r.body,
        attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments) : (r.attachments || []),
        approved: r.approved,
        createdAt: r.created_at,
        replies: repliesMap.get(r.id) || [],
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      console.error('[Reviews GET Error]', error?.message || error);
      return res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
  }

  // ------------------------- POST: Create new review -------------------------
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    // Rate limit: max 5 reviews per hour per IP
    const allowedIp = checkRateLimit(`review-submit:${ip}`, 5, 60 * 60 * 1000);
    if (!allowedIp) {
      return res.status(429).json({ error: 'Too many reviews submitted from this connection. Please try again later.' });
    }

    try {
      const { name, email, rating, verdict, body, attachments = [] } = req.body || {};

      // 1. Validation & Input Sanitization
      const cleanName = typeof name === 'string' ? name.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanName || cleanName.length < 2 || cleanName.length > 50) {
        return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
      }

      const cleanEmail = typeof email === 'string' && email.includes('@') ? email.trim() : null;
      if (cleanEmail) {
        // Per-email rate limit: max 3 reviews per hour per email
        const allowedEmail = checkRateLimit(`review-submit-email:${cleanEmail}`, 3, 60 * 60 * 1000);
        if (!allowedEmail) {
          return res.status(429).json({ error: 'Too many reviews submitted with this email. Please try again later.' });
        }
      }

      const numRating = parseInt(rating, 10);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
      }

      if (!ALLOWED_VERDICTS.includes(verdict)) {
        return res.status(400).json({ error: `Verdict must be one of: ${ALLOWED_VERDICTS.join(', ')}.` });
      }

      const cleanBody = typeof body === 'string' ? body.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanBody || cleanBody.length < 10 || cleanBody.length > 1000) {
        return res.status(400).json({ error: 'Review body must be between 10 and 1000 characters.' });
      }

      if (!Array.isArray(attachments) || attachments.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 attachments allowed.' });
      }

      // Validate each attachment object structure
      for (const att of attachments) {
        if (!att || typeof att !== 'object') {
          return res.status(400).json({ error: 'Invalid attachment data.' });
        }
        if (!att.key || typeof att.key !== 'string' || !ATTACHMENT_KEY_REGEX.test(att.key)) {
          return res.status(400).json({ error: 'Invalid attachment key pattern.' });
        }
        if (!['image', 'video', 'file'].includes(att.type)) {
          return res.status(400).json({ error: 'Invalid attachment type.' });
        }
        if (!att.name || typeof att.name !== 'string' || att.name.length === 0 || att.name.length > 200) {
          return res.status(400).json({ error: 'Invalid attachment name length.' });
        }
      }

      // 2. Insert into database with approved = false (MODERATION REQUIRED)
      const id = `rev-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const createdAt = new Date().toISOString();
      const attachmentsJson = JSON.stringify(attachments);

      await sql`
        INSERT INTO reviews (id, name, email, rating, verdict, body, attachments, approved, created_at)
        VALUES (${id}, ${cleanName}, ${cleanEmail}, ${numRating}, ${verdict}, ${cleanBody}, ${attachmentsJson}::jsonb, false, ${createdAt});
      `;

      // 3. Trigger email notification to Admin with HTML escaping
      const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehranrasool.me').replace(/\/+$/, '');
      const r2PublicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

      const pktTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      const escapedName = escapeHtml(cleanName);
      const escapedEmail = cleanEmail ? escapeHtml(cleanEmail) : 'Not provided';
      const escapedVerdict = escapeHtml(verdict);
      const escapedBody = escapeHtml(cleanBody);

      const attachmentListText = attachments.length > 0
        ? attachments.map(a => `- ${a.name} (${a.type}, ${a.size}): ${a.url || `${r2PublicUrl}/${a.key || ''}`}`).join('\n')
        : 'None';

      const attachmentListHtml = attachments.length > 0
        ? `<ul style="margin: 8px 0; padding-left: 20px;">
            ${attachments.map(a => `<li><a href="${escapeHtml(a.url || `${r2PublicUrl}/${a.key || ''}`)}" style="color: #10b981;" target="_blank">${escapeHtml(a.name)}</a> (${escapeHtml(a.type)}, ${escapeHtml(String(a.size))})</li>`).join('')}
          </ul>`
        : '<p style="color: #94a3b8; margin: 4px 0;">None</p>';

      const senderEmail = process.env.GMAIL_NOTIFY_USER || process.env.GMAIL_USER || 'mehranrasool546@gmail.com';
      const transporter = getNotifyTransporter();
      const mailOptions = {
        from: `"Portfolio Reviews Alert" <${senderEmail}>`,
        to: adminEmail,
        subject: `[Pending Moderation] New review from ${cleanName} — ${numRating} stars`,
        text: `New review submitted on your portfolio!\n\n` +
          `Status: Pending Admin Moderation\n` +
          `Reviewer: ${cleanName}\n` +
          `Email: ${cleanEmail || 'Not provided'}\n` +
          `Rating: ${numRating} / 5 stars\n` +
          `Verdict: ${verdict}\n` +
          `Timestamp (PKT): ${pktTime}\n\n` +
          `Review Text:\n${cleanBody}\n\n` +
          `Attachments:\n${attachmentListText}\n\n` +
          `Moderate at: ${siteUrl}/reviews\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
            <h2 style="color: #10b981; margin-top: 0;">✨ New Portfolio Review (Pending Approval)</h2>
            <div style="background: #0a1e12; border: 1px solid #173822; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Pending Approval</span></p>
              <p style="margin: 0 0 8px 0;"><strong>Reviewer:</strong> ${escapedName}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${escapedEmail}</p>
              <p style="margin: 0 0 8px 0;"><strong>Rating:</strong> <span style="color: #f59e0b; font-size: 16px;">${'★'.repeat(numRating)}</span> (${numRating}/5)</p>
              <p style="margin: 0 0 8px 0;"><strong>Verdict:</strong> <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${escapedVerdict}</span></p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;"><strong>Timestamp:</strong> ${pktTime}</p>
            </div>
            
            <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Review Content</h3>
            <div style="background: #030a05; padding: 16px; border-radius: 8px; border-left: 3px solid #10b981; margin-bottom: 20px; line-height: 1.6; color: #f8fafc;">
              ${escapedBody.replace(/\n/g, '<br/>')}
            </div>

            <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Attachments</h3>
            ${attachmentListHtml}

            <div style="margin-top: 28px; text-align: center;">
              <a href="${siteUrl}/reviews" style="background: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
                Moderate in Admin Panel
              </a>
            </div>
          </div>
        `,
      };

      try {
        const mailResult = await sendEmailWithRetry(transporter, mailOptions);
        if (!mailResult.success) {
          console.warn('[Review Alert Email Warning]', mailResult.error);
        }
      } catch (err) {
        console.error('[Review Email Error]', err?.message || err);
      }

      // Public response NEVER includes reviewer private email
      return res.status(201).json({
        id,
        name: cleanName,
        rating: numRating,
        verdict,
        body: cleanBody,
        attachments,
        approved: false,
        createdAt,
        message: 'Review submitted successfully. It will be publicly visible after moderation review.',
      });
    } catch (error) {
      console.error('[Reviews POST Error]', error?.message || error);
      return res.status(500).json({ error: 'Failed to submit review.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
