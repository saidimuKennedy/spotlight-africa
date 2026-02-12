import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="text-accent-gold" size={18} />,
    error: <AlertCircle className="text-red-400" size={18} />,
    info: <Info className="text-blue-400" size={18} />,
  };

  const borders = {
    success: "border-accent-gold/20",
    error: "border-red-500/20",
    info: "border-blue-500/20",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className="fixed top-10 right-10 z-110 pointer-events-auto"
        >
          <div
            className={`glass px-6 py-4 border ${borders[type]} flex items-center gap-4 min-w-[320px] shadow-2xl`}
          >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white flex-1">
              {message}
            </p>
            <button
              onClick={onClose}
              className="text-white/20 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>

            {/* Progress line */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                type === "success"
                  ? "bg-accent-gold"
                  : type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
              } origin-left`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
