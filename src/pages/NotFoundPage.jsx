import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 — Page Not Found | Mehran Rasool"
        description="The requested page could not be found. Navigate back to Mehran Rasool's portfolio homepage, projects, about page, or contact."
        canonical={getSiteUrl('/404')}
        noindex={true}
      />
      <Navbar />
      <main className="min-h-[85vh] bg-[#050f09] flex items-center justify-center px-4 sm:px-6 md:px-12 pt-28 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
            Error 404
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or has been relocated to another address.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              View Projects
            </Link>
          </div>

          <div className="pt-8 border-t border-emerald-500/10">
            <p className="text-xs text-white/50 mb-3 uppercase tracking-wider font-semibold">
              Explore Portfolio
            </p>
            <nav className="flex flex-wrap justify-center gap-4 text-sm text-emerald-400 font-medium">
              <Link to="/" className="hover:text-emerald-300 hover:underline">Home</Link>
              <span className="text-white/20">•</span>
              <Link to="/about" className="hover:text-emerald-300 hover:underline">About</Link>
              <span className="text-white/20">•</span>
              <Link to="/projects" className="hover:text-emerald-300 hover:underline">Projects</Link>
              <span className="text-white/20">•</span>
              <Link to="/reviews" className="hover:text-emerald-300 hover:underline">Reviews</Link>
              <span className="text-white/20">•</span>
              <Link to="/contact" className="hover:text-emerald-300 hover:underline">Contact</Link>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
