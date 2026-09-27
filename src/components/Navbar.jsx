import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { personalInfo } from '../data/portfolioData';
import brandLogo from '../assets/logo.jpeg';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { effectiveTheme, isHomePage } = useTheme();

  const isLight = !isHomePage && effectiveTheme === 'light';

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

  const handleSkillsClick = (e) => {
    e.preventDefault();
    if (isOpen) setIsOpen(false);

    const scroll = () => {
      const skillsEl = document.getElementById('skills');
      if (skillsEl) {
        skillsEl.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        });
      }
    };

    if (location.pathname === '/') {
      scroll();
    } else {
      navigate('/');
      setTimeout(scroll, 120); // wait for HomePage to mount
    }
  };

  // Close menu on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const hireMeMailto = `mailto:${personalInfo.emails.primary}?subject=Inquiry%20%E2%80%93%20${encodeURIComponent(personalInfo.name)}%20Portfolio&body=Hello%20${encodeURIComponent(personalInfo.firstName)},%0D%0A%0D%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20engineering%20opportunity%20with%20you.%0D%0A%0D%0ALooking%20forward%20to%20connecting.%0D%0ABest%20Regards,`;

  return (
    <>
      {/* Click-outside backdrop overlay for mobile menu */}
      {isOpen && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isLight ? 'bg-black/40' : 'bg-black/75'
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isOpen 
            ? (isLight ? 'bg-white/98 backdrop-blur-xl border-b border-emerald-500/20 py-4 shadow-2xl text-slate-800' : 'bg-[#020d06]/98 backdrop-blur-xl border-b border-emerald-500/20 py-4 shadow-2xl text-white')
            : isScrolled 
              ? (isLight ? 'bg-white/92 backdrop-blur-lg border-b border-emerald-500/20 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-slate-900' : 'bg-[#020a05]/85 backdrop-blur-lg border-b border-emerald-500/15 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white')
              : (isLight ? 'bg-white/75 backdrop-blur-md border-b border-emerald-500/15 py-5 text-slate-900 shadow-sm' : 'bg-transparent py-6 text-white')
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Left Side: Logo/Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className={`flex items-center gap-3 text-xl md:text-2xl font-black tracking-tight whitespace-nowrap group transition-colors ${
              isLight ? 'text-slate-900 hover:text-emerald-700' : 'text-white hover:text-emerald-300'
            }`}>
              <div className="relative">
                <img 
                  src={brandLogo} 
                  alt={`${personalInfo.brandName} profile avatar`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-black rounded-full"></span>
              </div>
              <span>{personalInfo.brandName}<span className="text-emerald-500">.</span></span>
            </Link>
          </div>

          {/* Center: Desktop Menu Links */}
          <div className="hidden md:flex space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              if (link.name === 'Skills') {
                return (
                  <a 
                    key={link.name} 
                    href={link.path}
                    onClick={handleSkillsClick}
                    className={`font-medium relative group transition-colors duration-300 text-sm tracking-wide ${
                      isLight ? 'text-slate-700 hover:text-emerald-600' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                );
              }

              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm tracking-wide font-medium relative group transition-colors duration-300 ${
                    isActive 
                      ? (isLight ? 'text-emerald-600 font-bold' : 'text-emerald-400 font-semibold')
                      : (isLight ? 'text-slate-700 hover:text-emerald-600' : 'text-white/80 hover:text-white')
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Theme Toggle + CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a 
              href={hireMeMailto}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105'
                  : 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] backdrop-blur-md'
              }`}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Right Side: Theme Toggle + Hamburger Menu */}
          <div className="md:hidden flex items-center gap-2.5">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer ${
                isLight 
                  ? 'text-slate-800 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20' 
                  : 'text-white bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
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

        {/* Mobile Slide-Down Menu (Full visibility, no clipping, scrollable) */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 overflow-y-auto ${
            isOpen 
              ? (isLight ? 'max-h-[calc(100dvh-5rem)] py-6 opacity-100 bg-white/98 backdrop-blur-2xl border-b border-emerald-500/20 shadow-2xl pb-10 text-slate-900' : 'max-h-[calc(100dvh-5rem)] py-6 opacity-100 bg-[#020d06]/98 backdrop-blur-2xl border-b border-emerald-500/20 shadow-2xl pb-10 text-white')
              : 'max-h-0 opacity-0 bg-transparent pointer-events-none'
          }`}
        >
          <div className="flex flex-col px-6 space-y-2">
            {navLinks.map((link) => {
              if (link.name === 'Skills') {
                return (
                  <a 
                    key={link.name} 
                    href={link.path}
                    onClick={handleSkillsClick}
                    className={`font-semibold text-lg py-2.5 transition-colors min-h-[44px] flex items-center ${
                      isLight 
                        ? 'text-slate-800 hover:text-emerald-600 border-b border-slate-100' 
                        : 'text-white/80 hover:text-emerald-400 border-b border-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold text-lg py-2.5 transition-colors min-h-[44px] flex items-center ${
                    isLight 
                      ? 'text-slate-800 hover:text-emerald-600 border-b border-slate-100' 
                      : 'text-white/80 hover:text-emerald-400 border-b border-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-2">
              <a 
                href={hireMeMailto}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all w-full text-center shadow-lg min-h-[48px] text-base"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
