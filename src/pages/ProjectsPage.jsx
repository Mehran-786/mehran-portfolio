import React from 'react';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';
import { useTheme } from '../context/ThemeContext';

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
  const { effectiveTheme } = useTheme();
  const isLight = effectiveTheme === 'light';

  return (
    <>
      <SEO
        title="Projects — Mehran Rasool"
        description="Explore software projects built by Mehran Rasool, including full-stack web applications, cross-platform Flutter apps, REST APIs, and applied AI systems."
        canonical={getSiteUrl('/projects')}
        jsonLd={schemas}
      />
      <Navbar />
      <main className={`pt-24 min-h-[100dvh] transition-colors duration-300 ${isLight ? 'bg-[#f0fdf4] text-slate-800' : 'bg-[#050f09] text-white'}`}>
        <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-4">
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            Portfolio Showcase
          </p>
          <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Projects — Mehran Rasool
          </h1>

          <div className={`flex flex-wrap items-center gap-2 text-xs md:text-sm mt-3 pt-2 border-b pb-3 ${
            isLight ? 'text-slate-600 border-emerald-500/20' : 'text-slate-400 border-emerald-500/10'
          }`}>
            <span>By <a href="/about" className={`font-semibold underline ${isLight ? 'text-emerald-700 hover:text-emerald-800' : 'text-emerald-400 hover:text-emerald-300'}`}>Mehran Rasool</a></span>
            <span className="text-emerald-500/40" aria-hidden="true">•</span>
            <span>Full-Stack &amp; Applied AI Developer</span>
            <span className="text-emerald-500/40" aria-hidden="true">•</span>
            <span>Last updated: September 20, 2026</span>
          </div>

          <p className={`mr-project-lede max-w-3xl mt-4 text-base md:text-lg leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Production web applications, cross-platform Flutter apps, secure LLM gateways, and systems engineered for high throughput, security, and real users.
          </p>
        </header>

        <Projects />
      </main>
      <Footer />
    </>
  );
}
