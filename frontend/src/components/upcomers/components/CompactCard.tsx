/**
 * Business Card for the grid
 * @component
 */

import { motion } from "framer-motion";
import { Business } from "../../../lib/api";

interface CompactCardProps {
  business: Business;
  onNavigate?: (business: Business) => void;
  variant?: number;
}

export const CompactCard = ({
  business,
  onNavigate,
  variant = 0,
}: CompactCardProps) => {
  // Determine aspect ratio based on variant to create Pinterest look
  const aspectClass =
    variant === 1
      ? "aspect-[4/5]"
      : variant === 2
        ? "aspect-[3/4]"
        : "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="relative group cursor-pointer mb-6 break-inside-avoid"
      onClick={() => onNavigate?.(business)}
    >
      <div className="relative w-full overflow-hidden">
        {/* Face 2: Hidden Detail Layer (appears below) */}
        <div className="absolute inset-x-0 bottom-0 py-4 px-4 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-accent-gold uppercase tracking-tighter">
              {business.category}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {business.health_score}% Health
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {business.description ||
              "Leading innovation across African markets."}
          </p>
        </div>

        {/* Face 1: Main Image Layer */}
        <div
          className={`relative z-10 ${aspectClass} overflow-hidden bg-slate-900 transition-transform duration-500 group-hover:-translate-y-[85px]`}
        >
          {business.avatar_url ? (
            <img
              src={business.avatar_url}
              alt={business.name}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-bg-surface to-bg-primary flex items-center justify-center">
              <span className="text-4xl font-heading font-bold text-accent-gold/20">
                {business.name?.charAt(0) || "?"}
              </span>
            </div>
          )}

          {/* Default view overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-300" />

          <div className="absolute inset-x-0 bottom-0 p-4 transform group-hover:translate-y-full transition-transform duration-500">
            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-tight truncate">
              {business.name}
            </h3>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">
              {business.industry || "Discovering"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};