import React from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import TechnicalSkills from '../components/TechnicalSkills';
import Services from '../components/Services';
import Projects from '../components/Projects';
import ContentCreator from '../components/ContentCreator';
import Internships from '../components/Internships';
import Leadership from '../components/Leadership';
import Certificates from '../components/Certificates';
import SoftSkills from '../components/SoftSkills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';

const getHomeSchemas = () => {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  const homeWebsitePersonSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        "url": `${siteUrl}/`,
        "name": "Mehran Rasool",
        "description": "Portfolio of Mehran Rasool — Full-Stack Developer",
        "publisher": { "@id": personId },
        "inLanguage": "en"
      },
      {
        "@type": "Person",
        "@id": personId,
        "name": "Mehran Rasool",
        "url": `${siteUrl}/`,
        "image": `${siteUrl}/logo.png`,
        "jobTitle": "Full-Stack Developer",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Wah Cantt",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "COMSATS University Islamabad, Wah Campus"
        },
        "knowsAbout": [
          "Web Development",
          "Web Application Development",
          "Mobile App Development",
          "Flutter Development",
          "React",
          "Next.js",
          "FastAPI",
          "Python",
          "Dart",
          "C++",
          "Java",
          "Artificial Intelligence",
          "Large Language Models",
          "LLM Security",
          "REST API Design",
          "Full-Stack Development"
        ],
        "sameAs": [
          "https://github.com/Mehran-786",
          "https://www.linkedin.com/in/mehran-rasool-445613402"
        ]
      }
    ]
  };

  const homeSpeakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mehran Rasool — Full-Stack Developer",
    "url": `${siteUrl}/`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".home-hero-subtitle", ".home-faq-answer"]
    }
  };

  return [homeWebsitePersonSchema, homeSpeakableSchema];
};

export default function HomePage() {
  const schemas = getHomeSchemas();

  return (
    <>
      <SEO
        title="Mehran Rasool — Full-Stack Developer"
        description="Mehran Rasool is a full-stack developer based in Wah Cantt, Pakistan, specializing in web development, Flutter apps, and AI systems."
        canonical={getSiteUrl('/')}
        ogType="website"
        jsonLd={schemas}
      />
      <Preloader />
      <Navbar />
      <Hero />
      <About />
      <TechnicalSkills />
      <Services />
      <Projects />
      <ContentCreator />
      <Internships />
      <Leadership />
      <Certificates />
      <SoftSkills />

      {/* Home FAQ Section for LLM SEO Extraction */}
      <section className="bg-[#030905] py-16 md:py-20 px-4 sm:px-6 md:px-12 border-t border-emerald-500/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Knowledge Base &amp; FAQ</p>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
            Frequently Asked Questions About My Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#07170e]/60 border border-emerald-500/15 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-base font-bold text-emerald-300 mb-2">
                Who is Mehran Rasool and what does he build?
              </h3>
              <p className="home-faq-answer text-sm text-slate-300 leading-relaxed">
                Mehran Rasool is a full-stack developer based in Wah Cantt, Pakistan, who builds web applications, Flutter mobile apps, and applied AI systems. His engineering work includes production web platforms, cross-platform mobile apps for iOS and Android, and hybrid LLM security gateways.
              </p>
            </div>

            <div className="bg-[#07170e]/60 border border-emerald-500/15 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-base font-bold text-emerald-300 mb-2">
                What is the Secure LLM Gateway?
              </h3>
              <p className="home-faq-answer text-sm text-slate-300 leading-relaxed">
                The Secure LLM Gateway is a five-stage hybrid security pipeline developed by Mehran Rasool that defends LLM applications against prompt injection, jailbreaking, and PII leakage. Evaluated across 150 benchmark prompts, it achieved 82.7% overall accuracy, 100% PII-masking recall, and 525ms average latency.
              </p>
            </div>

            <div className="bg-[#07170e]/60 border border-emerald-500/15 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-base font-bold text-emerald-300 mb-2">
                How does the YouTube analytics platform (YT VISION) work?
              </h3>
              <p className="home-faq-answer text-sm text-slate-300 leading-relaxed">
                YT VISION is an enterprise analytics platform powered by a FastAPI backend and React dashboard built on SOLID architectural principles. It processes channel metrics across an eight-stage pipeline with shared Pydantic data contracts between specialized SEO and Engagement engines.
              </p>
            </div>

            <div className="bg-[#07170e]/60 border border-emerald-500/15 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-base font-bold text-emerald-300 mb-2">
                Is Mehran Rasool available for freelance development?
              </h3>
              <p className="home-faq-answer text-sm text-slate-300 leading-relaxed">
                Yes. Mehran Rasool is actively open for freelance and contract work in web development, web application development, and Flutter mobile app development, collaborating remotely with international clients from Wah Cantt, Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </>
  );
}
