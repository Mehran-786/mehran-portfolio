import crypto from 'crypto';
import { otpStore, timingSafeCompare } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body || {};
    const record = otpStore.get('admin_otp');

    if (!record) {
      return res.status(401).json({ error: 'No active verification code found. Please request a new code.' });
    }

    // Check 5-minute expiration
    if (Date.now() > record.expiresAt) {
      otpStore.delete('admin_otp');
      return res.status(401).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Check maximum attempts (max 5)
    if (record.attempts >= 5) {
      otpStore.delete('admin_otp');
      return res.status(401).json({ error: 'Maximum attempts exceeded. Code destroyed. Please request a new code.' });
    }

    // Hash user-submitted code
    const inputHash = crypto.createHash('sha256').update((code || '').trim()).digest('hex');

    // Compare with timingSafeEqual
    const isMatch = timingSafeCompare(inputHash, record.hash);

    if (!isMatch) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        otpStore.delete('admin_otp');
        return res.status(401).json({ error: 'Maximum attempts exceeded. Code destroyed.' });
      }
      return res.status(401).json({ error: `Incorrect code. ${5 - record.attempts} attempt(s) remaining.` });
    }

    // Success: single-use, invalidate immediately
    otpStore.delete('admin_otp');

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

    // Set secure HTTP-only cookie with explicit flags: HttpOnly, Secure, SameSite=Strict, Max-Age=86400 (G5)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieHeader = `admin_session=${sessionToken}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('[OTP Verify Error]', error?.message || error);
    return res.status(500).json({ error: 'Verification failed.' });
  }
}
