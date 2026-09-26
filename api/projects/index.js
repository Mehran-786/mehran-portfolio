import crypto from 'crypto';
import { sql, initDb } from '../_lib/db.js';
import { verifyAdminSession, validateOrigin, escapeHtml } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  await initDb();

  // ------------------------- GET: List All Projects -------------------------
  if (req.method === 'GET') {
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      // Graceful local fallback when running offline or without database env vars
      const staticFallbacks = [
        {
          id: "video-vision",
          number: "01",
          badge: "🌟 Flagship Multi-Agent AI Platform",
          title: "Video Vision Enterprise: Multi-Agent AI & Video Intelligence Platform",
          description: "An enterprise-grade autonomous intelligence platform powered by a 10-Agent AI Board of Directors (SEO Expert, Thumbnail Expert, Audience Psychology, Forecast Predictor, Multi-Criteria Decision, Risk Intelligence, Memory Vector, and Executive Report Agents). Features autonomous consensus engines, TOPSIS utility calculation, 7/30/90-day predictive trend forecasting, seasonal pattern detection, and an interactive multi-agent workforce dashboard.",
          techTags: ["Multi-Agent AI", "Python", "FastAPI", "React", "Vite", "Pydantic", "TOPSIS Utility Scoring", "Predictive Analytics", "YouTube Data API"],
          links: { github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" },
          media: [],
          isFlagship: true,
          displayOrder: 1,
        },
        {
          id: "secure-llm-gateway",
          number: "02",
          badge: "🛡️ AI Security & Defense",
          title: "Secure LLM Gateway: Defending AI from Prompt Injection & Data Leaks",
          description: "A five-stage hybrid security gateway for LLM applications defending against direct prompt injection, jailbreaking (e.g. Grandma Exploit), and sensitive PII leaks across multiple languages. Combines a multilingual normalization layer, TF-IDF + Logistic Regression semantic attack classifier, and Microsoft Presidio with three custom recognizers (Pakistani CNIC, API keys, names) into a scored decision pipeline backed by a live Groq (llama-3.1-8b-instant) API. Evaluated on a 150-prompt dataset with 82.7% accuracy, 100% PII recall, 100% block precision, and 525ms average latency.",
          techTags: ["Python", "FastAPI", "scikit-learn", "Microsoft Presidio", "Groq API", "Docker", "Nginx", "Pydantic"],
          links: { github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" },
          media: [],
          isFlagship: true,
          displayOrder: 2,
        },
        {
          id: "tool-website",
          number: "03",
          badge: "🚀 Live Production Tool",
          title: "DownSocial: High-Speed Universal Video & Media Downloader",
          description: "A production web application and extraction utility designed for lightning-fast, high-definition video extraction across major platforms (YouTube, Facebook, Instagram, TikTok, Threads, Snapchat). Features automated link parsing, client-side format selection (HD MP4 / HQ MP3), IP-based rate limiting, Cloudflare edge caching, and full responsive dark mode.",
          techTags: ["React", "JavaScript", "Python", "Flask", "Media Extraction", "Cloudflare CDN", "Vercel", "Rate Limiting"],
          links: { github: "https://github.com/Mehran-786", demo: "https://mehranrasool.me/projects#tool-website", demoLabel: "Open Live Application" },
          media: [],
          isFlagship: false,
          displayOrder: 3,
        },
        {
          id: "cybersecurity-idps",
          number: "04",
          badge: "🔒 Cybersecurity & Defense",
          title: "Cryptographic IDPS & Online Brute-Force Defense",
          description: "A comprehensive Information Security platform demonstrating offline cryptographic hash cracking and real-time online brute-force attacks against web authentication. Features automated detection of repeated login failures, progressive rate limiting, 5-attempt account lockout mechanisms, and an Intrusion Detection & Prevention (IDPS) logging engine tracking attack timestamps and source vectors.",
          techTags: ["Python", "Cryptography", "IDPS", "Password Hashing & Salting", "MD5 / SHA-256", "Rate Limiting", "Threat Logging"],
          links: { github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" },
          media: [],
          isFlagship: false,
          displayOrder: 4,
        },
        {
          id: "dungeon-crawler-rpg",
          number: "05",
          badge: "⚔️ C++ Game Engine",
          title: "2D Dungeon Crawler RPG Game (DSA Engine)",
          description: "An object-oriented 2D dungeon crawler built from scratch in C++ utilizing core Data Structures & Algorithms. Implements grid/graph level progression, item inventory systems, particle animations, dynamic shop mechanics, and state-machine-driven boss battles with SFML rendering.",
          techTags: ["C++", "SFML", "OOP Architecture", "Data Structures & Algorithms", "Particle Systems", "State Machines"],
          links: { github: "https://github.com/Mehran-786", demo: null, demoLabel: "Open Live Application" },
          media: [],
          isFlagship: false,
          displayOrder: 5,
        }
      ];
      return res.status(200).json(staticFallbacks);
    }

    try {
      const { rows } = await sql`
        SELECT id, number, title, badge, description, tech_tags, links, media, is_flagship, display_order, created_at, updated_at
        FROM projects
        ORDER BY display_order ASC, created_at DESC;
      `;

      const formatted = rows.map(r => ({
        id: r.id,
        number: r.number || '',
        title: r.title,
        badge: r.badge || '',
        description: r.description,
        techTags: typeof r.tech_tags === 'string' ? JSON.parse(r.tech_tags) : (r.tech_tags || []),
        links: typeof r.links === 'string' ? JSON.parse(r.links) : (r.links || {}),
        media: typeof r.media === 'string' ? JSON.parse(r.media) : (r.media || []),
        isFlagship: Boolean(r.is_flagship),
        displayOrder: r.display_order || 0,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));

      return res.status(200).json(formatted);
    } catch (err) {
      console.error('[Projects GET Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to fetch projects.' });
    }
  }

  // ------------------------- POST: Create Project (Admin Only) -------------------------
  if (req.method === 'POST') {
    const isAdmin = verifyAdminSession(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized. Admin credentials required to add projects.' });
    }

    try {
      const {
        title,
        badge = '',
        description,
        techTags = [],
        links = {},
        media = [],
        isFlagship = false,
      } = req.body || {};

      const cleanTitle = typeof title === 'string' ? title.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanTitle || cleanTitle.length < 3 || cleanTitle.length > 150) {
        return res.status(400).json({ error: 'Project title must be between 3 and 150 characters.' });
      }

      const cleanDescription = typeof description === 'string' ? description.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanDescription || cleanDescription.length < 10) {
        return res.status(400).json({ error: 'Project description must be at least 10 characters.' });
      }

      const cleanBadge = typeof badge === 'string' ? badge.replace(/<[^>]*>?/gm, '').trim().slice(0, 100) : '';

      // Clean tech tags
      const cleanTechTags = Array.isArray(techTags)
        ? techTags.map(t => String(t).replace(/<[^>]*>?/gm, '').trim()).filter(Boolean)
        : [];

      // Clean links
      const cleanLinks = {
        github: typeof links?.github === 'string' && links.github.trim().startsWith('http') ? links.github.trim() : null,
        demo: typeof links?.demo === 'string' && (links.demo.trim().startsWith('http') || links.demo.trim().startsWith('/')) ? links.demo.trim() : null,
        demoLabel: typeof links?.demoLabel === 'string' && links.demoLabel.trim() ? links.demoLabel.trim().slice(0, 50) : 'Open Live Application',
      };

      // Clean media attachments
      const cleanMedia = Array.isArray(media)
        ? media.map(m => ({
            type: ['image', 'video', 'file'].includes(m.type) ? m.type : 'image',
            url: typeof m.url === 'string' ? m.url.trim() : '',
            key: typeof m.key === 'string' ? m.key.trim() : '',
            name: typeof m.name === 'string' ? m.name.slice(0, 120) : '',
            title: typeof m.title === 'string' ? m.title.slice(0, 120) : '',
            desc: typeof m.desc === 'string' ? m.desc.slice(0, 200) : '',
            size: typeof m.size === 'string' ? m.size : '',
          })).filter(m => m.url || m.key)
        : [];

      // Calculate next project number and order
      const { rows: countRows } = await sql`SELECT COUNT(*)::int as count FROM projects;`;
      const currentCount = countRows[0]?.count || 0;
      const nextNumber = String(currentCount + 1).padStart(2, '0');
      const nextOrder = currentCount + 1;

      // Generate unique ID slug
      const slugBase = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 50) || 'project';
      const id = `${slugBase}-${crypto.randomBytes(3).toString('hex')}`;

      const now = new Date().toISOString();

      await sql`
        INSERT INTO projects (id, number, title, badge, description, tech_tags, links, media, is_flagship, display_order, created_at, updated_at)
        VALUES (${id}, ${nextNumber}, ${cleanTitle}, ${cleanBadge}, ${cleanDescription}, ${JSON.stringify(cleanTechTags)}::jsonb, ${JSON.stringify(cleanLinks)}::jsonb, ${JSON.stringify(cleanMedia)}::jsonb, ${Boolean(isFlagship)}, ${nextOrder}, ${now}, ${now});
      `;

      return res.status(201).json({
        id,
        number: nextNumber,
        title: cleanTitle,
        badge: cleanBadge,
        description: cleanDescription,
        techTags: cleanTechTags,
        links: cleanLinks,
        media: cleanMedia,
        isFlagship: Boolean(isFlagship),
        displayOrder: nextOrder,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      console.error('[Projects POST Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to create project.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
