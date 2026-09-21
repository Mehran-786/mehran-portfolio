import crypto from 'crypto';
import { sql, initDb } from '../_lib/db.js';
import { getNotifyTransporter, sendEmailWithRetry } from '../_lib/utils.js';

const ALLOWED_VERDICTS = ["Excellent", "Good", "Average", "Needs work"];

export default async function handler(req, res) {
  await initDb();

  // ------------------------- GET: Fetch all approved reviews -------------------------
  if (req.method === 'GET') {
    try {
      // 1. Fetch reviews
      const { rows: reviewRows } = await sql`
        SELECT id, name, email, rating, verdict, body, attachments, approved, created_at
        FROM reviews
        WHERE approved = true
        ORDER BY created_at ASC;
      `;

      // If database is completely empty on fresh launch, seed initial testimonials
      if (reviewRows.length === 0) {
        const seedReviews = [
          {
            id: "rev-1",
            name: "Hamza Tariq",
            email: "hamza.dev@example.com",
            rating: 5,
            verdict: "Excellent",
            body: "Tested the 5-stage LLM security gateway with adversarial prompt injection attacks and Pakistani CNIC queries. The 82.7% accuracy and zero PII leaks held up reliably. Average latency was well under 600ms. Exceptional engineering!",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            approved: true,
            attachments: '[]',
          },
          {
            id: "rev-2",
            name: "Sarah Jenkins",
            email: "sarah.j@techlead.co",
            rating: 5,
            verdict: "Excellent",
            body: "The Flask extraction service behind Gunicorn and Cloudflare is remarkably fast. Handles HD 1080p downloads with zero stutter and rate limits abusive traffic automatically.",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            approved: true,
            attachments: '[]',
          },
          {
            id: "rev-3",
            name: "Zubair Ahmed",
            email: "zubair.ahmed@cuiwah.edu.pk",
            rating: 5,
            verdict: "Excellent",
            body: "The multi-engine pipeline and Pydantic data contracts between the SEO and Engagement engines are built strictly on SOLID principles. The Vite dashboard makes analytics crystal clear.",
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            approved: true,
            attachments: '[]',
          }
        ];

        for (const s of seedReviews) {
          await sql`
            INSERT INTO reviews (id, name, email, rating, verdict, body, attachments, approved, created_at)
            VALUES (${s.id}, ${s.name}, ${s.email}, ${s.rating}, ${s.verdict}, ${s.body}, ${s.attachments}::jsonb, ${s.approved}, ${s.created_at})
            ON CONFLICT (id) DO NOTHING;
          `;
        }

        // Add seed reply
        await sql`
          INSERT INTO review_replies (id, review_id, name, is_owner, body, created_at)
          VALUES (
            'rep-1-1', 
            'rev-1', 
            'Mehran Rasool', 
            true, 
            'Thanks Hamza! Glad the custom Presidio recognizers for CNIC and Groq Llama-3.1 inference performed well during your stress tests.', 
            ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()}
          )
          ON CONFLICT (id) DO NOTHING;
        `;

        // Re-query seeded
        const { rows: seededRows } = await sql`
          SELECT id, name, email, rating, verdict, body, attachments, approved, created_at
          FROM reviews
          WHERE approved = true
          ORDER BY created_at ASC;
        `;
        reviewRows.push(...seededRows);
      }

      // 2. Fetch replies
      const { rows: replyRows } = await sql`
        SELECT id, review_id, name, is_owner, body, created_at
        FROM review_replies
        ORDER BY created_at ASC;
      `;

      // 3. Nest replies under reviews
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
        email: r.email,
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
    try {
      const { name, email, rating, verdict, body, attachments = [] } = req.body || {};

      // 1. Validations per spec
      const cleanName = typeof name === 'string' ? name.trim() : '';
      if (!cleanName || cleanName.length < 2 || cleanName.length > 50) {
        return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
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

      const cleanEmail = typeof email === 'string' && email.includes('@') ? email.trim() : null;

      // 2. Insert into database
      const id = `rev-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const createdAt = new Date().toISOString();
      const attachmentsJson = JSON.stringify(attachments);

      await sql`
        INSERT INTO reviews (id, name, email, rating, verdict, body, attachments, approved, created_at)
        VALUES (${id}, ${cleanName}, ${cleanEmail}, ${numRating}, ${verdict}, ${cleanBody}, ${attachmentsJson}::jsonb, true, ${createdAt});
      `;

      const createdReview = {
        id,
        name: cleanName,
        email: cleanEmail,
        rating: numRating,
        verdict,
        body: cleanBody,
        attachments,
        approved: true,
        createdAt,
        replies: [],
      };

      // 3. Trigger email notification to Admin (reusing new-review notification logic)
      const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');
      const r2PublicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

      const pktTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      const attachmentListText = attachments.length > 0
        ? attachments.map(a => `- ${a.name} (${a.type}, ${a.size}): ${a.url || `${r2PublicUrl}/${a.key || ''}`}`).join('\n')
        : 'None';

      const attachmentListHtml = attachments.length > 0
        ? `<ul style="margin: 8px 0; padding-left: 20px;">
            ${attachments.map(a => `<li><a href="${a.url || `${r2PublicUrl}/${a.key || ''}`}" style="color: #10b981;" target="_blank">${a.name}</a> (${a.type}, ${a.size})</li>`).join('')}
          </ul>`
        : '<p style="color: #94a3b8; margin: 4px 0;">None</p>';

      const transporter = getNotifyTransporter();
      const mailOptions = {
        from: `"Portfolio Reviews Alert" <${process.env.GMAIL_NOTIFY_USER}>`,
        to: adminEmail,
        subject: `New review from ${cleanName} — ${numRating} stars`,
        text: `New review submitted on your portfolio!\n\n` +
          `Reviewer: ${cleanName}\n` +
          `Email: ${cleanEmail || 'Not provided'}\n` +
          `Rating: ${numRating} / 5 stars\n` +
          `Verdict: ${verdict}\n` +
          `Timestamp (PKT): ${pktTime}\n\n` +
          `Review Text:\n${cleanBody}\n\n` +
          `Attachments:\n${attachmentListText}\n\n` +
          `Manage Review: ${siteUrl}/reviews\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
            <h2 style="color: #10b981; margin-top: 0;">✨ New Portfolio Review</h2>
            <div style="background: #0a1e12; border: 1px solid #173822; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0;"><strong>Reviewer:</strong> ${cleanName}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${cleanEmail || 'Not provided'}</p>
              <p style="margin: 0 0 8px 0;"><strong>Rating:</strong> <span style="color: #f59e0b; font-size: 16px;">${'★'.repeat(numRating)}</span> (${numRating}/5)</p>
              <p style="margin: 0 0 8px 0;"><strong>Verdict:</strong> <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${verdict}</span></p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;"><strong>Timestamp:</strong> ${pktTime}</p>
            </div>
            
            <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Review Content</h3>
            <div style="background: #030a05; padding: 16px; border-radius: 8px; border-left: 3px solid #10b981; margin-bottom: 20px; line-height: 1.6; color: #f8fafc;">
              ${cleanBody.replace(/\n/g, '<br/>')}
            </div>

            <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Attachments</h3>
            ${attachmentListHtml}

            <div style="margin-top: 28px; text-align: center;">
              <a href="${siteUrl}/reviews" style="background: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
                Open Reviews Page
              </a>
            </div>
          </div>
        `,
      };

      sendEmailWithRetry(transporter, mailOptions).catch(err => console.error('[Review Email Error]', err));

      return res.status(201).json(createdReview);
    } catch (error) {
      console.error('[Reviews POST Error]', error?.message || error);
      return res.status(500).json({ error: 'Failed to submit review.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
