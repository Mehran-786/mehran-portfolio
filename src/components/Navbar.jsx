import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/portfolioData';
import brandLogo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to add backdrop
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  const hireMeMailto = `mailto:${personalInfo.emails.primary}?subject=Inquiry%20%E2%80%93%20${encodeURIComponent(personalInfo.name)}%20Portfolio&body=Hello%20${encodeURIComponent(personalInfo.firstName)},%0D%0A%0D%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20engineering%20opportunity%20with%20you.%0D%0A%0D%0ALooking%20forward%20to%20connecting.%0D%0ABest%20Regards,`;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isOpen 
          ? 'bg-[#0f0924]/95 backdrop-blur-xl border-b border-violet-500/20 py-4 shadow-2xl'
          : isScrolled 
            ? 'bg-[#090517]/85 backdrop-blur-lg border-b border-violet-500/15 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Left Side: Logo/Name */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 text-white text-xl md:text-2xl font-black tracking-tight whitespace-nowrap group">
            <div className="relative">
              <img 
                src={brandLogo} 
                alt={personalInfo.brandName} 
                className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform" 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-black rounded-full"></span>
            </div>
            <span>{personalInfo.brandName}<span className="text-violet-400">.</span></span>
          </a>
        </div>

        {/* Center: Desktop Menu Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-white/80 hover:text-white font-medium relative group transition-colors duration-300 text-sm tracking-wide"
            >
              {link}
              {/* Smooth hover underline */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Right Side: CTA Button */}
        <div className="hidden md:block">
          <a 
            href={hireMeMailto}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 backdrop-blur-md text-sm"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Hamburger Menu Icon */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 py-6 opacity-100 bg-[#0d0722]/98 backdrop-blur-2xl border-b border-violet-500/20 shadow-2xl' : 'max-h-0 opacity-0 bg-transparent'
        }`}
      >
        <div className="flex flex-col px-6 space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-violet-400 font-semibold text-lg py-2 border-b border-white/5 transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="pt-2">
            <a 
              href={hireMeMailto}
              onClick={() => setIsOpen(false)}
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all w-full text-center shadow-lg"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
