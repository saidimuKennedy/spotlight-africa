import { motion } from "framer-motion";
import { Shield, Lock, Scale } from "lucide-react";

const TermsPage = () => {
  const sections = [
    {
      title: "Platform Usage",
      content:
        "Spotlight Africa provides a digital platform for showcasing African businesses. Users agree to use the platform for professional and legitimate business monitoring, research, and connection purposes.",
    },
    {
      title: "Data Verification",
      content:
        "While we strive for 100% accuracy through our proprietary health score algorithms, information provided by businesses is subject to independent verification. Spotlight Africa is not liable for data provided by third-party entries.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content, designs, and proprietary scoring algorithms are the intellectual property of Spotlight Africa. Unauthorized scraping, replication, or commercial use of our datasets is strictly prohibited.",
    },
    {
      title: "Account Responsibilities",
      content:
        "Users are responsible for maintaining the security of their credentials. Any activity performed under an account is the sole responsibility of the account holder.",
    },
  ];

  return (
    <div className="bg-bg-primary min-h-screen pt-24">
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 text-accent-gold mb-6">
            <Shield size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Legal Framework
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter mb-6">
            TERMS OF{" "}
            <span className="text-accent-gold italic-serif lowercase">
              service
            </span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
            Last Updated: February 2026
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white/[0.02] border border-white/5 relative group"
            >
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center shrink-0 border border-accent-gold/20">
                  <span className="text-accent-gold font-bold text-sm">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    {section.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed font-serif italic text-lg text-white/70">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 border-l border-accent-gold bg-accent-gold/5"
        >
          <p className="text-white/60 text-sm leading-relaxed italic">
            By continuing to access Spotlight Africa, you acknowledge that you
            have read and understood our legal requirements. If you have
            questions regarding these terms, please contact our legal team at{" "}
            <span className="text-white font-bold">
              legal@spotlightafrica.com
            </span>
            .
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default TermsPage;
