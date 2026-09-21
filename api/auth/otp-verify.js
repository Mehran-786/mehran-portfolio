import crypto from 'crypto';
import { timingSafeCompare } from '../_lib/utils.js';
import { sql, initDb } from '../_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body || {};
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Verification code is required.' });
    }

    await initDb();

    // Query active code row from database
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

    // Check 5-minute expiration
    if (now > expiresAt) {
      await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;
      return res.status(401).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Check maximum attempts (max 5)
    if (record.attempts >= 5) {
      await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;
      return res.status(401).json({ error: 'Maximum attempts exceeded. Code destroyed. Please request a new code.' });
    }

    // Hash user-submitted code
    const inputHash = crypto.createHash('sha256').update(code.trim()).digest('hex');

    // Compare timing-safely with stored SHA-256 hash
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

    // Success: single-use code, delete immediately from database
    await sql`DELETE FROM otp_codes WHERE id = ${record.id};`;

    // Sign session token valid for 24 hours
    const sessionSecret = process.env.SESSION_SECRET || 'mehran_secure_session_secret_default_key_2026';
    const sessionPayload = {
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    const sessionStr = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    const signature = crypto.createHmac('sha256', sessionSecret).update(sessionStr).digest('hex');
    const sessionToken = `${sessionStr}.${signature}`;

    // Set secure HTTP-only cookie with explicit flags: HttpOnly, Secure, SameSite=Strict, Max-Age=86400
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieHeader = `admin_session=${sessionToken}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('[OTP Verify Error]', error?.message || error);
    return res.status(500).json({ error: 'Verification failed.' });
  }
}
