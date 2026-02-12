/**
 * SpotlightSection Component
 *
 * Brand identity section explaining what Spotlight Africa is.
 * Features a subtle logo watermark, elegant centered typography,
 * and clean design for a 100vh experience.
 *
 * @component
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SpotlightSectionProps {
  /** Callback when Learn More is clicked */
  onLearnMore?: () => void;
}

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="flex gap-8 group h-full"
  >
    {/* Minimalist Vertical Line */}
    <div className="w-[1.5px] h-full bg-white/20 group-hover:bg-accent-gold transition-colors duration-700 ease-out shrink-0" />

    <div className="flex flex-col py-1">
      {/* Small Category Label */}
      <span className="text-[10px] uppercase tracking-[0.3em] text-accent-gold/40 mb-4 font-semibold group-hover:text-accent-gold/80 transition-colors duration-500">
        {title}
      </span>

      <p className="text-white/50 text-sm md:text-[15px] leading-relaxed font-light text-left group-hover:text-white/80 transition-colors duration-500">
        {description}
      </p>
    </div>
  </motion.div>
);

const SpotlightSection = ({ onLearnMore }: SpotlightSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Fine parallax for the background image
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const logoY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] bg-bg-primary overflow-visible"
    >
      {/* Sticky Background Image - The "Fixed" Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <motion.div
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/spotlight_africa.png')",
            filter: "brightness(0.20) contrast(1.2) saturate(0.8)",
          }}
        />

        {/* Subtle glass overlay for depth */}
        <div className="absolute inset-0 bg-bg-primary/20 backdrop-blur-[2px]" />

        {/* Gradients to blend with surrounding sections */}
        <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-bg-primary via-bg-primary/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-bg-primary via-bg-primary/80 to-transparent" />

        {/* Mask Overlay - Darker at the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      </div>

      {/* Main Content - Glides over the sticky background */}
      <div className="relative z-10 -mt-[100vh] min-h-screen flex items-center justify-center py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-px bg-linear-to-r from-transparent via-accent-gold to-transparent mx-auto mb-8"
          />

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-hero mb-6"
          >
            <span className="text-accent-gold">Spotlight</span>{" "}
            <span className="text-white">Africa</span>
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="heading-subsection mb-8"
          >
            Illuminating African Excellence
          </motion.p>

          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-32 h-px bg-linear-to-r from-transparent via-white/20 to-transparent mx-auto mb-10"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-body-lg max-w-2xl mx-auto mb-12 text-white/80"
          >
            We shine a light on the most innovative and impactful businesses
            across the African continent. From pioneering startups to
            established innovators, we celebrate the spirit of African
            entrepreneurship and connect visionaries with opportunities that
            drive meaningful change.
          </motion.p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-12 mb-20 text-left">
            <FeatureCard
              title="Innovation"
              description="Showcasing cutting-edge African startups and their groundbreaking solutions."
              delay={0.6}
            />
            <FeatureCard
              title="Connection"
              description="Building bridges between entrepreneurs, investors, and mentors."
              delay={0.7}
            />
            <FeatureCard
              title="Impact"
              description="Highlighting businesses that create real change across communities."
              delay={0.8}
            />
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLearnMore}
              className="group btn-outline-gold gap-3 py-4 px-8"
            >
              Learn More About Us
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;
