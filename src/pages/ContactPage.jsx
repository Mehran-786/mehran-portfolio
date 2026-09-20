import React from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';

const getContactSchema = () => {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Hire Mehran Rasool — Web & Mobile App Developer",
    "url": `${siteUrl}/contact`,
    "description": "Get in touch with Mehran Rasool for freelance web development, Flutter mobile app engineering, and applied AI systems architecture.",
    "mainEntity": {
      "@type": "Person",
      "@id": personId,
      "name": "Mehran Rasool",
      "email": "mehranrasool.sp24@gmail.com",
      "telephone": "+92 328 9552955",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Wah Cantt",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    }
  };
};

export default function ContactPage() {
  const schema = getContactSchema();

  return (
    <>
      <SEO
        title="Hire Mehran Rasool — Web & Mobile App Developer"
        description="Hire Mehran Rasool for freelance and contract work in full-stack web development, Flutter mobile app development, and applied AI systems. Based in Pakistan."
        canonical={getSiteUrl('/contact')}
        jsonLd={schema}
      />
      <Navbar />
      <main className="pt-24 min-h-[100dvh] bg-[#050f09]">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-2 text-center">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Let's Build Together</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Hire Mehran Rasool — Full-Stack Developer
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mt-3 text-base md:text-lg">
            Available for freelance and contract engineering in web application development, Flutter mobile apps, REST APIs, and applied AI systems.
          </p>
        </header>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
