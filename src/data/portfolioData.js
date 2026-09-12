// ============================================================
// portfolioData.js — Centralized configuration for Mehran Rasool's Portfolio
// All external links, personal info, and content in one place.
// ============================================================

export const personalInfo = {
  name: "Mehran Rasool",
  firstName: "Mehran",
  brandName: "Mehran Rasool",
  title: "Full-Stack AI Engineer & Autonomous Systems Architect",
  location: "Islamabad / Wah Cantt, Pakistan",
  phone: "+92 328 9552955",
  emails: {
    primary: "mehranrasool.sp24@gmail.com",
    secondary: "SP24-BCS-008@cuiwah.edu.pk",
  },
  summary:
    "Full-Stack AI Engineer and Autonomous Systems Architect who designs and ships high-impact production platforms. Specializes in multi-agent AI boards, secure LLM gateways, cross-platform mobile apps with Flutter & Dart, high-throughput FastAPI/React architectures, and high-performance C++ systems.",
  resumeUrl: "/Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/Mehran-786",
  linkedin: "https://www.linkedin.com/in/mehran-rasool-445613402",
  instagram: "https://www.instagram.com/codemechanic0/",
  toolLive: "https://video-downloader-lemon-three.vercel.app/#",
};

export const heroContent = {
  greeting: "Hi, I'm Mehran Rasool",
  titleHighlight: "Full-Stack AI Engineer & Systems Architect",
  subtitle:
    "I architect autonomous multi-agent AI ecosystems, cross-platform Flutter applications, secure LLM gateways, and high-performance C++ platforms.",
  ctaPrimary: { text: "Explore My Work", href: "#projects" },
  ctaSecondary: {
    text: "Get In Touch",
    href: "mailto:mehranrasool.sp24@gmail.com?subject=Inquiry%20%E2%80%93%20Mehran%20Rasool%20Portfolio&body=Hello%20Mehran,%0D%0A%0D%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect%20regarding%20an%20engineering%20opportunity.%0D%0A%0D%0ABest%20Regards,",
  },
  ctaResume: { text: "Download CV", href: "/Resume.pdf" },
};

export const aboutContent = {
  heading: "Architecting the Future of AI & Systems",
  bio: `Hi, I'm <span class="text-white text-xl font-black mx-1 tracking-wide uppercase bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Mehran Rasool</span>. I am a <span class="text-white font-extrabold">Full-Stack AI Engineer & Systems Architect</span> dedicated to building scalable, production-ready software. My engineering focus spans <span class="text-violet-300 font-bold">autonomous multi-agent AI boards</span>, defense-in-depth <span class="text-fuchsia-300 font-bold">LLM security gateways</span>, high-performance <span class="text-indigo-300 font-bold">C++ game engines</span>, and cross-platform applications with <span class="text-cyan-300 font-bold">Flutter, Dart, and React</span>. I build robust architectures that solve complex real-world challenges.`,
  techStack: ["Autonomous AI Agents", "Flutter & Dart", "React & FastAPI", "C++ & Systems"],
};

export const skillsContent = {
  badge: "Engineering Methodology",
  heading: "How I architect and ship mission-critical software",
  description:
    "From threat modeling and multi-agent coordination to high-throughput async pipelines and containerized cloud deployment.",
  cards: [
    {
      number: "01",
      title: "Architecture & Threat Modeling",
      text: "Formulating formal multi-agent protocols, identifying attack vectors (prompt injection, jailbreaks, brute-force vulnerabilities), and defining robust system contracts.",
    },
    {
      number: "02",
      title: "Autonomous Agent Orchestration",
      text: "Designing consensus engines, TOPSIS utility scoring, and vector memory retrieval pipelines across specialized multi-agent executive boards.",
    },
    {
      number: "03",
      title: "Full-Stack & Mobile Implementation",
      text: "Engineering responsive React/Vite interfaces, high-fidelity Flutter & Dart cross-platform apps, and high-concurrency FastAPI/Flask backend services.",
    },
    {
      number: "04",
      title: "Hardening, Benchmarking & Deployment",
      text: "Evaluating latency, precision, and recall under heavy loads; containerizing with Docker; orchestrating Nginx reverse proxies with Cloudflare DDoS & edge defenses.",
    },
  ],
  endText: "Engineered for excellence.",
};

