import React from 'react';
import stackImage from '../assets/about/mehran-avatar.jpeg';
import { aboutContent } from '../data/portfolioData';

// Tech stack SVG icons rendered inline for crisp rendering
const PythonIcon = () => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 128 128">
        <path fill="#3776AB" d="M63.5 12c-27.4 0-25.7 11.9-25.7 11.9l.1 12.3h26.2v3.7H26.8S12 38.2 12 65.6c0 27.5 13 26.5 13 26.5h7.7v-10.9s-.4-13 12.8-13h22.1s12.3.2 12.3-12.1V24.1s1.7-12.1-26.4-12.1zm-14.7 7.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z"/>
        <path fill="#FFD43B" d="M64.5 116c27.4 0 25.7-11.9 25.7-11.9l-.1-12.3H63.9v-3.7h37.3s14.8 1.7 14.8-25.7c0-27.5-13-26.5-13-26.5h-7.7v10.9s.4 13-12.8 13H60.4s-12.3-.2-12.3 12.1v31.9s-1.7 12.2 26.4 12.2zm14.7-7.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
      </svg>
    </div>
    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Python & AI</span>
  </div>
);

const FlutterIcon = () => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 128 128">
        <path fill="#02569B" d="M74.9 16.5L25.3 66.1 40 80.8 104.3 16.5z"/>
        <path fill="#0175C2" d="M104.3 63.8L54.7 113.4l14.7 14.6 49.6-49.6z"/>
        <path fill="#29B6F6" d="M74.9 94.1l-15.3-15.3 15.3-15.3 15.3 15.3z"/>
      </svg>
    </div>
    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Flutter & Dart</span>
  </div>
);

const ReactIcon = () => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="11" fill="#61DAFB"/>
        <ellipse cx="64" cy="64" rx="48" ry="18" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(30 64 64)"/>
        <ellipse cx="64" cy="64" rx="48" ry="18" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(90 64 64)"/>
        <ellipse cx="64" cy="64" rx="48" ry="18" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(150 64 64)"/>
      </svg>
    </div>
    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">React & Web</span>
  </div>
);

const CppIcon = () => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 128 128">
        <path fill="#00599C" d="M116.8 63.6L65.4 12.2c-1.5-1.5-4.1-1.5-5.6 0L8.4 63.6c-1.5 1.5-1.5 4.1 0 5.6l51.4 51.4c1.5 1.5 4.1 1.5 5.6 0l51.4-51.4c1.6-1.5 1.6-4.1 0-5.6z"/>
        <path fill="#FFFFFF" d="M62.6 83.9c-11 0-20-8.9-20-20s8.9-20 20-20c6.1 0 11.5 2.7 15.2 7.1l-6.8 5.7c-2.2-2.8-5.6-4.4-8.4-4.4-6.4 0-11.6 5.2-11.6 11.6s5.2 11.6 11.6 11.6c3.2 0 6.5-1.7 8.5-4.5l6.8 5.6c-3.7 4.5-9.3 7.3-15.3 7.3zm24.6-25.2h4.5v-4.5h3.6v4.5h4.5v3.6h-4.5v4.5h-3.6v-4.5h-4.5v-3.6zm15.4 0h4.5v-4.5h3.6v4.5h4.5v3.6h-4.5v4.5h-3.6v-4.5h-4.5v-3.6z"/>
      </svg>
    </div>
    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">C++ & Systems</span>
  </div>
);

const About = () => {
  return (
    <section id="about" className="bg-gradient-to-b from-[#050f09] via-[#071a0f] to-[#030c06] pt-28 md:pt-32 pb-36 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center md:items-start relative z-10">
        
        {/* Left Side: ID Badge with dedicated clearance on mobile */}
        <div className="flex flex-col items-center w-full md:w-[360px] shrink-0 mt-16 md:mt-0">
          
          <div data-aos="drop-bounce" className="relative flex justify-center w-full">
            {/* Lanyard string - scaled responsively so it never clips or disconnects on mobile */}
            <div className="absolute -top-20 md:-top-32 left-1/2 w-2.5 md:w-3 h-24 md:h-40 bg-gradient-to-b from-black via-emerald-950 to-black transform -translate-x-1/2 shadow-inner z-0 border-x border-emerald-500/20"></div>
            {/* Lanyard clip */}
            <div className="absolute -top-5 md:-top-6 left-1/2 w-5 md:w-6 h-10 md:h-12 bg-gradient-to-b from-gray-300 to-gray-500 rounded border border-gray-400 transform -translate-x-1/2 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"></div>
            
            {/* Badge Card */}
            <div className="bg-[#061a10]/90 border border-emerald-500/30 w-full max-w-[290px] rounded-3xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 backdrop-blur-xl group">
              {/* Cutout Hole */}
              <div className="absolute -top-3 left-1/2 w-16 h-6 bg-[#061a10] border-t border-emerald-500/30 rounded-t-xl transform -translate-x-1/2 flex justify-center items-center">
                <div className="w-8 h-2 bg-black/60 rounded-full shadow-inner"></div>
              </div>
              {/* Image Container */}
              <div className="w-full aspect-square overflow-hidden rounded-2xl bg-black/60 border border-emerald-500/40 relative shadow-inner">
                <img 
                  src={stackImage} 
                  alt="Mehran Rasool — Full-Stack AI Engineer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <p className="text-white text-base font-black tracking-wide">Mehran Rasool</p>
                  <p className="text-emerald-400 text-xs font-semibold">Full-Stack AI Engineer</p>
                </div>
              </div>

              {/* Badge Footer Meta */}
              <div className="mt-3.5 pt-3 border-t border-emerald-500/20 flex justify-between items-center text-[11px] font-mono text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Verified Creator
                </span>
                <span className="text-emerald-400 font-bold">@codemechanic0</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Info Content */}
        <div data-aos="fade-left" data-aos-delay="200" className="flex-1 text-white mt-4 md:mt-0 relative z-20">
          
          <div className="inline-block border border-emerald-500/30 rounded-full px-4 py-1 text-xs text-emerald-400 font-bold mb-4 shadow-sm bg-emerald-500/10 backdrop-blur-sm">
            About Me
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {aboutContent.heading}
          </h2>

          <p 
            className="text-base md:text-lg font-normal mb-10 leading-relaxed text-white/80"
            dangerouslySetInnerHTML={{ __html: aboutContent.bio }}
          />

          {/* Horizontal Skills Row */}
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400/80 font-bold mb-4 font-mono">
              Core Technical Competencies
            </p>
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <div data-aos="zoom-in" data-aos-delay="300" className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <PythonIcon />
              </div>
              <div data-aos="zoom-in" data-aos-delay="400" className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <FlutterIcon />
              </div>
              <div data-aos="zoom-in" data-aos-delay="500" className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <ReactIcon />
              </div>
              <div data-aos="zoom-in" data-aos-delay="600" className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CppIcon />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Wave Divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-30 transform translate-y-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16 fill-[#050f09]">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default About;

