import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Globe,
  Zap,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createBusiness } from "../lib/api";

const RegisterBusinessPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    category: "startup",
    description: "",
    website: "",
    avatar_url: `https://picsum.photos/seed/${Math.random()}/200`,
    is_featured: false,
    is_public: true,
    health_score: 50,
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createBusiness(formData);

      // Update local storage with new token and role
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);

      // Go to success/payment step
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to register business");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border ${
                    step >= s
                      ? "bg-accent-gold border-accent-gold text-bg-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 border-white/10 text-white/30"
                  }`}
                >
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-px mx-2 ${step > s ? "bg-accent-gold" : "bg-white/10"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] mb-1">
              Step {step} of 3
            </p>
            <h2 className="text-white font-heading font-medium tracking-tight">
              {step === 1 && "Identity Selection"}
              {step === 2 && "Business Portfolio"}
              {step === 3 && "Ecosystem Integration"}
            </h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="max-w-2xl">
                <h1 className="text-5xl font-heading font-bold text-white mb-6 uppercase tracking-tighter">
                  Define Your{" "}
                  <span className="text-accent-gold italic">Presence.</span>
                </h1>
                <p className="text-white/40 text-lg font-serif italic leading-relaxed">
                  Choose the category that best represents your role in the
                  African economic renaissance.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    id: "startup",
                    label: "Startup",
                    icon: <Zap size={24} />,
                    desc: "Early stage high-growth potential ventures.",
                  },
                  {
                    id: "innovator",
                    label: "Innovator",
                    icon: <Globe size={24} />,
                    desc: "Established companies driving technological change.",
                  },
                  {
                    id: "mentor",
                    label: "Mentor",
                    icon: <ShieldCheck size={24} />,
                    desc: "Industry leaders guiding the next generation.",
                  },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFormData({ ...formData, category: cat.id });
                      handleNext();
                    }}
                    className={`p-8 text-left border transition-all duration-500 group relative overflow-hidden ${
                      formData.category === cat.id
                        ? "bg-white/5 border-accent-gold"
                        : "bg-white/2 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`mb-6 transition-colors ${formData.category === cat.id ? "text-accent-gold" : "text-white/20 group-hover:text-white"}`}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-white/40 font-serif leading-relaxed italic">
                      {cat.desc}
                    </p>

                    {formData.category === cat.id && (
                      <motion.div
                        layoutId="active-cat"
                        className="absolute bottom-0 left-0 w-full h-1 bg-accent-gold"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-white/2 border-b border-white/10 px-0 py-4 text-2xl font-heading text-white focus:outline-none focus:border-accent-gold transition-colors placeholder:text-white/5"
                        placeholder="e.g. Nile Dynamics"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.industry}
                        onChange={(e) =>
                          setFormData({ ...formData, industry: e.target.value })
                        }
                        className="w-full bg-white/2 border-b border-white/10 px-0 py-4 text-xl text-white focus:outline-none focus:border-accent-gold transition-colors placeholder:text-white/5"
                        placeholder="e.g. Agri-Tech"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                        Official Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="w-full bg-white/2 border-b border-white/10 px-0 py-4 text-lg text-white/70 focus:outline-none focus:border-accent-gold transition-colors placeholder:text-white/5"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                        Executive Summary
                      </label>
                      <textarea
                        rows={6}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-white/2 border border-white/10 p-6 text-sm text-white focus:outline-none focus:border-accent-gold transition-colors placeholder:text-white/5 leading-relaxed font-serif italic"
                        placeholder="Briefly describe your vision and mission..."
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] hover:text-white transition-colors"
                  >
                    Back to identity
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-12 py-4 flex items-center gap-4 group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      {loading ? "Registering..." : "Finalize Portfolio"}
                    </span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 py-10"
            >
              <div className="max-w-xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center text-accent-gold mx-auto mb-8">
                  <CreditCard size={40} />
                </div>
                <h1 className="text-4xl font-heading font-bold text-white uppercase tracking-tighter">
                  Tier-1 Verification
                </h1>
                <p className="text-white/40 text-lg font-serif italic leading-relaxed">
                  Join the elite tier to unlock real-time analytics, investor
                  pipelines, and featured status across the ecosystem.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {/* M-PESA Placeholder */}
                <div className="glass p-8 border-accent-gold/20 flex flex-col items-center text-center space-y-6 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-1">
                      M-PESA Express
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      Instant Activation
                    </p>
                  </div>
                  <button
                    disabled
                    className="w-full py-3 bg-secondary/80 text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Card Placeholder */}
                <div className="glass p-8 border-white/5 flex flex-col items-center text-center space-y-6 relative group overflow-hidden">
                  <div className="w-12 h-12 bg-white/5 text-white/40 rounded-full flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-1">
                      International Terminal
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      Standard Processing
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] max-w-xs mx-auto">
                Securely processed by Spotlight Africa Infrastructure.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterBusinessPage;
