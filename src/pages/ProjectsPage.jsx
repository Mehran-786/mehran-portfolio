import React from 'react';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';

const getProjectsSchemas = () => {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;

  const softwareSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Secure LLM Gateway",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Cross-platform, Linux, Cloud",
      "description": "A five-stage hybrid security gateway defending LLM applications against prompt injection, jailbreaking, and sensitive PII leakage across multiple languages. 82.7% overall accuracy, 100% PII recall, 525ms average latency.",
      "author": { "@id": personId },
      "programmingLanguage": ["Python", "FastAPI"],
      "codeRepository": "https://github.com/Mehran-786",
      "datePublished": "2024-02-10T00:00:00Z",
      "dateModified": "2026-09-26T00:00:00Z"
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "DownSocial: Universal Media & Video Downloader",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "description": "A live production web service and media extraction utility with rate limiting, Nginx, Gunicorn, Cloudflare edge caching, and multilingual support.",
      "author": { "@id": personId },
      "programmingLanguage": ["Python", "Flask", "JavaScript", "React"],
      "codeRepository": "https://github.com/Mehran-786",
      "url": `${siteUrl}/projects#tool-website`,
      "datePublished": "2023-11-20T00:00:00Z",
      "dateModified": "2026-09-26T00:00:00Z"
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "YT VISION: YouTube Analytics Platform",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser, Chrome Extension",
      "description": "Multi-engine YouTube analytics platform and browser extension built on SOLID principles with shared Pydantic contracts across an eight-stage pipeline.",
      "author": { "@id": personId },
      "programmingLanguage": ["Python", "FastAPI", "React", "TypeScript"],
      "codeRepository": "https://github.com/Mehran-786",
      "datePublished": "2024-05-15T00:00:00Z",
      "dateModified": "2026-09-26T00:00:00Z"
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "2D Dungeon Crawler RPG Game",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Windows, Linux",
      "description": "An object-oriented 2D dungeon crawler built from scratch in C++ with SFML rendering, particle systems, inventory management, and shop mechanics.",
      "author": { "@id": personId },
      "programmingLanguage": ["C++"],
      "codeRepository": "https://github.com/Mehran-786",
      "datePublished": "2023-08-10T00:00:00Z",
      "dateModified": "2026-09-26T00:00:00Z"
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Cryptographic IDPS & Online Brute-Force Defense",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Linux, Cloud, Cross-platform",
      "description": "Information security platform demonstrating offline cryptographic hash analysis and real-time online brute-force intrusion detection with automated account lockout.",
      "author": { "@id": personId },
      "programmingLanguage": ["Python", "Cryptography"],
      "codeRepository": "https://github.com/Mehran-786",
      "datePublished": "2024-03-10T00:00:00Z",
      "dateModified": "2026-09-26T00:00:00Z"
    }
  ];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Secure an LLM Application Against Prompt Injection and PII Leakage",
    "description": "A five-stage hybrid defense pipeline for validating, classifying, sanitizing, and filtering prompts before and after passing them to large language models.",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Multilingual Input Normalization",
        "text": "Detect input language and normalize non-English text to English using deep-translator to expose cross-lingual adversarial attempts."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Machine Learning Threat Classification",
        "text": "Extract word and character n-grams via TF-IDF and classify intent using Logistic Regression with strict thresholding to block known jailbreak patterns."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "PII Detection and Anonymization",
        "text": "Scan input text with Microsoft Presidio and custom regex/checksum recognizers (e.g. Pakistani CNIC, API keys) to redact sensitive data before model inference."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Secure LLM Generation",
        "text": "Forward sanitized, anonymized prompt to the model (e.g. Llama 3 via Groq) under restricted system prompts and low temperature."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Output Verification and De-anonymization",
        "text": "Verify the model's generated response against policy violations and safely re-inject sanitized placeholders if needed before returning to the client."
      }
    ]
  };

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Projects Showcase — Mehran Rasool",
    "url": `${siteUrl}/projects`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".mr-project-lede", ".mr-project-summary"]
    }
  };

  return [...softwareSchemas, howToSchema, speakableSchema];
};