// Technical Skills Data - Expanded & High-Level
export const technicalSkills = {
  categories: [
    {
      title: "Autonomous AI & Agentic Systems",
      skills: [
        { name: "Multi-Agent AI Boards & Orchestration", level: 96 },
        { name: "Prompt Injection & Jailbreak Defense", level: 95 },
        { name: "Microsoft Presidio (PII Sanitization)", level: 94 },
        { name: "Vector Memory & Semantic Classifiers", level: 90 },
        { name: "Groq, Claude & LLM Inference APIs", level: 95 }
      ]
    },
    {
      title: "Mobile & Cross-Platform Development",
      skills: [
        { name: "Flutter", level: 92 },
        { name: "Dart", level: 90 },
        { name: "Mobile UI/UX Architecture", level: 92 },
        { name: "State Management & Responsive Design", level: 88 },
        { name: "Cross-Platform API Integration", level: 94 }
      ]
    },
    {
      title: "Full-Stack Web & Backend",
      skills: [
        { name: "React 19 & Vite", level: 95 },
        { name: "FastAPI (Async Microservices)", level: 94 },
        { name: "REST APIs & Pydantic Contracts", level: 96 },
        { name: "Flask & Python Web Engines", level: 90 },
        { name: "Tailwind CSS & Glassmorphic UI", level: 95 }
      ]
    },
    {
      title: "Core Computer Science & Systems",
      skills: [
        { name: "C++ (OOP & SFML Engines)", level: 92 },
        { name: "Advanced Data Structures & Algorithms", level: 94 },
        { name: "SOLID Design & System Architecture", level: 95 },
        { name: "Relational Databases & SQL Optimization", level: 88 },
        { name: "Java Systems", level: 86 }
      ]
    },
    {
      title: "DevOps & Cloud Infrastructure",
      skills: [
        { name: "Docker Containerization", level: 88 },
        { name: "Nginx & Gunicorn Production Stacks", level: 90 },
        { name: "Cloudflare Edge, CDN & Security", level: 92 },
        { name: "Git / GitHub CI/CD Workflows", level: 94 },
        { name: "Postman & API Automated Testing", level: 92 }
      ]
    },
    {
      title: "Agentic Workflows & Tooling",
      skills: [
        { name: "Google Antigravity & Agentic Pair-Coding", level: 98 },
        { name: "Claude Sonnet & Advanced Prompting", level: 96 },
        { name: "Cursor Composer & Rapid Prototyping", level: 94 },
        { name: "Automated Evaluation & Benchmarking", level: 92 }
      ]
    }
  ]
};

// Content Creation Data (Code Mechanic)
export const contentCreation = {
  badge: "Code Mechanic",
  heading: "Technical Insights & Engineering Breakdowns",
  description: "Beyond engineering platforms, I share architectural deep-dives, multi-agent frameworks, AI security exploits, and performance optimizations via @codemechanic0.",
  categories: [
    {
      title: "Multi-Agent AI & System Intelligence",
      description: "Deconstructing autonomous board architectures, consensus engines, reputation tracking, and vector memory integration.",
      stats: "Agentic AI",
      icon: "🤖"
    },
    {
      title: "AI Security & LLM Defense",
      description: "Breakdowns of prompt injections, jailbreak vulnerabilities, and regex-powered PII sanitization in enterprise pipelines.",
      stats: "@codemechanic0",
      icon: "🛡️"
    },
    {
      title: "Flutter & Cross-Platform Apps",
      description: "Structuring scalable Flutter architectures, state management patterns, and smooth 60fps mobile interfaces.",
      stats: "Flutter Dev",
      icon: "📱"
    },
    {
      title: "C++ Systems & Algorithmic Engines",
      description: "Visualizing graph algorithms, procedural dungeon generators, combat state machines, and SFML rendering pipelines.",
      stats: "DSA in Action",
      icon: "⚔️"
    }
  ]
};

