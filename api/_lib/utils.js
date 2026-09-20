import { S3Client } from '@aws-sdk/client-s3';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory stores for serverless lifecycle (persists across warm invocations)
export const otpStore = global.__OTP_STORE__ || (global.__OTP_STORE__ = new Map());
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
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_NOTIFY_USER || '',
      pass: process.env.GMAIL_NOTIFY_APP_PASSWORD || '',
    },
  });
}

export function getReplyTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_REPLY_USER || '',
      pass: process.env.GMAIL_REPLY_APP_PASSWORD || '',
    },
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
        return { success: false, error: error?.message };
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
