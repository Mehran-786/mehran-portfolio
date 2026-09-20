export default function handler(req, res) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mehran-nine.vercel.app').replace(/\/+$/, '');
  const content = `# Mehran Rasool — Portfolio Summary for AI Crawlers

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

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(content);
}
