import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import { projects as defaultStaticProjects } from '../data/portfolioData';
import brandLogo from '../assets/logo.jpeg';
import { useTheme } from '../context/ThemeContext';

// Static Project Media Imports (Fallbacks & Default Assets)
import aiDemoVideo from '../assets/projects/ai-gateway-demo.mp4';
import isPortalImg from '../assets/projects/is-portal.png';
import isCrackImg from '../assets/projects/is-crack.png';
import isBruteforceImg from '../assets/projects/is-bruteforce.png';
import gameLobbyImg from '../assets/projects/game-lobby.png';
import gamePlayingImg from '../assets/projects/game-playing.png';
import gameBossImg from '../assets/projects/game-boss.png';
import gameInventoryImg from '../assets/projects/game-inventory.png';
import gameCartImg from '../assets/projects/game-cart.png';
import gameWinImg from '../assets/projects/game-win.png';
import vvMultiAgent from '../assets/projects/video-vision-multi-agent.jpeg';
import vvTrend from '../assets/projects/video-vision-trend.jpeg';
import vvEngines from '../assets/projects/video-vision-engines.jpeg';
import vvAnalytics from '../assets/projects/video-vision-analytics.jpeg';
import vvEmployeeSec from '../assets/projects/video-vision-employee-section.jpeg';
import vvEmployeePerf from '../assets/projects/video-vision-employee-performance.jpeg';
import toolMain from '../assets/projects/tool-website-main.jpeg';
import toolFeatures from '../assets/projects/tool-website-features.jpeg';
import toolReady from '../assets/projects/tool-website-ready.jpeg';

// Static asset mapping to resolve development /src/ paths to bundled production assets
const staticAssetMap = {
  '/src/assets/projects/video-vision-multi-agent.jpeg': vvMultiAgent,
  'video-vision-multi-agent.jpeg': vvMultiAgent,
  '/src/assets/projects/video-vision-trend.jpeg': vvTrend,
  'video-vision-trend.jpeg': vvTrend,
  '/src/assets/projects/video-vision-engines.jpeg': vvEngines,
  'video-vision-engines.jpeg': vvEngines,
  '/src/assets/projects/video-vision-analytics.jpeg': vvAnalytics,
  'video-vision-analytics.jpeg': vvAnalytics,
  '/src/assets/projects/video-vision-employee-section.jpeg': vvEmployeeSec,
  'video-vision-employee-section.jpeg': vvEmployeeSec,
  '/src/assets/projects/video-vision-employee-performance.jpeg': vvEmployeePerf,
  'video-vision-employee-performance.jpeg': vvEmployeePerf,
  '/src/assets/projects/tool-website-main.jpeg': toolMain,
  'tool-website-main.jpeg': toolMain,
  '/src/assets/projects/tool-website-features.jpeg': toolFeatures,
  'tool-website-features.jpeg': toolFeatures,
  '/src/assets/projects/tool-website-ready.jpeg': toolReady,
  'tool-website-ready.jpeg': toolReady,
  '/src/assets/projects/is-portal.png': isPortalImg,
  'is-portal.png': isPortalImg,
  '/src/assets/projects/is-crack.png': isCrackImg,
  'is-crack.png': isCrackImg,
  '/src/assets/projects/is-bruteforce.png': isBruteforceImg,
  'is-bruteforce.png': isBruteforceImg,
  '/src/assets/projects/game-lobby.png': gameLobbyImg,
  'game-lobby.png': gameLobbyImg,
  '/src/assets/projects/game-playing.png': gamePlayingImg,
  'game-playing.png': gamePlayingImg,
  '/src/assets/projects/game-boss.png': gameBossImg,
  'game-boss.png': gameBossImg,
  '/src/assets/projects/game-inventory.png': gameInventoryImg,
  'game-inventory.png': gameInventoryImg,
  '/src/assets/projects/game-cart.png': gameCartImg,
  'game-cart.png': gameCartImg,
  '/src/assets/projects/game-win.png': gameWinImg,
  'game-win.png': gameWinImg,
  '/src/assets/projects/ai-gateway-demo.mp4': aiDemoVideo,
  'ai-gateway-demo.mp4': aiDemoVideo,
};

