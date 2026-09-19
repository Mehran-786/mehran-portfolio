import React from 'react';
import { technicalSkills } from '../data/portfolioData';

const SkillProgress = ({ name, level }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-white/90 text-sm font-semibold tracking-wide">{name}</span>
      <span className="text-emerald-400 text-xs font-bold font-mono">{level}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
      <div 
        className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);

const SkillCard = ({ category, index }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={index * 100}
    className="bg-[#0f0923]/70 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 hover:scale-[1.02] hover:border-emerald-500/50 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] transition-all duration-500 flex flex-col justify-between"
  >
    <div>
      <h3 className="text-white text-base md:text-lg font-black tracking-tight mb-6 pb-2.5 border-b border-emerald-500/20 uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        {category.title}
      </h3>
      <div>
        {category.skills.map((skill) => (
          <SkillProgress key={skill.name} name={skill.name} level={skill.level} />
        ))}
      </div>
    </div>
  </div>
);

const TechnicalSkills = () => {
  return (
    <section id="skills" className="bg-[#050f09] pt-24 pb-28 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 text-center">
          <div className="inline-block border border-emerald-500/30 rounded-full px-5 py-1.5 text-xs text-emerald-400 font-bold mb-5 shadow-sm bg-emerald-500/10 backdrop-blur-sm">
            Technical Arsenal
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Specialized Skills
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            High-performance engineering across autonomous multi-agent systems, cross-platform apps, full-stack backends, and low-level C++ architectures.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {technicalSkills.categories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechnicalSkills;