// Leadership & Engineering Highlights
export const leadershipList = [
  {
    title: "Video Vision: Multi-Agent AI Board Platform",
    description: "Architected a 10-agent autonomous board of directors with consensus scoring, TOPSIS utility calculation, trend forecasting, and executive summaries.",
    role: "Founding AI Architect",
    badge: "Autonomous AI"
  },
  {
    title: "Secure LLM Gateway: AI Defense Pipeline",
    description: "Architected a 5-stage hybrid security gateway defending against prompt injections and PII leaks. Evaluated on a 150-prompt multilingual benchmark with 82.7% accuracy and 100% block precision.",
    role: "AI Security Lead",
    badge: "AI Security"
  },
  {
    title: "DownSocial Universal Media Downloader",
    description: "Engineered and deployed a high-traffic media extraction tool with rate limiting, Cloudflare edge caching, and multi-platform extraction.",
    role: "Full-Stack Architect",
    badge: "Production Web"
  },
  {
    title: "2D Dungeon Crawler RPG (DSA Game Engine)",
    description: "Engineered an object-oriented C++ game applying graph traversals, priority queues, and dynamic inventory states with custom SFML rendering.",
    role: "Systems Developer",
    badge: "C++ & DSA"
  }
];

// Experience Data
export const internshipsList = [
  {
    organization: "Autonomous AI & Systems Engineering",
    role: "AI Systems Architect & Full-Stack Engineer",
    duration: "2025 – Present",
    skills: ["Multi-Agent AI", "AI Security", "FastAPI", "React", "Flutter", "Docker"],
    tech: ["Python", "FastAPI", "React", "Flutter", "Docker", "Pydantic"]
  },
  {
    organization: "DownSocial Web Platform",
    role: "Creator & Infrastructure Engineer",
    duration: "2026",
    skills: ["Media Extraction", "Rate Limiting", "Reverse Proxy Configuration", "Cloudflare"],
    tech: ["Python", "Flask", "Gunicorn", "Nginx", "Cloudflare", "React"]
  },
  {
    organization: "Systems & Security Software",
    role: "Lead Systems & Security Developer",
    duration: "2024 – Present",
    skills: ["Data Structures & Algorithms", "C++ Systems", "Information Security", "Cryptography", "SFML"],
    tech: ["C++", "Python", "Java", "SQL", "SFML"]
  }
];

// Soft Skills Data
export const softSkillsList = [
  { name: "Complex Problem Solving", icon: "🧩", desc: "Deconstructing intricate multi-agent workflows and high-concurrency systems into modular, maintainable architectures." },
  { name: "Threat Modeling & Security", icon: "🛡️", desc: "Anticipating attack vectors, prompt manipulations, and system vulnerabilities before production deployment." },
  { name: "System Thinking & SOLID", icon: "⚙️", desc: "Structuring software architectures with clean separation of concerns, DRY principles, and reusable data contracts." },
  { name: "Rapid Innovation", icon: "🚀", desc: "Adopting cutting-edge LLM frameworks, agentic workflows, and cross-platform tools to build fast and reliably." },
  { name: "Architectural Documentation", icon: "📝", desc: "Authoring comprehensive architectural blueprints, benchmark reports, and clean API specifications." },
  { name: "Technical Leadership", icon: "💬", desc: "Articulating complex technical, algorithmic, and security concepts with clarity to stakeholders and collaborators." },
  { name: "Engineering Rigor", icon: "🔬", desc: "Applying thorough benchmarking, latency analysis, and unit validation to every single feature." },
  { name: "Polyglot Versatility", icon: "🌟", desc: "Seamlessly moving across high-level web interfaces, mobile Flutter applications, backend microservices, and low-level C++." }
];

