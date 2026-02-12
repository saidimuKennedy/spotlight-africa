import { motion } from "framer-motion";
import { Users, Target, Rocket, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/spotlight-logo-bg.png"
            alt="Spotlight Africa Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-bg-primary via-transparent to-bg-primary" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-gold text-sm font-bold uppercase tracking-[0.3em] mb-4 block"
          >
            Illuminating Excellence
          </motion.span>
          {/* <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tighter leading-none"
          >
            OUR STORY{" "}
            <span className="text-accent-gold italic-serif lowercase">is</span>{" "}
            AFRICA
          </motion.h1> */}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 tracking-tight">
              A Platform Built for the{" "}
              <span className="text-accent-gold">Next Billion</span> Success
              Stories.
            </h2>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed font-serif italic">
              <p>
                Spotlight Africa was born out of a simple observation: African
                brilliance is everywhere, but the infrastructure to showcase it
                shouldn't be a luxury.
              </p>
              <p>
                We believe that every business, from the bustling tech hubs of
                Lagos to the dynamic startups in Nairobi, deserves a stage that
                matches their ambition. Our platform is that stage—a premium
                digital ecosystem where transparency meets opportunity.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                label: "Community",
                value: "500+",
                color: "text-accent-gold",
              },
              {
                icon: Target,
                label: "Accuracy",
                value: "100%",
                color: "text-white",
              },
              {
                icon: Rocket,
                label: "Growth",
                value: "3.5x",
                color: "text-accent-gold",
              },
              {
                icon: Globe,
                label: "Reach",
                value: "12+",
                color: "text-white",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white/5 border border-white/5 flex flex-col items-center text-center group hover:border-accent-gold/30 transition-all"
              >
                <stat.icon
                  className={`${stat.color} mb-4 group-hover:scale-110 transition-transform`}
                  size={24}
                />
                <div className="text-3xl font-heading font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="heading-subsection text-accent-gold">
              Our Foundation
            </span>
            <h2 className="heading-section mt-4">Values that drive us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Radical Transparency",
                description:
                  "Our health score system ensures that merit dictates visibility, not just marketing spend.",
              },
              {
                title: "Premium by Default",
                description:
                  "We believe African excellence deserves a world-class aesthetic that reflects its worth.",
              },
              {
                title: "Connection First",
                description:
                  "We are the bridge between local visionaries and global strategic capital.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-bg-surface border border-white/5 relative group"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-accent-gold group-hover:h-full transition-all duration-500" />
                <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-wider">
                  {value.title}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
