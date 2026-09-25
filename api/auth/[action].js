import crypto from 'crypto';
import { getNotifyTransporter, sendEmailWithRetry, checkRateLimit, timingSafeCompare, verifyAdminSession, validateOrigin } from '../_lib/utils.js';
import { sql, initDb } from '../_lib/db.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

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
  if (action === 'change-secret') {
    return handleChangeSecret(req, res);
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
    if (!secretId || typeof secretId !== 'string') {
      return res.status(401).json({ error: 'Invalid authentication request.' });
    }

    await initDb();

    const { rows: credRows } = await sql`SELECT secret_hash FROM admin_credentials WHERE id = 1 LIMIT 1;`;
    const storedHash = credRows[0]?.secret_hash;
    if (!storedHash) {
      console.error('[Auth Error] No admin credentials record found in database.');
      return res.status(500).json({ error: 'Server authentication configuration error.' });
    }

    const inputHash = crypto.createHash('sha256').update(secretId.trim()).digest('hex');
    const isValid = timingSafeCompare(inputHash, storedHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid authentication request.' });
    }

    // Generate cryptographically secure challenge and 6-digit numeric OTP
    const challengeId = crypto.randomUUID();
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // DELETE previous rows first (single active code)
    await sql`DELETE FROM otp_codes;`;

    // INSERT new hash, expiry, attempts=0, challengeId, and IP
    await sql`
      INSERT INTO otp_codes (challenge_id, code_hash, expires_at, attempts, requesting_ip)
      VALUES (${challengeId}, ${otpHash}, ${expiresAt}, 0, ${ip});
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
    const senderEmail = process.env.GMAIL_NOTIFY_USER || process.env.GMAIL_USER || 'mehranrasool546@gmail.com';
    const transporter = getNotifyTransporter();

    const mailOptions = {
      from: `"Mehran Portfolio Security" <${senderEmail}>`,
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

    const mailResult = await sendEmailWithRetry(transporter, mailOptions);
    if (!mailResult.success) {
      console.error('[OTP Email Error]', mailResult.error);
      return res.status(500).json({ 
        error: `Could not send verification email: ${mailResult.error}. Please check your Gmail App Password in Vercel settings.` 
      });
    }

    return res.status(200).json({ success: true, message: 'Verification code sent.', challengeId });
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

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const allowed = checkRateLimit(`otp-verify:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many verification attempts from this IP. Please wait 15 minutes.' });
  }

  try {
    const { code, challengeId } = req.body || {};
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Verification code is required.' });
    }

    await initDb();

    let record = null;
    if (challengeId && typeof challengeId === 'string') {
      const { rows } = await sql`
        SELECT id, code_hash, expires_at, attempts, requesting_ip
        FROM otp_codes
        WHERE challenge_id = ${challengeId}
        LIMIT 1;
      `;
      record = rows[0];
    } else {
      const { rows } = await sql`
        SELECT id, code_hash, expires_at, attempts, requesting_ip
        FROM otp_codes
        ORDER BY id DESC
        LIMIT 1;
      `;
      record = rows[0];
    }

    if (!record) {
      return res.status(401).json({ error: 'No active verification code found. Please request a new code.' });
    }

    // IP challenge verification
    if (record.requesting_ip && record.requesting_ip !== 'unknown' && record.requesting_ip !== ip) {
      const isBothLocal = (record.requesting_ip === '127.0.0.1' || record.requesting_ip === '::1') && (ip === '127.0.0.1' || ip === '::1');
      if (!isBothLocal && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ error: 'Authentication challenge session mismatch.' });
      }
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

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      console.error('[FATAL] SESSION_SECRET is not set.');
      return res.status(500).json({ error: 'Server authentication configuration error.' });
    }

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
    // STRICT SECURITY: Do not leak session token in JSON; authentication relies solely on the HttpOnly cookie
    return res.status(200).json({ success: true });
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

// ------------------------- 4. Change Secret ID (Part 2) -------------------------
async function handleChangeSecret(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Enforce active admin session
  const isAdmin = verifyAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  try {
    const { currentSecretId, newSecretId } = req.body || {};

    // 2. Validate current secret is provided
    if (!currentSecretId || typeof currentSecretId !== 'string') {
      return res.status(400).json({ error: 'Current secret ID is required.' });
    }

    // 3. Validate new secret meets length requirement (>= 12 characters)
    if (!newSecretId || typeof newSecretId !== 'string' || newSecretId.length < 12) {
      return res.status(400).json({ error: 'New secret ID must be at least 12 characters long.' });
    }

    await initDb();

    // 4. Fetch stored hash from database
    const { rows: credRows } = await sql`SELECT secret_hash FROM admin_credentials WHERE id = 1 LIMIT 1;`;
    const storedHash = credRows[0]?.secret_hash;
    if (!storedHash) {
      return res.status(500).json({ error: 'Admin credentials record not found in database.' });
    }

    // 5. Compare current secret hash (timing-safe)
    const currentInputHash = crypto.createHash('sha256').update(currentSecretId.trim()).digest('hex');
    const isCurrentValid = timingSafeCompare(currentInputHash, storedHash);
    if (!isCurrentValid) {
      return res.status(401).json({ error: 'Current secret ID is incorrect.' });
    }

    // 6. Update to new hashed secret
    const newHash = crypto.createHash('sha256').update(newSecretId.trim()).digest('hex');
    await sql`
      UPDATE admin_credentials
      SET secret_hash = ${newHash}, updated_at = NOW()
      WHERE id = 1;
    `;

    // No emails sent per spec
    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('[Change Secret Error]', error?.message || error);
    return res.status(500).json({ error: 'Failed to update secret ID.' });
  }
}

// ------------------------- 5. Logout -------------------------
async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieHeader = `admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

  res.setHeader('Set-Cookie', cookieHeader);
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
