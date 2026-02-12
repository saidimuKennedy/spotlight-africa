import { motion } from "framer-motion";
import { Lock, Eye, CheckCircle2 } from "lucide-react";

const PrivacyPage = () => {
  const policies = [
    {
      icon: Eye,
      title: "Data Collection",
      content:
        "We collect basic account information and public business metrics provided by you. We do not track personal navigation history outside the scope of platform interaction.",
    },
    {
      icon: Lock,
      title: "Security Protocols",
      content:
        "All data is encrypted in transit and at rest using industry-standard protocols. We utilize distributed server infrastructure across African and global regions for redundancy.",
    },
    {
      icon: CheckCircle2,
      title: "Your Rights",
      content:
        "You maintain full control over your business data. At any time, you may request a full export of your metrics or the immediate deletion of your spotlight profile.",
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
            <Lock size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Privacy First
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter mb-6">
            PRIVACY{" "}
            <span className="text-accent-gold italic-serif lowercase">
              policy
            </span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
            Committed to African Data Sovereignty
          </p>
        </motion.div>

        <div className="space-y-8">
          {policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-start gap-8 p-10 bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                <div className="p-4 bg-accent-gold/5 border border-accent-gold/10 text-accent-gold group-hover:scale-110 transition-transform">
                  <policy.icon size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-[0.1em]">
                    {policy.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed text-lg font-serif">
                    {policy.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-white/30 text-sm italic font-serif max-w-xl mx-auto mb-8">
            "Your data is the lifeblood of your innovation. We treat it with the
            same respect we give to the businesses we spotlight."
          </p>
          <div className="w-12 h-px bg-accent-gold/30 mx-auto" />
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
