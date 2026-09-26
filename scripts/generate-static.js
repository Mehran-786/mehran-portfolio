import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir   = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');

// ─── Domain Configuration ───────────────────────────────────────────────────
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VITE_SITE_URL        ||
  'https://mehranrasool.me'
).replace(/\/+$/, '');

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

// ─── 1. sitemap.xml ─────────────────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects/secure-llm-gateway</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects/video-vision</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects/downsocial</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects/cybersecurity-idps</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${siteUrl}/projects/dungeon-crawler</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${siteUrl}/reviews</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`;

// ─── 2. robots.txt ──────────────────────────────────────────────────────────
const robots = `User-agent: *
Allow: /
Disallow: /api/

# === AI / LLM Crawlers — explicitly allowed for AEO + LLM-SEO ============
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Allow: /
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /api/

User-agent: Claude-Web
Allow: /
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /api/

User-agent: Google-Extended
Allow: /
Disallow: /api/

User-agent: Applebot-Extended
Allow: /
Disallow: /api/

User-agent: CCBot
Allow: /
Disallow: /api/

User-agent: Amazonbot
Allow: /
Disallow: /api/

User-agent: YouBot
Allow: /
Disallow: /api/

User-agent: anthropic-ai
Allow: /
Disallow: /api/

# === Sitemap ===============================================================
Sitemap: ${siteUrl}/sitemap.xml
`;

// ─── 3. llms.txt ────────────────────────────────────────────────────────────
const llms = `# Mehran Rasool — Portfolio Summary for AI & LLM Crawlers
# Generated: ${today} | Canonical Domain: ${siteUrl}

## Identity & Professional Overview
- Name: Mehran Rasool
- Primary Professional Identity: Full-Stack Developer
- Secondary Specializations: Full-Stack Web Development, Flutter App Engineering, Applied AI Systems, REST API Architecture, LLM Security
- Location: Wah Cantt, Punjab, Pakistan
- Education: Bachelor of Science in Computer Science at COMSATS University Islamabad, Wah Campus
- Official Website: ${siteUrl}

## Technical Capabilities
- Web Development: React, Next.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite
- Mobile Development: Flutter, Dart, Cross-platform iOS & Android mobile application development
- Backend & APIs: Python, FastAPI, Flask, Pydantic, RESTful API design, Gunicorn, Nginx
- Systems & Core Languages: Python, Dart, JavaScript, C++, Java, SQL
- AI & LLM Security: Prompt Injection Defense, Microsoft Presidio, scikit-learn, TF-IDF, Logistic Regression, Groq API
- Deployment & Infrastructure: Linux Server Administration, Vercel, Cloudflare edge caching, Git, GitHub

## Verified Software Projects & Architecture
1. Secure LLM Gateway
   - Description: A five-stage hybrid security gateway for LLM applications defending against direct prompt injection, jailbreaking, and sensitive PII leakage across multiple languages.
   - Stack: Python, FastAPI, scikit-learn, Microsoft Presidio, Groq API (llama-3.1-8b-instant), Docker, Nginx, Pydantic
   - Benchmark Evaluation (150-prompt test suite): 82.7% overall accuracy, 100% PII recall, 100% block precision, 525ms average latency
   - Repository: https://github.com/Mehran-786

2. YT VISION (YouTube Analytics Platform & Extension)
   - Description: Multi-engine YouTube analytics platform and browser extension built on SOLID principles with shared Pydantic data contracts across an eight-stage pipeline.
   - Stack: Python, FastAPI, React, Vite, Pydantic, TOPSIS Utility Scoring, YouTube Data API
   - Repository: https://github.com/Mehran-786

3. DownSocial (Universal Video & Media Downloader)
   - Description: High-speed universal video and media extraction production web utility supporting multi-platform extraction with IP rate limiting and Cloudflare edge caching.
   - Stack: React, JavaScript, Python, Flask, Cloudflare CDN, Vercel
   - Repository: https://github.com/Mehran-786
   - Live URL: ${siteUrl}/projects#tool-website

4. Cryptographic IDPS & Online Brute-Force Defense
   - Description: Information security platform demonstrating offline cryptographic hash analysis and real-time online brute-force intrusion detection with automated account lockout.
   - Stack: Python, Cryptography, IDPS, Hash Salting, Rate Limiting
   - Repository: https://github.com/Mehran-786

5. 2D Dungeon Crawler RPG Game (DSA Engine)
   - Description: An object-oriented 2D dungeon crawler built from scratch in C++ featuring SFML rendering, particle systems, dynamic inventory, and boss battle state machines.
   - Stack: C++, SFML, Data Structures & Algorithms, OOP
   - Repository: https://github.com/Mehran-786

## Contact & Public Verification
- Official Website: ${siteUrl}
- About Page: ${siteUrl}/about
- Projects Showcase: ${siteUrl}/projects
- Client Reviews: ${siteUrl}/reviews
- Contact Page: ${siteUrl}/contact
- GitHub: https://github.com/Mehran-786
- LinkedIn: https://www.linkedin.com/in/mehran-rasool-445613402
- Email: mehranrasool.sp24@gmail.com
`;

