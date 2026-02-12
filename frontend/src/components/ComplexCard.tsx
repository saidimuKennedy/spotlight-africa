import { ArrowUpRight, Edit, Trash2 } from "lucide-react";
import clsx from "clsx";

interface CardProps {
  title: string;
  subtitle: string;
  image?: string;
  score?: number;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ComplexCard = ({
  title,
  subtitle,
  image,
  score,
  className,
  onEdit,
  onDelete,
}: CardProps) => {
  return (
    <div className={clsx("relative group", className)}>
      <div
        className="
          relative z-10 
          bg-[#1A1A1A] 
          h-48
          p-6 flex flex-col justify-between
          before:absolute before:top-0 before:right-0 before:w-20 before:h-20 
          before:bg-[#0A0A0A] before:z-20
          overflow-hidden
        "
      >
        {/* Content */}
        <div className="relative z-10 mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          <h3 className="text-white text-xl font-medium leading-tight">
            {title}
          </h3>
          <p className="text-white/40 text-xs mt-1">{subtitle}</p>
        </div>

        {/* Footer / Stats */}
        <div className="relative z-10 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/20 uppercase tracking-widest mb-1">
              Status
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
                New Lead
              </span>
            </div>
          </div>

          {/* Score Dots */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i <= (score || 3) ? "bg-neon-lime" : "bg-white/10"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {onEdit || onDelete ? (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white/40 hover:text-neon-lime hover:border-neon-lime/30 transition-colors"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/30 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          className="
          absolute top-0 right-0 z-30 
          w-14 h-14 
          flex items-center justify-center 
          text-white/20 hover:text-neon-lime transition-colors
          group-hover:rotate-45 duration-300
        "
        >
          <ArrowUpRight size={24} />
        </button>
      )}

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 rounded-[30px] border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors"></div>
    </div>
  );
};

export default ComplexCard;
