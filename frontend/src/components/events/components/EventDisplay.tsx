/**
 * Minimalist Event Display
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface EventDisplayProps {
  title: string;
  date: string;
  location: string;
  imageUrl?: string;
  link?: string;
}

export const EventDisplay = ({
  title,
  date,
  location,
  imageUrl,
  link = "/network",
}: EventDisplayProps) => {
  const navigate = useNavigate();

  return (
    <div className="group cursor-pointer" onClick={() => navigate(link)}>
      {/* Image Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-900 mb-8">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <span className="text-white/20 font-heading text-4xl italic">
              Event
            </span>
          </div>
        )}
        {/* Date Overlay - minimal */}
        <div className="absolute top-4 left-4 bg-white/90 px-4 py-2">
          <span className="text-black text-xs font-bold uppercase tracking-widest">
            {date}
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white/40">
          <span>{location}</span>
          <span className="w-4 h-px bg-white/20" />
          <span>Live Event</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-heading font-normal text-white group-hover:text-accent-gold transition-colors duration-300">
          {title}
        </h3>

        <button className="group/btn flex items-center gap-2 text-sm uppercase tracking-widest text-white mt-2">
          <span>Request Invitation</span>
          <ArrowRight
            size={14}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};
