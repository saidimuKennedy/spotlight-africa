import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageSquare,
  Users,
  TrendingUp,
  Globe,
  Zap,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { fetchNetworkFeed, sendChatMessage, ChatMessage } from "../lib/api";
import AuthModal from "../components/AuthModal";

const NetworkPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFeed = async () => {
    try {
      const data = await fetchNetworkFeed();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
    // Refresh every 10 seconds for a "live" feel
    const interval = setInterval(loadFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await sendChatMessage(newMessage);
      setNewMessage("");
      loadFeed();
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        setShowAuthModal(true);
      } else {
        console.error("Failed to send message:", error);
      }
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.user?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar - Navigation & Trending */}
        <div className="lg:col-span-3 space-y-8 hidden lg:block">
          <div className="card-elevated p-6">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
              Network Pulse
            </h3>
            <div className="space-y-4">
              <SidebarItem
                icon={<Globe size={16} />}
                label="Global Feed"
                active
              />
              <SidebarItem icon={<Zap size={16} />} label="Industry Hubs" />
              <SidebarItem icon={<Users size={16} />} label="Elite Mentors" />
              <SidebarItem
                icon={<TrendingUp size={16} />}
                label="Funding Alerts"
              />
            </div>
          </div>

          <div className="card-elevated p-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 blur-3xl -mr-16 -mt-16 group-hover:bg-accent-gold/20 transition-colors" />
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
              Trending Topics
            </h3>
            <div className="space-y-3">
              <Tag label="#FinTech" count="1.2k" />
              <Tag label="#SustainableAgri" count="850" />
              <Tag label="#FoundersConnect" count="640" />
              <Tag label="#NigeriaStartups" count="420" />
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Search & Welcome */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-white tracking-tighter uppercase mb-4">
              The Spotlight Network
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search the network conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 px-12 py-4 text-white focus:outline-none focus:border-accent-gold/30 transition-all font-light"
              />
            </div>
          </div>

          {/* New Message Input */}
          <form onSubmit={handleSendMessage} className="card-elevated p-1 mb-8">
            <div className="flex items-center gap-4 bg-slate-900/50 p-4">
              <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center shrink-0 border border-accent-gold/20">
                <MessageSquare size={18} className="text-accent-gold" />
              </div>
              <input
                type="text"
                placeholder="Share an insight or ask the network..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-white/20"
              />
              <button
                type="submit"
                disabled={sending}
                className="p-3 bg-accent-gold text-bg-primary hover:brightness-110 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </form>

          {/* Messages List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(3)].map((_, i) => <SkeletonMessage key={i} />)
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <MessageCard key={msg.id} msg={msg} />
                ))
              ) : (
                <div className="p-20 text-center border border-dashed border-white/10">
                  <p className="text-white/30 font-serif italic">
                    The network is quiet. Be the first to speak.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar - Stats & Invitations */}
        <div className="lg:col-span-3 space-y-8 hidden lg:block">
          <div className="card-elevated p-8 text-center">
            <div className="inline-flex p-4 bg-accent-gold/10 rounded-full mb-4">
              <Users size={24} className="text-accent-gold" />
            </div>
            <h4 className="text-xl font-heading font-bold text-white mb-2 uppercase">
              Elite Network
            </h4>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              You are among 2,400+ vetted founders and investors illuminating
              African markets.
            </p>
            <button className="w-full btn-outline-gold py-3 text-[10px]">
              Invite Founder
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              Recent Activity
            </h3>
            <ActivityItem
              text="Sarah from PayStack joined FinTech hub"
              time="2m ago"
            />
            <ActivityItem
              text="Ibrahim shared a funding opportunity"
              time="15m ago"
            />
            <ActivityItem
              text="New mentor available in Logistics"
              time="1h ago"
            />
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Join the Conversation"
        message="Sign in to share your insights with the African business community."
      />
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <button
    className={`w-full flex items-center gap-4 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
      active
        ? "bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold"
        : "text-white/40 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    {label}
  </button>
);

const Tag = ({ label, count }: { label: string; count: string }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <span className="text-[11px] font-bold text-white/60 group-hover:text-accent-gold transition-colors">
      {label}
    </span>
    <span className="text-[10px] text-white/20">{count}</span>
  </div>
);

const MessageCard = ({ msg }: { msg: ChatMessage }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-elevated p-6 group hover:border-white/20 transition-all"
  >
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
        <span className="text-accent-gold/40 font-bold uppercase">
          {msg.user?.email.charAt(0)}
        </span>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              {msg.user?.email.split("@")[0]}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] text-white/30 font-medium">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <ArrowUpRight
            size={14}
            className="text-white/0 group-hover:text-white/20 transition-all"
          />
        </div>
        <p className="text-sm text-white/70 font-serif italic leading-relaxed">
          "{msg.message}"
        </p>
      </div>
    </div>
  </motion.div>
);

const ActivityItem = ({ text, time }: { text: string; time: string }) => (
  <div className="flex gap-3 items-start">
    <div className="w-1 h-1 rounded-full bg-accent-gold mt-1.5 shrink-0" />
    <div>
      <p className="text-[11px] text-white/60 leading-tight">{text}</p>
      <span className="text-[9px] text-white/20 font-bold uppercase">
        {time}
      </span>
    </div>
  </div>
);

const SkeletonMessage = () => (
  <div className="card-elevated p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-white/5" />
      <div className="flex-1 space-y-3">
        <div className="h-2 w-24 bg-white/5" />
        <div className="h-3 w-full bg-white/5" />
        <div className="h-3 w-2/3 bg-white/5" />
      </div>
    </div>
  </div>
);

export default NetworkPage;