// Real Projects with Media Attachments
export const projects = [
  {
    id: "video-vision",
    number: "01",
    badge: "🌟 Flagship Multi-Agent AI Platform",
    title: "Video Vision Enterprise: Multi-Agent AI & Video Intelligence Platform",
    description:
      "An enterprise-grade autonomous intelligence platform powered by a 10-Agent AI Board of Directors (SEO Expert, Thumbnail Expert, Audience Psychology, Forecast Predictor, Multi-Criteria Decision, Risk Intelligence, Memory Vector, and Executive Report Agents). Features autonomous consensus engines, TOPSIS utility calculation, 7/30/90-day predictive trend forecasting, seasonal pattern detection, and an interactive multi-agent workforce dashboard.",
    techTags: [
      "Multi-Agent AI",
      "Python",
      "FastAPI",
      "React",
      "Vite",
      "Pydantic",
      "TOPSIS Utility Scoring",
      "Predictive Analytics",
      "YouTube Data API"
    ],
    links: {
      github: "https://github.com/Mehran-786",
      demo: null,
    },
    screenshots: [
      { url: "/src/assets/projects/video-vision-multi-agent.jpeg", caption: "Multi-Agent AI Board (10 Specialized Agents)" },
      { url: "/src/assets/projects/video-vision-trend.jpeg", caption: "Trend Forecaster & Market Intelligence" },
      { url: "/src/assets/projects/video-vision-engines.jpeg", caption: "Core Analytics Engine Architecture" },
      { url: "/src/assets/projects/video-vision-analytics.jpeg", caption: "Deep Video Performance & Metrics Analytics" },
      { url: "/src/assets/projects/video-vision-employee-section.jpeg", caption: "Autonomous Workforce & Task Hub" },
      { url: "/src/assets/projects/video-vision-employee-performance.jpeg", caption: "Agent Economics & Performance Dashboard" }
    ],
    isFlagship: true,
  },
  {
    id: "secure-llm-gateway",
    number: "02",
    badge: "🛡️ AI Security & Defense",
    title: "Secure LLM Gateway: Defending AI from Prompt Injection & Data Leaks",
    description:
      "A five-stage hybrid security gateway for LLM applications defending against direct prompt injection, jailbreaking (e.g. Grandma Exploit), and sensitive PII leaks across multiple languages. Combines a multilingual normalization layer, TF-IDF + Logistic Regression semantic attack classifier, and Microsoft Presidio with three custom recognizers (Pakistani CNIC, API keys, names) into a scored decision pipeline backed by a live Groq (llama-3.1-8b-instant) API. Evaluated on a 150-prompt dataset with 82.7% accuracy, 100% PII recall, 100% block precision, and 525ms average latency.",
    techTags: [
      "Python",
      "FastAPI",
      "scikit-learn",
      "Microsoft Presidio",
      "Groq API",
      "Docker",
      "Nginx",
      "Pydantic"
    ],
    links: {
      github: "https://github.com/Mehran-786",
      demo: null,
    },
    videoUrl: "/src/assets/projects/ai-gateway-demo.mp4",
    isFlagship: true,
  },
  {
    id: "tool-website",
    number: "03",
    badge: "🚀 Live Production Tool",
    title: "DownSocial: High-Speed Universal Video & Media Downloader",
    description:
      "A production web application and extraction utility designed for lightning-fast, high-definition video extraction across major platforms (YouTube, Facebook, Instagram, TikTok, Threads, Snapchat). Features automated link parsing, client-side format selection (HD MP4 / HQ MP3), IP-based rate limiting, Cloudflare edge caching, and full responsive dark mode.",
    techTags: [
      "React",
      "JavaScript",
      "Python",
      "Flask",
      "Media Extraction",
      "Cloudflare CDN",
      "Vercel",
      "Rate Limiting"
    ],
    links: {
      github: "https://github.com/Mehran-786",
      demo: "https://video-downloader-lemon-three.vercel.app/#",
    },
    screenshots: [
      { url: "/src/assets/projects/tool-website-main.jpeg", caption: "DownSocial Video Downloader Hub" },
      { url: "/src/assets/projects/tool-website-features.jpeg", caption: "Multi-Platform Platform Selector" },
      { url: "/src/assets/projects/tool-website-ready.jpeg", caption: "HD & MP3 Quality Selection Engine" }
    ],
    isFlagship: false,
  },
  {
    id: "cybersecurity-idps",
    number: "04",
    badge: "🔒 Cybersecurity & Defense",
    title: "Cryptographic IDPS & Online Brute-Force Defense",
    description:
      "A comprehensive Information Security platform demonstrating offline cryptographic hash cracking and real-time online brute-force attacks against web authentication. Features automated detection of repeated login failures, progressive rate limiting, 5-attempt account lockout mechanisms, and an Intrusion Detection & Prevention (IDPS) logging engine tracking attack timestamps and source vectors.",
    techTags: [
      "Python",
      "Cryptography",
      "IDPS",
      "Password Hashing & Salting",
      "MD5 / SHA-256",
      "Rate Limiting",
      "Threat Logging"
    ],
    screenshots: [
      { url: "/src/assets/projects/is-portal.png", caption: "Password Cracking Portal" },
      { url: "/src/assets/projects/is-crack.png", caption: "Hash Value Decryption & Analysis" },
      { url: "/src/assets/projects/is-bruteforce.png", caption: "Online Brute-Force Attack & IDPS Defenses" }
    ],
    links: {
      github: "https://github.com/Mehran-786",
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "dungeon-crawler-rpg",
    number: "05",
    badge: "⚔️ C++ Game Engine",
    title: "2D Dungeon Crawler RPG Game (DSA Engine)",
    description:
      "An object-oriented 2D dungeon crawler built from scratch in C++ utilizing core Data Structures & Algorithms. Implements grid/graph level progression, item inventory systems, particle animations, dynamic shop mechanics, and state-machine-driven boss battles with SFML rendering.",
    techTags: [
      "C++",
      "SFML",
      "Data Structures & Algorithms",
      "OOP",
      "State Machines",
      "Game Architecture"
    ],
    screenshots: [
      { url: "/src/assets/projects/game-lobby.png", caption: "Game Lobby & Mission Select" },
      { url: "/src/assets/projects/game-playing.png", caption: "Dungeon Exploration Gameplay" },
      { url: "/src/assets/projects/game-boss.png", caption: "Boss Encounter Combat State" },
      { url: "/src/assets/projects/game-inventory.png", caption: "Player Inventory System" },
      { url: "/src/assets/projects/game-cart.png", caption: "In-Game Merchant & Shop UI" },
      { url: "/src/assets/projects/game-win.png", caption: "Victory State & Level Clearance" }
    ],
    links: {
      github: "https://github.com/Mehran-786",
      demo: null,
    },
    isFlagship: false,
  },
];

export const certificates = {
  featured: [
    {
      name: "Autonomous Multi-Agent Systems Architecture",
      issuer: "Advanced AI Development",
      icon: "🤖",
    },
    {
      name: "AI & LLM Security Engineering",
      issuer: "AI Security Institute",
      icon: "🛡️",
    },
    {
      name: "Cross-Platform Mobile Development (Flutter & Dart)",
      issuer: "Mobile Engineering",
      icon: "📱",
    },
    {
      name: "Data Structures & Algorithms in C++",
      issuer: "Computer Science Engineering",
      icon: "⚙️",
    },
    {
      name: "Information Security & Cryptography",
      issuer: "Cybersecurity Specialization",
      icon: "🔒",
    },
    {
      name: "High-Performance Backend Systems & FastAPI",
      issuer: "Cloud & Web Architecture",
      icon: "⚡",
    },
  ],
  viewAllUrl: "https://github.com/Mehran-786",
};

export const education = {
  degree: "BS in Computer Science",
  institution: "COMSATS University Islamabad",
  focus: "Autonomous AI, Cyber Defense, and Distributed Systems",
  summary: "Comprehensive grounding in theoretical and applied computing, advanced algorithms, systems programming, and modern software architectures.",
};

export const footerContent = {
  taglines: [
    "Autonomous AI & Multi-Agent Systems",
    "Flutter & React · FastAPI · C++",
    "High-Performance Software Engineering",
  ],
  credential: "Full-Stack AI Engineer & Systems Architect",
  copyright: `© ${new Date().getFullYear()} Mehran Rasool | Built with React & Vite`,
};

// EmailJS Configuration
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
