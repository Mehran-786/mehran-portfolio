import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';
import { projects } from '../data/portfolioData';
import { getSiteUrl } from '../config/env';

// Media Assets
import aiDemoVideo from '../assets/projects/ai-gateway-demo.mp4';
import isPortalImg from '../assets/projects/is-portal.png';
import isCrackImg from '../assets/projects/is-crack.png';
import isBruteforceImg from '../assets/projects/is-bruteforce.png';
import gameLobbyImg from '../assets/projects/game-lobby.png';
import gamePlayingImg from '../assets/projects/game-playing.png';
import gameBossImg from '../assets/projects/game-boss.png';
import gameInventoryImg from '../assets/projects/game-inventory.png';
import gameCartImg from '../assets/projects/game-cart.png';
import gameWinImg from '../assets/projects/game-win.png';
import vvMultiAgent from '../assets/projects/video-vision-multi-agent.jpeg';
import vvTrend from '../assets/projects/video-vision-trend.jpeg';
import vvEngines from '../assets/projects/video-vision-engines.jpeg';
import vvAnalytics from '../assets/projects/video-vision-analytics.jpeg';
import vvEmployeeSec from '../assets/projects/video-vision-employee-section.jpeg';
import vvEmployeePerf from '../assets/projects/video-vision-employee-performance.jpeg';
import toolMain from '../assets/projects/tool-website-main.jpeg';
import toolFeatures from '../assets/projects/tool-website-features.jpeg';
import toolReady from '../assets/projects/tool-website-ready.jpeg';

