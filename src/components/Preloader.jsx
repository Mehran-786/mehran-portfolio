import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the liquid fill animation (1.6s) + pause before shutter lifts smoothly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-screen bg-[#070412] z-[100000] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient central glow */}
          <div className="absolute w-96 h-96 bg-violet-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />

          {/* Logo Container */}
          <motion.div 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative text-5xl md:text-7xl font-black tracking-tighter select-none"
          >
            {/* Background text (empty state) */}
            <div className="text-violet-950/60 font-sans">
              {personalInfo.brandName}<span className="text-violet-950/40">.</span>
            </div>

            {/* Foreground text (water fill state) */}
            <motion.div 
              className="absolute top-0 left-0 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 overflow-hidden whitespace-nowrap drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] font-sans"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            >
              {personalInfo.brandName}<span className="text-fuchsia-400">.</span>
            </motion.div>
          </motion.div>

          {/* Subtitle tag */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-violet-400/70 text-xs font-mono tracking-widest uppercase mt-6"
          >
            Systems · AI Agents · Architecture
          </motion.p>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
