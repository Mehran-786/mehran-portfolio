import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl } from '../config/env';

const getAboutSchemas = () => {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: "Mehran Rasool",
    alternateName: "Mehran",
    url: `${siteUrl}/about`,
    image: `${siteUrl}/logo.png`,
    jobTitle: "Full-Stack Developer & AI Engineer",
    description:
      "Full-stack web and mobile app developer building production web applications with React, Next.js, FastAPI and Flutter, plus applied AI and LLM security systems. Based in Wah Cantt, Pakistan.",
    worksFor: {
      "@type": "Organization",
      name: "Independent / Freelance",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad, Wah Campus",
      url: "https://www.cuiwah.edu.pk/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wah Cantt",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    knowsAbout: [
      "Web Development",
      "Web Application Development",
      "Mobile App Development",
      "Flutter Development",
      "React Development",
      "Next.js",
      "FastAPI",
      "Python",
      "Dart",
      "C++",
      "Java",
      "Full-Stack Development",
      "Artificial Intelligence",
      "Large Language Models",
      "LLM Security",
      "Prompt Injection Defense",
      "REST API Design",
      "Machine Learning",
      "Natural Language Processing",
      "Software Architecture",
      "Backend Development",
      "Frontend Development",
    ],
    sameAs: [
      "https://github.com/Mehran-786",
      "https://www.linkedin.com/in/mehran-rasool-445613402",
    ],
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "About Mehran Rasool — Full-Stack Web & Flutter App Developer",
    url: `${siteUrl}/about`,
    description:
      "About Mehran Rasool — full-stack developer specializing in web development, web application development, and Flutter mobile app development, with applied AI and LLM security engineering.",
    mainEntity: { "@id": personId },
    datePublished: "2024-01-15",
    dateModified: "2026-09-20",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".mr-lede", ".mr-summary"]
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${siteUrl}/about`,
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does Mehran Rasool build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mehran Rasool builds full-stack web applications, cross-platform mobile apps with Flutter, and applied AI systems. His work includes a deployed video downloader web service, a multi-engine YouTube analytics platform, and a secure LLM gateway defending against prompt injection and PII leakage.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Mehran Rasool work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "React, Next.js, Flutter, Dart, Python, FastAPI, Flask, C++, Java, JavaScript, Tailwind CSS, scikit-learn, and Microsoft Presidio, deployed on Vercel and Linux servers behind Nginx and Gunicorn.",
        },
      },
      {
        "@type": "Question",
        name: "Is Mehran Rasool available for freelance web and app development work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Mehran Rasool takes on freelance and contract work in web development, web application development, and Flutter mobile app development, working with clients remotely from Wah Cantt, Pakistan.",
        },
      },
    ],
  };

  return [personSchema, profilePageSchema, faqSchema];
};

export default function AboutPage() {
  const schemas = getAboutSchemas();

  return (
    <>
      <SEO
        title="About Mehran Rasool — Full-Stack Web & Flutter App Developer"
        description="Mehran Rasool is a full-stack developer building web applications, Flutter mobile apps, and applied AI systems with React and FastAPI. Based in Wah Cantt, PK."
        canonical={getSiteUrl('/about')}
        ogType="profile"
        jsonLd={schemas}
      />

      <Navbar />

      <style>{aboutCss}</style>

      <main className="mr-about-page">
        <article className="mr-about-container">
          {/* ---------- Opening ---------- */}
          <header className="mr-intro">
            <p className="mr-kicker">About</p>
            <h1>
              I build software that ships — web, mobile, and the AI layer in
              between.
            </h1>
            <div className="mr-byline-bar">
              <span>By <a href="/about" className="mr-author-link">Mehran Rasool</a></span>
              <span className="mr-dot" aria-hidden="true">•</span>
              <span>Full-Stack Developer &amp; AI Engineer</span>
              <span className="mr-dot" aria-hidden="true">•</span>
              <span>Last updated: September 20, 2026</span>
            </div>
            <p className="mr-lede">
              I'm Mehran Rasool, a full-stack developer based in Wah Cantt,
              Pakistan. I build production web applications, cross-platform mobile
              apps with Flutter, and applied AI systems — the kind that run on real
              servers with real users, not just on a laptop during a demo.
            </p>
          </header>

          {/* ---------- Spec strip: real data, definition list ---------- */}
          <dl className="mr-spec">
            <div>
              <dt>Based in</dt>
              <dd>Wah Cantt, Punjab, Pakistan</dd>
            </div>
            <div>
              <dt>Working on</dt>
              <dd>Web apps, Flutter apps, AI systems</dd>
            </div>
            <div>
              <dt>Studying</dt>
              <dd>BS Computer Science, COMSATS Wah</dd>
            </div>
            <div>
              <dt>Open to</dt>
              <dd>Freelance &amp; contract work</dd>
            </div>
          </dl>

          {/* ---------- Narrative ---------- */}
          <section className="mr-section">
            <h2>How I got here</h2>
            <p>
              I started where most Computer Science students start — writing
              console programs for coursework. What changed things was deciding
              that a project isn't finished when it compiles; it's finished when
              someone else can use it. That single shift pushed me from writing
              assignments into deploying real services: domains, servers, rate
              limiting, error handling, the parts nobody teaches in a lecture.
            </p>
            <p>
              Since then I've built and shipped a live video downloader web
              service running on a Flask backend behind Nginx and Gunicorn with
              Cloudflare protection, a multi-engine YouTube analytics platform with
              a FastAPI backend and React dashboard, and a secure LLM gateway that
              defends AI applications against prompt injection and personal-data
              leakage. Each one taught me something the last one couldn't.
            </p>
          </section>

          {/* ---------- What I do ---------- */}
          <section className="mr-section">
            <h2>What I do</h2>

            <div className="mr-practice">
              <h3>Web development</h3>
              <p>
                I build full web applications end to end — frontend, backend,
                database, and deployment. On the frontend I work in React and
                Next.js with modern component architecture and responsive layouts
                that hold up on every screen size. On the backend I build REST APIs
                in FastAPI and Flask, with typed contracts, proper validation, and
                sensible error handling. I handle the deployment too: Vercel for
                frontends, Linux servers behind Nginx and Gunicorn for Python
                services, with rate limiting and CDN protection where it matters.
              </p>
            </div>

            <div className="mr-practice">
              <h3>Mobile app development with Flutter</h3>
              <p>
                I build cross-platform mobile applications using Flutter and Dart —
                one codebase that ships to both Android and iOS with native
                performance and a consistent interface. My focus is on apps that
                feel fast: smooth state management, clean navigation, and
                interfaces that respond immediately rather than waiting on a
                spinner. Where an app needs a backend, I build that too, so the
                API and the client are designed together instead of bolted on.
              </p>
            </div>

            <div className="mr-practice">
              <h3>AI and LLM engineering</h3>
              <p>
                I work on applied AI — not research papers, but systems that do
                something. I built a five-stage hybrid security gateway for LLM
                applications that combines multilingual input normalization, a
                TF-IDF and logistic regression attack classifier, and Microsoft
                Presidio with custom recognizers for Pakistani CNIC numbers and API
                keys. On a 150-prompt evaluation set it reached 82.7% overall
                accuracy with 100% PII-masking recall and 100% block precision. I
                also integrate LLM APIs into products — the practical side of
                making AI actually useful inside an application.
              </p>
            </div>

            <div className="mr-practice">
              <h3>Systems and fundamentals</h3>
              <p>
                Underneath the web and mobile work sits a foundation in C++, Java,
                and data structures. I've built a multi-file object-oriented 2D
                game engine in C++ with SFML, and desktop applications in Java
                applying real object-oriented design. Knowing what's happening
                below the framework is what makes the framework work.
              </p>
            </div>
          </section>

          {/* ---------- Approach ---------- */}
          <section className="mr-section">
            <h2>How I work</h2>
            <p>
              I plan before I build. On larger projects I design the architecture
              first — module boundaries, data contracts between components,
              failure modes — before writing a feature. It's slower on day one and
              considerably faster by week three, because I'm not rebuilding things
              I got wrong early.
            </p>
            <p>
              I use AI tools heavily and deliberately, mostly at the design and
              review stage rather than as an autocomplete. That means I ship more,
              but it also means I read every line that goes into production and can
              explain why it's there.
            </p>
            <p>
              And I finish things. Half the value of a project is in the last 20%
              — deployment, edge cases, the thing that breaks when a real user does
              something unexpected. That part is the job.
            </p>
          </section>

          {/* ---------- Stack Matrix Comparison Table ---------- */}
          <section className="mr-section">
            <h2>Technology Stack Comparison Matrix</h2>
            <p className="mr-summary">
              A breakdown of production technologies across frontend, mobile, backend, and systems layers, detailing architectural fit and delivered projects.
            </p>

            <div
              className="mr-table-wrapper"
              tabIndex={0}
              role="region"
              aria-label="Technology Stack Comparison Table"
            >
              <table className="mr-matrix-table">
                <thead>
                  <tr>
                    <th scope="col">Technology</th>
                    <th scope="col">Layer</th>
                    <th scope="col">Primary Use Case</th>
                    <th scope="col">Key Strength</th>
                    <th scope="col">Production Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>React &amp; Next.js</strong></td>
                    <td><span className="mr-tag mr-tag-fe">Frontend Web</span></td>
                    <td>Interactive SPAs, Dashboards &amp; SSR Platforms</td>
                    <td>Modular component state, virtual DOM, SSR/SSG flexibility</td>
                    <td>Portfolio, YT VISION Dashboard</td>
                  </tr>
                  <tr>
                    <td><strong>Flutter &amp; Dart</strong></td>
                    <td><span className="mr-tag mr-tag-mb">Mobile Client</span></td>
                    <td>High-performance iOS &amp; Android Apps</td>
                    <td>Single codebase, 60fps compiled skia/impeller rendering</td>
                    <td>Cross-Platform Mobile Apps</td>
                  </tr>
                  <tr>
                    <td><strong>FastAPI &amp; Python</strong></td>
                    <td><span className="mr-tag mr-tag-be">Backend &amp; AI</span></td>
                    <td>Asynchronous high-throughput APIs &amp; AI gateways</td>
                    <td>Async concurrency, Pydantic type validation, automatic OpenAPI</td>
                    <td>Secure LLM Gateway, YT VISION</td>
                  </tr>
                  <tr>
                    <td><strong>Flask &amp; Python</strong></td>
                    <td><span className="mr-tag mr-tag-be">Microservice</span></td>
                    <td>Media streaming extraction &amp; processing services</td>
                    <td>Lightweight runtime, minimal dependencies, raw WSGI simplicity</td>
                    <td>DownSocial Video Downloader</td>
                  </tr>
                  <tr>
                    <td><strong>C++ (SFML)</strong></td>
                    <td><span className="mr-tag mr-tag-sys">Systems Engine</span></td>
                    <td>Game engines, particle systems &amp; rendering pipelines</td>
                    <td>Direct memory management, pointer control, zero GC jitter</td>
                    <td>2D Dungeon Crawler RPG</td>
                  </tr>
                  <tr>
                    <td><strong>Java (Swing / JDBC)</strong></td>
                    <td><span className="mr-tag mr-tag-sys">Enterprise App</span></td>
                    <td>Object-oriented desktop &amp; persistent transaction systems</td>
                    <td>Strict OOP design patterns, relational ACID persistence</td>
                    <td>Real Estate Management System</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Card Grid for Stack */}
            <div className="mr-stack">
              <div>
                <h4>Frontend</h4>
                <p>React, Next.js, JavaScript, HTML5, CSS3, Tailwind CSS, Vite</p>
              </div>
              <div>
                <h4>Mobile</h4>
                <p>Flutter, Dart, cross-platform Android &amp; iOS</p>
              </div>
              <div>
                <h4>Backend</h4>
                <p>Python, FastAPI, Flask, REST APIs, Pydantic, Nginx, Gunicorn</p>
              </div>
              <div>
                <h4>AI &amp; data</h4>
                <p>
                  LLM APIs, scikit-learn, Microsoft Presidio, NLP, prompt engineering
                </p>
              </div>
              <div>
                <h4>Languages</h4>
                <p>Python, JavaScript, Dart, C++, Java</p>
              </div>
              <div>
                <h4>Deployment</h4>
                <p>Vercel, Linux servers, Cloudflare, Git &amp; GitHub</p>
              </div>
            </div>
          </section>

          {/* ---------- Engineering Glossary & Key Concepts ---------- */}
          <section className="mr-section">
            <h2>Engineering Glossary &amp; Core Concepts</h2>
            <p className="mr-summary">
              Definitive terminology and architectural paradigms applied across my AI, web, and systems engineering work.
            </p>

            <dl className="mr-glossary">
              <div className="mr-glossary-item">
                <dt>Prompt Injection</dt>
                <dd>
                  A security threat against Large Language Models where adversarial user inputs override system directives or instructions to trigger unauthorized behavior, bypass safety controls, or leak proprietary prompt logic.
                </dd>
              </div>
              <div className="mr-glossary-item">
                <dt>PII Masking</dt>
                <dd>
                  The automated detection and irreversible or reversible tokenization/redaction of Personally Identifiable Information (such as CNIC numbers, names, phone numbers, and API tokens) before passing prompts to external third-party model inference providers.
                </dd>
              </div>
              <div className="mr-glossary-item">
                <dt>TF-IDF</dt>
                <dd>
                  Term Frequency-Inverse Document Frequency: a statistical numerical feature extraction metric representing the informational importance of n-grams in a corpus, used in our gateway for sub-millisecond machine-learning attack classification.
                </dd>
              </div>
              <div className="mr-glossary-item">
                <dt>Cross-Platform Development</dt>
                <dd>
                  The practice of authoring software from a unified codebase (specifically using Flutter and Dart) that compiles down directly into ARM/x86 native machine code for Android and iOS without runtime webview wrappers.
                </dd>
              </div>
              <div className="mr-glossary-item">
                <dt>REST API</dt>
                <dd>
                  Representational State Transfer: a stateless client-server architectural style communicating over standard HTTP verbs (GET, POST, PUT, DELETE) with deterministic JSON request/response payloads, pagination, and status codes.
                </dd>
              </div>
            </dl>
          </section>

          {/* ---------- Frequently Asked Questions (FAQ) ---------- */}
          <section className="mr-section mr-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="mr-faq-list">
              <div className="mr-faq-item">
                <h3>What does Mehran Rasool build?</h3>
                <p>
                  Mehran Rasool builds full-stack web applications, cross-platform mobile apps with Flutter, and applied AI systems. His work includes a deployed video downloader web service, a multi-engine YouTube analytics platform, and a secure LLM gateway defending against prompt injection and PII leakage.
                </p>
              </div>
              <div className="mr-faq-item">
                <h3>What technologies does Mehran Rasool work with?</h3>
                <p>
                  React, Next.js, Flutter, Dart, Python, FastAPI, Flask, C++, Java, JavaScript, Tailwind CSS, scikit-learn, and Microsoft Presidio, deployed on Vercel and Linux servers behind Nginx and Gunicorn.
                </p>
              </div>
              <div className="mr-faq-item">
                <h3>Is Mehran Rasool available for freelance web and app development work?</h3>
                <p>
                  Yes. Mehran Rasool takes on freelance and contract work in web development, web application development, and Flutter mobile app development, working with clients remotely from Wah Cantt, Pakistan.
                </p>
              </div>
            </div>
          </section>

          {/* ---------- Contact ---------- */}
          <section className="mr-section mr-contact">
            <h2>Working together</h2>
            <p>
              I take on freelance and contract work in web development, web
              application development, and Flutter mobile app development. If you
              need something built — a web app, a mobile app, an API, or an AI
              feature inside an existing product — tell me what problem you're
              solving and I'll tell you honestly whether I'm the right person for
              it.
            </p>
            <div className="mr-links">
              <a href="mailto:mehranrasool.sp24@gmail.com" className="mr-btn-primary">Email me</a>
              <a
                href="https://github.com/Mehran-786"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/mehran-rasool-445613402"
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}

const aboutCss = `
.mr-about-page {
  --mr-bg: #050f09;
  --mr-surface: #0a1910;
  --mr-line: #173822;
  --mr-text: #E9E7E2;
  --mr-muted: #94a3b8;
  --mr-accent: #10b981;
  --mr-accent-glow: rgba(16, 185, 129, 0.2);

  background: var(--mr-bg);
  color: var(--mr-text);
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  min-height: 100dvh;
  padding: clamp(5rem, 10vw, 7.5rem) clamp(1rem, 5vw, 3rem) clamp(3rem, 7vw, 5rem);
  line-height: 1.7;
}

.mr-about-container {
  max-width: 76ch;
  margin-inline: auto;
}

.mr-kicker {
  color: var(--mr-accent);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem;
}

.mr-about-page h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.18;
  letter-spacing: -0.025em;
  font-weight: 800;
  margin: 0 0 1rem;
  color: #ffffff;
  text-wrap: balance;
}

