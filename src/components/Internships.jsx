import React from 'react';
import { internshipsList } from '../data/portfolioData';

const InternshipCard = ({ intern, index }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={index * 150}
    className="bg-[#020d06]/80 backdrop-blur-xl border border-emerald-500/25 rounded-3xl p-8 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)] transition-all duration-500 flex flex-col justify-between"
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <span className="text-violet-300/80 text-xs font-mono font-bold tracking-widest uppercase">
          {intern.duration}
        </span>
        <span className="bg-emerald-500/20 text-violet-300 text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-full border border-emerald-500/30">
          Experience
        </span>
      </div>
      <h3 className="text-white text-2xl font-black mb-1.5 tracking-tight">
        {intern.role}
      </h3>
      <p className="text-teal-400 text-sm font-bold tracking-wide mb-6 uppercase">
        {intern.organization}
      </p>

      {/* Skills gained */}
      <div className="mb-6">
        <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Key Competencies:</h4>
        <ul className="text-white/80 text-sm font-normal space-y-1.5 pl-4 list-disc marker:text-emerald-400">
          {intern.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>

    {/* Technologies used */}
    <div className="pt-4 border-t border-emerald-500/20">
      <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Technologies:</h4>
      <div className="flex flex-wrap gap-2">
        {intern.tech.map((t) => (
          <span 
            key={t}
            className="px-3 py-1 text-xs font-mono font-bold text-violet-200 bg-emerald-500/10 rounded-full border border-emerald-500/25 hover:bg-emerald-500/20 transition-all"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const Internships = () => {
  return (
    <section className="bg-gradient-to-b from-[#020a05] via-[#140b2d] to-[#020a05] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center">
          <div className="inline-block border border-emerald-500/30 rounded-full px-5 py-1.5 text-xs text-emerald-400 font-bold mb-4 shadow-sm bg-emerald-500/10 backdrop-blur-sm">
            Proven Track Record
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
            Engineering Experience
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Hands-on architecture, production deployment, and system hardening across real-world initiatives.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {internshipsList.map((intern, index) => (
            <InternshipCard key={intern.organization} intern={intern} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Internships;

