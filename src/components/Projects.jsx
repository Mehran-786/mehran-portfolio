import React, { useState, useEffect } from 'react';
import { projects } from '../data/portfolioData';

// Project Media Imports
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

// Video Vision Imports
import vvMultiAgent from '../assets/projects/video-vision-multi-agent.jpeg';
import vvTrend from '../assets/projects/video-vision-trend.jpeg';
import vvEngines from '../assets/projects/video-vision-engines.jpeg';
import vvAnalytics from '../assets/projects/video-vision-analytics.jpeg';
import vvEmployeeSec from '../assets/projects/video-vision-employee-section.jpeg';
import vvEmployeePerf from '../assets/projects/video-vision-employee-performance.jpeg';

// Tool Website Imports
import toolMain from '../assets/projects/tool-website-main.jpeg';
import toolFeatures from '../assets/projects/tool-website-features.jpeg';
import toolReady from '../assets/projects/tool-website-ready.jpeg';

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

// Map screenshots to project IDs
const videoVisionScreenshots = [
  { img: vvMultiAgent, title: "10-Agent Autonomous AI Board", desc: "Consensus engine, reputation tracking & agent roster" },
  { img: vvTrend, title: "Trend Forecaster & Intelligence", desc: "7/30/90-day predictions, opportunity windows & niche topics" },
  { img: vvEngines, title: "Core Engine Architecture", desc: "Multi-stage pipeline with shared Pydantic data contracts" },
  { img: vvAnalytics, title: "Deep Video Analytics", desc: "Engagement curves, retention analytics & ranking signals" },
  { img: vvEmployeeSec, title: "Autonomous Workforce Hub", desc: "Executive departments, task automation & digital calendar" },
  { img: vvEmployeePerf, title: "Agent Economics & Performance", desc: "Continuous learning score & ROI telemetry" }
];

const toolScreenshots = [
  { img: toolMain, title: "DownSocial Universal Downloader", desc: "Modern dark UI supporting 6+ video platforms" },
  { img: toolFeatures, title: "Platform Extraction Hub", desc: "YouTube, Instagram, TikTok, Threads & Snapchat support" },
  { img: toolReady, title: "Quality & Format Selection", desc: "Instant HD MP4 & HQ MP3 extraction engine" }
];

const isScreenshots = [
  { img: isPortalImg, title: "Password Cracking Portal", desc: "Interactive portal for testing hash attacks" },
  { img: isCrackImg, title: "Hash Cracking Output", desc: "MD5/SHA-256 decrypted passwords & salt analysis" },
  { img: isBruteforceImg, title: "Online Brute-Force IDPS", desc: "Live attack logs, rate-limit trigger & lockout defense" }
];

const gameScreenshots = [
  { img: gameLobbyImg, title: "Game Lobby" },
  { img: gamePlayingImg, title: "Dungeon Exploration" },
  { img: gameBossImg, title: "Boss Battle State" },
  { img: gameInventoryImg, title: "Player Inventory" },
  { img: gameCartImg, title: "In-Game Merchant" },
  { img: gameWinImg, title: "Victory Screen" }
];

