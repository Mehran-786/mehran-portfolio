import crypto from 'crypto';
import { getNotifyTransporter, sendEmailWithRetry, checkRateLimit, timingSafeCompare, verifyAdminSession } from '../_lib/utils.js';
import { sql, initDb } from '../_lib/db.js';

export default async function handler(req, res) {
  const action = req.query?.action || req.url?.split('/')?.filter(Boolean)?.pop()?.split('?')?.[0];

  if (action === 'otp-request') {
    return handleOtpRequest(req, res);
  }
  if (action === 'otp-verify') {
    return handleOtpVerify(req, res);
  }
  if (action === 'session-check') {
    return handleSessionCheck(req, res);
  }
  if (action === 'logout') {
    return handleLogout(req, res);
  }

  return res.status(404).json({ error: `Auth action '${action}' not found.` });
}

// ------------------------- 1. OTP Request -------------------------
async function handleOtpRequest(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit: max 3 OTP requests per 15 minutes per IP
  const allowed = checkRateLimit(`otp-request:${ip}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { secretId } = req.body || {};
    const expectedSecretId = process.env.ADMIN_SECRET_ID || 'MehranRasool@@00786786';

    const isValid = timingSafeCompare(secretId || '', expectedSecretId);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid authentication request.' });
    }

    await initDb();

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // DELETE previous rows first (single active code)
    await sql`DELETE FROM otp_codes;`;

    // INSERT new hash, expiry, attempts=0, and IP
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
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            <strong>Security Notice:</strong> This code expires in 5 minutes and is valid for a single use only.<br/>
            Requesting IP: <code style="color: #10b981;">${ip}</code>
          </p>
        </div>
      `,
    };

    sendEmailWithRetry(transporter, mailOptions).catch(err => {
      console.error('[Admin Alert Failed]', err?.message || err);
    });

    return res.status(200).json({ success: true, message: 'Verification code sent.' });
  } catch (error) {
    console.error('[OTP Request Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to process authentication request.' });
  }
}

// ------------------------- 2. OTP Verify -------------------------
async function handleOtpVerify(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body || {};
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Verification code is required.' });
    }

    await initDb();

    const { rows } = await sql`
      SELECT id, code_hash, expires_at, attempts
      FROM otp_codes
      ORDER BY id DESC
      LIMIT 1;
    `;

    const record = rows[0];
    if (!record) {
      return res.status(401).json({ error: 'No active verification code found. Please request a new code.' });
    }

    const expiresAt = new Date(record.expires_at).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;
      return res.status(401).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (record.attempts >= 5) {
      await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;
      return res.status(401).json({ error: 'Maximum attempts exceeded. Code destroyed. Please request a new code.' });
    }

    const inputHash = crypto.createHash('sha256').update(code.trim()).digest('hex');
    const isMatch = timingSafeCompare(inputHash, record.code_hash);

    if (!isMatch) {
      const newAttempts = record.attempts + 1;
      if (newAttempts >= 5) {
        await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;
        return res.status(401).json({ error: 'Maximum attempts exceeded. Code destroyed.' });
      } else {
        await sql`UPDATE otp_codes SET attempts = ${newAttempts} WHERE id = ${record.id};`;
        return res.status(401).json({ error: `Incorrect code. ${5 - newAttempts} attempt(s) remaining.` });
      }
    }

    await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;

    const sessionSecret = process.env.SESSION_SECRET || 'mehran_secure_session_secret_default_key_2026';
    const sessionPayload = {
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    const sessionStr = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    const signature = crypto.createHmac('sha256', sessionSecret).update(sessionStr).digest('hex');
    const sessionToken = `${sessionStr}.${signature}`;

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieHeader = `admin_session=${sessionToken}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('[OTP Verify Error]', error?.message || error);
    return res.status(500).json({ error: 'Verification failed.' });
  }
}

// ------------------------- 3. Session Check -------------------------
async function handleSessionCheck(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isAdmin = verifyAdminSession(req);
  return res.status(200).json({ isAdmin });
}

// ------------------------- 4. Logout -------------------------
async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieHeader = `admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

  res.setHeader('Set-Cookie', cookieHeader);
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
