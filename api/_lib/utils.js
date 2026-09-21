import { S3Client } from '@aws-sdk/client-s3';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Rate limiter store for serverless lifecycle (persists across warm invocations)
export const rateLimitStore = global.__RATE_LIMIT_STORE__ || (global.__RATE_LIMIT_STORE__ = new Map());

/**
 * Rate limiter utility
 * @param {string} key - e.g. "presign:192.168.1.1"
 * @param {number} max - max allowed requests
 * @param {number} windowMs - window duration in ms
 */
export function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  rateLimitStore.set(key, record);

  return record.count <= max;
}

/**
 * Cloudflare R2 S3 Client
 */
export function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID || '';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Gmail Transporters
 */
export function getNotifyTransporter() {
  const user = process.env.GMAIL_NOTIFY_USER || process.env.GMAIL_USER || process.env.ADMIN_EMAIL || 'mehranrasool546@gmail.com';
  const rawPass = process.env.GMAIL_NOTIFY_APP_PASSWORD || process.env.GMAIL_NOTIFY_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export function getReplyTransporter() {
  const user = process.env.GMAIL_REPLY_USER || 'mehranrasool.sp24@gmail.com';
  const rawPass = process.env.GMAIL_REPLY_APP_PASSWORD || process.env.GMAIL_REPLY_PASSWORD || process.env.GMAIL_APP_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Email sender with exponential backoff retry (2 retries: 1s, 3s)
 */
export async function sendEmailWithRetry(transporter, mailOptions, retries = 2) {
  const delays = [1000, 3000];
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      attempt += 1;
      if (attempt > retries) {
        console.error(`[Email Error] Failed after ${retries} retries:`, error?.message || error);
        return { success: false, error: error?.message || 'Email delivery failed' };
      }
      const delayMs = delays[attempt - 1] || 2000;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Timing safe string comparison
 */
export function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify admin session from cookies or Authorization header
 * @param {import('http').IncomingMessage} req
 * @returns {boolean}
 */
export function verifyAdminSession(req) {
  try {
    const cookieHeader = req.headers?.cookie || '';
    let sessionToken = '';

    const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
    if (match) {
      sessionToken = decodeURIComponent(match[1]);
    } else if (req.headers?.authorization?.startsWith('Bearer ')) {
      sessionToken = req.headers.authorization.slice(7).trim();
    }

    if (!sessionToken || !sessionToken.includes('.')) return false;

    const [payloadB64, sig] = sessionToken.split('.');
    const sessionSecret = process.env.SESSION_SECRET || 'mehran_secure_session_secret_default_key_2026';
    const expectedSig = crypto.createHmac('sha256', sessionSecret).update(payloadB64).digest('hex');

    if (!timingSafeCompare(sig, expectedSig)) return false;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
    if (payload.role !== 'admin') return false;
    if (payload.exp && Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}