const ProjectCard = ({ project, aosDelay, onImageClick }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={aosDelay}
    className={`relative rounded-3xl p-[1px] group transition-all duration-500 ${
      project.isFlagship 
        ? 'bg-gradient-to-br from-violet-500/60 via-fuchsia-500/20 to-indigo-500/40 hover:from-violet-400 hover:via-fuchsia-400/50 hover:to-indigo-400 shadow-[0_10px_40px_rgba(139,92,246,0.2)]' 
        : 'bg-white/10 hover:bg-violet-500/30'
    }`}
  >
    <div className={`rounded-3xl p-6 md:p-10 h-full backdrop-blur-xl transition-all duration-500 flex flex-col justify-between ${
      project.isFlagship 
        ? 'bg-[#0e0824]/95 group-hover:bg-[#120a2e]/95' 
        : 'bg-[#0c071d]/90 group-hover:bg-[#100926]/90'
    }`}>
      <div>
        {/* Top Meta: Badge & Number */}
        <div className="flex justify-between items-center mb-4">
          {project.badge ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-violet-300 bg-violet-500/15 px-3.5 py-1.5 rounded-full border border-violet-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              {project.badge}
            </span>
          ) : <span />}
          <span className="text-4xl md:text-5xl font-black text-white/15 font-serif italic">{project.number}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-violet-300 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 font-normal">
          {project.description}
        </p>

        {/* Video Vision: 6-Screenshot Interactive Grid */}
        {project.id === "video-vision" && (
          <div className="my-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {videoVisionScreenshots.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => onImageClick(item.img, item.title, item.desc)}
                  className="group/img relative rounded-2xl overflow-hidden border border-violet-500/20 bg-black/40 cursor-pointer hover:border-violet-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-violet-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-black/70 text-white border border-white/20">
                        <ZoomIcon />
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#140b2e]/90 text-left border-t border-violet-500/10">
                    <p className="text-white text-xs font-bold truncate">{item.title}</p>
                    <p className="text-violet-300/70 text-[10px] truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-violet-400/60 text-xs mt-2.5 italic text-right font-mono flex items-center justify-end gap-1">
              <ZoomIcon /> Click any view to inspect HD interface details
            </p>
          </div>
        )}

        {/* Secure LLM Gateway: Video Demonstration Embed */}
        {project.id === "secure-llm-gateway" && (
          <div className="my-6 rounded-2xl overflow-hidden border border-violet-500/25 bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></span>
                Live AI Gateway Video Demo
              </span>
              <span className="text-violet-400">1080p HD</span>
            </div>
            <video 
              controls 
              playsInline 
              preload="metadata" 
              className="w-full max-h-[420px] object-cover bg-black"
            >
              <source src={aiDemoVideo} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        )}

        {/* DownSocial Tool Website: 3-Screenshot Showcase */}
        {project.id === "tool-website" && (
          <div className="my-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {toolScreenshots.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => onImageClick(item.img, item.title, item.desc)}
                  className="group/img relative rounded-2xl overflow-hidden border border-violet-500/20 bg-black/40 cursor-pointer hover:border-violet-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-violet-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-black/70 text-white border border-white/20">
                        <ZoomIcon />
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#140b2e]/90 text-left border-t border-violet-500/10">
                    <p className="text-white text-xs font-bold truncate">{item.title}</p>
                    <p className="text-violet-300/70 text-[10px] truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cybersecurity IDPS: Screenshot Gallery */}
        {project.id === "cybersecurity-idps" && (
          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isScreenshots.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => onImageClick(item.img, item.title, item.desc)}
                className="group/img relative rounded-2xl overflow-hidden border border-violet-500/20 bg-black/40 cursor-pointer hover:border-violet-400 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-2.5 bg-[#140b2e]/90 text-left border-t border-violet-500/10">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                  <p className="text-violet-300/70 text-[10px] truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dungeon Crawler RPG: Screenshot Showcase */}
        {project.id === "dungeon-crawler-rpg" && (
          <div className="my-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {gameScreenshots.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => onImageClick(item.img, item.title, "C++ SFML Game Engine")}
                  className="group/game relative rounded-xl overflow-hidden border border-violet-500/20 bg-black/40 cursor-pointer hover:border-violet-400 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover/game:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-1.5 bg-[#140b2e]/95 text-center">
                    <p className="text-white/90 text-[10px] font-bold truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techTags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 text-xs font-semibold text-violet-200 bg-violet-500/10 rounded-full border border-violet-500/25 hover:bg-violet-500/20 hover:border-violet-400 transition-all duration-300 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-violet-500/20">
        {project.links.github && (
          <a 
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 group/btn"
          >
            <GitHubIcon />
            View Repository
          </a>
        )}

        {project.links.demo ? (
          <a 
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLinkIcon />
            Open Live Application
          </a>
        ) : (
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-white/50 border border-white/10">
            Enterprise Architecture
          </span>
        )}
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [activeModal, setActiveModal] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (img, title, desc = '') => {
    setActiveModal({ img, title, desc });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section id="projects" className="bg-[#07050e] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 text-center">
          <div className="inline-block border border-violet-500/30 rounded-full px-5 py-1.5 text-xs text-violet-400 font-bold mb-5 shadow-sm bg-violet-500/10 backdrop-blur-sm">
            Featured Systems
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Signature Projects
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Real-world systems spanning multi-agent AI ecosystems, defense-grade LLM gateways, high-speed web utilities, and C++ game engines.
          </p>
        </div>

        {/* Projects Stack */}
        <div className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              aosDelay={index * 100} 
              onImageClick={openModal}
            />
          ))}
        </div>

      </div>

      {/* Lightbox Modal for High-Res Inspection */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#100727] border border-violet-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.4)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="px-6 py-4 bg-[#140b33] border-b border-violet-500/20 flex justify-between items-center">
              <div>
                <h4 className="text-white font-bold text-base md:text-lg">{activeModal.title}</h4>
                {activeModal.desc && (
                  <p className="text-violet-300 text-xs mt-0.5">{activeModal.desc}</p>
                )}
              </div>
              <button 
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-violet-600 text-white flex items-center justify-center transition-colors text-lg"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Image display */}
            <div className="p-3 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img 
                src={activeModal.img} 
                alt={activeModal.title} 
                className="max-w-full max-h-[72vh] object-contain rounded-xl"
              />
            </div>

            {/* Footer bar */}
            <div className="px-6 py-3 bg-[#140b33] border-t border-violet-500/20 flex justify-between items-center text-xs text-white/60">
              <span>Full Resolution Showcase</span>
              <button 
                onClick={closeModal}
                className="px-4 py-1.5 rounded-full bg-violet-600/30 hover:bg-violet-600 text-white font-semibold transition-colors"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
