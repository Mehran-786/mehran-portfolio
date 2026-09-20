import { getNotifyTransporter, sendEmailWithRetry } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, rating, verdict, body, attachments = [], createdAt } = req.body || {};

  // Formatted Pakistan Standard Time (Asia/Karachi)
  const dateObj = createdAt ? new Date(createdAt) : new Date();
  const pktTime = dateObj.toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');
  const r2PublicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

  const attachmentListText = attachments.length > 0
    ? attachments.map(a => {
        const fullUrl = a.url?.startsWith('http') ? a.url : `${r2PublicUrl}/${a.key || ''}`;
        return `- ${a.name} (${a.type}, ${a.size}): ${fullUrl}`;
      }).join('\n')
    : 'None';

  const attachmentListHtml = attachments.length > 0
    ? `<ul style="margin: 8px 0; padding-left: 20px;">
        ${attachments.map(a => {
          const fullUrl = a.url?.startsWith('http') ? a.url : `${r2PublicUrl}/${a.key || ''}`;
          return `<li><a href="${fullUrl}" style="color: #10b981;" target="_blank">${a.name}</a> (${a.type}, ${a.size})</li>`;
        }).join('')}
      </ul>`
    : '<p style="color: #94a3b8; margin: 4px 0;">None</p>';

  const transporter = getNotifyTransporter();

  const mailOptions = {
    from: `"Portfolio Reviews Alert" <${process.env.GMAIL_NOTIFY_USER}>`,
    to: adminEmail,
    subject: `New review from ${name || 'Visitor'} — ${rating || 5} stars`,
    text: `New review submitted on your portfolio!\n\n` +
      `Reviewer: ${name || 'Anonymous'}\n` +
      `Email: ${email || 'Not provided'}\n` +
      `Rating: ${rating || 5} / 5 stars\n` +
      `Verdict: ${verdict || 'N/A'}\n` +
      `Timestamp (PKT): ${pktTime}\n\n` +
      `Review Text:\n${body || ''}\n\n` +
      `Attachments:\n${attachmentListText}\n\n` +
      `Manage Review in Admin Panel: ${siteUrl}/reviews\n`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
        <h2 style="color: #10b981; margin-top: 0;">✨ New Portfolio Review</h2>
        <div style="background: #0a1e12; border: 1px solid #173822; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0;"><strong>Reviewer:</strong> ${name || 'Anonymous'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Rating:</strong> <span style="color: #f59e0b; font-size: 16px;">${'★'.repeat(rating || 5)}</span> (${rating || 5}/5)</p>
          <p style="margin: 0 0 8px 0;"><strong>Verdict:</strong> <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${verdict || 'General'}</span></p>
          <p style="margin: 0; color: #94a3b8; font-size: 12px;"><strong>Timestamp:</strong> ${pktTime}</p>
        </div>
        
        <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Review Content</h3>
        <div style="background: #030a05; padding: 16px; border-radius: 8px; border-left: 3px solid #10b981; margin-bottom: 20px; line-height: 1.6; color: #f8fafc;">
          ${(body || '').replace(/\n/g, '<br/>')}
        </div>

        <h3 style="color: #e2e8f0; font-size: 14px; margin-bottom: 8px;">Attachments</h3>
        ${attachmentListHtml}

        <div style="margin-top: 28px; text-align: center;">
          <a href="${siteUrl}/reviews" style="background: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
            Open Reviews Admin Panel
          </a>
        </div>
      </div>
    `,
  };

  // Asynchronous send with 2 retries (G3) - never blocks the client response
  sendEmailWithRetry(transporter, mailOptions).catch(err => {
    console.error('[New Review Email Failed]', err);
  });

  return res.status(200).json({ success: true, message: 'Notification queued.' });
}
