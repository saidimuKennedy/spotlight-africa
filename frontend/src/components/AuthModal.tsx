import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const AuthModal = ({
  isOpen,
  onClose,
  title = "Authentication Required",
  message = "Join the Spotlight network to engage with Africa's premier entrepreneurs.",
}: AuthModalProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-primary/95 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="glass p-8 md:p-10 border border-white/10 relative overflow-hidden group">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-gold/10 border border-accent-gold/20 rounded-full mb-6">
                  <Lock className="text-accent-gold w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white tracking-widest uppercase mb-4">
                  {title}
                </h2>
                <p className="text-sm text-white/40 font-serif italic leading-relaxed">
                  "{message}"
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    onClose();
                    navigate("/auth");
                  }}
                  className="w-full btn-primary py-4 group flex items-center justify-center gap-3"
                >
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em]">
                    Sign In / Register
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-30">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-white" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">
                    Member Access
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