/* byline bar */
.mr-byline-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--mr-muted);
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--mr-line);
}
.mr-author-link {
  color: #34d399;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}
.mr-author-link:hover {
  color: #6ee7b7;
}
.mr-dot {
  color: #2e6642;
}

.mr-lede {
  font-size: clamp(1.0625rem, 2vw, 1.22rem);
  color: #cbd5e1;
  margin: 0;
  line-height: 1.68;
}

.mr-summary {
  color: var(--mr-muted);
  font-size: 0.95rem;
  margin: 0 0 1.25rem;
}

/* spec strip */
.mr-spec {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1px;
  background: var(--mr-line);
  border: 1px solid var(--mr-line);
  border-radius: 12px;
  overflow: hidden;
  margin: clamp(2rem, 5vw, 3.5rem) auto;
  padding: 0;
}
.mr-spec > div {
  background: var(--mr-surface);
  padding: 1rem 1.25rem;
}
.mr-spec dt {
  color: var(--mr-accent);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}
.mr-spec dd {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #f1f5f9;
}

/* sections */
.mr-section {
  margin-top: clamp(2.75rem, 6vw, 4.5rem);
}
.mr-about-page h2 {
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--mr-line);
  color: #ffffff;
}
.mr-about-page h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #34d399;
  margin: 0 0 0.5rem;
}
.mr-about-page p {
  margin: 0 0 1.25rem;
  color: #cbd5e1;
}
.mr-about-page p:last-child { margin-bottom: 0; }

