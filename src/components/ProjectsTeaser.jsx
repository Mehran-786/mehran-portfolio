import React from 'react';
import { Link } from 'react-router-dom';

const highlightProjects = [
  {
    id: "video-vision",
    badge: "🌟 Flagship Multi-Agent AI Platform",
    title: "Video Vision Enterprise",
    subtitle: "10-Agent AI Board & Predictive Analytics",
    description: "An autonomous intelligence platform powered by a 10-Agent AI Board of Directors with consensus engines, TOPSIS utility calculation, and 7/30/90-day predictive trend forecasting.",
    techTags: ["Multi-Agent AI", "Python", "FastAPI", "React", "Predictive Analytics"],
  },
  {
    id: "secure-llm-gateway",
    badge: "🛡️ AI Security & Defense",
    title: "Secure LLM Gateway",
    subtitle: "Prompt Injection & PII Leak Defense",
    description: "A five-stage hybrid defense pipeline for LLM applications defending against prompt injection, jailbreaking, and PII leaks with 82.7% accuracy and 100% PII recall.",
    techTags: ["Python", "FastAPI", "scikit-learn", "Presidio", "Groq API"],
  },
  {
    id: "tool-website",
    badge: "🚀 Live Production Tool",
    title: "DownSocial Universal Downloader",
    subtitle: "High-Speed Media Extraction Utility",
    description: "A production media extraction service supporting 6+ platforms with IP rate limiting, Cloudflare edge caching, and instant HD MP4 / HQ MP3 processing.",
    techTags: ["React", "Flask", "Cloudflare CDN", "Rate Limiting", "Linux"],
  }
];

export default function ProjectsTeaser() {
  return (
    <section id="projects" className="bg-[#050f09] pt-20 pb-24 px-6 md:px-12 w-full relative overflow-hidden font-sans border-t border-emerald-500/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[450px] h-[450px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div data-aos="fade-up" className="mb-14 text-center">
          <div className="inline-block border border-emerald-500/30 rounded-full px-5 py-1.5 text-xs text-emerald-400 font-bold mb-4 shadow-sm bg-emerald-500/10 backdrop-blur-sm uppercase tracking-wider">
            Portfolio Highlights
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Signature Projects
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Real-world systems spanning multi-agent AI ecosystems, defense-grade LLM gateways, high-speed web utilities, and C++ game engines.
          </p>
        </div>

        {/* 3 Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlightProjects.map((p, idx) => (
            <div
              key={p.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="rounded-2xl p-[1px] bg-gradient-to-b from-emerald-500/30 via-white/5 to-emerald-500/10 hover:from-emerald-400 hover:to-teal-400/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="bg-[#0a160e]/90 hover:bg-[#0e2014]/90 p-6 rounded-2xl h-full backdrop-blur-xl flex flex-col justify-between transition-colors">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {p.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono mb-3">{p.subtitle}</p>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.techTags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-semibold text-emerald-200 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View Project Details &amp; Media
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Big Centered CTA Button to /projects */}
        <div data-aos="fade-up" className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm md:text-base shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:scale-105"
          >
            <span>Explore All Projects &amp; Live Showcase</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="text-xs text-slate-400 mt-3 font-mono">
            Interactive demonstrations, code repositories, system architecture &amp; high-res screenshots
          </p>
        </div>

      </div>
    </section>
  );
}
