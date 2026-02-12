/**
 * HeroSection Component
 *
 * A dramatic, full-viewport hero section showcasing the #1 best-performing business.
 * Features floating stat cards, glow effects, and elegant typography matching the
 * Stoicism-inspired dark design reference.
 *
 * @component
 */
import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Business } from "../../lib/api";

interface HeroSectionProps {
  /** All available businesses to determine the featured one */
  allBusinesses: Business[];
  /** Callback when "Explore Bio" CTA is clicked */
  onExploreBio?: (business: Business) => void;
}

/**
 * Floating Stats Card Component
 * Displays a stat with a label and optional trend indicator
 */

const HeroSection = ({ allBusinesses, onExploreBio }: HeroSectionProps) => {
  // Get the best performing business (highest health score)
  const featuredBusiness = useMemo(() => {
    if (!allBusinesses.length) return null;
    return [...allBusinesses].sort(
      (a, b) => b.health_score - a.health_score,
    )[0];
  }, [allBusinesses]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen bg-bg-primary overflow-hidden flex flex-col">
      {/* Background Layer - Immersive & Subtle */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${featuredBusiness?.avatar_url || "/images/spotlight_africa.png"}")`,
            filter: "grayscale(1) brightness(0.4) contrast(1.1)",
          }}
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-bg-primary via-bg-primary/50 to-transparent" />
      </div>

      {/* Main Content Container - Centered horizontally but allows edge bleeding */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          {/* Left Column: Semantic Info & Branding (Span 7) */}
          <div className="lg:col-span-7 space-y-8 lg:pr-12">
            {/* Aesthetic Vertical Accent + Section Label */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <div className="w-px h-12 bg-accent-gold" />
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold font-bold">
                  Spotlight Africa
                </span>
                <p className="text-white/40 text-xs font-serif italic">
                  Showcase of Excellence
                </p>
              </div>
            </motion.div>

            {/* Main Title & Description */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-white leading-[0.9] tracking-tighter">
                  {featuredBusiness?.name || "The Vision"}
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-white/60 text-lg md:text-xl max-w-xl font-light leading-relaxed"
              >
                {featuredBusiness?.description ||
                  "Defining the new standard of African business performance and innovation."}
              </motion.p>
            </div>

            {/* Meta Stats Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-4"
            >
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  Health Score
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-light text-accent-gold">
                    {featuredBusiness?.health_score}%
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-glow-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  Industry
                </p>
                <div className="text-xl text-white font-medium">
                  {featuredBusiness?.industry || "Technology"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  Status
                </p>
                <div className="text-secondary uppercase tracking-widest text-xs font-bold border border-secondary/20 px-3 py-1 rounded-full">
                  {featuredBusiness?.category || "Pioneer"}
                </div>
              </div>
            </motion.div>

            {/* CTA Container */}
            <motion.div variants={itemVariants} className="pt-8">
              <button
                onClick={() =>
                  featuredBusiness && onExploreBio?.(featuredBusiness)
                }
                className="group btn-outline-gold py-5 px-10 flex items-center gap-3"
              >
                <span className="text-sm font-bold tracking-widest uppercase text-white">
                  Explore Business Bio
                </span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Dramatic Image Frame (Span 5) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 relative"
          >
            {/* The Frame */}
            <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full max-w-md mx-auto overflow-hidden group">
              {/* Outer Decorative Border */}
              <div className="absolute inset-2 border border-white/10 transition-all duration-700 group-hover:inset-0 group-hover:border-accent-gold/40" />

              {featuredBusiness?.avatar_url ? (
                <img
                  src={featuredBusiness.avatar_url}
                  alt={featuredBusiness.name}
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                  <span className="text-[15rem] font-heading font-bold text-white/5 select-none">
                    S
                  </span>
                </div>
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-transparent opacity-60" />
            </div>

            {/* Background Decorative Text Layer */}
            <div className="absolute -top-10 -right-20 pointer-events-none select-none hidden xl:block">
              <span className="text-[20rem] font-bold text-white/[0.02] tracking-tighter leading-none italic uppercase">
                Spot
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Bottom - Visual Tie-in for the Reveal Section */}
      <div className="relative z-20 w-full flex justify-center pb-12">
        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="flex flex-col items-center gap-4 group cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold group-hover:text-white/60 transition-colors">
            Discover More
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-accent-gold/40 group-hover:bg-accent-gold transition-colors"
          />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
