import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { emailjsConfig, personalInfo, socialLinks } from '../data/portfolioData';

const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax translation for the big text
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "30%"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return; // Prevent duplicate submissions

    setStatus('sending');

    const form = formRef.current;
    const firstName = form.querySelector('#firstName')?.value || '';
    const lastName = form.querySelector('#lastName')?.value || '';
    const email = form.querySelector('#email')?.value || '';
    const message = form.querySelector('#message')?.value || '';

    // Validate inputs
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // Check if EmailJS is configured
    const isConfigured = 
      emailjsConfig.serviceId && 
      emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      emailjsConfig.templateId && 
      emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      emailjsConfig.publicKey && 
      emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY';

    if (!isConfigured) {
      // Fallback to prefilled mailto
      const mailtoLink = `mailto:${personalInfo.emails.primary}?subject=Portfolio Contact from ${firstName} ${lastName}&body=${encodeURIComponent(`From: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`)}`;
      window.open(mailtoLink, '_blank');
      setStatus('success');
      formRef.current.reset();
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // EmailJS integration
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey
      );
      setStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section ref={ref} id="contact" className="bg-[#050f09] w-full min-h-dvh relative overflow-hidden flex items-end pt-32 pb-0 border-t border-emerald-950/40">
      {/* Huge Background Parallax Text */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center overflow-hidden pointer-events-none z-0 pt-16 md:pt-12 opacity-15"
      >
        <span 
          aria-hidden="true"
          className="text-[25vw] leading-[0.75] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-500 uppercase tracking-tighter select-none scale-y-[1.6] origin-top"
          style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
        >
          Contact
        </span>
      </motion.div>

      {/* Form Card Overlay */}
      <div className="relative z-10 w-full flex justify-end items-end">
        <div 
          data-aos="fade-up"
          className="bg-gradient-to-br from-[#160b33]/95 via-[#071a0f]/98 to-[#090417]/98 border-t border-l border-emerald-500/30 rounded-tl-[2.5rem] md:rounded-tl-[3.5rem] w-full md:w-[85%] lg:w-[75%] p-8 md:p-16 text-white flex flex-col justify-between shadow-[0_-20px_60px_rgba(16,185,129,0.15)] backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400 block mb-2 font-mono">
                Initiate Dialogue
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Let's Build Something Exceptional
              </h3>
            </div>
            
            {/* Instagram Quick Link */}
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 px-4 py-2 rounded-full transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              DM on Instagram
            </a>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-14 w-full">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="relative">
                  <input 
                    type="text" 
                    id="firstName" 
                    name="first_name"
                    placeholder="First Name" 
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-base md:text-lg focus:outline-none focus:border-emerald-400 transition-colors placeholder-white/50 font-medium rounded-none text-white"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    id="lastName" 
                    name="last_name"
                    placeholder="Last Name" 
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-base md:text-lg focus:outline-none focus:border-emerald-400 transition-colors placeholder-white/50 font-medium rounded-none text-white"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email" 
                    name="user_email"
                    placeholder="Email Address" 
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-base md:text-lg focus:outline-none focus:border-emerald-400 transition-colors placeholder-white/50 font-medium rounded-none text-white"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col">
                  <textarea 
                    id="message" 
                    name="message"
                    placeholder="Tell me about your project or inquiry..." 
                    required
                    className="w-full h-full min-h-[140px] bg-transparent border-b border-white/20 pb-3 text-base md:text-lg focus:outline-none focus:border-emerald-400 transition-colors placeholder-white/50 font-medium resize-none rounded-none text-white"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row gap-10 mt-2">
              {/* Left text */}
              <div className="flex-1 flex items-start gap-4 text-sm font-normal text-white/70">
                <input 
                  type="checkbox" 
                  id="permission" 
                  defaultChecked
                  className="mt-1 w-4 h-4 rounded-sm border-white/30 bg-transparent text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500" 
                />
                <label htmlFor="permission" className="cursor-pointer max-w-[320px] leading-snug">
                  I give permission to contact me at this email regarding this inquiry.
                </label>
              </div>

              {/* Right text & button */}
              <div className="flex-1 flex flex-col gap-6 text-xs text-white/60 font-medium">
                <p className="leading-relaxed max-w-[420px]">
                  Messages are sent directly to my primary inbox. I typically respond within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                  <p className="max-w-[260px] leading-relaxed">
                    Direct Email: <a href={`mailto:${personalInfo.emails.primary}`} className="underline text-violet-300 hover:text-white transition-colors">{personalInfo.emails.primary}</a>
                  </p>
                  
                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className={`px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap self-start sm:self-auto ${
                      status === 'sending' 
                        ? 'opacity-50 cursor-not-allowed bg-emerald-600/50 text-white' 
                        : status === 'success'
                        ? 'bg-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                        : status === 'error'
                        ? 'bg-rose-800 text-white'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transform hover:scale-105'
                    }`}
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2">
                        Transmitted Successfully âœ“
                      </span>
                    ) : status === 'error' ? (
                      <span className="flex items-center gap-2">
                        Failed â€” Please Retry
                      </span>
                    ) : 'Send Inquiry'}
                    
                    {status === 'idle' && (
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;

