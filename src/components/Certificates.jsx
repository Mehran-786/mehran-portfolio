import React from 'react';
import { certificates } from '../data/portfolioData';

const CertificateCard = ({ cert, aosDelay }) => (
  <div 
    data-aos="zoom-in"
    data-aos-delay={aosDelay}
    className="bg-[#020d06]/80 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 hover:border-emerald-400 hover:scale-105 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] transition-all duration-500 cursor-default group"
  >
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform duration-300">{cert.icon}</span>
      <div>
        <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 group-hover:text-violet-300 transition-colors">
          {cert.name}
        </h3>
        <p className="text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
          {cert.issuer}
        </p>
      </div>
    </div>
  </div>
);

const Certificates = () => {
  return (
    <section className="bg-gradient-to-b from-[#050f09] via-[#120829] to-[#050f09] pt-20 pb-28 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12 md:mb-16 text-center">
          <div className="inline-block border border-emerald-500/30 rounded-full px-5 py-1.5 text-xs text-emerald-400 font-bold mb-4 shadow-sm bg-emerald-500/10 backdrop-blur-sm">
            Validation & Learning
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
            Certifications & Domains
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Continuous specialization across modern AI paradigms, cyber defense, and systems engineering.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {certificates.featured.map((cert, index) => (
            <CertificateCard 
              key={cert.name} 
              cert={cert} 
              aosDelay={String((index + 1) * 100)} 
            />
          ))}
        </div>

        {/* View All Certificates CTA */}
        <div data-aos="fade-up" data-aos-delay="700" className="flex justify-center">
          <a
            href={certificates.viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View GitHub Repositories & Proofs
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certificates;