.mr-practice { 
  margin-bottom: 1.75rem;
  background: rgba(10, 25, 16, 0.5);
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(23, 56, 34, 0.6);
}
.mr-practice:last-child { margin-bottom: 0; }

/* Table Wrapper & Matrix Table */
.mr-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1.5rem 0 2.5rem;
  border: 1px solid var(--mr-line);
  border-radius: 10px;
  background: var(--mr-surface);
}
.mr-table-wrapper:focus {
  outline: 2px solid var(--mr-accent);
  outline-offset: 2px;
}
.mr-matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  min-width: 620px;
}
.mr-matrix-table th {
  background: rgba(16, 185, 129, 0.08);
  color: #6ee7b7;
  font-weight: 700;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--mr-line);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.mr-matrix-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(23, 56, 34, 0.5);
  color: #cbd5e1;
  vertical-align: top;
}
.mr-matrix-table tbody tr:hover {
  background: rgba(16, 185, 129, 0.04);
}
.mr-matrix-table tbody tr:last-child td {
  border-bottom: none;
}
.mr-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}
.mr-tag-fe { background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
.mr-tag-mb { background: rgba(168, 85, 247, 0.15); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
.mr-tag-be { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
.mr-tag-sys { background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }

/* stack grid */
.mr-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.mr-stack > div {
  background: var(--mr-surface);
  border: 1px solid var(--mr-line);
  padding: 1.125rem;
  border-radius: 10px;
}
.mr-stack h4 {
  font-size: 0.8125rem;
  color: var(--mr-accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.375rem;
}
.mr-stack p {
  margin: 0;
  font-size: 0.9375rem;
  color: #e2e8f0;
}

/* Technical Glossary */
.mr-glossary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}
.mr-glossary-item {
  background: var(--mr-surface);
  border: 1px solid var(--mr-line);
  border-radius: 10px;
  padding: 1.15rem 1.35rem;
}
.mr-glossary-item dt {
  font-size: 1.05rem;
  font-weight: 700;
  color: #34d399;
  margin-bottom: 0.4rem;
}
.mr-glossary-item dd {
  margin: 0;
  font-size: 0.9375rem;
  color: #cbd5e1;
  line-height: 1.65;
}

/* FAQ */
.mr-faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}
.mr-faq-item {
  background: var(--mr-surface);
  border: 1px solid var(--mr-line);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
}
.mr-faq-item h3 {
  color: #ffffff;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}
.mr-faq-item p {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--mr-muted);
}

/* contact */
.mr-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
}
.mr-links a {
  color: #ffffff;
  text-decoration: none;
  background: var(--mr-surface);
  border: 1px solid var(--mr-line);
  padding: 0.65rem 1.35rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.mr-links a:hover,
.mr-links a:focus-visible {
  border-color: var(--mr-accent);
  color: var(--mr-accent);
  box-shadow: 0 0 15px var(--mr-accent-glow);
  transform: translateY(-1px);
}
.mr-links a.mr-btn-primary {
  background: linear-gradient(135deg, #059669, #0d9488);
  border-color: #10b981;
  color: #ffffff;
  font-weight: 600;
}
.mr-links a.mr-btn-primary:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  color: #ffffff;
}
.mr-links a:focus-visible {
  outline: 2px solid var(--mr-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .mr-links a { transition: none; transform: none; }
}
`;
