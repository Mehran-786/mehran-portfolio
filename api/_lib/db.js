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

    // 2. Reviews Table (Defaults to approved = true for auto-publication)
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        verdict TEXT NOT NULL,
        body TEXT NOT NULL,
        attachments JSONB NOT NULL DEFAULT '[]',
        approved BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    try {
      await sql`ALTER TABLE reviews ALTER COLUMN approved SET DEFAULT true;`;
      await sql`UPDATE reviews SET approved = true WHERE approved = false;`;
    } catch {}

    // 3. Review Replies Table (Supports threaded replies & targeted notifications)
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
    try {
      await sql`ALTER TABLE review_replies ADD COLUMN IF NOT EXISTS parent_reply_id TEXT;`;
      await sql`ALTER TABLE review_replies ADD COLUMN IF NOT EXISTS reply_to_name TEXT;`;
      await sql`ALTER TABLE review_replies ADD COLUMN IF NOT EXISTS email TEXT;`;
    } catch (migErr) {
      console.warn('[DB Migration Warning review_replies]', migErr?.message || migErr);
    }

    // 4. Admin Credentials Table (Secure in-app secret management)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY DEFAULT 1,
        secret_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT single_row CHECK (id = 1)
      );
    `;

    // 5. Projects Table (Dynamic Project Management by Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        number TEXT,
        title TEXT NOT NULL,
        badge TEXT,
        description TEXT NOT NULL,
        tech_tags JSONB NOT NULL DEFAULT '[]',
        links JSONB NOT NULL DEFAULT '{}',
        media JSONB NOT NULL DEFAULT '[]',
        is_flagship BOOLEAN NOT NULL DEFAULT false,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // Seed default projects if table is empty
    try {
      const { rows: projCountRows } = await sql`SELECT COUNT(*)::int as count FROM projects;`;
      if (projCountRows[0]?.count === 0) {
        const defaultProjects = [
          {
            id: "video-vision",
            number: "01",
            badge: "🌟 Flagship Multi-Agent AI Platform",
            title: "Video Vision Enterprise: Multi-Agent AI & Video Intelligence Platform",
            description: "An enterprise-grade autonomous intelligence platform powered by a 10-Agent AI Board of Directors (SEO Expert, Thumbnail Expert, Audience Psychology, Forecast Predictor, Multi-Criteria Decision, Risk Intelligence, Memory Vector, and Executive Report Agents). Features autonomous consensus engines, TOPSIS utility calculation, 7/30/90-day predictive trend forecasting, seasonal pattern detection, and an interactive multi-agent workforce dashboard.",
            tech_tags: JSON.stringify(["Multi-Agent AI", "Python", "FastAPI", "React", "Vite", "Pydantic", "TOPSIS Utility Scoring", "Predictive Analytics", "YouTube Data API"]),
            links: JSON.stringify({ github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" }),
            media: JSON.stringify([
              { type: "image", url: "/src/assets/projects/video-vision-multi-agent.jpeg", title: "10-Agent Autonomous AI Board", desc: "Consensus engine, reputation tracking & agent roster" },
              { type: "image", url: "/src/assets/projects/video-vision-trend.jpeg", title: "Trend Forecaster & Intelligence", desc: "7/30/90-day predictions, opportunity windows & niche topics" },
              { type: "image", url: "/src/assets/projects/video-vision-engines.jpeg", title: "Core Engine Architecture", desc: "Multi-stage pipeline with shared Pydantic data contracts" },
              { type: "image", url: "/src/assets/projects/video-vision-analytics.jpeg", title: "Deep Video Analytics", desc: "Engagement curves, retention analytics & ranking signals" },
              { type: "image", url: "/src/assets/projects/video-vision-employee-section.jpeg", title: "Autonomous Workforce Hub", desc: "Executive departments, task automation & digital calendar" },
              { type: "image", url: "/src/assets/projects/video-vision-employee-performance.jpeg", title: "Agent Economics & Performance", desc: "Continuous learning score & ROI telemetry" }
            ]),
            is_flagship: true,
            display_order: 1
          },
          {
            id: "secure-llm-gateway",
            number: "02",
            badge: "🛡️ AI Security & Defense",
            title: "Secure LLM Gateway: Defending AI from Prompt Injection & Data Leaks",
            description: "A five-stage hybrid security gateway for LLM applications defending against direct prompt injection, jailbreaking (e.g. Grandma Exploit), and sensitive PII leaks across multiple languages. Combines a multilingual normalization layer, TF-IDF + Logistic Regression semantic attack classifier, and Microsoft Presidio with three custom recognizers (Pakistani CNIC, API keys, names) into a scored decision pipeline backed by a live Groq (llama-3.1-8b-instant) API. Evaluated on a 150-prompt dataset with 82.7% accuracy, 100% PII recall, 100% block precision, and 525ms average latency.",
            tech_tags: JSON.stringify(["Python", "FastAPI", "scikit-learn", "Microsoft Presidio", "Groq API", "Docker", "Nginx", "Pydantic"]),
            links: JSON.stringify({ github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" }),
            media: JSON.stringify([
              { type: "video", url: "/src/assets/projects/ai-gateway-demo.mp4", title: "Live AI Gateway Video Demo", desc: "1080p HD Demonstration" }
            ]),
            is_flagship: true,
            display_order: 2
          },
          {
            id: "tool-website",
            number: "03",
            badge: "🚀 Live Production Tool",
            title: "DownSocial: High-Speed Universal Video & Media Downloader",
            description: "A production web application and extraction utility designed for lightning-fast, high-definition video extraction across major platforms (YouTube, Facebook, Instagram, TikTok, Threads, Snapchat). Features automated link parsing, client-side format selection (HD MP4 / HQ MP3), IP-based rate limiting, Cloudflare edge caching, and full responsive dark mode.",
            tech_tags: JSON.stringify(["React", "JavaScript", "Python", "Flask", "Media Extraction", "Cloudflare CDN", "Vercel", "Rate Limiting"]),
            links: JSON.stringify({ github: "https://github.com/Mehran-786", demo: "https://mehranrasool.me/projects#tool-website", demoLabel: "Open Live Application" }),
            media: JSON.stringify([
              { type: "image", url: "/src/assets/projects/tool-website-main.jpeg", title: "DownSocial Universal Downloader", desc: "Modern dark UI supporting 6+ video platforms" },
              { type: "image", url: "/src/assets/projects/tool-website-features.jpeg", title: "Platform Extraction Hub", desc: "YouTube, Instagram, TikTok, Threads & Snapchat support" },
              { type: "image", url: "/src/assets/projects/tool-website-ready.jpeg", title: "Quality & Format Selection", desc: "Instant HD MP4 & HQ MP3 extraction engine" }
            ]),
            is_flagship: false,
            display_order: 3
          },
          {
            id: "cybersecurity-idps",
            number: "04",
            badge: "🔒 Cybersecurity & Defense",
            title: "Cryptographic IDPS & Online Brute-Force Defense",
            description: "A comprehensive Information Security platform demonstrating offline cryptographic hash cracking and real-time online brute-force attacks against web authentication. Features automated detection of repeated login failures, progressive rate limiting, 5-attempt account lockout mechanisms, and an Intrusion Detection & Prevention (IDPS) logging engine tracking attack timestamps and source vectors.",
            tech_tags: JSON.stringify(["Python", "Cryptography", "IDPS", "Password Hashing & Salting", "MD5 / SHA-256", "Rate Limiting", "Threat Logging"]),
            links: JSON.stringify({ github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" }),
            media: JSON.stringify([
              { type: "image", url: "/src/assets/projects/is-portal.png", title: "Password Cracking Portal", desc: "Interactive portal for testing hash attacks" },
              { type: "image", url: "/src/assets/projects/is-crack.png", title: "Hash Cracking Output", desc: "MD5/SHA-256 decrypted passwords & salt analysis" },
              { type: "image", url: "/src/assets/projects/is-bruteforce.png", title: "Online Brute-Force IDPS", desc: "Live attack logs, rate-limit trigger & lockout defense" }
            ]),
            is_flagship: false,
            display_order: 4
          },
          {
            id: "dungeon-crawler-rpg",
            number: "05",
            badge: "⚔️ C++ Game Engine",
            title: "2D Dungeon Crawler RPG Game (DSA Engine)",
            description: "An object-oriented 2D dungeon crawler built from scratch in C++ utilizing core Data Structures & Algorithms. Implements grid/graph level progression, item inventory systems, particle animations, dynamic shop mechanics, and state-machine-driven boss battles with SFML rendering.",
            tech_tags: JSON.stringify(["C++", "SFML", "OOP Architecture", "Data Structures & Algorithms", "Particle Systems", "State Machines"]),
            links: JSON.stringify({ github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" }),
            media: JSON.stringify([
              { type: "image", url: "/src/assets/projects/game-lobby.png", title: "Game Lobby", desc: "SFML Main Menu" },
              { type: "image", url: "/src/assets/projects/game-playing.png", title: "Dungeon Exploration", desc: "Dynamic Map Rendering" },
              { type: "image", url: "/src/assets/projects/game-boss.png", title: "Boss Battle State", desc: "Finite State Machine AI" },
              { type: "image", url: "/src/assets/projects/game-inventory.png", title: "Player Inventory", desc: "Data Structure Inventory Grid" },
              { type: "image", url: "/src/assets/projects/game-cart.png", title: "In-Game Merchant", desc: "SFML Shop Screen" },
              { type: "image", url: "/src/assets/projects/game-win.png", title: "Victory Screen", desc: "Game Completion State" }
            ]),
            is_flagship: false,
            display_order: 5
          }
        ];

        for (const p of defaultProjects) {
          await sql`
            INSERT INTO projects (id, number, title, badge, description, tech_tags, links, media, is_flagship, display_order)
            VALUES (${p.id}, ${p.number}, ${p.title}, ${p.badge}, ${p.description}, ${p.tech_tags}::jsonb, ${p.links}::jsonb, ${p.media}::jsonb, ${p.is_flagship}, ${p.display_order})
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      }
    } catch (seedErr) {
      console.warn('[DB Seed Warning projects]', seedErr?.message || seedErr);
    }

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
