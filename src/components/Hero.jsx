import React, { useRef, useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroVideo from '../assets/hero video/mehran-hero.mp4';
import heroPoster from '../assets/hero video/hero-poster.jpeg';
import mobileHeroVideo from '../assets/hero video/mobile-hero.mp4';
import mobileHeroPoster from '../assets/hero video/mobile-hero.jpeg';
import { heroContent, socialLinks } from '../data/portfolioData';

/* ─── Shared social icon SVGs ─────────────────────────────── */
const GithubIcon  = () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>;
const LinkedinIcon = () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const InstagramIcon = () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;

/* ─── Shared Play / Pause icons ───────────────────────────── */
const PlayIcon  = ({ cls }) => <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({ cls }) => <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;

const Hero = () => {
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-out' });

    // ─── Mobile / Desktop video switch ───────────────────────────────────
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth < 768;
      if (isMobileScreen && desktopVideoRef.current && !desktopVideoRef.current.paused) {
        desktopVideoRef.current.pause();
        setIsPlaying(false);
      } else if (!isMobileScreen && mobileVideoRef.current && !mobileVideoRef.current.paused) {
        mobileVideoRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getActiveVideo = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return mobileVideoRef.current;
    }
    return desktopVideoRef.current;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    const active = getActiveVideo();
    if (active) {
      active.currentTime = 0;
      active.load();
    }
    if (mobileVideoRef.current) mobileVideoRef.current.currentTime = 0;
    if (desktopVideoRef.current) desktopVideoRef.current.currentTime = 0;
  };

  const toggleVideo = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const active = getActiveVideo();
    if (active) {
      if (active.paused || active.ended) {
        if (active.ended) active.currentTime = 0;
        active.muted = false;
        setIsMuted(false);
        active.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          active.muted = true;
          setIsMuted(true);
          active.play();
          setIsPlaying(true);
        });
      } else {
        active.pause();
        setIsPlaying(false);
      }
    }
  };
  return (
    <section className="relative w-full bg-[#050f09]">

      {/* ================================================================ */}
      {/* MOBILE HERO  (< md)                                              */}
      {/* h-[100dvh]: native CSS unit — browser tracks it live, no JS.    */}
      {/* dvh = dynamic viewport height (excludes address bar correctly)   */}
      {/* mobile-hero-fallback = 100vh for browsers without dvh support    */}
      {/* ================================================================ */}
      <div className="block md:hidden mobile-hero-fallback relative w-full overflow-hidden bg-[#050f09] h-[100dvh]">

        {/* === POSTER IMAGE (shown when video not playing) ===
             Separate img element = full CSS object-cover control on Android.
             object-top: anchors to the top of the image — keeps subject's
             face/head visible as the container fills the viewport.         */}
        <img
          src={mobileHeroPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-opacity duration-500"
          style={{ opacity: isPlaying ? 0 : 1, pointerEvents: 'none' }}
        />

        {/* === VIDEO (shown when playing) ===
             object-top MATCHES the poster above — eliminates the jump
             that occurred when switching between object-top and object-center */}
        <video
          ref={mobileVideoRef}
          onEnded={handleEnded}
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-opacity duration-500"
          style={{ opacity: isPlaying ? 1 : 0 }}
        >
          <source src={mobileHeroVideo} type="video/mp4" />
        </video>

        {/* Cinematic gradient overlays — stronger bottom gradient for cross-platform readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f09] via-[#050f09]/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050f09]/60 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Content — absolutely positioned at the bottom, text over image */}
        <div className="absolute inset-0 z-20 px-4 flex flex-col justify-end text-left w-full pointer-events-none" style={{ paddingBottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 72px))' }}>
          <div className="pointer-events-auto flex flex-row items-end justify-between gap-3 w-full">

            {/* LEFT: social row + heading + subtitle + CTA buttons */}
            <div className="flex flex-col items-start text-left flex-1 min-w-0">

              {/* Inline social icons (same pattern as desktop md view) */}
              <div className="flex items-center gap-3 mb-2">
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                   className="text-white/80 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="GitHub">
                  <GithubIcon />
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-white/80 hover:text-[#0077b5] p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                   className="text-white/80 hover:text-emerald-400 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </div>

              {/* Heading — solid white, same style as desktop */}
              <h1 className="text-white text-2xl font-extrabold mb-1.5 tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {heroContent.greeting}, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                  {heroContent.titleHighlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/90 text-xs font-medium mb-3 max-w-[260px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed line-clamp-2">
                {heroContent.subtitle}
              </p>

              {/* CTA Buttons row */}
              <div className="flex flex-row flex-wrap items-center gap-2 w-full">
                <a href={heroContent.ctaPrimary.href}
                   className="px-3.5 py-2 text-xs rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md min-h-[40px] inline-flex items-center justify-center transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  {heroContent.ctaPrimary.text}
                </a>
                <a href={heroContent.ctaSecondary.href}
                   className="px-3.5 py-2 text-xs rounded-full bg-[#050f09]/80 border border-emerald-500/50 text-white font-semibold min-h-[40px] inline-flex items-center justify-center transition-all backdrop-blur-md active:scale-95 hover:border-emerald-400">
                  {heroContent.ctaSecondary.text}
                </a>
                <a href={heroContent.ctaResume.href} download
                   className="px-3.5 py-2 text-xs rounded-full bg-white/10 border border-white/25 text-white font-semibold min-h-[40px] inline-flex items-center justify-center gap-1 transition-all backdrop-blur-md active:scale-95 hover:bg-white hover:text-black">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {heroContent.ctaResume.text}
                </a>
              </div>
            </div>

            {/* RIGHT: Circular Play Reel button — identical to desktop */}
            <div
              className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group shrink-0 pb-1 self-end"
              onClick={toggleVideo}
              role="button"
              tabIndex={0}
              aria-label={!isPlaying ? "Play reel video" : "Pause reel video"}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVideo(e); } }}
            >
              <div className="w-14 h-14 rounded-full border-2 border-emerald-400/60 bg-[#050f09]/70 backdrop-blur-md flex justify-center items-center group-hover:scale-110 group-active:scale-95 group-hover:bg-emerald-600 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] shrink-0">
                {!isPlaying
                  ? <PlayIcon cls="w-5 h-5 text-emerald-400 group-hover:text-white ml-0.5" />
                  : <PauseIcon cls="w-5 h-5 text-emerald-400 group-hover:text-white" />
                }
              </div>
              <span className="text-white text-[9px] font-bold tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap drop-shadow-md">
                {!isPlaying ? "Play Reel" : "Pause"}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP HERO  (>= md)  — byte-for-byte unchanged                 */}
      {/* ================================================================ */}
      <div className="hidden md:block relative w-full h-screen h-dvh min-h-dvh overflow-hidden bg-[#050f09]">

        {/* Background Video */}
        <video
          ref={desktopVideoRef}
          onEnded={handleEnded}
          muted={isMuted}
          playsInline
          poster={heroPoster}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f09]/95 via-[#050f09]/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050f09]/50 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Left Floating Social Bar for Large Screens */}
        <div className="hidden lg:flex flex-col gap-6 fixed left-6 top-1/2 -translate-y-1/2 z-50 mix-blend-difference">
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
             className="text-white/60 hover:text-white transition-all duration-300 transform hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" aria-label="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          </a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
             className="text-white/60 hover:text-[#0077b5] transition-all duration-300 transform hover:scale-125" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
             className="text-white/60 hover:text-emerald-400 transition-all duration-300 transform hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
        </div>

        {/* Content Container — anchored at the bottom with seamless overlap */}
        <div className="absolute inset-0 z-20 px-4 sm:px-6 pb-6 sm:pb-8 md:pb-[8%] md:px-12 max-w-7xl mx-auto flex flex-col justify-end text-left w-full pointer-events-none">
          <div className="pointer-events-auto flex flex-row items-end justify-between gap-3 sm:gap-6 w-full">

            {/* Left Side: Text and Buttons */}
            <div className="flex flex-col items-start text-left max-w-2xl flex-1 min-w-0">
              {/* Mobile / Hero inline socials */}
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="flex items-center gap-3.5 mb-1.5 sm:mb-3 lg:hidden"
              >
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="GitHub">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="LinkedIn">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-emerald-400 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center drop-shadow-md" aria-label="Instagram">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
              </div>

              {/* Main Heading */}
              <h1
                data-aos="fade-up"
                className="text-white text-xl sm:text-3xl md:text-5xl font-extrabold mb-1.5 sm:mb-2 md:mb-4 tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              >
                {heroContent.greeting}, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                  {heroContent.titleHighlight}
                </span>
              </h1>

              {/* Subheading */}
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-white/90 text-xs sm:text-sm md:text-lg font-medium mb-3 sm:mb-4 md:mb-8 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed line-clamp-2 sm:line-clamp-none"
              >
                {heroContent.subtitle}
              </p>

              {/* CTA Buttons */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-row flex-wrap items-center gap-2 sm:gap-3.5 w-full"
              >
                <a href={heroContent.ctaPrimary.href}
                   className="px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:scale-105 shadow-md min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center">
                  {heroContent.ctaPrimary.text}
                </a>
                <a href={heroContent.ctaSecondary.href}
                   className="px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm rounded-full bg-[#050f09]/80 border border-emerald-500/50 text-white font-semibold hover:bg-emerald-950/60 hover:border-emerald-400 transition-all duration-300 backdrop-blur-md min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center">
                  {heroContent.ctaSecondary.text}
                </a>
                <a href={heroContent.ctaResume.href} download
                   className="px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm rounded-full bg-white/10 border border-white/25 text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {heroContent.ctaResume.text}
                </a>
              </div>
            </div>

            {/* Right Side: Circular Play Reel Button */}
            <div
              data-aos="zoom-in"
              data-aos-delay="500"
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0 pb-1 sm:pb-2 self-end"
              onClick={toggleVideo}
              role="button"
              tabIndex={0}
              aria-label={!isPlaying ? "Play reel video" : "Pause reel video"}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVideo(e); } }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-emerald-400/60 bg-[#050f09]/70 backdrop-blur-md flex justify-center items-center group-hover:scale-110 group-active:scale-95 group-hover:bg-emerald-600 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] shrink-0">
                {!isPlaying ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-400 group-hover:text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </div>
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap drop-shadow-md">
                {!isPlaying ? "Play Reel" : "Pause"}
              </span>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          data-aos="fade-up"
          data-aos-delay="800"
          className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
