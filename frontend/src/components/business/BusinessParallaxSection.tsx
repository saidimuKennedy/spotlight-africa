/**
 * BusinessParallaxSection Component
 *
 * Displays the top 3 performing businesses in a parallax card arrangement.
 * The 2nd best business is raised and centered, with the 1st and 3rd
 * positioned on either side at different depths.
 *
 * @component
 */
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Zap, Award } from "lucide-react";
import { Business } from "../../lib/api";

interface BusinessParallaxSectionProps {
  /** All businesses to select top 3 from */
  allBusinesses: Business[];
  /** Navigation callback when a business is selected */
  onNavigate?: (business: Business) => void;
}

interface BusinessCardProps {
  business: Business;
  rank: 1 | 2 | 3;
  onNavigate?: (business: Business) => void;
}

/**
 * Get rank styling based on position
 */
const getRankStyles = (rank: 1 | 2 | 3) => {
  switch (rank) {
    case 1:
      return {
        scale: "md:scale-95",
        zIndex: "z-20",
        translateY: "md:translate-y-8",
        badge: {
          bg: "bg-secondary/20",
          border: "border-secondary/30",
          text: "text-secondary",
          icon: Award,
        },
        label: "1st Place",
      };
    case 2:
      return {
        scale: "md:scale-105",
        zIndex: "z-30",
        translateY: "md:-translate-y-4",
        badge: {
          bg: "bg-accent-gold/20",
          border: "border-accent-gold/30",
          text: "text-accent-gold",
          icon: Star,
        },
        label: "2nd Place",
      };
    case 3:
      return {
        scale: "md:scale-90",
        zIndex: "z-10",
        translateY: "md:translate-y-12",
        badge: {
          bg: "bg-primary/20",
          border: "border-primary/30",
          text: "text-primary",
          icon: Zap,
        },
        label: "3rd Place",
      };
  }
};

const BusinessCard = ({ business, rank, onNavigate }: BusinessCardProps) => {
  const styles = getRankStyles(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: rank * 0.15 }}
      className={`relative group ${styles.scale} ${styles.zIndex} ${styles.translateY} transition-all duration-500 hover:z-50`}
    >
      {/* The Container - Relative to hold the two faces - Expanded height */}
      <div className="relative w-full h-[520px] cursor-pointer">
        {/* Face 2: The Bottom/Text Layer (Details) */}
        <div className="absolute inset-x-0 bottom-0 h-[280px] bg-white p-8 shadow-2xl transition-all duration-700 ease-out transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end border-b-4 border-accent-gold z-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-accent-gold/10 text-[10px] text-accent-gold font-bold uppercase tracking-widest">
                {business.category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                {business.industry || "Technology"}
              </span>
            </div>

            <h3 className="text-3xl font-heading font-bold text-slate-900 leading-tight tracking-tighter">
              {business.name}
            </h3>

            <p className="text-sm text-slate-500 line-clamp-2 font-serif italic">
              {business.description ||
                "Leading innovation across African markets."}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(business);
              }}
              className="mt-4 w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
            >
              View Strategic Bio
            </button>
          </div>
        </div>

        {/* Face 1: The Top/Image Layer */}
        <div
          className={`
            absolute inset-x-0 top-0 h-[440px] z-10 
            transition-all duration-700 ease-out transform
            group-hover:-translate-y-32
            ${rank === 2 ? "ring-2 ring-accent-gold/40 glow-gold" : "border border-white/5"}
            bg-slate-950 overflow-hidden
          `}
        >
          {business.avatar_url ? (
            <img
              src={business.avatar_url}
              alt={business.name}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-bg-surface to-bg-primary flex items-center justify-center">
              <span className="text-8xl font-heading font-bold text-accent-gold/10">
                {business.name?.charAt(0) || "?"}
              </span>
            </div>
          )}

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-40 transition-opacity" />

          {/* Overlay Info (visible when not hovered) */}
          <div className="absolute inset-x-0 bottom-0 p-6 transform group-hover:translate-y-full transition-transform duration-500">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-accent-gold/20 backdrop-blur-md flex items-center justify-center border border-accent-gold/30">
                <span className="text-xl font-bold text-accent-gold">
                  {rank}
                </span>
              </div>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-widest">
                {business.health_score}% Score
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-heading font-bold text-white uppercase tracking-tight">
              {business.name}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BusinessParallaxSection = ({
  allBusinesses,
  onNavigate,
}: BusinessParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Different parallax speeds for each card position
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -50]); // Left card (1st)
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -25]); // Center card (2nd) - slowest
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -75]); // Right card (3rd) - fastest

  // Get top 3 businesses sorted by health score
  const topBusinesses = useMemo(() => {
    if (!allBusinesses.length) return [];
    return [...allBusinesses]
      .sort((a, b) => b.health_score - a.health_score)
      .slice(0, 3);
  }, [allBusinesses]);

  if (topBusinesses.length === 0) {
    return null;
  }

  // Reorder: [0] = 1st best, [1] = 2nd best, [2] = 3rd best
  // Display order: left (1st), center (2nd), right (3rd)
  const orderedCards = [
    { business: topBusinesses[0], rank: 1 as const, motion: y1 },
    { business: topBusinesses[1], rank: 2 as const, motion: y2 },
    { business: topBusinesses[2], rank: 3 as const, motion: y3 },
  ].filter((card) => card.business); // Filter out undefined businesses

  return (
    <section ref={sectionRef} className="relative pt-48 pb-32 overflow-hidden">
      {/* Section Background */}
      <div className="absolute inset-0 bg-linear-to-b from-bg-secondary via-bg-primary to-bg-secondary" />

      {/* Section Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-36 md:mb-42 lg:mb-50"
        >
          <span className="heading-subsection text-accent-gold">
            Top Performers
          </span>
          <h2 className="heading-section mt-4">
            Africa's <span className="text-accent-gold">Leading</span>{" "}
            Businesses
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto mt-4">
            Discover the most impactful and innovative businesses shaping the
            future of the African continent.
          </p>
        </motion.div>

        {/* Parallax Cards Grid - Expansive 3-card layout */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24">
          {orderedCards.map((card, index) => (
            <motion.div
              key={card.business.id}
              className={`
                w-full max-w-[380px] lg:max-w-[420px] 
                ${index === 1 ? "lg:max-w-[480px]" : ""}
              `}
            >
              <BusinessCard
                business={card.business}
                rank={card.rank}
                onNavigate={onNavigate}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessParallaxSection;