// ─── 4. Pre-Rendered Pages Configuration ────────────────────────────────────
const pages = [
  {
    route: '/',
    outputPath: path.join(distDir, 'index.html'),
    title: 'Mehran Rasool — Full-Stack Developer',
    description: 'Mehran Rasool is a full-stack developer based in Wah Cantt, Pakistan, specializing in web development, Flutter apps, and AI systems.',
    canonical: `${siteUrl}/`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        'name': 'Mehran Rasool',
        'url': `${siteUrl}/`,
        'description': 'Official portfolio of Mehran Rasool — Full-Stack Developer specializing in web development, Flutter mobile apps, and applied AI systems.',
        'publisher': { '@id': personId }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': personId,
        'name': 'Mehran Rasool',
        'url': `${siteUrl}/`,
        'image': `${siteUrl}/logo.png`,
        'jobTitle': 'Full-Stack Developer',
        'description': 'Full-stack developer building production web applications, cross-platform Flutter mobile apps, and applied AI systems. Based in Wah Cantt, Pakistan.',
        'alumniOf': {
          '@type': 'CollegeOrUniversity',
          'name': 'COMSATS University Islamabad, Wah Campus'
        },
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Wah Cantt',
          'addressRegion': 'Punjab',
          'addressCountry': 'PK'
        },
        'sameAs': [
          'https://github.com/Mehran-786',
          'https://www.linkedin.com/in/mehran-rasool-445613402'
        ]
      }
    ],
    htmlContent: `
      <header style="padding: 2rem; text-align: center;">
        <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem;">Hi, I'm Mehran Rasool</h1>
        <p style="color: #10b981; font-size: 1.25rem; font-weight: bold;">Full-Stack Developer</p>
        <p style="color: #cbd5e1; max-width: 600px; margin: 1rem auto;">
          Mehran Rasool is a full-stack developer based in Wah Cantt, Pakistan, specializing in web development, Flutter apps, and AI systems.
        </p>
        <nav style="margin-top: 1.5rem;">
          <a href="/about" style="color: #10b981; margin: 0 10px;">About</a>
          <a href="/projects" style="color: #10b981; margin: 0 10px;">Projects</a>
          <a href="/reviews" style="color: #10b981; margin: 0 10px;">Reviews</a>
          <a href="/contact" style="color: #10b981; margin: 0 10px;">Contact</a>
        </nav>
      </header>
    `
  },
  {
    route: '/about',
    outputPath: path.join(distDir, 'about/index.html'),
    title: 'About Mehran Rasool — Full-Stack Developer',
    description: 'Learn more about Mehran Rasool, a full-stack developer from Wah Cantt, Pakistan, building high-impact web applications, Flutter mobile apps, and secure AI systems.',
    canonical: `${siteUrl}/about`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      'name': 'About Mehran Rasool — Full-Stack Developer',
      'url': `${siteUrl}/about`,
      'datePublished': '2024-01-15T00:00:00Z',
      'dateModified': '2026-09-26T00:00:00Z',
      'mainEntity': {
        '@type': 'Person',
        '@id': personId,
        'name': 'Mehran Rasool',
        'jobTitle': 'Full-Stack Developer',
        'alumniOf': 'COMSATS University Islamabad, Wah Campus',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Wah Cantt',
          'addressRegion': 'Punjab',
          'addressCountry': 'PK'
        }
      }
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>About Mehran Rasool — Full-Stack Developer</h1>
        <p style="color: #10b981; font-weight: 600;">Based in Wah Cantt, Punjab, Pakistan | COMSATS University Islamabad</p>
        <p>I build software that ships — web, mobile, and the AI layer in between. Specializing in production React applications, cross-platform Flutter mobile apps, and secure FastAPI services.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/" style="color: #10b981; margin-right: 15px;">Home</a>
          <a href="/projects" style="color: #10b981; margin-right: 15px;">Projects</a>
          <a href="/contact" style="color: #10b981;">Contact</a>
        </nav>
      </main>
    `
  },
  {
    route: '/projects',
    outputPath: path.join(distDir, 'projects/index.html'),
    title: 'Projects — Mehran Rasool',
    description: 'Explore software projects built by Mehran Rasool, including full-stack web applications, cross-platform Flutter apps, REST APIs, and applied AI systems.',
    canonical: `${siteUrl}/projects`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Secure LLM Gateway',
        'applicationCategory': 'SecurityApplication',
        'operatingSystem': 'Cross-platform, Linux, Cloud',
        'description': 'A five-stage hybrid security gateway defending LLM applications against prompt injection, jailbreaking, and sensitive PII leakage across multiple languages.',
        'author': { '@id': personId },
        'programmingLanguage': ['Python', 'FastAPI'],
        'codeRepository': 'https://github.com/Mehran-786'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'DownSocial: Universal Media & Video Downloader',
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'Web Browser',
        'description': 'A live production web service and media extraction utility with rate limiting, Nginx, Gunicorn, Cloudflare edge caching, and multilingual support.',
        'author': { '@id': personId },
        'programmingLanguage': ['Python', 'Flask', 'JavaScript', 'React'],
        'codeRepository': 'https://github.com/Mehran-786'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'YT VISION: YouTube Analytics Platform',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web Browser, Chrome Extension',
        'description': 'Multi-engine YouTube analytics platform and browser extension built on SOLID principles with shared Pydantic contracts across an eight-stage pipeline.',
        'author': { '@id': personId },
        'programmingLanguage': ['Python', 'FastAPI', 'React', 'TypeScript'],
        'codeRepository': 'https://github.com/Mehran-786'
      }
    ],
    htmlContent: `
      <main style="padding: 2rem; max-width: 900px; margin: 0 auto; color: #f1f5f9;">
        <h1>Projects — Mehran Rasool</h1>
        <p>Explore software projects built by Mehran Rasool, including full-stack web applications, cross-platform Flutter apps, REST APIs, and applied AI systems.</p>
        <section style="margin-top: 2rem;">
          <h2>1. Secure LLM Gateway</h2>
          <p>Five-stage hybrid defense pipeline defending against prompt injection and PII leakage with 82.7% accuracy and 100% PII recall.</p>
          <h2>2. YT VISION Analytics Platform</h2>
          <p>FastAPI and React analytics platform built on SOLID design principles with shared Pydantic data contracts.</p>
          <h2>3. DownSocial Video Downloader</h2>
          <p>High-speed universal video and audio extraction service with Cloudflare edge caching and rate limiting.</p>
          <h2>4. 2D Dungeon Crawler RPG</h2>
          <p>Object-oriented C++ game engine with SFML rendering and inventory management.</p>
          <h2>5. Real Estate Management System</h2>
          <p>Java desktop application implementing property database tracking and transaction records.</p>
        </section>
        <nav style="margin-top: 1.5rem;">
          <a href="/" style="color: #10b981; margin-right: 15px;">Home</a>
          <a href="/about" style="color: #10b981; margin-right: 15px;">About</a>
          <a href="/contact" style="color: #10b981;">Contact</a>
        </nav>
      </main>
    `
  },
  {
    route: '/reviews',
    outputPath: path.join(distDir, 'reviews/index.html'),
    title: 'Client Reviews — Mehran Rasool',
    description: "Read client and peer reviews for Mehran Rasool's full-stack development, Flutter mobile apps, and software engineering work.",
    canonical: `${siteUrl}/reviews`,
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>Client Reviews — Mehran Rasool</h1>
        <p>Read verified peer and client reviews on Mehran Rasool's full-stack development, Flutter mobile apps, and software engineering work.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/" style="color: #10b981; margin-right: 15px;">Home</a>
          <a href="/projects" style="color: #10b981; margin-right: 15px;">Projects</a>
          <a href="/contact" style="color: #10b981;">Contact</a>
        </nav>
      </main>
    `
  },
  {
    route: '/contact',
    outputPath: path.join(distDir, 'contact/index.html'),
    title: 'Contact Mehran Rasool — Full-Stack Developer',
    description: 'Contact Mehran Rasool, a full-stack developer based in Wah Cantt, Pakistan, for freelance web development, Flutter apps, and engineering collaborations.',
    canonical: `${siteUrl}/contact`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact Mehran Rasool — Full-Stack Developer',
      'url': `${siteUrl}/contact`,
      'mainEntity': {
        '@type': 'Person',
        '@id': personId,
        'name': 'Mehran Rasool',
        'email': 'mehranrasool.sp24@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Wah Cantt',
          'addressRegion': 'Punjab',
          'addressCountry': 'PK'
        }
      }
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>Contact Mehran Rasool — Full-Stack Developer</h1>
        <p>Available for freelance and contract engineering in web application development, Flutter mobile apps, REST APIs, and applied AI systems.</p>
        <p>Email: <a href="mailto:mehranrasool.sp24@gmail.com" style="color: #10b981;">mehranrasool.sp24@gmail.com</a></p>
        <nav style="margin-top: 1.5rem;">
          <a href="/" style="color: #10b981; margin-right: 15px;">Home</a>
          <a href="/about" style="color: #10b981; margin-right: 15px;">About</a>
          <a href="/projects" style="color: #10b981;">Projects</a>
        </nav>
      </main>
    `
  },
  {
    route: '/404',
    outputPath: path.join(distDir, '404.html'),
    title: '404 — Page Not Found | Mehran Rasool',
    description: 'The requested page could not be found. Navigate back to Mehran Rasool\'s portfolio homepage, projects, about page, or contact.',
    canonical: `${siteUrl}/404`,
    noindex: true,
    htmlContent: `
      <main style="padding: 3rem 2rem; max-width: 600px; margin: 0 auto; text-align: center; color: #f1f5f9;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">404 — Page Not Found</h1>
        <p style="color: #94a3b8; margin-bottom: 2rem;">The page you are looking for doesn't exist or has been relocated.</p>
        <nav>
          <a href="/" style="color: #10b981; margin: 0 10px; font-weight: 600;">Home</a>
          <a href="/about" style="color: #10b981; margin: 0 10px; font-weight: 600;">About</a>
          <a href="/projects" style="color: #10b981; margin: 0 10px; font-weight: 600;">Projects</a>
          <a href="/contact" style="color: #10b981; margin: 0 10px; font-weight: 600;">Contact</a>
        </nav>
      </main>
    `
  },
  // Dedicated Project Detail Pages for SEO & Crawlers
  {
    route: '/projects/secure-llm-gateway',
    outputPath: path.join(distDir, 'projects/secure-llm-gateway/index.html'),
    title: 'Secure LLM Gateway — Project by Mehran Rasool',
    description: 'Architecture and benchmark results for the Secure LLM Gateway: Defending AI from prompt injection and PII leaks with 82.7% accuracy.',
    canonical: `${siteUrl}/projects/secure-llm-gateway`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Secure LLM Gateway',
      'applicationCategory': 'SecurityApplication',
      'operatingSystem': 'Cross-platform, Linux, Cloud',
      'description': 'A five-stage hybrid security gateway defending LLM applications against prompt injection, jailbreaking, and sensitive PII leakage across multiple languages.',
      'author': { '@id': personId },
      'programmingLanguage': ['Python', 'FastAPI'],
      'codeRepository': 'https://github.com/Mehran-786'
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>Secure LLM Gateway: Defending AI from Prompt Injection & Data Leaks</h1>
        <p style="color: #10b981; font-weight: bold;">Engineered by Mehran Rasool — Full-Stack Developer</p>
        <p>A five-stage hybrid security gateway for LLM applications defending against direct prompt injection, jailbreaking, and sensitive PII leaks across multiple languages.</p>
        <h2>Key Results (Verified 150-Prompt Evaluation)</h2>
        <ul>
          <li>Overall Accuracy: 82.7%</li>
          <li>PII Recall: 100%</li>
          <li>Block Precision: 100%</li>
          <li>Average Latency: 525ms</li>
        </ul>
        <nav style="margin-top: 1.5rem;">
          <a href="/projects" style="color: #10b981; margin-right: 15px;">All Projects</a>
          <a href="/" style="color: #10b981;">Home</a>
        </nav>
      </main>
    `
  },
  {
    route: '/projects/video-vision',
    outputPath: path.join(distDir, 'projects/video-vision/index.html'),
    title: 'YT VISION: YouTube Analytics Platform — Project by Mehran Rasool',
    description: 'Multi-engine YouTube analytics platform and browser extension engineered with FastAPI, React, and shared Pydantic data contracts.',
    canonical: `${siteUrl}/projects/video-vision`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'YT VISION: YouTube Analytics Platform',
      'applicationCategory': 'BusinessApplication',
      'author': { '@id': personId },
      'programmingLanguage': ['Python', 'FastAPI', 'React']
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>YT VISION: Multi-Engine YouTube Analytics Platform & Extension</h1>
        <p style="color: #10b981; font-weight: bold;">Engineered by Mehran Rasool — Full-Stack Developer</p>
        <p>Multi-engine YouTube analytics platform and browser extension built on SOLID principles with shared Pydantic data contracts across an eight-stage processing pipeline.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/projects" style="color: #10b981; margin-right: 15px;">All Projects</a>
          <a href="/" style="color: #10b981;">Home</a>
        </nav>
      </main>
    `
  },
  {
    route: '/projects/downsocial',
    outputPath: path.join(distDir, 'projects/downsocial/index.html'),
    title: 'DownSocial: Universal Media Downloader — Project by Mehran Rasool',
    description: 'High-speed universal media downloader web utility with rate limiting, Nginx, Gunicorn, and Cloudflare edge caching by Mehran Rasool.',
    canonical: `${siteUrl}/projects/downsocial`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'DownSocial: Universal Media & Video Downloader',
      'applicationCategory': 'MultimediaApplication',
      'author': { '@id': personId },
      'programmingLanguage': ['Python', 'Flask', 'React']
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>DownSocial: Universal Media & Video Downloader</h1>
        <p style="color: #10b981; font-weight: bold;">Engineered by Mehran Rasool — Full-Stack Developer</p>
        <p>A live production web service and media extraction utility with rate limiting, Nginx, Gunicorn, Cloudflare edge caching, and multilingual support.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/projects" style="color: #10b981; margin-right: 15px;">All Projects</a>
          <a href="/" style="color: #10b981;">Home</a>
        </nav>
      </main>
    `
  },
  {
    route: '/projects/cybersecurity-idps',
    outputPath: path.join(distDir, 'projects/cybersecurity-idps/index.html'),
    title: 'Cryptographic IDPS & Online Brute-Force Defense — Project by Mehran Rasool',
    description: 'Information security platform demonstrating offline cryptographic hash analysis and real-time online brute-force intrusion detection with automated account lockout by Mehran Rasool.',
    canonical: `${siteUrl}/projects/cybersecurity-idps`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Cryptographic IDPS & Online Brute-Force Defense',
      'applicationCategory': 'SecurityApplication',
      'author': { '@id': personId },
      'programmingLanguage': ['Python', 'Cryptography']
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>Cryptographic IDPS & Online Brute-Force Defense</h1>
        <p style="color: #10b981; font-weight: bold;">Engineered by Mehran Rasool — Full-Stack Developer</p>
        <p>Information security platform demonstrating offline cryptographic hash analysis and real-time online brute-force intrusion detection with automated account lockout.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/projects" style="color: #10b981; margin-right: 15px;">All Projects</a>
          <a href="/" style="color: #10b981;">Home</a>
        </nav>
      </main>
    `
  },
  {
    route: '/projects/dungeon-crawler',
    outputPath: path.join(distDir, 'projects/dungeon-crawler/index.html'),
    title: '2D Dungeon Crawler RPG Game — Project by Mehran Rasool',
    description: 'An object-oriented 2D dungeon crawler built from scratch in C++ featuring SFML rendering, particle systems, dynamic inventory, and boss battle state machines by Mehran Rasool.',
    canonical: `${siteUrl}/projects/dungeon-crawler`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': '2D Dungeon Crawler RPG Game (DSA Engine)',
      'applicationCategory': 'GameApplication',
      'author': { '@id': personId },
      'programmingLanguage': ['C++', 'SFML']
    },
    htmlContent: `
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto; color: #f1f5f9;">
        <h1>2D Dungeon Crawler RPG Game (DSA Engine)</h1>
        <p style="color: #10b981; font-weight: bold;">Engineered by Mehran Rasool — Full-Stack Developer</p>
        <p>An object-oriented 2D dungeon crawler built from scratch in C++ featuring SFML rendering, particle systems, dynamic inventory, and boss battle state machines.</p>
        <nav style="margin-top: 1.5rem;">
          <a href="/projects" style="color: #10b981; margin-right: 15px;">All Projects</a>
          <a href="/" style="color: #10b981;">Home</a>
        </nav>
      </main>
    `
  }
];

// ─── 5. Write Sitemap, Robots & LLMs ─────────────────────────────────────────
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(distDir, 'robots.txt'),  robots,  'utf-8');
fs.writeFileSync(path.join(distDir, 'llms.txt'),    llms,    'utf-8');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'),  robots,  'utf-8');
fs.writeFileSync(path.join(publicDir, 'llms.txt'),    llms,    'utf-8');

// ─── 6. Generate Static HTML Routes for Crawlers & SEO ───────────────────────
const templatePath = path.join(distDir, 'index.html');
if (fs.existsSync(templatePath)) {
  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  for (const p of pages) {
    const dir = path.dirname(p.outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let rendered = baseHtml;

    // Update <title>
    rendered = rendered.replace(/<title>[\s\S]*?<\/title>/i, `<title>${p.title}</title>`);

    // Update <meta name="description">
    rendered = rendered.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${p.description}"`);

    // Update canonical link
    rendered = rendered.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${p.canonical}"`);

    // Update OpenGraph
    rendered = rendered.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${p.title}"`);
    rendered = rendered.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${p.description}"`);
    rendered = rendered.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i, `<meta property="og:url" content="${p.canonical}"`);

    // Update Twitter
    rendered = rendered.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${p.title}"`);
    rendered = rendered.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${p.description}"`);

    // Update robots if noindex
    if (p.noindex) {
      rendered = rendered.replace(/<meta\s+name="robots"\s+content="[^"]*"/i, `<meta name="robots" content="noindex, nofollow"`);
    }

    // Inject JSON-LD
    if (p.jsonLd) {
      const jsonLdString = JSON.stringify(p.jsonLd);
      const jsonScript = `<script id="dynamic-jsonld" type="application/ld+json">${jsonLdString}</script>`;
      if (rendered.includes('</head>')) {
        rendered = rendered.replace('</head>', `  ${jsonScript}\n  </head>`);
      }
    }

    // Inject pre-rendered semantic HTML into #root for bots and non-JS clients
    if (p.htmlContent) {
      rendered = rendered.replace('<div id="root"></div>', `<div id="root">${p.htmlContent}</div>`);
    }

    fs.writeFileSync(p.outputPath, rendered, 'utf-8');
  }

  console.log(`✅  Pre-rendered ${pages.length} static HTML route shells for crawlability!`);
}

console.log(`✅  SEO files generated for: ${siteUrl}`);
console.log(`    → dist/sitemap.xml  dist/robots.txt  dist/llms.txt`);
console.log(`    → public/sitemap.xml  public/robots.txt  public/llms.txt`);
