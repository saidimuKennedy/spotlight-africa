/**
 * BusinessPage Component
 *
 * Dynamic business detail page showing full business information
 * with user interactions: likes, comments, and inquiries.
 *
 * Route: /business/:id
 *
 * @component
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Globe,
  TrendingUp,
  Users,
  Building2,
  Target,
} from "lucide-react";
import {
  Business,
  Comment as APIComment,
  fetchBusiness,
  fetchComments,
  addComment,
  likeBusiness,
  submitInquiry,
  trackView,
  trackConversion,
} from "../lib/api";

import Comment from "./dashboard/component/Comment";
import StatCard from "./dashboard/component/StatCard";
import AuthModal from "../components/AuthModal";
import Toast, { ToastType } from "../components/Toast";

const BusinessPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    title: "",
    message: "",
  });

  // Toast State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const [comment, setComment] = useState("");
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<APIComment[]>([]);

  // Helper to trigger auth modal
  const triggerAuth = (title: string, message: string) => {
    setAuthModalConfig({ title, message });
    setShowAuthModal(true);
  };

  // Fetch business data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [bizData, commentsData] = await Promise.all([
          fetchBusiness(id),
          fetchComments(id),
          trackView(id),
        ]);
        setBusiness(bizData);
        setLikeCount(bizData.like_count || 0);
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to load business details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle like toggle
  const handleLike = async () => {
    if (!id) return;
    try {
      await likeBusiness(id);
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        triggerAuth(
          "Join the Spotlight",
          "Only verified network members can endorse businesses with a pulse.",
        );
      } else {
        console.error("Failed to like:", error);
      }
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;

    try {
      await addComment(id, comment);
      // Refresh comments
      const freshComments = await fetchComments(id);
      setComments(freshComments);
      setComment("");
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        triggerAuth(
          "Share Your Voice",
          "Sign in to join the conversation and build your professional profile.",
        );
      } else {
        console.error("Failed to post comment:", error);
      }
    }
  };

  // Handle inquiry submission
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirySubject.trim() || !inquiryMessage.trim() || !id) return;

    try {
      await submitInquiry(id, inquirySubject, inquiryMessage);
      showToast("Inquiry sent successfully!", "success");
      setShowInquiryForm(false);
      setInquirySubject("");
      setInquiryMessage("");
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        triggerAuth(
          "Reach Out",
          "Authenticate to send direct inquiries and partnership proposals.",
        );
      } else {
        console.error("Failed to send inquiry:", error);
        showToast(error.message, "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-heading font-bold text-white">
          Business Not Found
        </h1>
        <button onClick={() => navigate("/")} className="btn-outline-gold">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Optimized with Masking */}
      <section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-bg-primary">
        {/* Hero Image with Edge Masking */}
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            maskImage: "linear-gradient(to bottom, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 80%, transparent)",
          }}
        >
          {business.avatar_url ? (
            <img
              src={business.avatar_url}
              alt={business.name}
              className="w-full h-full object-cover grayscale-[0.3]"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-bg-surface to-bg-primary" />
          )}

          {/* Moody Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-transparent" />
        </div>

        {/* Backdrop Ambient Glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, var(--color-accent-gold) 0%, transparent 70%)",
          }}
        />
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 -mt-24 md:-mt-40 mb-12 md:mb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Business Header - North Star Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
              <div className="flex flex-col items-start md:items-start flex-1">
                {/* Categorization */}
                <div className="flex items-center flex-wrap gap-4 mb-6">
                  <span className="px-5 py-2 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.2em]">
                    {business.category}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] font-serif italic">
                    {business.industry || "General"}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white tracking-tighter mb-4 leading-[0.9]">
                  {business.name}
                </h1>
              </div>

              {/* Quick Health Indicator */}
              <div className="flex items-center gap-6 pb-4 md:pb-2 border-b border-white/10 w-full md:w-auto">
                <div className="flex-1 md:flex-none md:text-right">
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">
                    Health Score
                  </div>
                  <div className="text-4xl font-heading font-bold text-accent-gold">
                    {business.health_score}%
                  </div>
                </div>
                <div className="w-14 h-14 bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                  <TrendingUp className="text-accent-gold" size={28} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section - Editorial Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative p-6 sm:p-12 bg-white/5 border border-white/5"
              >
                <div className="absolute top-0 left-0 w-1 h-20 bg-accent-gold" />

                <h2 className="text-xs font-bold text-accent-gold uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                  <Building2 size={14} />
                  Foundational Story
                </h2>

                <div className="space-y-6">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white/90 leading-tight">
                    {business.description
                      ? `"${business.description}"`
                      : '"This week have lucky; I wash it next."'}
                  </p>

                  <div className="w-20 h-px bg-white/20" />

                  <p className="text-body-lg text-white/50 leading-relaxed font-light">
                    Founded with a vision to revolutionize the market, this
                    enterprise embodies the "Discovery" spirit of the African
                    economic landscape. Their operation stands as a testament to
                    resilience and strategic innovation.
                  </p>
                </div>

                {business.website && (
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (id) trackConversion(id);
                      }}
                      className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent-gold transition-colors"
                    >
                      <Globe size={16} className="text-accent-gold" />
                      Explore Official Domain
                      <ArrowLeft
                        size={14}
                        className="rotate-180 group-hover:translate-x-2 transition-transform"
                      />
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-6 sm:p-8"
              >
                <h2 className="heading-subsection text-white mb-6 flex items-center gap-3">
                  <MessageCircle size={20} className="text-accent-gold" />
                  Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-bg-surface border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <Comment
                        key={c.id}
                        author={c.user?.email.split("@")[0] || "User"}
                        content={c.content}
                        date={new Date(c.created_at).toLocaleDateString()}
                      />
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white/5 border border-white/5">
                      <p className="text-white/30 font-serif italic">
                        No comments yet. Be the first to start the conversation.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card-elevated p-6 space-y-4"
              >
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center gap-3 py-4 border transition-all ${
                    liked
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : "bg-bg-surface border-white/10 text-white/70 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Heart size={20} fill={liked ? "currentColor" : "none"} />
                  <span className="font-medium">
                    {likeCount.toLocaleString()} Likes
                  </span>
                </button>

                {/* Inquiry Button */}
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full btn-primary py-4 gap-3"
                >
                  <Send size={18} />
                  Send Inquiry
                </button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <StatCard
                  icon={<TrendingUp size={18} />}
                  value={business.health_score}
                  label="Health Score"
                />
                <StatCard
                  icon={<Heart size={18} />}
                  value={likeCount}
                  label="Likes"
                  color="text-primary"
                />
                <StatCard
                  icon={<MessageCircle size={18} />}
                  value={comments.length}
                  label="Comments"
                  color="text-secondary"
                />
                <StatCard
                  icon={<Users size={18} />}
                  value="45"
                  label="Inquiries"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInquiryForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg card-elevated p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-gold/20 flex items-center justify-center">
                  <Target size={20} className="text-accent-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-white">
                    Send Inquiry
                  </h3>
                  <p className="text-sm text-white/50">to {business.name}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    placeholder="What's your inquiry about?"
                    className="w-full px-4 py-3 bg-bg-surface border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Message
                  </label>
                  <textarea
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={4}
                    className="w-full px-4 py-3 bg-bg-surface border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50 resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="flex-1 py-3 bg-bg-surface border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-3">
                    Send Inquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        {...authModalConfig}
      />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};

export default BusinessPage;
