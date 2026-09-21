import crypto from 'crypto';
import { getNotifyTransporter, sendEmailWithRetry, checkRateLimit, timingSafeCompare } from '../_lib/utils.js';
import { sql, initDb } from '../_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Client IP extraction
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit: max 3 OTP requests per 15 minutes per IP
  const allowed = checkRateLimit(`otp-request:${ip}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { secretId } = req.body || {};
    const expectedSecretId = process.env.ADMIN_SECRET_ID || 'MehranRasool@@00786786';

    // Verify secret ID timing-safely
    const isValid = timingSafeCompare(secretId || '', expectedSecretId);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid authentication request.' });
    }

    // Ensure database tables exist
    await initDb();

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // DELETE any existing rows first (single active code at a time)
    await sql`DELETE FROM otp_codes;`;

    // INSERT new hash, expiry (now + 5 min), attempts=0, and IP
    await sql`
      INSERT INTO otp_codes (code_hash, expires_at, attempts, requesting_ip)
      VALUES (${otpHash}, ${expiresAt}, 0, ${ip});
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
    const transporter = getNotifyTransporter();

    const mailOptions = {
      from: `"Mehran Portfolio Security" <${process.env.GMAIL_NOTIFY_USER}>`,
      to: adminEmail,
      subject: 'Your login code',
      text: `Your single-use login code is: ${otp}\n\nThis code expires in 5 minutes.\nRequesting IP: ${ip}\n\nIf you did not request this login code, someone may have your secret ID. Please review your credentials immediately.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #050f09; color: #f1f5f9; border-radius: 12px; border: 1px solid #10b981;">
          <h2 style="color: #10b981; margin-top: 0;">Portfolio Admin Verification</h2>
          <p style="color: #94a3b8; font-size: 14px;">Use the following single-use verification code to complete your admin login:</p>
          <div style="background: #0a1e12; border: 1px solid #10b981; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #34d399; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5;">
            ⏱️ <strong>Expires in 5 minutes.</strong><br/>
            📍 <strong>Requesting IP:</strong> ${ip}
          </p>
          <hr style="border: none; border-top: 1px solid #173822; margin: 20px 0;" />
          <p style="color: #f87171; font-size: 11px; margin-bottom: 0;">
            ⚠️ If you did not initiate this request, someone may have your secret ID. Please update your environment variables immediately.
          </p>
        </div>
      `,
    };

    // Send email with exponential backoff retry
    await sendEmailWithRetry(transporter, mailOptions);

    return res.status(200).json({ success: true, message: 'Verification code sent to admin email.' });
  } catch (error) {
    console.error('[OTP Request Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to process authentication.' });
  }
}
