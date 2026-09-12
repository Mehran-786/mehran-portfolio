import React from 'react';
import { softSkillsList } from '../data/portfolioData';

const SoftSkillCard = ({ skill, index }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={index * 100}
    className="bg-[#0f0924]/80 border border-violet-500/20 rounded-3xl p-6 hover:scale-[1.03] hover:border-violet-400 hover:shadow-[0_20px_45px_rgba(139,92,246,0.2)] transition-all duration-500 group flex flex-col items-center text-center justify-between min-h-[220px] backdrop-blur-xl"
  >
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-4 p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-300">
        {skill.icon}
      </div>
      <h3 className="text-white text-base md:text-lg font-black tracking-tight mb-2 uppercase group-hover:text-violet-300 transition-colors">
        {skill.name}
      </h3>
      <p className="text-white/60 text-xs md:text-sm font-normal leading-relaxed">
        {skill.desc}
      </p>
    </div>
  </div>
);

const SoftSkills = () => {
  return (
    <section className="bg-[#07050e] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center">
          <div className="inline-block border border-violet-500/30 rounded-full px-5 py-1.5 text-xs text-violet-400 font-bold mb-4 shadow-sm bg-violet-500/10 backdrop-blur-sm">
            Core Competencies
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Engineering Principles
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Essential traits that make me an effective systems architect, collaborator, and problem solver.
          </p>
        </div>

        {/* Soft Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {softSkillsList.map((skill, index) => (
            <SoftSkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SoftSkills;
