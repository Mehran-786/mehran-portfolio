import { sql } from '@vercel/postgres';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Attempt to load .env.local if running in local development
if (!process.env.POSTGRES_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  } catch {}
}

let isInitialized = false;

/**
 * Initialize PostgreSQL tables if they don't exist yet
 */
export async function initDb() {
  if (isInitialized) return;

  if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
    console.warn('[DB Warning] POSTGRES_URL is not set. Database operations will fail unless credentials are provided.');
    return;
  }

  try {
    // 1. OTP Codes Table (Challenge bound, short expiry, attempts limited)
    await sql`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id SERIAL PRIMARY KEY,
        challenge_id TEXT,
        code_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        requesting_ip TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS challenge_id TEXT;`;

    // 2. Reviews Table (Defaults to unapproved for moderation)
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        verdict TEXT NOT NULL,
        body TEXT NOT NULL,
        attachments JSONB NOT NULL DEFAULT '[]',
        approved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 3. Review Replies Table
    await sql`
      CREATE TABLE IF NOT EXISTS review_replies (
        id TEXT PRIMARY KEY,
        review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        is_owner BOOLEAN NOT NULL DEFAULT false,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 4. Admin Credentials Table (Secure in-app secret management)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY DEFAULT 1,
        secret_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT single_row CHECK (id = 1)
      );
    `;

    // Migration bootstrap: Fail closed if ADMIN_SECRET_ID is not configured
    const { rows: credRows } = await sql`SELECT id FROM admin_credentials LIMIT 1;`;
    if (credRows.length === 0) {
      if (process.env.ADMIN_SECRET_ID) {
        const secretHash = crypto.createHash('sha256').update(process.env.ADMIN_SECRET_ID.trim()).digest('hex');
        await sql`
          INSERT INTO admin_credentials (id, secret_hash, updated_at)
          VALUES (1, ${secretHash}, NOW())
          ON CONFLICT (id) DO NOTHING;
        `;
      } else {
        console.warn('[DB Init] ADMIN_SECRET_ID is not configured in environment. Admin credentials table remains unseeded (fail closed).');
      }
    }

    isInitialized = true;
  } catch (err) {
    console.error('[DB Init Error]', err?.message || err);
    throw err;
  }
}

export { sql };
