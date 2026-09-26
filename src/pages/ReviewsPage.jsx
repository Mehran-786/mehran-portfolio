import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getSiteUrl, getR2Url } from '../config/env';

const VERDICTS = ["Excellent", "Good", "Average", "Needs work"];

// Fallback SVG video poster for uploaded videos
const DEFAULT_VIDEO_POSTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="%23050f09"/><circle cx="200" cy="112" r="32" fill="%2310b981" opacity="0.85"/><polygon points="192,98 216,112 192,126" fill="%23ffffff"/><text x="200" y="165" fill="%2394a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Video Attachment</text></svg>`;

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffSec = Math.floor((now - past) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export default function ReviewsPage() {
  // Tri-State Theme: 'default' | 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('mr_reviews_theme') || 'default';
    } catch {
      return 'default';
    }
  });

  // User Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mr_review_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin session state - derived exclusively from signed cookie via /api/auth/session-check
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminStep, setAdminStep] = useState(1); // 1 = Secret ID, 2 = 6-digit OTP
  const [secretIdInput, setSecretIdInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [adminChallengeId, setAdminChallengeId] = useState('');
  const [adminError, setAdminError] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNameInput, setAuthNameInput] = useState('');
  const [authEmailInput, setAuthEmailInput] = useState('');

  // Change Password Modal state (Part 2)
  const [showChangeSecretModal, setShowChangeSecretModal] = useState(false);
  const [currentSecretInput, setCurrentSecretInput] = useState('');
  const [newSecretInput, setNewSecretInput] = useState('');
  const [confirmSecretInput, setConfirmSecretInput] = useState('');
  const [changeSecretError, setChangeSecretError] = useState('');
  const [changeSecretSuccess, setChangeSecretSuccess] = useState('');
  const [changeSecretLoading, setChangeSecretLoading] = useState(false);

  // Delete Confirmation Modal state (A3)
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // 'review' | 'reply'
    reviewId: null,
    replyId: null,
    textSnippet: '',
    r2Keys: [],
  });
  const deleteModalCancelRef = useRef(null);
  const deleteTriggerRef = useRef(null);

  // Pending action when auth required
  const [pendingAction, setPendingAction] = useState(null);

  // Reviews Data - loaded from shared PostgreSQL database
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [loadReviewsError, setLoadReviewsError] = useState(null);

  // Form state
  const [formRating, setFormRating] = useState(5);
  const [formVerdict, setFormVerdict] = useState("Excellent");
  const [formBody, setFormBody] = useState("");
  const [formAttachments, setFormAttachments] = useState([]); // [{ id, name, size, type, key, url, uploadProgress, abortController }]
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Animated Feedback Modal states (replacing static bottom bar)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFeedbackClosing, setIsFeedbackClosing] = useState(false);

  // Guest fields for non-authenticated reviewers
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Math CAPTCHA Anti-Bot states
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Replying state
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Filters & Sorting (project filter removed per A1)
  const [filterRating, setFilterRating] = useState("ALL");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // Lightbox
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Refs
  const threadEndRef = useRef(null);
  const composerRef = useRef(null);
  const otpInputsRef = useRef([]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem('mr_reviews_theme', theme);
    } catch {}
  }, [theme]);

  // Fetch reviews from Postgres DB
  const fetchReviews = useCallback(async (adminMode = isAdmin) => {
    setIsLoadingReviews(true);
    setLoadReviewsError(null);
    try {
      const url = adminMode ? '/api/reviews?admin=true' : '/api/reviews';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`);
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.reviews || []);
      setReviews(list);
    } catch (err) {
      console.error('[Fetch Reviews Error]', err);
      setLoadReviewsError(err.message || 'Failed to load reviews from server.');
    } finally {
      setIsLoadingReviews(false);
    }
  }, [isAdmin]);

  // Check admin session on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/session-check')
      .then(res => res.json())
      .then(data => {
        if (mounted && data && typeof data.isAdmin === 'boolean') {
          setIsAdmin(data.isAdmin);
          if (data.isAdmin) {
            fetchReviews(true);
          }
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [fetchReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // VisualViewport API listener for mobile keyboard shifts (F9)
  useEffect(() => {
    const handleViewportResize = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport.height}px`);
      }
    };
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('scroll', handleViewportResize);
    handleViewportResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('scroll', handleViewportResize);
    };
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (showAdminModal && adminStep === 2 && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          if (prev === 240) setCanResend(true); // enabled after 60s
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAdminModal, adminStep, otpCountdown]);

  // Auto-scroll to bottom of thread on initial load
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Tri-State Theme Toggle (strictly adhering to rules)
  const handleToggleDark = () => {
    setTheme(theme === 'dark' ? 'default' : 'dark');
  };

  const handleToggleLight = () => {
    setTheme(theme === 'light' ? 'default' : 'light');
  };

  // User Auth Submit
  const handleUserAuthSubmit = (e) => {
    e.preventDefault();
    if (!authNameInput.trim() || authNameInput.length < 2 || authNameInput.length > 50) {
      setAuthError("Name must be between 2 and 50 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authEmailInput.trim())) {
      setAuthError("Please provide a valid email address.");
      return;
    }
    const user = { name: authNameInput.trim(), email: authEmailInput.trim() };
    setCurrentUser(user);
    try {
      localStorage.setItem('mr_review_user', JSON.stringify(user));
    } catch {}
    setShowAuthModal(false);
    setAuthError("");

    if (pendingAction === 'submit_review') {
      executeReviewSubmit(user);
    }
    setPendingAction(null);
  };

  // Admin Login Step 1: Request OTP
  const handleAdminRequestOtp = async (e) => {
    e.preventDefault();
    setAdminError('');
    if (!secretIdInput.trim()) {
      setAdminError("Please enter your secret ID.");
      return;
    }

    try {
      const res = await fetch('/api/auth/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretId: secretIdInput.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setAdminStep(2);
        setOtpCountdown(300);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setAdminChallengeId(data.challengeId || '');
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
      } else {
        setAdminError(data.error || "Authentication failed.");
      }
    } catch {
      setAdminError("Network error. Please try again.");
    }
  };

  // Admin Login Step 2: Verify OTP
  const handleAdminVerifyOtp = async (codeToVerify) => {
    const fullCode = codeToVerify || otpDigits.join('');
    if (fullCode.length !== 6) {
      setAdminError("Please enter all 6 digits.");
      return;
    }

    setAdminError('');
    try {
      const res = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode, challengeId: adminChallengeId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdmin(true);
        fetchReviews(true);
        setShowAdminModal(false);
        setAdminStep(1);
        setSecretIdInput('');
        setOtpDigits(['', '', '', '', '', '']);
        setAdminChallengeId('');
      } else {
        setAdminError(data.error || "Invalid code. Please try again.");
      }
    } catch {
      setAdminError("Verification error. Please try again.");
    }
  };

  // 6-digit OTP input handlers with auto-advance and paste support (C4)
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      // Pasted full code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        const newDigits = pasted.split('');
        setOtpDigits(newDigits);
        otpInputsRef.current[5]?.focus();
        handleAdminVerifyOtp(pasted);
        return;
      }
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every(d => d !== '') && newDigits.join('').length === 6) {
      handleAdminVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsAdmin(false);
  };

  const handleChangeSecretSubmit = async (e) => {
    e.preventDefault();
    setChangeSecretError('');
    setChangeSecretSuccess('');

    if (!currentSecretInput) {
      setChangeSecretError('Current secret ID is required.');
      return;
    }
    if (!newSecretInput || newSecretInput.length < 12) {
      setChangeSecretError('New secret ID must be at least 12 characters long.');
      return;
    }
    if (newSecretInput !== confirmSecretInput) {
      setChangeSecretError('New secret ID and confirmation do not match.');
      return;
    }

    setChangeSecretLoading(true);
    try {
      const res = await fetch('/api/auth/change-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSecretId: currentSecretInput,
          newSecretId: newSecretInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangeSecretError(data.error || 'Failed to update password.');
        setChangeSecretLoading(false);
        return;
      }
      setChangeSecretSuccess('Password updated successfully.');
      setCurrentSecretInput('');
      setNewSecretInput('');
      setConfirmSecretInput('');
      setTimeout(() => {
        setShowChangeSecretModal(false);
        setChangeSecretSuccess('');
      }, 1800);
    } catch {
      setChangeSecretError('An unexpected network error occurred.');
    } finally {
      setChangeSecretLoading(false);
    }
  };

  // Direct R2 presigned file upload via XMLHttpRequest with real progress (D1-D4)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formAttachments.length + files.length > 5) {
      setFormErrors(prev => ({ ...prev, attachments: "Maximum 5 attachments allowed total." }));
      return;
    }

    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const isVid = ['mp4', 'webm', 'mov'].includes(ext);
      const isDoc = ['pdf', 'zip', 'doc', 'docx'].includes(ext);

      if (!isImg && !isVid && !isDoc) {
        setFormErrors(prev => ({ ...prev, attachments: `File '${file.name}' has an unsupported file format.` }));
        continue;
      }

      if (isImg && file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, attachments: `Image '${file.name}' exceeds 5MB.` }));
        continue;
      }
      if (isVid && file.size > 50 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, attachments: `Video '${file.name}' exceeds 50MB.` }));
        continue;
      }
      if (isDoc && file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, attachments: `Document '${file.name}' exceeds 10MB.` }));
        continue;
      }

      const tempId = Math.random().toString(36).substring(2, 9);
      const abortController = new AbortController();

      // Placeholder attachment with progress
      const newAtt = {
        id: tempId,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: isImg ? 'image' : isVid ? 'video' : 'file',
        key: '',
        url: URL.createObjectURL(file),
        poster: isVid ? DEFAULT_VIDEO_POSTER : null,
        uploadProgress: 0,
        isUploading: true,
        abortController,
      };

      setFormAttachments(prev => [...prev, newAtt]);
      setFormErrors(prev => ({ ...prev, attachments: null }));

      // Request presigned PUT URL from serverless API
      try {
        const presignRes = await fetch('/api/r2/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || (isImg ? 'image/jpeg' : isVid ? 'video/mp4' : 'application/pdf'),
            fileSize: file.size,
          }),
        });

        const presignData = await presignRes.json();
        if (!presignRes.ok || !presignData.uploadUrl) {
          throw new Error(presignData.error || 'Presign failed');
        }

        // Direct XHR PUT directly to Cloudflare R2 (bypasses Vercel 4.5MB limit)
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignData.uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            setFormAttachments(prev => prev.map(a => a.id === tempId ? { ...a, uploadProgress: percent } : a));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setFormAttachments(prev => prev.map(a => a.id === tempId ? {
              ...a,
              key: presignData.key,
              url: presignData.publicUrl,
              uploadProgress: 100,
              isUploading: false,
            } : a));
          } else {
            setFormErrors(prev => ({ ...prev, attachments: `Failed to upload ${file.name}.` }));
            setFormAttachments(prev => prev.filter(a => a.id !== tempId));
          }
        };

        xhr.onerror = () => {
          setFormErrors(prev => ({ ...prev, attachments: `Network error uploading ${file.name}.` }));
          setFormAttachments(prev => prev.filter(a => a.id !== tempId));
        };

        abortController.signal.addEventListener('abort', () => xhr.abort());
        xhr.send(file);
      } catch (err) {
        setFormErrors(prev => ({ ...prev, attachments: `Could not initialize upload for ${file.name}: ${err.message}` }));
        setFormAttachments(prev => prev.filter(a => a.id !== tempId));
      }
    }
  };

  const removeAttachment = (id) => {
    const att = formAttachments.find(a => a.id === id);
    if (att?.abortController) {
      att.abortController.abort();
    }
    // If uploaded, delete from R2
    if (att?.key) {
      fetch('/api/r2/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: [att.key] }),
      }).catch(() => {});
    }
    setFormAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Fetch Math CAPTCHA question from backend
  const fetchNewCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaError('');
    try {
      const res = await fetch('/api/reviews?action=captcha');
      if (res.ok) {
        const data = await res.json();
        setCaptchaQuestion(data.question);
        setCaptchaToken(data.token);
      } else {
        const n1 = Math.floor(Math.random() * 8) + 2;
        const n2 = Math.floor(Math.random() * 6) + 1;
        setCaptchaQuestion(`What is ${n1} + ${n2}?`);
      }
    } catch {
      const n1 = Math.floor(Math.random() * 8) + 2;
      const n2 = Math.floor(Math.random() * 6) + 1;
      setCaptchaQuestion(`What is ${n1} + ${n2}?`);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Open & Close handlers with scatter/contract animation timing
  const openFeedbackModal = useCallback(() => {
    setIsFeedbackClosing(false);
    setIsFeedbackOpen(true);
    setCaptchaAnswer('');
    setCaptchaError('');
    setFormErrors({});
    fetchNewCaptcha();
  }, [fetchNewCaptcha]);

  const closeFeedbackModal = useCallback(() => {
    if (isFeedbackClosing) return;
    setIsFeedbackClosing(true);
    setTimeout(() => {
      setIsFeedbackOpen(false);
      setIsFeedbackClosing(false);
    }, 280);
  }, [isFeedbackClosing]);

  // Submit Review Flow
  const onReviewFormSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formBody.trim() || formBody.trim().length < 10) {
      errors.body = "Review text must be at least 10 characters.";
    } else if (formBody.trim().length > 1000) {
      errors.body = "Review text cannot exceed 1000 characters.";
    }

    if (formAttachments.some(a => a.isUploading)) {
      errors.attachments = "Please wait for file uploads to finish.";
    }

    if (!isAdmin && (!captchaAnswer || String(captchaAnswer).trim() === '')) {
      setCaptchaError("Please solve the anti-bot math verification question.");
      return;
    }

    let activeUser = currentUser;
    if (!activeUser && !isAdmin) {
      if (!guestName.trim() || guestName.trim().length < 2) {
        errors.name = "Please enter your name (at least 2 characters).";
      } else {
        activeUser = {
          name: guestName.trim(),
          email: guestEmail.trim() || '',
        };
        setCurrentUser(activeUser);
        try {
          localStorage.setItem('mr_review_user', JSON.stringify(activeUser));
        } catch {}
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    executeReviewSubmit(activeUser);
  };

  const executeReviewSubmit = async (user) => {
    setIsSubmitting(true);
    setCaptchaError('');
    const cleanBody = formBody.replace(/<[^>]*>?/gm, '').trim();

    const payload = {
      name: isAdmin ? "Mehran Rasool" : (user?.name || guestName || "Anonymous Reviewer"),
      email: isAdmin ? "mehranrasool.sp24@gmail.com" : (user?.email || guestEmail || ""),
      rating: formRating,
      verdict: formVerdict,
      body: cleanBody,
      mathAnswer: captchaAnswer,
      mathToken: captchaToken,
      attachments: formAttachments.map(a => ({
        id: a.id,
        name: a.name,
        size: a.size,
        type: a.type,
        key: a.key,
        url: a.key ? getR2Url(a.key) : a.url,
        poster: a.poster || DEFAULT_VIDEO_POSTER,
      })),
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes('math')) {
          setCaptchaError(data.error);
          fetchNewCaptcha();
        }
        throw new Error(data.error || 'Failed to submit review.');
      }

      const newReview = data;
      setReviews(prev => {
        const exists = prev.some(r => r.id === newReview.id);
        if (exists) return prev;
        return [...prev, newReview];
      });

      setSubmitSuccess(true);
      setFormBody("");
      setFormAttachments([]);
      setFormErrors({});
      setCaptchaAnswer("");

      // Smoothly contract back into the trigger button and scroll to new review
      setTimeout(() => {
        closeFeedbackModal();
        setTimeout(() => {
          setSubmitSuccess(false);
          threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }, 700);
    } catch (err) {
      console.error('[Submit Review Error]', err);
      setFormErrors(prev => ({ ...prev, body: err.message || 'Submission failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Approve Review (Admin)
  const handleApproveReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve review.');
      }
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: true } : r));
    } catch (err) {
      console.error('[Approve Review Error]', err);
      alert('Failed to approve review: ' + err.message);
    }
  };

  // Submit Reply Flow
  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;

    if (!currentUser && !isAdmin) {
      setPendingAction(reviewId);
      setShowAuthModal(true);
      return;
    }

    const cleanReply = replyText.replace(/<[^>]*>?/gm, '').trim();
    const payload = {
      name: isAdmin ? "Mehran Rasool" : (currentUser?.name || "Community Member"),
      isOwner: isAdmin,
      body: cleanReply,
    };

    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply.');
      }

      const createdReply = data;
      setReviews(prev => prev.map(rev => {
        if (rev.id === reviewId) {
          return {
            ...rev,
            replies: [...(rev.replies || []), createdReply],
          };
        }
        return rev;
      }));

      setReplyText("");
      setReplyTargetId(null);
    } catch (err) {
      console.error('[Reply Submit Error]', err);
      alert(err.message || 'Could not post reply. Please try again.');
    }
  };

  // Trigger Delete Modal (A3)
  const triggerDeleteReviewModal = (review, triggerEl) => {
    deleteTriggerRef.current = triggerEl;
    const r2Keys = (review.attachments || []).map(a => a.key).filter(Boolean);
    setDeleteModalState({
      isOpen: true,
      type: 'review',
      reviewId: review.id,
      replyId: null,
      textSnippet: review.body.slice(0, 80) + (review.body.length > 80 ? '...' : ''),
      r2Keys,
    });
  };

  const triggerDeleteReplyModal = (reviewId, reply, triggerEl) => {
    deleteTriggerRef.current = triggerEl;
    setDeleteModalState({
      isOpen: true,
      type: 'reply',
      reviewId,
      replyId: reply.id,
      textSnippet: reply.body.slice(0, 80) + (reply.body.length > 80 ? '...' : ''),
      r2Keys: [],
    });
  };

  // Confirm Deletion
  const confirmDeleteAction = async () => {
    if (deleteModalState.type === 'review') {
      try {
        const res = await fetch(`/api/reviews/${deleteModalState.reviewId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete review.');
        }
        setReviews(prev => prev.filter(r => r.id !== deleteModalState.reviewId));
      } catch (err) {
        console.error('[Delete Review Error]', err);
        alert(err.message || 'Could not delete review.');
      }
    } else if (deleteModalState.type === 'reply') {
      setReviews(prev => prev.map(r => {
        if (r.id === deleteModalState.reviewId) {
          return {
            ...r,
            replies: (r.replies || []).filter(rep => rep.id !== deleteModalState.replyId),
          };
        }
        return r;
      }));
    }

    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModalState({ isOpen: false, type: null, reviewId: null, replyId: null, textSnippet: '', r2Keys: [] });
    // Restore focus to triggering button (A3)
    setTimeout(() => deleteTriggerRef.current?.focus(), 50);
  };

  // Keyboard navigation & Focus Trap in Delete Modal (A3)
  useEffect(() => {
    if (!deleteModalState.isOpen) return;

    deleteModalCancelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDeleteModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteModalState.isOpen]);

  // Filtering & Sorting (project filter removed)
  const filteredReviews = reviews
    .filter(r => (isAdmin ? true : r.approved))
    .filter(r => filterRating === "ALL" || r.rating === parseInt(filterRating, 10))
    .filter(r => filterVerdict === "ALL" || r.verdict === filterVerdict)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  const totalReviews = reviews.filter(r => r.approved).length;
  const avgRating = totalReviews > 0
    ? (reviews.filter(r => r.approved).reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.filter(r => r.approved).forEach(r => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  // Dynamic Schema for Reviews
  const REVIEWS_SCHEMA = totalReviews > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Engineering Services & Applications by Mehran Rasool",
    "description": "Client and peer reviews on web development, Flutter apps, and AI security systems built by Mehran Rasool.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews,
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": reviews.filter(r => r.approved).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      "reviewBody": r.body,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating,
        "bestRating": "5",
        "worstRating": "1",
      },
    })),
  } : null;

  return (
    <>
      <SEO
        title="Client Reviews — Mehran Rasool"
        description="Read client and peer reviews for Mehran Rasool's full-stack development, Flutter mobile apps, and software engineering work."
        canonical={getSiteUrl('/reviews')}
        jsonLd={REVIEWS_SCHEMA}
      />

      <Navbar />

      <div className="mr-reviews-root" data-theme={theme}>
        <style>{reviewsCss}</style>

        <main className="mr-reviews-page">
          {/* Header & Tri-State Toggle Bar */}
          <header className="mr-rev-header">
            <div className="mr-header-top">
              <div>
                <span className="mr-rev-kicker">Feedback Community</span>
                <h1>Client Reviews & Feedback</h1>
                <p className="mr-rev-sub">
                  Transparent reviews, discussions, and threaded replies on Mehran Rasool's production applications, Flutter mobile codebases, and applied AI systems.
                </p>
              </div>

              {/* Floating Controls */}
              <div className="mr-controls-bar">
                {/* Tri-State Theme Toggle */}
                <div className="mr-tri-toggle" role="group" aria-label="Theme mode switcher">
                  <button
                    type="button"
                    className={`mr-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={handleToggleDark}
                    aria-pressed={theme === 'dark'}
                  >
                    DARK
                  </button>
                  <button
                    type="button"
                    className={`mr-toggle-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={handleToggleLight}
                    aria-pressed={theme === 'light'}
                  >
                    LIGHT
                  </button>
                </div>

                {/* Admin Status / Trigger */}
                {isAdmin ? (
                  <div className="mr-admin-badge-group">
                    <span className="mr-admin-active-badge">👑 Admin Active</span>
                    <button
                      onClick={() => {
                        setCurrentSecretInput('');
                        setNewSecretInput('');
                        setConfirmSecretInput('');
                        setChangeSecretError('');
                        setChangeSecretSuccess('');
                        setShowChangeSecretModal(true);
                      }}
                      className="mr-btn-ghost text-xs"
                    >
                      Change Password
                    </button>
                    <button onClick={handleAdminLogout} className="mr-btn-ghost text-xs">Logout</button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAdminStep(1);
                      setAdminError('');
                      setShowAdminModal(true);
                    }}
                    className="mr-admin-trigger-btn"
                    title="Site Owner Admin Access"
                    aria-label="Admin Login"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Admin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pinned Aggregate Summary Card */}
            <div className="mr-aggregate-card">
              <div className="mr-agg-score">
                <span className="mr-big-number">{avgRating}</span>
                <div className="mr-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={`mr-star ${s <= Math.round(Number(avgRating)) ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <span className="mr-agg-count">Based on {totalReviews} verified review{totalReviews !== 1 ? 's' : ''}</span>
              </div>

              <div className="mr-agg-bars">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingCounts[rating] || 0;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="mr-bar-row">
                      <span className="mr-bar-label">{rating} ★</span>
                      <div className="mr-bar-track">
                        <div className="mr-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="mr-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters & Sorting Bar (project filter removed per A1) */}
            <div className="mr-filter-bar">
              <div className="mr-filter-group">
                <label htmlFor="filter-rating">Rating:</label>
                <select
                  id="filter-rating"
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="mr-select"
                >
                  <option value="ALL">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="mr-filter-group">
                <label htmlFor="filter-verdict">Verdict:</label>
                <select
                  id="filter-verdict"
                  value={filterVerdict}
                  onChange={(e) => setFilterVerdict(e.target.value)}
                  className="mr-select"
                >
                  <option value="ALL">All Verdicts</option>
                  {VERDICTS.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="mr-filter-group">
                <label htmlFor="filter-sort">Sort:</label>
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mr-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              <button
                type="button"
                onClick={openFeedbackModal}
                className="mr-btn-write-review ml-auto"
                id="btn-header-leave-feedback"
              >
                <span className="text-amber-400">★</span>
                <span>Leave Feedback</span>
                <span>✏️</span>
              </button>
            </div>
          </header>

          {/* Chat Thread */}
          <section className="mr-chat-thread" aria-label="Review messages thread">
            {isLoadingReviews ? (
              <div className="mr-skeleton-thread">
                {[1, 2, 3].map(i => (
                  <div key={i} className="mr-skeleton-card">
                    <div className="mr-skeleton-header">
                      <div className="mr-skeleton-avatar"></div>
                      <div className="mr-skeleton-lines">
                        <div className="mr-skeleton-line short"></div>
                        <div className="mr-skeleton-line tiny"></div>
                      </div>
                    </div>
                    <div className="mr-skeleton-body">
                      <div className="mr-skeleton-line full"></div>
                      <div className="mr-skeleton-line medium"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : loadReviewsError ? (
              <div className="mr-error-thread">
                <p className="text-red-400 font-semibold mb-2">⚠️ {loadReviewsError}</p>
                <button
                  type="button"
                  onClick={fetchReviews}
                  className="mr-submit-btn mr-touch-btn"
                >
                  🔄 Retry Loading Reviews
                </button>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="mr-empty-thread">
                <p className="text-xl font-semibold mb-2">No reviews match your filters yet.</p>
                <p className="text-sm opacity-75">Be the first to share your experience with Mehran's engineering work below!</p>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <article key={rev.id} className="mr-message-bubble">
                  {/* Bubble Header */}
                  <div className="mr-bubble-header">
                    <div className="mr-author-info">
                      <div className="mr-avatar">
                        {rev.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mr-author-name">{rev.name}</span>
                          <span className="mr-verdict-chip">{rev.verdict}</span>
                          {rev.approved === false && (
                            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              Pending Approval
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mr-bubble-meta">
                      <div className="mr-star-rating" aria-label={`${rev.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} className={s <= rev.rating ? 'mr-star filled' : 'mr-star'}>★</span>
                        ))}
                      </div>
                      <time className="mr-timestamp">{timeAgo(rev.createdAt)}</time>
                      {isAdmin && rev.approved === false && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="mr-1 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                          title="Approve review for public display"
                        >
                          ✓ Approve
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={(e) => triggerDeleteReviewModal(rev, e.currentTarget)}
                          className="mr-delete-btn"
                          title="Delete review (Admin)"
                          aria-label={`Delete review by ${rev.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bubble Body */}
                  <div className="mr-bubble-body">
                    <p>{rev.body}</p>
                  </div>

                  {/* Attachments */}
                  {rev.attachments && rev.attachments.length > 0 && (
                    <div className="mr-attachments-grid">
                      {rev.attachments.map(att => (
                        <div key={att.id} className="mr-att-item">
                          {att.type === 'image' && (
                            <img
                              src={att.url || getR2Url(att.key)}
                              alt={att.name}
                              className="mr-att-img"
                              onClick={() => setActiveLightboxImg(att.url || getR2Url(att.key))}
                            />
                          )}
                          {att.type === 'video' && (
                            <video
                              src={att.url || getR2Url(att.key)}
                              poster={att.poster || DEFAULT_VIDEO_POSTER}
                              controls
                              preload="metadata"
                              className="mr-att-vid"
                            />
                          )}
                          {att.type === 'file' && (
                            <a href={att.url || getR2Url(att.key)} download={att.name} className="mr-att-file">
                              <span>📄 {att.name}</span>
                              <span className="text-xs opacity-60">({att.size})</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Threaded Replies */}
                  {rev.replies && rev.replies.length > 0 && (
                    <div className="mr-replies-list">
                      {rev.replies.map(reply => (
                        <div key={reply.id} className={`mr-reply-bubble ${reply.isOwner ? 'owner' : ''}`}>
                          <div className="mr-reply-head">
                            <span className="mr-reply-author">
                              {reply.name}
                              {/* Changed to "Verified" per A2 */}
                              {reply.isOwner && <span className="mr-owner-badge">Verified</span>}
                            </span>
                            <div className="flex items-center gap-2">
                              <time className="mr-timestamp">{timeAgo(reply.createdAt)}</time>
                              {isAdmin && (
                                <button
                                  onClick={(e) => triggerDeleteReplyModal(rev.id, reply, e.currentTarget)}
                                  className="mr-delete-btn text-xs"
                                  title="Delete reply (Admin)"
                                  aria-label="Delete reply"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mr-reply-body">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Action Trigger */}
                  <div className="mr-bubble-footer">
                    {replyTargetId === rev.id ? (
                      <div className="mr-reply-composer">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${rev.name}...`}
                          className="mr-reply-input"
                          maxLength={300}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleReplySubmit(rev.id);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(rev.id)}
                          className="mr-btn-send-reply"
                        >
                          Send
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyTargetId(null)}
                          className="mr-btn-ghost text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTargetId(rev.id);
                          setReplyText("");
                        }}
                        className="mr-btn-reply-action"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
            <div ref={threadEndRef} />
          </section>

          {/* Floating Action Trigger Button with Stars & Pencil Icon */}
          <button
            type="button"
            onClick={openFeedbackModal}
            className="mr-feedback-fab"
            aria-label="Open feedback form"
            id="btn-leave-feedback-fab"
          >
            <span className="mr-fab-stars" aria-hidden="true">✨ ⭐</span>
            <span className="mr-fab-pencil" aria-hidden="true">✏️</span>
            <span className="mr-fab-label">Leave Feedback</span>
          </button>

          {/* Animated Feedback Modal with Scatter / Contract Transition */}
          {isFeedbackOpen && (
            <div
              className={`mr-feedback-backdrop ${isFeedbackClosing ? 'closing' : 'opening'}`}
              onClick={closeFeedbackModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
            >
              <div
                className={`mr-feedback-modal ${isFeedbackClosing ? 'contracting' : 'scattering'}`}
                onClick={(e) => e.stopPropagation()}
                ref={composerRef}
              >
                <form onSubmit={onReviewFormSubmit}>
                  {/* Modal Top Header */}
                  <div className="mr-composer-top">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐ ✏️</span>
                      <h3 id="feedback-modal-title" className="mr-composer-title">Share Your Feedback</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentUser && (
                        <span className="mr-current-user-tag hidden sm:inline">
                          Signed in as <strong>{currentUser.name}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentUser(null);
                              try { localStorage.removeItem('mr_review_user'); } catch {}
                            }}
                            className="ml-1 underline opacity-70 hover:opacity-100 text-xs"
                          >
                            (change)
                          </button>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={closeFeedbackModal}
                        className="mr-modal-close-btn"
                        aria-label="Close feedback modal"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Guest Name & Email if not authenticated */}
                  {!currentUser && !isAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-slate-300">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => {
                            setGuestName(e.target.value);
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                          }}
                          placeholder="e.g. Alex Morgan"
                          className="mr-input w-full"
                        />
                        {formErrors.name && <p className="mr-error-msg">{formErrors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider block mb-1 text-slate-300">Your Email <span className="opacity-60 text-xs font-normal lowercase">(for reply notification)</span></label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="e.g. alex@example.com"
                          className="mr-input w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Star Rating & Verdict Controls */}
                  <div className="mr-form-meta-row">
                    <div className="mr-field">
                      <label>Star Rating</label>
                      <div
                        className="mr-stars-input"
                        role="radiogroup"
                        aria-label="Star rating"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowRight' && formRating < 5) setFormRating(formRating + 1);
                          if (e.key === 'ArrowLeft' && formRating > 1) setFormRating(formRating - 1);
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            role="radio"
                            aria-checked={formRating === star}
                            aria-label={`${star} star`}
                            onClick={() => setFormRating(star)}
                            className={`mr-star-btn ${star <= formRating ? 'active' : ''}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mr-field">
                      <label>Verdict</label>
                      <div className="mr-verdict-chips" role="radiogroup">
                        {VERDICTS.map((v) => (
                          <button
                            type="button"
                            key={v}
                            role="radio"
                            aria-checked={formVerdict === v}
                            onClick={() => setFormVerdict(v)}
                            className={`mr-chip-btn ${formVerdict === v ? 'active' : ''}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Textarea */}
                  <div className="mr-textarea-wrap">
                    <textarea
                      value={formBody}
                      onChange={(e) => setFormBody(e.target.value)}
                      placeholder="Share your honest feedback on Mehran's engineering work, applications, and systems (10 to 1,000 characters)..."
                      rows={3}
                      maxLength={1000}
                      className="mr-textarea"
                    />
                    <div className="mr-textarea-counter">
                      {formBody.length} / 1000
                    </div>
                  </div>
                  {formErrors.body && <p className="mr-error-msg">{formErrors.body}</p>}

                  {/* Anti-Bot Math Challenge */}
                  {!isAdmin && (
                    <div className="mr-captcha-box">
                      <div className="mr-captcha-header">
                        <span className="mr-captcha-title">🛡️ Anti-Bot Verification</span>
                        <button
                          type="button"
                          onClick={fetchNewCaptcha}
                          className="mr-captcha-refresh"
                          title="Get new math question"
                        >
                          🔄 New Question
                        </button>
                      </div>
                      <div className="mr-captcha-calc">
                        <span className="mr-captcha-q">{captchaLoading ? "Loading..." : (captchaQuestion || "What is 7 + 5?")}</span>
                        <span className="text-emerald-400 font-bold text-lg">=</span>
                        <input
                          type="number"
                          value={captchaAnswer}
                          onChange={(e) => {
                            setCaptchaAnswer(e.target.value);
                            if (captchaError) setCaptchaError('');
                          }}
                          placeholder="Answer"
                          className="mr-captcha-input"
                          required
                        />
                        <span className="text-xs text-slate-400 hidden sm:inline">Solves automated spam so review posts instantly!</span>
                      </div>
                      {captchaError && <p className="mr-error-msg mt-1.5">{captchaError}</p>}
                    </div>
                  )}

                  {/* Attachments Preview Row with upload progress */}
                  {formAttachments.length > 0 && (
                    <div className="mr-composer-att-previews">
                      {formAttachments.map((att) => (
                        <div key={att.id} className="mr-comp-att-pill">
                          <span>{att.type === 'image' ? '🖼️' : att.type === 'video' ? '🎬' : '📄'} {att.name}</span>
                          {att.isUploading ? (
                            <div className="mr-upload-progress-wrap">
                              <span className="text-xs text-emerald-400 font-mono">{att.uploadProgress}%</span>
                              <button type="button" onClick={() => removeAttachment(att.id)} className="text-red-400 ml-1 text-xs" title="Cancel upload">✕</button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => removeAttachment(att.id)} aria-label={`Remove ${att.name}`}>✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.attachments && <p className="mr-error-msg">{formErrors.attachments}</p>}

                  {/* Composer Actions Bottom Row */}
                  <div className="mr-composer-actions pt-2 border-t border-emerald-950/60 mt-3">
                    <div className="flex items-center gap-3">
                      <label className="mr-upload-btn" title="Add up to 5 attachments (Images <= 5MB, Video <= 50MB, Docs <= 10MB)">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov,.pdf,.zip,.doc,.docx"
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>Attach Files</span>
                      </label>
                      <span className="text-xs text-slate-400 opacity-80 hidden sm:inline">Images, video, or PDF (up to 5 files)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeFeedbackModal}
                        className="mr-btn-ghost text-xs py-2 px-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || formAttachments.some(a => a.isUploading)}
                        className="mr-submit-btn flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-emerald-300 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <span>Posting...</span>
                          </>
                        ) : submitSuccess ? (
                          "✓ Review Posted Live!"
                        ) : (
                          "Post Feedback"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* Delete Confirmation Modal (A3) */}
        {deleteModalState.isOpen && (
          <div className="mr-modal-backdrop" onClick={closeDeleteModal}>
            <div
              className="mr-modal-panel mr-modal-delete"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <h3 id="delete-modal-title" className="text-xl font-bold text-red-400">Delete this review?</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">
                This can't be undone.
              </p>
              {deleteModalState.textSnippet && (
                <div className="mr-delete-preview-box">
                  "{deleteModalState.textSnippet}"
                </div>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  ref={deleteModalCancelRef}
                  onClick={closeDeleteModal}
                  className="mr-btn-ghost mr-touch-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAction}
                  className="mr-btn-destructive mr-touch-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Auth Modal */}
        {showAuthModal && (
          <div className="mr-modal-backdrop" onClick={() => setShowAuthModal(false)}>
            <div className="mr-modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <h3>Quick Verification</h3>
              <p className="text-sm opacity-80 mb-4">
                Please enter your Name and Email to post feedback or join the discussion. Your email is never displayed publicly.
              </p>
              <form onSubmit={handleUserAuthSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={authNameInput}
                    onChange={(e) => setAuthNameInput(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="mr-input w-full"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="mr-input w-full"
                  />
                </div>
                {authError && <p className="mr-error-msg">{authError}</p>}
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="mr-btn-ghost mr-touch-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mr-submit-btn mr-touch-btn"
                  >
                    Continue & Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Login 2-Step OTP Modal (C1-C4) */}
        {showAdminModal && (
          <div className="mr-modal-backdrop" onClick={() => setShowAdminModal(false)}>
            <div className="mr-modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold">Admin Two-Step Login</h3>
              </div>

              {adminStep === 1 ? (
                /* Step 1: Secret ID */
                <form onSubmit={handleAdminRequestOtp} className="flex flex-col gap-3.5">
                  <p className="text-sm opacity-80 mb-2">
                    Enter your Admin Secret ID to receive a 6-digit verification code sent to your email.
                  </p>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Secret ID</label>
                    <input
                      type="password"
                      required
                      value={secretIdInput}
                      onChange={(e) => setSecretIdInput(e.target.value)}
                      placeholder="Enter secret ID..."
                      className="mr-input w-full"
                      autoFocus
                    />
                  </div>
                  {adminError && <p className="mr-error-msg">{adminError}</p>}
                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="mr-btn-ghost mr-touch-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="mr-submit-btn mr-touch-btn"
                    >
                      Send Verification Code
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: 6-digit OTP code entry (C4) */
                <div className="flex flex-col gap-3.5">
                  <p className="text-sm opacity-80 mb-1">
                    A 6-digit verification code has been emailed to your admin address. It expires in <strong>{Math.floor(otpCountdown / 60)}:{String(otpCountdown % 60).padStart(2, '0')}</strong>.
                  </p>

                  <div className="mr-otp-boxes-wrap">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpInputsRef.current[idx] = el}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="mr-otp-box"
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {adminError && <p className="mr-error-msg">{adminError}</p>}

                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      disabled={!canResend}
                      onClick={handleAdminRequestOtp}
                      className="mr-btn-ghost text-xs disabled:opacity-40"
                    >
                      {canResend ? "Resend code" : "Resend code (60s)"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAdminModal(false)}
                        className="mr-btn-ghost mr-touch-btn"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdminVerifyOtp()}
                        className="mr-submit-btn mr-touch-btn"
                      >
                        Verify & Login
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Change Password / Secret ID Modal (Part 2) */}
        {showChangeSecretModal && (
          <div className="mr-modal-backdrop" onClick={() => !changeSecretLoading && setShowChangeSecretModal(false)}>
            <div className="mr-modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔑</span>
                <h3 className="text-xl font-bold">Change Admin Secret ID</h3>
              </div>
              <form onSubmit={handleChangeSecretSubmit} className="flex flex-col gap-3.5">
                <p className="text-sm opacity-80 mb-1">
                  Update your admin secret password. The new secret must be at least 12 characters long.
                </p>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Current Secret ID</label>
                  <input
                    type="password"
                    required
                    value={currentSecretInput}
                    onChange={(e) => setCurrentSecretInput(e.target.value)}
                    placeholder="Enter current secret ID..."
                    className="mr-input w-full"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1">New Secret ID</label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    value={newSecretInput}
                    onChange={(e) => setNewSecretInput(e.target.value)}
                    placeholder="Enter new secret ID..."
                    className="mr-input w-full"
                  />
                  <span className="text-[11px] text-white/50 block mt-1">Minimum 12 characters required</span>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Confirm New Secret ID</label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    value={confirmSecretInput}
                    onChange={(e) => setConfirmSecretInput(e.target.value)}
                    placeholder="Confirm new secret ID..."
                    className="mr-input w-full"
                  />
                </div>

                {changeSecretError && <p className="mr-error-msg">{changeSecretError}</p>}
                {changeSecretSuccess && (
                  <p className="text-emerald-400 text-sm font-semibold p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {changeSecretSuccess}
                  </p>
                )}

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangeSecretModal(false)}
                    className="mr-btn-ghost mr-touch-btn"
                    disabled={changeSecretLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mr-submit-btn mr-touch-btn"
                    disabled={changeSecretLoading}
                  >
                    {changeSecretLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pinch-Friendly Lightbox for Images (F13) */}
        {activeLightboxImg && (
          <div className="mr-lightbox-backdrop" onClick={() => setActiveLightboxImg(null)}>
            <div className="mr-lightbox-content">
              <img src={activeLightboxImg} alt="Review attachment enlarged" />
              <button className="mr-lightbox-close" onClick={() => setActiveLightboxImg(null)} aria-label="Close enlarged image">✕</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

// Glassmorphism and Mobile/Zoom CSS (F1-F13)
const reviewsCss = `
/* Theme definitions using relative rem units */
.mr-reviews-root[data-theme="default"],
.mr-reviews-root {
  --rev-bg: #050f09;
  --rev-panel-bg: rgba(10, 25, 16, 0.45);
  --rev-panel-border: rgba(16, 185, 129, 0.2);
  --rev-bubble-bg: rgba(15, 35, 24, 0.55);
  --rev-bubble-border: rgba(52, 211, 153, 0.2);
  --rev-reply-bg: rgba(6, 18, 12, 0.6);
  --rev-text: #f1f5f9;
  --rev-text-muted: #94a3b8;
  --rev-accent: #10b981;
  --rev-accent-glow: rgba(16, 185, 129, 0.35);
  --rev-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.4);
  --rev-blur: blur(16px) saturate(140%);
}

.mr-reviews-root[data-theme="dark"] {
  --rev-bg: #030704;
  --rev-panel-bg: rgba(8, 18, 12, 0.88);
  --rev-panel-border: rgba(16, 185, 129, 0.3);
  --rev-bubble-bg: rgba(12, 24, 16, 0.92);
  --rev-bubble-border: rgba(52, 211, 153, 0.25);
  --rev-reply-bg: rgba(5, 12, 8, 0.95);
  --rev-text: #f8fafc;
  --rev-text-muted: #a1a1aa;
  --rev-accent: #34d399;
  --rev-accent-glow: rgba(52, 211, 153, 0.4);
  --rev-shadow: 0 1.25rem 3rem rgba(0, 0, 0, 0.7);
  --rev-blur: blur(20px) saturate(160%);
}

.mr-reviews-root[data-theme="light"] {
  --rev-bg: #f0fdf4;
  --rev-panel-bg: rgba(255, 255, 255, 0.82);
  --rev-panel-border: rgba(16, 185, 129, 0.35);
  --rev-bubble-bg: rgba(255, 255, 255, 0.9);
  --rev-bubble-border: rgba(16, 185, 129, 0.25);
  --rev-reply-bg: rgba(240, 253, 244, 0.95);
  --rev-text: #064e3b;
  --rev-text-muted: #047857;
  --rev-accent: #059669;
  --rev-accent-glow: rgba(5, 150, 105, 0.25);
  --rev-shadow: 0 1rem 2.25rem rgba(5, 150, 105, 0.12);
  --rev-blur: blur(16px) saturate(120%);
}

/* Base Container with dynamic viewport height (F3) */
.mr-reviews-root {
  background: var(--rev-bg);
  color: var(--rev-text);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  min-height: 100svh;
  min-height: 100dvh;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  overflow-x: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .mr-reviews-root, .mr-toggle-btn, .mr-message-bubble {
    transition: none !important;
  }
}

.mr-reviews-page {
  max-width: 60rem;
  margin: 0 auto;
  padding: clamp(5rem, 10vw, 7.5rem) clamp(1rem, 4vw, 2rem) clamp(9rem, 16vw, 14rem);
  box-sizing: border-box;
}

.mr-rev-kicker {
  color: var(--rev-accent);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.mr-reviews-page h1 {
  font-size: clamp(1.85rem, 4.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
}

.mr-rev-sub {
  color: var(--rev-text-muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 55ch;
  margin: 0;
}

.mr-header-top {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .mr-header-top {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

/* Floating Tri-State Toggle & Admin Trigger (F7: 44px min hit targets) */
.mr-controls-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.mr-tri-toggle {
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 9999px;
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
  box-shadow: var(--rev-shadow);
}

.mr-toggle-btn {
  min-height: 2.75rem; /* 44px touch target */
  min-width: 3.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--rev-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mr-toggle-btn.active {
  background: var(--rev-accent);
  color: #ffffff;
  box-shadow: 0 0 0.75rem var(--rev-accent-glow);
}

.mr-toggle-btn:focus-visible {
  outline: 2px solid var(--rev-accent);
  outline-offset: 2px;
}

.mr-admin-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem; /* 44px touch target */
  padding: 0.5rem 0.9rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  color: var(--rev-text);
  cursor: pointer;
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
  transition: all 0.2s ease;
}

.mr-admin-trigger-btn:hover, .mr-admin-trigger-btn:focus-visible {
  border-color: var(--rev-accent);
  color: var(--rev-accent);
  outline: 2px solid var(--rev-accent);
  outline-offset: 2px;
}

.mr-admin-active-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
}

/* Aggregate Card */
.mr-aggregate-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  border-radius: 1rem;
  padding: 1.5rem 1.75rem;
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
  box-shadow: var(--rev-shadow);
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .mr-aggregate-card {
    grid-template-columns: 12.5rem 1fr;
    align-items: center;
  }
}

.mr-big-number {
  font-size: 3.25rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
}

.mr-stars-row {
  display: flex;
  gap: 0.15rem;
  font-size: 1.25rem;
  margin: 0.4rem 0;
}

.mr-star {
  color: rgba(148, 163, 184, 0.4);
}
.mr-star.filled {
  color: #f59e0b;
}

.mr-agg-count {
  font-size: 0.8125rem;
  color: var(--rev-text-muted);
}

.mr-agg-bars {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mr-bar-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
}

.mr-bar-label {
  width: 2.25rem;
  font-weight: 600;
  color: var(--rev-text-muted);
}

.mr-bar-track {
  flex: 1;
  height: 0.5rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.2);
  overflow: hidden;
}

.mr-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 9999px;
}

.mr-bar-count {
  width: 1.75rem;
  text-align: right;
  color: var(--rev-text-muted);
}

/* Filter Bar */
.mr-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.75rem;
  padding: 0.85rem 1.25rem;
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
}

.mr-filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.mr-select {
  background: rgba(0, 0, 0, 0.25);
  color: var(--rev-text);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.375rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.8125rem;
  min-height: 2.5rem;
}

/* Chat Thread & Bubbles */
.mr-chat-thread {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 5rem;
  scroll-padding-bottom: 6rem;
}

.mr-message-bubble {
  background: var(--rev-bubble-bg);
  border: 1px solid var(--rev-bubble-border);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
  box-shadow: var(--rev-shadow);
  word-break: break-word;
}

.mr-bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
}

.mr-author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mr-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669, #0d9488);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9375rem;
  flex-shrink: 0;
}

.mr-author-name {
  font-size: 0.9375rem;
  font-weight: 700;
}

.mr-verdict-chip {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.15);
  color: var(--rev-accent);
  border: 1px solid var(--rev-bubble-border);
}

.mr-bubble-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.mr-timestamp {
  font-size: 0.75rem;
  color: var(--rev-text-muted);
}

.mr-delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  min-width: 2.75rem; /* 44px touch target */
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 1.125rem;
}

.mr-delete-btn:hover, .mr-delete-btn:focus-visible {
  background: rgba(239, 68, 68, 0.15);
  outline: 2px solid #ef4444;
}

.mr-bubble-body {
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

/* Attachments */
.mr-attachments-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mr-att-img {
  width: 5.5rem;
  height: 5.5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid var(--rev-panel-border);
  cursor: zoom-in;
}

.mr-att-vid {
  max-width: 16rem;
  border-radius: 0.5rem;
}

.mr-att-file {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--rev-panel-border);
  color: var(--rev-text);
  text-decoration: none;
  font-size: 0.8125rem;
}

/* Threaded Replies */
.mr-replies-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-left: clamp(0.75rem, 3vw, 1.5rem);
  border-left: 2px solid var(--rev-panel-border);
}

.mr-reply-bubble {
  background: var(--rev-reply-bg);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.mr-reply-bubble.owner {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(6, 35, 20, 0.75);
}

.mr-reply-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.mr-reply-author {
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Verified badge (A2) */
.mr-owner-badge {
  background: #10b981;
  color: #000000;
  font-size: 0.625rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.mr-reply-body {
  font-size: 0.875rem;
  line-height: 1.55;
  margin: 0;
}

.mr-btn-reply-action {
  min-height: 2.75rem; /* 44px touch target */
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  border: 1px solid var(--rev-panel-border);
  color: var(--rev-text-muted);
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.mr-btn-reply-action:hover, .mr-btn-reply-action:focus-visible {
  color: var(--rev-accent);
  border-color: var(--rev-accent);
  outline: 2px solid var(--rev-accent);
}

.mr-reply-composer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.mr-reply-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--rev-panel-border);
  color: var(--rev-text);
  padding: 0.5rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  min-height: 2.75rem;
}

.mr-btn-send-reply {
  background: var(--rev-accent);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 1.1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

/* Animated Floating Action Button (FAB) with Stars & Pencil */
.mr-feedback-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1.45rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  animation: mrFabFloat 4s ease-in-out infinite;
}

.mr-feedback-fab:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6), 0 0 0 2px rgba(52, 211, 153, 0.4);
}

.mr-feedback-fab:active {
  transform: translateY(0) scale(0.97);
}

@keyframes mrFabFloat {
  0%, 100% {
    transform: translateY(0);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.45);
  }
  50% {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px rgba(16, 185, 129, 0.6);
  }
}

.mr-fab-stars {
  font-size: 1.15rem;
  display: inline-flex;
  animation: mrStarTwinkle 2.5s ease-in-out infinite;
}

@keyframes mrStarTwinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(12deg); opacity: 0.85; filter: drop-shadow(0 0 6px #f59e0b); }
}

.mr-fab-pencil {
  font-size: 1.15rem;
  display: inline-flex;
  animation: mrPencilWiggle 3s ease-in-out infinite;
}

@keyframes mrPencilWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-12deg); }
  75% { transform: rotate(8deg); }
}

@media (max-width: 640px) {
  .mr-feedback-fab {
    bottom: 1.25rem;
    right: 1.25rem;
    padding: 0.75rem 1.15rem;
    font-size: 0.875rem;
  }
}

/* Header Trigger Button */
.mr-btn-write-review {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mr-btn-write-review:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: #10b981;
  color: #ffffff;
  transform: translateY(-1px);
}

/* Animated Feedback Modal Backdrop */
.mr-feedback-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: opacity 0.28s ease;
}

.mr-feedback-backdrop.opening {
  opacity: 1;
}

.mr-feedback-backdrop.closing {
  opacity: 0;
}

/* Feedback Modal Panel (originates/scatters from bottom-right FAB) */
.mr-feedback-modal {
  position: relative;
  width: 100%;
  max-width: 44rem;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  border-radius: 1.25rem;
  padding: 1.5rem;
  backdrop-filter: var(--rev-blur);
  -webkit-backdrop-filter: var(--rev-blur);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15);
  transform-origin: bottom right;
}

.mr-feedback-modal.scattering {
  animation: mrFeedbackScatter 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.mr-feedback-modal.contracting {
  animation: mrFeedbackContract 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes mrFeedbackScatter {
  0% {
    opacity: 0;
    transform: scale(0.15) translate(120px, 120px) rotate(-6deg);
    filter: blur(8px);
  }
  65% {
    opacity: 1;
    transform: scale(1.02) translate(-6px, -6px) rotate(1deg);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(0, 0) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes mrFeedbackContract {
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0) rotate(0deg);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.12) translate(120px, 120px) rotate(-8deg);
    filter: blur(6px);
  }
}

.mr-modal-close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.mr-modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #f87171;
  transform: rotate(90deg);
}

/* Math CAPTCHA Anti-Bot Box */
.mr-captcha-box {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.85rem;
}

.mr-captcha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.mr-captcha-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #34d399;
}

.mr-captcha-refresh {
  background: transparent;
  border: none;
  color: var(--rev-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
}

.mr-captcha-refresh:hover {
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
}

.mr-captcha-calc {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mr-captcha-q {
  font-family: monospace;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.mr-captcha-input {
  width: 5.5rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 0.375rem;
  padding: 0.35rem 0.65rem;
  color: #f1f5f9;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  outline: none;
}

.mr-captcha-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.mr-composer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.mr-composer-title {
  font-size: 0.9375rem;
  font-weight: 700;
}

.mr-current-user-tag {
  font-size: 0.75rem;
  color: var(--rev-text-muted);
}

.mr-form-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 0.65rem;
}

.mr-stars-input {
  display: inline-flex;
  gap: 0.15rem;
}

/* Star Buttons: 44x44px touch target (F7) */
.mr-star-btn {
  background: transparent;
  border: none;
  font-size: 1.35rem;
  color: rgba(148, 163, 184, 0.4);
  cursor: pointer;
  min-width: 2.75rem;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.mr-star-btn.active {
  color: #f59e0b;
}

.mr-verdict-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.mr-chip-btn {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--rev-panel-border);
  border-radius: 9999px;
  min-height: 2.75rem; /* 44px hit area */
  padding: 0.4rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--rev-text-muted);
  cursor: pointer;
}

.mr-chip-btn.active {
  background: rgba(16, 185, 129, 0.25);
  border-color: var(--rev-accent);
  color: var(--rev-accent);
}

.mr-textarea-wrap {
  position: relative;
  margin-bottom: 0.5rem;
}

.mr-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--rev-text);
  font-family: inherit;
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 4.5rem;
  box-sizing: border-box;
}

.mr-textarea:focus {
  outline: 2px solid var(--rev-accent);
}

.mr-textarea-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.6875rem;
  color: var(--rev-text-muted);
}

.mr-composer-att-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.mr-comp-att-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.375rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
}

.mr-comp-att-pill button {
  min-width: 1.75rem;
  min-height: 1.75rem;
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mr-composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

/* Tap-to-open file upload fallback (F10) */
.mr-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem; /* 44px touch target */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--rev-panel-border);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--rev-text);
}

.mr-upload-btn:hover, .mr-upload-btn:focus-within {
  border-color: var(--rev-accent);
  outline: 2px solid var(--rev-accent);
}

.mr-submit-btn {
  background: linear-gradient(135deg, #059669, #0d9488);
  color: #ffffff;
  border: 1px solid #10b981;
  min-height: 2.75rem; /* 44px touch target */
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 1rem var(--rev-accent-glow);
}

.mr-submit-btn:hover, .mr-submit-btn:focus-visible {
  box-shadow: 0 0 1.5rem rgba(16, 185, 129, 0.6);
  outline: 2px solid #34d399;
}

.mr-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Delete Button Destructive */
.mr-btn-destructive {
  background: #dc2626;
  color: #ffffff;
  border: 1px solid #ef4444;
  min-height: 2.75rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}
.mr-btn-destructive:hover, .mr-btn-destructive:focus-visible {
  background: #b91c1c;
  outline: 2px solid #f87171;
  outline-offset: 2px;
}

.mr-delete-preview-box {
  background: rgba(0, 0, 0, 0.35);
  border-left: 3px solid #ef4444;
  padding: 0.65rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: #cbd5e1;
  font-style: italic;
  margin: 0.75rem 0;
  word-break: break-word;
}

.mr-btn-ghost {
  min-height: 2.75rem;
  padding: 0.5rem 1.1rem;
  background: transparent;
  border: 1px solid var(--rev-panel-border);
  color: var(--rev-text-muted);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8125rem;
}

.mr-btn-ghost:hover, .mr-btn-ghost:focus-visible {
  color: var(--rev-text);
  border-color: var(--rev-accent);
  outline: 2px solid var(--rev-accent);
}

.mr-error-msg {
  color: #ef4444;
  font-size: 0.75rem;
  margin: 0.25rem 0;
}

/* Modals with Full-Screen Responsive Sheet below 480px (F11) */
.mr-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
  box-sizing: border-box;
}

.mr-modal-panel {
  background: var(--rev-panel-bg);
  border: 1px solid var(--rev-panel-border);
  border-radius: 1rem;
  padding: 1.75rem;
  max-width: 28rem;
  width: 100%;
  backdrop-filter: var(--rev-blur);
  box-shadow: var(--rev-shadow);
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 480px) {
  .mr-modal-panel {
    max-width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
    padding: 2rem 1.25rem calc(2rem + env(safe-area-inset-bottom, 0px));
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.mr-input {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--rev-panel-border);
  border-radius: 0.5rem;
  padding: 0.65rem 0.85rem;
  color: var(--rev-text);
  font-size: 0.875rem;
  min-height: 2.75rem;
  box-sizing: border-box;
}

.mr-input:focus {
  outline: 2px solid var(--rev-accent);
}

/* 6-box OTP entry UI (C4, F7) */
.mr-otp-boxes-wrap {
  display: flex;
  gap: clamp(0.35rem, 2vw, 0.75rem);
  justify-content: center;
  margin: 1.25rem 0;
}

.mr-otp-box {
  width: clamp(2.5rem, 11vw, 3.25rem);
  height: clamp(2.75rem, 12vw, 3.75rem);
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid var(--rev-panel-border);
  border-radius: 0.5rem;
  color: #34d399;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  font-family: monospace;
}

.mr-otp-box:focus {
  border-color: #10b981;
  outline: 2px solid #10b981;
  background: rgba(16, 185, 129, 0.1);
}

/* Pinch-Friendly Lightbox (F13) */
.mr-lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 70;
  padding: 1rem;
  touch-action: pan-x pan-y pinch-zoom;
}

.mr-lightbox-content {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
}

.mr-lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 0.75rem;
  touch-action: pinch-zoom;
}

.mr-lightbox-close {
  position: absolute;
  top: -2.75rem;
  right: 0;
  min-width: 2.75rem;
  min-height: 2.75rem;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Skeleton Loading & Error Banner */
.mr-skeleton-thread {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.mr-skeleton-card {
  background: var(--rev-bubble-bg);
  border: 1px solid var(--rev-bubble-border);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: var(--rev-blur);
}
.mr-skeleton-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.mr-skeleton-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.2);
  animation: mr-pulse 1.8s ease-in-out infinite;
}
.mr-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.mr-skeleton-line {
  height: 0.75rem;
  border-radius: 0.25rem;
  background: rgba(16, 185, 129, 0.15);
  animation: mr-pulse 1.8s ease-in-out infinite;
}
.mr-skeleton-line.short { width: 35%; }
.mr-skeleton-line.tiny { width: 20%; }
.mr-skeleton-line.full { width: 95%; margin-bottom: 0.5rem; }
.mr-skeleton-line.medium { width: 70%; }
@keyframes mr-pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.8; }
}
.mr-error-thread {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 1rem;
}
`;
