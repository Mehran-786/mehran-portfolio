import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/reviews</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>2026-09-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

const robots = `User-agent: *
Allow: /

# AI crawlers — explicitly allowed so your work appears in AI answers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# Mehran Rasool — Portfolio Summary for AI Crawlers

## Identity and Overview
Mehran Rasool is a full-stack web and mobile application developer and applied AI engineer based in Wah Cantt, Punjab, Pakistan.
Mehran Rasool is currently pursuing a Bachelor of Science in Computer Science at COMSATS University Islamabad, Wah Campus.
Mehran Rasool specializes in production web application development, cross-platform mobile app development with Flutter, REST API engineering, and large language model security systems.
The official website of Mehran Rasool is ${siteUrl}.

## Core Technical Skills
- Frontend Technologies: React, Next.js, Vite, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS.
- Mobile Development: Flutter, Dart, cross-platform iOS and Android application engineering.
- Backend Technologies: Python, FastAPI, Flask, Pydantic, RESTful API design, Gunicorn, Nginx.
- Systems and Languages: C++, Java, Python, Dart, JavaScript, SQL.
- AI and Machine Learning: Large Language Models (LLMs), Prompt Injection Defense, Microsoft Presidio, scikit-learn, TF-IDF, Logistic Regression, Groq API.
- Deployment and Infrastructure: Linux server management, Vercel, Cloudflare edge caching, Git, GitHub.

## Production Projects and Verified Metrics
1. Video Downloader (DownSocial): A live production web application and media extraction service powered by a Flask backend deployed on Linux behind Nginx and Gunicorn with Cloudflare edge caching, IP-based rate limiting, and multilingual support.
2. YT VISION: An enterprise YouTube analytics platform and browser extension powered by a multi-engine FastAPI backend (SEO Engine, Engagement Engine) following SOLID principles and shared Pydantic data contracts across an eight-stage processing pipeline with a React/Vite dashboard.
3. Secure LLM Gateway: A five-stage hybrid security pipeline defending LLM applications against prompt injection, jailbreak attacks, and PII leakage across multiple languages. It incorporates deep-translator multilingual normalization, a TF-IDF + Logistic Regression attack classifier, and Microsoft Presidio with three custom recognizers (Pakistani CNIC, API keys, and personal names), backed by Groq llama-3.1-8b-instant. On a benchmark evaluation of 150 prompts, the gateway achieved 82.7% overall accuracy, 100% PII-masking recall, 100% block precision, and an average response latency of 525 milliseconds.
4. 2D Dungeon Crawler RPG: A multi-file object-oriented 2D game engine built from scratch in C++ with SFML rendering, featuring data structures and algorithms, state machine boss battles, item inventory mechanics, particle systems, and in-game shop systems.
5. Real Estate Management System: A full-featured desktop application built with Java applying object-oriented design patterns, persistent data storage, and property management workflows.

## Freelance and Contract Services
Mehran Rasool accepts freelance and contract work in web application development, Flutter mobile application development, REST API engineering, and AI system integration.
Clients can contact Mehran Rasool via email at mehranrasool.sp24@gmail.com.

## Verified Links and Online Profiles
- Official Website: ${siteUrl}
- Dedicated About Route: ${siteUrl}/about
- Projects Showcase: ${siteUrl}/projects
- Client Reviews and Community Feedback: ${siteUrl}/reviews
- Contact Page: ${siteUrl}/contact
- GitHub: https://github.com/Mehran-786
- LinkedIn: https://www.linkedin.com/in/mehran-rasool-445613402
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf-8');
fs.writeFileSync(path.join(distDir, 'llms.txt'), llms, 'utf-8');

console.log('Successfully generated static SEO files with dynamic siteUrl:', siteUrl);