export default function ProjectsPage() {
  const schemas = getProjectsSchemas();

  return (
    <>
      <SEO
        title="Projects — Mehran Rasool"
        description="Explore software projects built by Mehran Rasool, including full-stack web applications, cross-platform Flutter apps, REST APIs, and applied AI systems."
        canonical={getSiteUrl('/projects')}
        jsonLd={schemas}
      />
      <Navbar />
      <main className="pt-24 min-h-[100dvh] bg-[#050f09]">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-4">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Portfolio Showcase</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Projects — Mehran Rasool
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400 mt-3 pt-2 border-b border-emerald-500/10 pb-3">
            <span>By <a href="/about" className="text-emerald-400 font-semibold underline hover:text-emerald-300">Mehran Rasool</a></span>
            <span className="text-emerald-500/40" aria-hidden="true">•</span>
            <span>Full-Stack &amp; Applied AI Developer</span>
            <span className="text-emerald-500/40" aria-hidden="true">•</span>
            <span>Last updated: September 20, 2026</span>
          </div>

          <p className="mr-project-lede text-slate-300 max-w-3xl mt-4 text-base md:text-lg leading-relaxed">
            Production web applications, cross-platform Flutter apps, secure LLM gateways, and systems engineered for high throughput, security, and real users.
          </p>

          {/* Project Comparison Matrix */}
          <div className="mt-8 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              Engineering Comparison Matrix
            </h2>
            <p className="mr-project-summary text-xs md:text-sm text-slate-400 mb-4">
              Side-by-side comparison of technical architecture, design patterns, and verified operational benchmarks across major projects.
            </p>

            <div
              className="overflow-x-auto rounded-xl border border-emerald-500/20 bg-[#0a1910] focus:outline-none focus:ring-2 focus:ring-emerald-400"
              style={{ WebkitOverflowScrolling: 'touch' }}
              tabIndex={0}
              role="region"
              aria-label="Project Engineering Comparison Matrix"
            >
              <table className="w-full border-collapse text-left text-xs md:text-sm min-w-[720px]">
                <thead>
                  <tr className="bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-300 uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4">Domain / Layer</th>
                    <th scope="col" className="py-3 px-4">Core Stack</th>
                    <th scope="col" className="py-3 px-4">Architectural Highlights</th>
                    <th scope="col" className="py-3 px-4">Verified Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-300">
                  <tr className="hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Secure LLM Gateway</td>
                    <td className="py-3.5 px-4"><span className="inline-block px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">AI / LLM Defense</span></td>
                    <td className="py-3.5 px-4">Python, FastAPI, Presidio, scikit-learn, Groq</td>
                    <td className="py-3.5 px-4">5-stage hybrid pipeline: deep-translator normalization, TF-IDF + Logistic Regression classifier, custom CNIC/API key PII recognizers</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">82.7% accuracy, 100% PII recall, 525ms latency</td>
                  </tr>
                  <tr className="hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">DownSocial Downloader</td>
                    <td className="py-3.5 px-4"><span className="inline-block px-2 py-0.5 rounded text-[11px] bg-blue-500/15 text-blue-300 border border-blue-500/30">Web &amp; Media Service</span></td>
                    <td className="py-3.5 px-4">Python, Flask, React, Gunicorn, Nginx, Linux</td>
                    <td className="py-3.5 px-4">Cloudflare edge caching, IP rate limiting, multi-format media extraction daemon behind reverse proxy</td>
                    <td className="py-3.5 px-4 font-mono text-blue-300">Production deployed, high concurrent throughput</td>
                  </tr>
                  <tr className="hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">YT VISION Analytics</td>
                    <td className="py-3.5 px-4"><span className="inline-block px-2 py-0.5 rounded text-[11px] bg-purple-500/15 text-purple-300 border border-purple-500/30">Analytics &amp; Extension</span></td>
                    <td className="py-3.5 px-4">FastAPI, React, Vite, TypeScript, Chrome API</td>
                    <td className="py-3.5 px-4">Multi-engine architecture (SEO + Engagement Engine), SOLID principles, shared Pydantic contracts across 8-stage pipeline</td>
                    <td className="py-3.5 px-4 font-mono text-purple-300">Sub-second multi-metric scoring</td>
                  </tr>
                  <tr className="hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">2D Dungeon Crawler RPG</td>
                    <td className="py-3.5 px-4"><span className="inline-block px-2 py-0.5 rounded text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30">Game Engine &amp; Systems</span></td>
                    <td className="py-3.5 px-4">C++, SFML</td>
                    <td className="py-3.5 px-4">Multi-file OOP architecture, deterministic memory management, particle system engine, state-machine boss AI</td>
                    <td className="py-3.5 px-4 font-mono text-amber-300">Steady 60 FPS rendering, zero GC jitter</td>
                  </tr>
                  <tr className="hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Real Estate System</td>
                    <td className="py-3.5 px-4"><span className="inline-block px-2 py-0.5 rounded text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30">Desktop Application</span></td>
                    <td className="py-3.5 px-4">Java, Swing, JDBC, SQL</td>
                    <td className="py-3.5 px-4">MVC architecture, role-based admin controls, persistent database schemas, relational transaction logs</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">ACID property transactions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </header>

        <Projects />
      </main>
      <Footer />
    </>
  );
}
