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
 * Escapes unsafe characters for HTML/Email rendering to prevent injection/XSS
 * @param {string} str - Raw user input
 * @returns {string} Sanitized string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      console.error('[FATAL] SESSION_SECRET is not set.');
      return false;
    }
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

/**
 * Validates request origin/referer for state-changing endpoints (CORS & CSRF protection).
 * Explicitly allows:
 * - https://mehranrasool.me
 * - https://www.mehranrasool.me
 * - process.env.NEXT_PUBLIC_SITE_URL (and www / non-www variant)
 * - Vercel preview URLs (*.vercel.app)
 * - Localhost development origins (http://localhost:5173, http://localhost:3000, 127.0.0.1)
 * Normalizes both Origin and Referer headers.
 */
export function validateOrigin(req) {
  let requestOrigin = req.headers?.['origin'] || '';

  // If Origin header is missing, extract and normalize origin from Referer
  if (!requestOrigin && req.headers?.['referer']) {
    try {
      const refererUrl = new URL(req.headers['referer']);
      requestOrigin = refererUrl.origin;
    } catch {
      requestOrigin = '';
    }
  }

  // If still no origin or referer (e.g. direct server-to-server or curl)
  if (!requestOrigin) {
    const secFetchSite = req.headers?.['sec-fetch-site'];
    if (secFetchSite && secFetchSite === 'cross-site') {
      return false; // Cross-site browser request with stripped origin
    }
    return true; // Direct same-origin or trusted server invocation
  }

  // Normalize origin: lowercase and strip trailing slash
  requestOrigin = requestOrigin.trim().toLowerCase().replace(/\/+$/, '');

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehranrasool.me').trim().toLowerCase().replace(/\/+$/, '');

  const explicitAllowed = new Set([
    'https://mehranrasool.me',
    'https://www.mehranrasool.me',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    siteUrl,
  ]);

  if (siteUrl.startsWith('https://www.')) {
    explicitAllowed.add(siteUrl.replace('https://www.', 'https://'));
  } else if (siteUrl.startsWith('https://')) {
    explicitAllowed.add(siteUrl.replace('https://', 'https://www.'));
  }

  // Exact match check
  if (explicitAllowed.has(requestOrigin)) {
    return true;
  }

  // Check localhost / 127.0.0.1 on any port
  if (requestOrigin.startsWith('http://localhost:') || requestOrigin.startsWith('http://127.0.0.1:')) {
    return true;
  }

  // Check Vercel preview deployments (*.vercel.app)
  try {
    const urlObj = new URL(requestOrigin);
    if (urlObj.hostname === 'vercel.app' || urlObj.hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