const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const cleanName = url.split('/').pop().split('?')[0];
  if (staticAssetMap[cleanName]) return staticAssetMap[cleanName];
  if (staticAssetMap[url]) return staticAssetMap[url];
  return url;
};

const getProjectSlug = (id) => {
  if (id === 'tool-website') return 'downsocial';
  if (id === 'dungeon-crawler-rpg') return 'dungeon-crawler';
  return id;
};

// Static screenshots map for default projects
const staticScreenshotsMap = {
  'video-vision': [
    { img: vvMultiAgent, title: "10-Agent Autonomous AI Board", desc: "Consensus engine, reputation tracking & agent roster" },
    { img: vvTrend, title: "Trend Forecaster & Intelligence", desc: "7/30/90-day predictions, opportunity windows & niche topics" },
    { img: vvEngines, title: "Core Engine Architecture", desc: "Multi-stage pipeline with shared Pydantic data contracts" },
    { img: vvAnalytics, title: "Deep Video Analytics", desc: "Engagement curves, retention analytics & ranking signals" },
    { img: vvEmployeeSec, title: "Autonomous Workforce Hub", desc: "Executive departments, task automation & digital calendar" },
    { img: vvEmployeePerf, title: "Agent Economics & Performance", desc: "Continuous learning score & ROI telemetry" }
  ],
  'tool-website': [
    { img: toolMain, title: "DownSocial Universal Downloader", desc: "Modern dark UI supporting 6+ video platforms" },
    { img: toolFeatures, title: "Platform Extraction Hub", desc: "YouTube, Instagram, TikTok, Threads & Snapchat support" },
    { img: toolReady, title: "Quality & Format Selection", desc: "Instant HD MP4 & HQ MP3 extraction engine" }
  ],
  'cybersecurity-idps': [
    { img: isPortalImg, title: "Password Cracking Portal", desc: "Interactive portal for testing hash attacks" },
    { img: isCrackImg, title: "Hash Cracking Output", desc: "MD5/SHA-256 decrypted passwords & salt analysis" },
    { img: isBruteforceImg, title: "Online Brute-Force IDPS", desc: "Live attack logs, rate-limit trigger & lockout defense" }
  ],
  'dungeon-crawler-rpg': [
    { img: gameLobbyImg, title: "Game Lobby", desc: "C++ SFML Game Engine" },
    { img: gamePlayingImg, title: "Dungeon Exploration", desc: "C++ SFML Game Engine" },
    { img: gameBossImg, title: "Boss Battle State", desc: "C++ SFML Game Engine" },
    { img: gameInventoryImg, title: "Player Inventory", desc: "C++ SFML Game Engine" },
    { img: gameCartImg, title: "In-Game Merchant", desc: "C++ SFML Game Engine" },
    { img: gameWinImg, title: "Victory Screen", desc: "C++ SFML Game Engine" }
  ]
};

const GitHubIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