// Detailed project metadata mapping
const projectDetails = {
  'secure-llm-gateway': {
    id: 'secure-llm-gateway',
    slug: 'secure-llm-gateway',
    dataId: 'secure-llm-gateway',
    category: 'AI Security & Defense Pipeline',
    schemaType: 'SecurityApplication',
    shortName: 'Secure LLM Gateway',
    headline: 'Defending Enterprise AI from Prompt Injections, Jailbreaks & Sensitive Data Leaks',
    architecture: [
      {
        stage: 'Stage 1: Multilingual Normalization',
        details: 'Detects input language across 100+ languages and normalizes non-English prompts via deep-translator to expose cross-lingual adversarial bypass attempts.',
      },
      {
        stage: 'Stage 2: ML Threat Classifier',
        details: 'Extracts word and character n-grams using TF-IDF and classifies adversarial intent with a Logistic Regression classifier tuned for zero false positives.',
      },
      {
        stage: 'Stage 3: PII Detection & Entity Redaction',
        details: 'Integrates Microsoft Presidio with three custom regex-backed recognizers: Pakistani CNIC numbers, cloud API keys, and individual personal names.',
      },
      {
        stage: 'Stage 4: LLM Inference Bridge',
        details: 'Forwards sanitized prompts to high-throughput Groq API (llama-3.1-8b-instant) with latency-optimized streaming inference.',
      },
      {
        stage: 'Stage 5: Output Audit & Defense Gate',
        details: 'Performs post-generation safety checks on the model response before returning it to the downstream client application.',
      },
    ],
    benchmarks: {
      headline: 'Internal Benchmark Evaluation (150-Prompt Multilingual Test Suite)',
      disclaimer: 'These metrics represent internal evaluation results tested on a 150-prompt adversarial dataset under controlled test conditions. They are project measurements and not universal security guarantees.',
      metrics: [
        { label: 'Overall Accuracy', value: '82.7%' },
        { label: 'PII Recall Rate', value: '100%' },
        { label: 'Block Precision', value: '100%' },
        { label: 'Average Latency', value: '525ms' },
      ],
    },
    galleryType: 'video',
    videoSrc: aiDemoVideo,
  },
  'video-vision': {
    id: 'video-vision',
    slug: 'video-vision',
    dataId: 'video-vision',
    category: 'Enterprise Multi-Agent AI Platform',
    schemaType: 'BusinessApplication',
    shortName: 'YT VISION / Video Vision Enterprise',
    headline: '10-Agent Autonomous Board of Directors & Predictive Video Analytics',
    architecture: [
      {
        stage: 'Autonomous 10-Agent Board',
        details: 'Orchestrates 10 specialized AI agents: SEO Expert, Thumbnail Strategist, Audience Psychology, Predictive Trend Forecaster, Multi-Criteria Decision, Risk Intelligence, Vector Memory, and Executive Report Agents.',
      },
      {
        stage: 'Consensus & Utility Engine',
        details: 'Implements TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) utility scoring to rank operational actions objectively.',
      },
      {
        stage: 'Predictive Time-Series Forecasting',
        details: 'Generates 7, 30, and 90-day predictive performance trajectories and seasonal opportunity windows using channel analytics signals.',
      },
      {
        stage: 'Shared Contract Architecture',
        details: 'FastAPI backend and React/Vite dashboard unified by shared Pydantic data schemas across all 8 processing pipeline stages.',
      },
    ],
    galleryType: 'images',
    images: [
      { src: vvMultiAgent, title: 'Multi-Agent AI Board', desc: '10 specialized autonomous agents coordinating in real time.' },
      { src: vvTrend, title: 'Trend Forecaster & Intelligence', desc: 'Predictive performance forecasting and topic discovery.' },
      { src: vvEngines, title: 'Core Analytics Engine', desc: 'Multi-stage processing pipeline built with Pydantic contracts.' },
      { src: vvAnalytics, title: 'Deep Video Analytics', desc: 'Engagement curves and retention signals.' },
      { src: vvEmployeeSec, title: 'Autonomous Workforce Hub', desc: 'Agent task delegation and executive workflow automation.' },
      { src: vvEmployeePerf, title: 'Agent Performance Telemetry', desc: 'Continuous evaluation metrics and scoring.' },
    ],
  },
  'downsocial': {
    id: 'tool-website',
    slug: 'downsocial',
    dataId: 'tool-website',
    category: 'Production Media Extraction Utility',
    schemaType: 'MultimediaApplication',
    shortName: 'DownSocial',
    headline: 'High-Throughput Universal Media Extraction Platform',
    architecture: [
      {
        stage: 'Multi-Platform URL Parser',
        details: 'Extracts high-definition video and audio streams from YouTube, Instagram, Facebook, TikTok, Threads, and Snapchat.',
      },
      {
        stage: 'Format Transformation Engine',
        details: 'Client-side and server-assisted transcoding providing HD MP4 video streams and HQ MP3 audio conversions.',
      },
      {
        stage: 'Edge Caching & Defense',
        details: 'Deployed with IP-based rate limiting, Nginx reverse proxy caching, Gunicorn WSGI workers, and Cloudflare edge protection.',
      },
    ],
    galleryType: 'images',
    images: [
      { src: toolMain, title: 'DownSocial Hub', desc: 'Clean, responsive dark UI supporting 6+ video platforms.' },
      { src: toolFeatures, title: 'Platform Extraction Hub', desc: 'Multi-platform media detection and stream processing.' },
      { src: toolReady, title: 'Format & Quality Engine', desc: 'Instant selection between HD MP4 and HQ MP3 extraction.' },
    ],
  },
  'cybersecurity-idps': {
    id: 'cybersecurity-idps',
    slug: 'cybersecurity-idps',
    dataId: 'cybersecurity-idps',
    category: 'Information Security & Intrusion Defense',
    schemaType: 'SecurityApplication',
    shortName: 'Cryptographic IDPS',
    headline: 'Cryptographic Hash Cracking & Real-Time Brute-Force Intrusion Defense',
    architecture: [
      {
        stage: 'Offline Cryptographic Analysis',
        details: 'Demonstrates rainbow table and dictionary analysis against MD5 and SHA-256 hashed passwords with salt permutation testing.',
      },
      {
        stage: 'Online Brute-Force Attack Engine',
        details: 'Simulates high-velocity authentication brute-force attacks against HTTP endpoints to evaluate defensive threshold resilience.',
      },
      {
        stage: 'IDPS Defense & Lockout Layer',
        details: 'Implements exponential rate limiting, progressive delays, and a hard 5-attempt account lockout mechanism with audit logging.',
      },
    ],
    galleryType: 'images',
    images: [
      { src: isPortalImg, title: 'Password Cracking Portal', desc: 'Interactive analysis of cryptographic hash vulnerabilities.' },
      { src: isCrackImg, title: 'Decryption & Salt Analysis', desc: 'MD5/SHA-256 decrypted analysis and timing benchmarks.' },
      { src: isBruteforceImg, title: 'Online Brute-Force IDPS', desc: 'Live intrusion detection, threat logging, and lockout defenses.' },
    ],
  },
  'dungeon-crawler': {
    id: 'dungeon-crawler-rpg',
    slug: 'dungeon-crawler',
    dataId: 'dungeon-crawler-rpg',
    category: 'C++ Systems & Algorithmic Game Engine',
    schemaType: 'GameApplication',
    shortName: '2D Dungeon Crawler RPG',
    headline: 'Object-Oriented C++ Game Engine with SFML Rendering & Graph Progression',
    architecture: [
      {
        stage: 'Algorithmic Dungeon Generation',
        details: 'Applies graph traversal (BFS/DFS) algorithms to procedurally assemble interconnected dungeon layouts with room progression logic.',
      },
      {
        stage: 'Combat & Entity State Machines',
        details: 'Finite state machines governing enemy AI behavior, boss attack patterns, and player combat resolution.',
      },
      {
        stage: 'Inventory & Data Structures',
        details: 'Custom priority queues, dynamic inventories, item stat stacks, and in-game shop transaction processing.',
      },
      {
        stage: 'SFML Rendering Pipeline',
        details: 'Hardware-accelerated 2D rendering with custom particle emission systems and audio feedback.',
      },
    ],
    galleryType: 'images',
    images: [
      { src: gameLobbyImg, title: 'Game Lobby', desc: 'Character selection and campaign mission launcher.' },
      { src: gamePlayingImg, title: 'Dungeon Exploration', desc: 'Grid exploration and obstacle navigation.' },
      { src: gameBossImg, title: 'Boss Encounter', desc: 'State-machine driven boss combat sequence.' },
      { src: gameInventoryImg, title: 'Player Inventory', desc: 'Dynamic slot-based inventory data structure.' },
      { src: gameCartImg, title: 'In-Game Merchant', desc: 'Transactional shop system for equipment upgrades.' },
      { src: gameWinImg, title: 'Victory State', desc: 'Level clearance and final combat statistics.' },
    ],
  },
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [lightboxImg, setLightboxImg] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const detail = projectDetails[slug];
  if (!detail) {
    return <NotFoundPage />;
  }

  // Find parent project metadata from portfolioData.js
  const baseProject = projects.find(p => p.id === detail.dataId) || {};
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const canonicalUrl = `${siteUrl}/projects/${detail.slug}`;

  // Structured Data (SoftwareApplication + BreadcrumbList)
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': detail.schemaType || 'SoftwareApplication',
      'name': baseProject.title || detail.shortName,
      'applicationCategory': detail.schemaType,
      'operatingSystem': 'Cross-platform, Linux, Web',
      'description': baseProject.description || detail.headline,
      'author': {
        '@type': 'Person',
        '@id': personId,
        'name': 'Mehran Rasool',
        'url': siteUrl,
      },
      'programmingLanguage': baseProject.techTags || [],
      'codeRepository': baseProject.links?.github || 'https://github.com/Mehran-786',
      'url': canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Projects',
          'item': `${siteUrl}/projects`,
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': detail.shortName,
          'item': canonicalUrl,
        },
      ],
    },
  ];

  return (
    <div className="bg-[#050f09] text-white min-h-screen flex flex-col font-sans">
      <SEO
        title={`${detail.shortName} — Project by Mehran Rasool`}
        description={baseProject.description || detail.headline}
        canonical={canonicalUrl}
        schemas={schemas}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-white/50">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-emerald-400 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold" aria-current="page">{detail.shortName}</span>
        </nav>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {detail.category}
            </span>
            <span className="text-xs font-mono text-white/60">
              Engineered by <strong className="text-white">Mehran Rasool</strong> (Full-Stack Developer)
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            {baseProject.title || detail.shortName}
          </h1>

          <p className="text-lg md:text-xl text-emerald-300/90 font-medium mb-6 leading-relaxed">
            {detail.headline}
          </p>

          <p className="text-white/70 text-base leading-relaxed">
            {baseProject.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            {baseProject.links?.github && (
              <a
                href={baseProject.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white hover:text-black transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            )}

            {baseProject.links?.demo && (
              <a
                href={baseProject.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all"
              >
                Open Live Application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            )}

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
            >
              Discuss Architecture
            </Link>
          </div>
        </header>

        {/* Tech Stack Pills */}
        <section className="mb-14 p-6 rounded-2xl bg-[#091a10] border border-emerald-500/20">
          <h2 className="text-xs uppercase tracking-wider text-emerald-400 font-mono mb-4">Technologies & Stack</h2>
          <div className="flex flex-wrap gap-2">
            {baseProject.techTags?.map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-500/10 rounded-full border border-emerald-500/25"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Benchmarks Section (if applicable) */}
        {detail.benchmarks && (
          <section className="mb-14 p-8 rounded-3xl bg-gradient-to-br from-[#0c2215] to-[#06140c] border border-emerald-500/30">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Evaluation Rigor
              </span>
              <h2 className="text-2xl font-black text-white mt-3 mb-2">{detail.benchmarks.headline}</h2>
              <p className="text-xs font-mono text-white/60 leading-relaxed">
                {detail.benchmarks.disclaimer}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {detail.benchmarks.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 text-center">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">{m.value}</p>
                  <p className="text-xs font-mono text-white/70 uppercase tracking-wider">{m.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Architectural Stages */}
        {detail.architecture && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-white mb-6">Technical Architecture & Engineering</h2>
            <div className="space-y-4">
              {detail.architecture.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#091a10]/80 border border-emerald-500/20">
                  <h3 className="text-base font-bold text-emerald-300 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {item.stage}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Showcase */}
        {detail.galleryType === 'video' && detail.videoSrc && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-white mb-6">Video Demonstration</h2>
            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shadow-2xl">
              <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live System Demonstration
                </span>
                <span className="text-emerald-400">1080p HD</span>
              </div>
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[500px] object-cover bg-black"
              >
                <source src={detail.videoSrc} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          </section>
        )}

        {detail.galleryType === 'images' && detail.images && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-white mb-6">Interface & Architecture Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {detail.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImg(img)}
                  className="group rounded-2xl overflow-hidden border border-emerald-500/20 bg-black/40 cursor-pointer hover:border-emerald-400 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-[#0a1b12]">
                    <p className="text-xs font-bold text-white truncate">{img.title}</p>
                    <p className="text-[11px] text-white/60 truncate">{img.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back navigation & Contact CTA */}
        <div className="pt-10 border-t border-emerald-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to All Projects
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all"
          >
            Get In Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImg.title}
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#07130b] border border-emerald-500/30 rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">{lightboxImg.title}</h3>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                aria-label="Close modal"
                className="text-white/60 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <img src={lightboxImg.src} alt={lightboxImg.title} className="w-full max-h-[75vh] object-contain bg-black" />
            {lightboxImg.desc && (
              <p className="p-4 text-xs text-white/70 font-mono">{lightboxImg.desc}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
