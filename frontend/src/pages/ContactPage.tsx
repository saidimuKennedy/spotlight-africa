import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Toast from "../components/Toast";
import { submitPlatformInquiry } from "../lib/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPlatformInquiry(formData);
      setToast({
        isVisible: true,
        message: "Message dispatched. We will synchronize soon.",
        type: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setToast({
        isVisible: true,
        message: "Signal lost. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-20"
        >
          {/* Left: Info */}
          <div className="space-y-12">
            <div>
              <h1 className="heading-hero text-6xl mb-6">Connect.</h1>
              <p className="text-white/40 text-lg font-serif italic max-w-md leading-relaxed">
                Whether you're an investor, an innovator, or a storyteller,
                we're here to synchronize the signal.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold group-hover:border-accent-gold transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">
                    Direct Email
                  </p>
                  <p className="text-white font-medium text-lg">
                    hello@spotlightafrica.co
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold group-hover:border-accent-gold transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">
                    Voice Line
                  </p>
                  <p className="text-white font-medium text-lg">
                    +254 700 000 000
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold group-hover:border-accent-gold transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">
                    Base Instance
                  </p>
                  <p className="text-white font-medium text-lg">
                    Kilimani, Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/2 border border-white/5 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-accent-gold/50 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-accent-gold/50 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-accent-gold/50 outline-none transition-all"
                  placeholder="What is this about?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                  Transmission
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-accent-gold/50 outline-none transition-all resize-none font-serif italic"
                  placeholder="Your message goes here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-accent-gold text-black uppercase font-bold tracking-[0.3em] text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-accent-gold/20"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {isSubmitting ? "Sending..." : "Dispatch Message"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