export default function Projects() {
  const { effectiveTheme } = useTheme();
  const isLight = effectiveTheme === 'light';

  const [projectsList, setProjectsList] = useState(defaultStaticProjects);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Admin Auth Modal
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminStep, setAdminStep] = useState(1);
  const [secretIdInput, setSecretIdInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTechTags, setFormTechTags] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');
  const [formDemoLabel, setFormDemoLabel] = useState('Open Live Application');
  const [formIsFlagship, setFormIsFlagship] = useState(false);
  const [formMedia, setFormMedia] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Check admin session and fetch dynamic projects on mount
  useEffect(() => {
    checkAdminSession();
    fetchProjects();
    AOS.init({ duration: 800, once: true, easing: 'ease-out' });
  }, []);

  // Refresh scroll animations when project list loads or changes
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [projectsList]);

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/auth/session-check');
      const data = await res.json();
      if (data.authenticated) {
        setIsAdmin(true);
      }
    } catch {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      }
    } catch (err) {
      console.warn('[Projects Fetch Notice] Using static fallback:', err?.message || err);
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        if (!isSubmitting) setShowProjectModal(false);
        setShowDeleteModal(false);
        setShowAdminLoginModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting]);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // ------------------------- Admin Auth Handlers -------------------------
  const handleAdminRequestOtp = async (e) => {
    e.preventDefault();
    setAdminError('');
    if (!secretIdInput.trim()) {
      setAdminError("Please enter your Secret ID.");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch('/api/auth/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretId: secretIdInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request OTP');

      setChallengeId(data.challengeId || '');
      setAdminStep(2);
      setOtpCountdown(300); // 5 minutes
    } catch (err) {
      setAdminError(err.message || 'Authentication failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminVerifyOtp = async (e) => {
    e.preventDefault();
    setAdminError('');
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setAdminError("Please enter the 6-digit verification code.");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpInput.trim(), challengeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP code.');

      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setAdminStep(1);
      setSecretIdInput('');
      setOtpInput('');
    } catch (err) {
      setAdminError(err.message || 'OTP verification failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsAdmin(false);
  };

  // ------------------------- Add / Edit Project Handlers -------------------------
  const openAddProjectModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormBadge('');
    setFormDesc('');
    setFormTechTags('');
    setFormGithub('');
    setFormDemo('');
    setFormDemoLabel('Open Live Application');
    setFormIsFlagship(false);
    setFormMedia([]);
    setFormError('');
    setShowProjectModal(true);
  };

  const openEditProjectModal = (project) => {
    setEditingProject(project);
    setFormTitle(project.title || '');
    setFormBadge(project.badge || '');
    setFormDesc(project.description || '');
    setFormTechTags((project.techTags || []).join(', '));
    setFormGithub(project.links?.github || '');
    setFormDemo(project.links?.demo || '');
    setFormDemoLabel(project.links?.demoLabel || 'Open Live Application');
    setFormIsFlagship(Boolean(project.isFlagship));

    // Resolve media list
    let initialMedia = [];
    if (Array.isArray(project.media) && project.media.length > 0) {
      initialMedia = project.media.map(m => ({
        ...m,
        url: resolveAssetUrl(m.url),
      }));
    } else if (staticScreenshotsMap[project.id]) {
      initialMedia = staticScreenshotsMap[project.id].map(s => ({
        type: 'image',
        url: s.img,
        title: s.title || '',
        desc: s.desc || '',
      }));
    } else if (project.id === 'secure-llm-gateway') {
      initialMedia = [{ type: 'video', url: aiDemoVideo, title: 'Live AI Gateway Video Demo', desc: '1080p HD' }];
    }
    setFormMedia(initialMedia);
    setFormError('');
    setShowProjectModal(true);
  };

  // File Upload to Cloudflare R2
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType = 'image';
      if (['mp4', 'webm'].includes(ext) || file.type.startsWith('video/')) fileType = 'video';
      else if (ext === 'pdf' || file.type === 'application/pdf') fileType = 'file';

      const previewUrl = fileType === 'image' ? URL.createObjectURL(file) : '';

      const placeholderItem = {
        id: tempId,
        type: fileType,
        name: file.name,
        title: file.name.replace(/\.[^/.]+$/, ""),
        desc: '',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: '',
        previewUrl,
        key: '',
        isUploading: true,
      };

      setFormMedia(prev => [...prev, placeholderItem]);

      try {
        // Step 1: Request Presigned URL from API
        const presignRes = await fetch('/api/r2/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || (fileType === 'video' ? 'video/mp4' : 'image/jpeg'),
            fileSize: file.size,
            folder: 'projects',
            projectId: editingProject?.id || 'new-proj',
          }),
        });
        const presignData = await presignRes.json();
        if (!presignRes.ok) throw new Error(presignData.error || 'Failed to get upload authorization.');

        // Step 2: Upload direct to R2
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || (fileType === 'video' ? 'video/mp4' : 'image/jpeg') },
          body: file,
        });
        if (!uploadRes.ok) throw new Error('Cloud storage upload failed.');

        // Step 3: Update item with permanent URL
        setFormMedia(prev => prev.map(m => m.id === tempId ? {
          ...m,
          url: presignData.publicUrl,
          key: presignData.key,
          isUploading: false,
        } : m));
      } catch (uploadErr) {
        console.error('[Upload Error]', uploadErr);
        alert(`Failed to upload ${file.name}: ${uploadErr.message}`);
        setFormMedia(prev => prev.filter(m => m.id !== tempId));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveMedia = (index) => {
    setFormMedia(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMediaMeta = (index, field, value) => {
    setFormMedia(prev => prev.map((m, idx) => idx === index ? { ...m, [field]: value } : m));
  };

  // Submit Add or Edit Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim() || formTitle.trim().length < 3) {
      setFormError('Please enter a project title (at least 3 characters).');
      return;
    }
    if (!formDesc.trim() || formDesc.trim().length < 10) {
      setFormError('Please enter a detailed project description (at least 10 characters).');
      return;
    }

    if (formMedia.some(m => m.isUploading)) {
      setFormError('Please wait for file uploads to finish before saving.');
      return;
    }

    setIsSubmitting(true);

    const techTagsArray = formTechTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle.trim(),
      badge: formBadge.trim(),
      description: formDesc.trim(),
      techTags: techTagsArray,
      links: {
        github: formGithub.trim() || null,
        demo: formDemo.trim() || null,
        demoLabel: formDemoLabel.trim() || 'Open Live Application',
      },
      media: formMedia.map(m => ({
        type: m.type || 'image',
        url: m.url,
        key: m.key || '',
        name: m.name || '',
        title: m.title || '',
        desc: m.desc || '',
        size: m.size || '',
      })),
      isFlagship: formIsFlagship,
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project.');

      if (editingProject) {
        setProjectsList(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
      } else {
        setProjectsList(prev => [data, ...prev]);
      }

      setShowProjectModal(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------- Delete Project Handlers -------------------------
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete project.');

      setProjectsList(prev => prev.filter(p => p.id !== projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      alert(err.message || 'Could not delete project.');
    }
  };

  // Helper to resolve media for a project card
  const getProjectScreenshots = (p) => {
    if (Array.isArray(p.media) && p.media.filter(m => m.type === 'image' && m.url).length > 0) {
      return p.media
        .filter(m => m.type === 'image' && m.url)
        .map(m => ({
          img: resolveAssetUrl(m.url),
          title: m.title || p.title,
          desc: m.desc || '',
        }));
    }
    return staticScreenshotsMap[p.id] || [];
  };

  const getProjectVideos = (p) => {
    let list = [];
    if (Array.isArray(p.media)) {
      list = p.media
        .filter(m => m.type === 'video' && m.url)
        .map(m => ({
          ...m,
          url: resolveAssetUrl(m.url),
        }));
    }
    if (list.length === 0 && p.id === 'secure-llm-gateway') {
      return [{ url: aiDemoVideo, title: 'Live AI Gateway Video Demo', desc: '1080p HD' }];
    }
    return list;
  };

  const getProjectFiles = (p) => {
    if (Array.isArray(p.media)) {
      return p.media.filter(m => m.type === 'file' && m.url);
    }
    return [];
  };

  return (
    <section 
      id="projects" 
      className={`pt-12 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#f0fdf4] text-slate-800' : 'bg-[#050f09] text-white'
      }`}
    >
      {/* Background ambient lighting */}
      <div className={`absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-colors duration-300 ${
        isLight ? 'bg-emerald-400/20' : 'bg-emerald-600/10'
      }`} />
      <div className={`absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-colors duration-300 ${
        isLight ? 'bg-teal-400/20' : 'bg-teal-600/10'
      }`} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Admin Bar or Discreet Luxury Login Button */}
        {isAdmin ? (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5 mb-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-[0_4px_25px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-2.5 text-emerald-300 text-sm font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              🛡️ Admin Mode Active — Full Project Management Privileges
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openAddProjectModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-extrabold text-xs md:text-sm hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 cursor-pointer"
              >
                <span className="text-base leading-none">＋</span>
                Add New Project
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xs font-semibold transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end mb-8">
            <button
              type="button"
              onClick={() => setShowAdminLoginModal(true)}
              className={`group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                isLight
                  ? 'bg-white/90 hover:bg-white border-emerald-500/35 text-emerald-800 shadow-[0_2px_12px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)]'
                  : 'bg-gradient-to-r from-[#04150b]/90 to-[#071f11]/90 hover:from-[#082615] hover:to-[#0b331c] border-emerald-500/35 hover:border-emerald-400 text-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]'
              }`}
              title="Site Owner Admin Console"
            >
              {/* Mehran's Avatar with glowing emerald pulse */}
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-emerald-400/80 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0">
                <img src={brandLogo} alt="Admin" className="w-full h-full object-cover" />
                <span className="absolute inset-0 bg-emerald-500/15 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Title & Key Icon */}
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                <span>Admin Portal</span>
                <svg className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              {/* Status Dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div data-aos="fade-up" className="mb-16 text-center">
          <div className={`inline-block border rounded-full px-5 py-1.5 text-xs font-bold mb-5 shadow-sm uppercase tracking-wider backdrop-blur-sm ${
            isLight ? 'border-emerald-600/30 text-emerald-700 bg-emerald-100/70' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
          }`}>
            Featured Systems
          </div>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Signature Projects
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
            Real-world systems spanning multi-agent AI ecosystems, defense-grade LLM gateways, high-speed web utilities, and C++ game engines.
          </p>
        </div>

        {/* Projects Stack */}
        <div className="flex flex-col gap-10">
          {projectsList.map((project, index) => {
            const screenshots = getProjectScreenshots(project);
            const videos = getProjectVideos(project);
            const files = getProjectFiles(project);
            const isFlagship = Boolean(project.isFlagship);
            const projectNumber = project.number || String(index + 1).padStart(2, '0');
            const techTags = Array.isArray(project.techTags) 
              ? project.techTags 
              : (typeof project.techTags === 'string' ? JSON.parse(project.techTags || '[]') : []);
            const links = typeof project.links === 'string' 
              ? JSON.parse(project.links || '{}') 
              : (project.links || {});

            return (
              <div 
                key={project.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`relative rounded-3xl p-[1px] group transition-all duration-500 ${
                  isFlagship 
                    ? (isLight 
                        ? 'bg-gradient-to-br from-emerald-500/50 via-teal-500/20 to-teal-500/30 shadow-[0_10px_35px_rgba(16,185,129,0.15)] hover:shadow-[0_15px_45px_rgba(16,185,129,0.25)]' 
                        : 'bg-gradient-to-br from-emerald-500/60 via-teal-500/20 to-teal-500/40 hover:from-emerald-400 hover:via-teal-400/50 hover:to-teal-400 shadow-[0_10px_40px_rgba(16,185,129,0.2)]'
                      )
                    : (isLight ? 'bg-emerald-900/15 hover:bg-emerald-500/40 shadow-md' : 'bg-white/10 hover:bg-emerald-500/30')
                }`}
              >
                <div className={`rounded-3xl p-6 md:p-10 h-full backdrop-blur-xl transition-all duration-500 flex flex-col justify-between ${
                  isLight 
                    ? (isFlagship ? 'bg-white/95 group-hover:bg-white text-slate-800' : 'bg-white/90 group-hover:bg-white/95 text-slate-800')
                    : (isFlagship ? 'bg-[#0e0824]/95 group-hover:bg-[#120a2e]/95 text-white' : 'bg-[#0c071d]/90 group-hover:bg-[#100926]/90 text-white')
                }`}>
                  <div>
                    {/* Top Meta: Badge, Number & Admin Action Toolbar */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                      {project.badge ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border ${
                          isLight ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 'text-violet-300 bg-emerald-500/15 border-emerald-500/30'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {project.badge}
                        </span>
                      ) : <span />}

                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded-full">
                            <button
                              type="button"
                              onClick={() => openEditProjectModal(project)}
                              className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit Project"
                            >
                              ✏️ Edit
                            </button>
                            <span className="text-white/20">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectToDelete(project);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                        <span className={`text-4xl md:text-5xl font-black font-serif italic ${isLight ? 'text-emerald-950/15' : 'text-white/15'}`}>{projectNumber}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl md:text-3xl font-black tracking-tight mb-4 transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-violet-300'
                    }`}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm md:text-base leading-relaxed mb-6 font-normal whitespace-pre-line ${
                      isLight ? 'text-slate-700' : 'text-white/70'
                    }`}>
                      {project.description}
                    </p>

                    {/* Multiple Image Screenshots Grid (With Zoom Lightbox) */}
                    {screenshots.length > 0 && (
                      <div className="my-6">
                        <div className={`grid gap-3 ${
                          screenshots.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
                          screenshots.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                          screenshots.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
                          'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                        }`}>
                          {screenshots.map((item, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setActiveModal({ img: item.img, title: item.title, desc: item.desc })}
                              className={`group/img relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                                isLight
                                  ? 'border-emerald-500/30 bg-slate-100 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                                  : 'border-emerald-500/20 bg-black/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                              }`}
                            >
                              <div className="aspect-video overflow-hidden relative">
                                <img 
                                  src={item.img} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="p-2 rounded-full bg-black/70 text-white border border-white/20">
                                    <ZoomIcon />
                                  </span>
                                </div>
                              </div>
                              <div className={`p-2.5 text-left border-t ${
                                isLight ? 'bg-slate-50 border-emerald-500/15' : 'bg-[#140b2e]/90 border-emerald-500/10'
                              }`}>
                                <p className={`${isLight ? 'text-slate-900' : 'text-white'} text-xs font-bold truncate`}>{item.title}</p>
                                {item.desc && <p className={`${isLight ? 'text-emerald-700' : 'text-violet-300/70'} text-[10px] truncate`}>{item.desc}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className={`${isLight ? 'text-emerald-700/80' : 'text-emerald-400/60'} text-xs mt-2.5 italic text-right font-mono flex items-center justify-end gap-1`}>
                          <ZoomIcon /> Click any view to inspect HD interface details
                        </p>
                      </div>
                    )}

                    {/* Video Demonstration Embeds (Support Multiple Videos) */}
                    {videos.length > 0 && (
                      <div className="my-6 flex flex-col gap-5">
                        {videos.map((vid, vIdx) => (
                          <div 
                            key={vIdx}
                            className={`rounded-2xl overflow-hidden border shadow-lg ${
                              isLight ? 'border-emerald-500/35 bg-black' : 'border-emerald-500/25 bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                            }`}
                          >
                            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {vid.title || (videos.length > 1 ? `Live Video Demonstration #${vIdx + 1}` : "Live Project Video Demo")}
                              </span>
                              <span className="text-emerald-400 font-bold">{vid.desc || "1080p HD"}</span>
                            </div>
                            <video 
                              controls 
                              playsInline 
                              preload="metadata" 
                              className="w-full max-h-[440px] object-cover bg-black"
                            >
                              <source src={vid.url} type="video/mp4" />
                              Your browser does not support video playback.
                            </video>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Attached PDFs / Documents */}
                    {files.length > 0 && (
                      <div className="my-4 flex flex-wrap gap-2.5">
                        {files.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.name}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-medium ${
                              isLight ? 'bg-emerald-50 border-emerald-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-100' : 'bg-white/5 border-emerald-500/20 text-white hover:border-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            <span className="text-base">📄</span>
                            <span className="font-bold">{file.title || file.name || "Project Documentation"}</span>
                            {file.size && <span className="opacity-60 text-[11px]">({file.size})</span>}
                            <span className="text-emerald-600 text-[11px] underline ml-1 font-semibold">Download PDF ↗</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Tech Tags */}
                    {techTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {techTags.map((tag) => (
                          <span 
                            key={tag}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-300 cursor-default ${
                              isLight ? 'text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400' : 'text-violet-200 bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-400'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className={`flex flex-wrap items-center gap-3 pt-4 border-t ${isLight ? 'border-emerald-500/20' : 'border-emerald-500/20'}`}>
                    {/* Repository Link with Auto-Styled GitHub Icon & Button */}
                    {links.github && (
                      <a 
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group/btn ${
                          isLight 
                            ? 'bg-slate-900 text-white hover:bg-emerald-700 hover:text-white border border-slate-900' 
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        <GitHubIcon />
                        View Repository
                      </a>
                    )}

                    {/* Website / Live Link with Auto-Styled Gradient Button */}
                    {links.demo ? (
                      <a 
                        href={links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:scale-105"
                      >
                        <ExternalLinkIcon />
                        {links.demoLabel || "Open Live Application"}
                      </a>
                    ) : (
                      <span className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold ${
                        isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        Enterprise Architecture
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ------------------------- Add / Edit Project Modal ------------------------- */}
      {showProjectModal && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => !isSubmitting && setShowProjectModal(false)}
        >
          <div 
            className="relative max-w-3xl w-full bg-[#08150d] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.3)] my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a1e12] border-b border-emerald-500/20 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingProject ? '✏️ Edit Project' : '✨ Add New Project'}
                </h3>
                <p className="text-emerald-400 text-xs">
                  {editingProject ? `Modifying project: ${editingProject.title}` : 'Upload and publish a completed project to your portfolio'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isSubmitting && setShowProjectModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto flex flex-col gap-4 text-left">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  ⚠️ {formError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Autonomous Agent Dashboard"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                />
              </div>

              {/* Custom Badge / Tag */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Top Badge / Label (Custom Subtitle)
                </label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. 🌟 Flagship Multi-Agent AI Platform (or custom tag)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ye tag project card ke top par green pulsing dot ke sath show hota hai.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe your system architecture, problem solved, key features, and engineering benchmarks..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm leading-relaxed"
                />
              </div>

              {/* Tech Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Tech Stack Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formTechTags}
                  onChange={(e) => setFormTechTags(e.target.value)}
                  placeholder="Python, FastAPI, React, Docker, PostgreSQL, Groq"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                />
              </div>

              {/* Repository Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  View Repository Link (GitHub URL)
                </label>
                <input
                  type="url"
                  value={formGithub}
                  onChange={(e) => setFormGithub(e.target.value)}
                  placeholder="https://github.com/Mehran-786/repository-name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Aap sirf link daalein, button aur GitHub logo automatically style ho kar display hoga.
                </span>
              </div>

              {/* Live Website / Demo Link & Custom Button Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Live Website / Demo Link
                  </label>
                  <input
                    type="url"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    placeholder="https://myproject.com or demo link"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Website Button Name
                  </label>
                  <input
                    type="text"
                    value={formDemoLabel}
                    onChange={(e) => setFormDemoLabel(e.target.value)}
                    placeholder="Open Live Application"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040c07] border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Flagship Toggle */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#040c07] border border-emerald-500/20">
                <input
                  type="checkbox"
                  id="flagship-check"
                  checked={formIsFlagship}
                  onChange={(e) => setFormIsFlagship(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-emerald-500/40 bg-black cursor-pointer"
                />
                <label htmlFor="flagship-check" className="text-xs text-white font-semibold cursor-pointer select-none">
                  Highlight as Flagship System (Glowing Emerald Border &amp; Enhanced Shadow)
                </label>
              </div>

              {/* Media Uploads Hub (Images, Videos, PDFs) */}
              <div className="border border-emerald-500/30 rounded-2xl p-4 bg-[#040c07]/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>📁</span> Media Attachments (Pictures, Videos &amp; PDFs)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Upload multiple pictures, HD video demo (MP4/WebM), or project PDF documentation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>＋</span> Upload Media
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/mp4,video/webm,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Media Items List */}
                {formMedia.length === 0 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-500/20 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-500/5 transition-all"
                  >
                    <p className="text-xs text-slate-400">
                      No media attached yet. Click to upload screenshots, demo videos, or PDF files.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {formMedia.map((m, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a1b10] border border-emerald-500/20"
                      >
                        {/* Type Icon or Thumbnail */}
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-black shrink-0 flex items-center justify-center border border-white/10">
                          {m.type === 'image' && (m.previewUrl || m.url) ? (
                            <img 
                              src={m.previewUrl || resolveAssetUrl(m.url)} 
                              alt={m.title || "thumbnail"} 
                              className="w-full h-full object-cover" 
                            />
                          ) : m.type === 'video' ? (
                            <span className="text-lg">🎬</span>
                          ) : m.type === 'file' ? (
                            <span className="text-lg">📄</span>
                          ) : (
                            <span className="text-lg">🖼️</span>
                          )}
                        </div>

                        {/* Title & Desc Inputs */}
                        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={m.title || ''}
                            onChange={(e) => handleUpdateMediaMeta(idx, 'title', e.target.value)}
                            placeholder="Title / View Caption"
                            className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                          />
                          <input
                            type="text"
                            value={m.desc || ''}
                            onChange={(e) => handleUpdateMediaMeta(idx, 'desc', e.target.value)}
                            placeholder="Short subtitle or note"
                            className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        {/* Status / Remove */}
                        {m.isUploading ? (
                          <span className="text-[11px] text-emerald-400 animate-pulse font-mono shrink-0">Uploading...</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(idx)}
                            className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                            title="Remove Media"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/20">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowProjectModal(false)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Project...' : (editingProject ? 'Update Project' : 'Publish Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------- Delete Confirmation Modal ------------------------- */}
      {showDeleteModal && projectToDelete && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="relative max-w-md w-full bg-[#12070a] border border-red-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mb-4">
              🗑️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Project</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{projectToDelete.title}"</strong>? Any media attachments in Cloudflare R2 will also be cleaned up.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------- Admin Login 2-Step OTP Modal ------------------------- */}
      {showAdminLoginModal && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAdminLoginModal(false)}
        >
          <div 
            className="relative max-w-md w-full bg-[#07170e] border border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-lg font-bold text-white">Portfolio Admin Login</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminLoginModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {adminError && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs">
                ⚠️ {adminError}
              </div>
            )}

            {adminStep === 1 ? (
              <form onSubmit={handleAdminRequestOtp} className="flex flex-col gap-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your Admin Secret ID to receive a secure 6-digit verification code at your email address.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Admin Secret ID
                  </label>
                  <input
                    type="password"
                    required
                    value={secretIdInput}
                    onChange={(e) => setSecretIdInput(e.target.value)}
                    placeholder="Enter Secret ID..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(false)}
                    className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {adminLoading ? 'Verifying...' : 'Send Login Code →'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminVerifyOtp} className="flex flex-col gap-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter the 6-digit verification code sent to your authenticated admin email address.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[8px] font-mono text-2xl px-4 py-3 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-300 focus:border-emerald-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Expires in: <strong className="text-emerald-400 font-mono">{Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}</strong></span>
                  <button
                    type="button"
                    onClick={() => setAdminStep(1)}
                    className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                  >
                    Back to Secret ID
                  </button>
                </div>
                <div className="flex justify-end gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(false)}
                    className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {adminLoading ? 'Logging In...' : 'Verify & Unlock Admin'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ------------------------- Lightbox Modal for High-Res Inspection ------------------------- */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#100727] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.4)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#140b33] border-b border-emerald-500/20 flex justify-between items-center">
              <div>
                <h4 className="text-white font-bold text-base md:text-lg">{activeModal.title}</h4>
                {activeModal.desc && (
                  <p className="text-violet-300 text-xs mt-0.5">{activeModal.desc}</p>
                )}
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors text-lg cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img 
                src={activeModal.img} 
                alt={activeModal.title} 
                className="max-w-full max-h-[72vh] object-contain rounded-xl"
              />
            </div>

            <div className="px-6 py-3 bg-[#140b33] border-t border-emerald-500/20 flex justify-between items-center text-xs text-white/60">
              <span>Full Resolution Showcase</span>
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600 text-white font-semibold transition-colors cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
