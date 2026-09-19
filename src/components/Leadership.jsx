import React from 'react';
import { leadershipList } from '../data/portfolioData';

const Leadership = () => {
  return (
    <section className="bg-[#050f09] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]">
      
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-teal-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-16 text-center">
          <div className="inline-block border border-emerald-500/30 rounded-full px-5 py-1.5 text-xs text-emerald-400 font-bold mb-4 shadow-sm bg-emerald-500/10 backdrop-blur-sm">
            Technical Leadership
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Initiatives & Architecture
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Key research directions, autonomous multi-agent design, AI security pipelines, and systems engineering.
          </p>
        </div>

        {/* 2x2 Architecture Grid (2 Top, 2 Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
          {leadershipList.map((item, index) => (
            <div
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative bg-[#0e0824]/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/60 rounded-3xl p-7 md:p-8 hover:shadow-[0_20px_40px_rgba(16,185,129,0.25)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle card glow on hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/25 transition-all duration-500 pointer-events-none" />

              {/* Card Top: Number Index & Category Badge */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-black text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    0{index + 1}
                  </span>
                  <span className="bg-teal-500/15 text-fuchsia-300 text-[11px] font-black tracking-widest uppercase py-1 px-3 rounded-full border border-teal-500/30">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-violet-200 transition-colors tracking-tight mb-2">
                  {item.title}
                </h3>

                {/* Role */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <p className="text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
                    {item.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm md:text-[15px] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Card Bottom Accent Line */}
              <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs text-white/40 group-hover:text-violet-300 transition-colors">
                <span className="font-mono tracking-wider text-[11px] uppercase">
                  Architecture Focus
                </span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                  â†’
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Leadership;


