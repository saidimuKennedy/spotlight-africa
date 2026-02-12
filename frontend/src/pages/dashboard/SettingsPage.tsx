import { motion } from "framer-motion";
import {
  Shield,
  Bell,
  User,
  CreditCard,
  ChevronRight,
  LogOut,
} from "lucide-react";

const SettingsPage = () => {
  const sections = [
    {
      icon: User,
      title: "Account Credentials",
      description:
        "Manage your primary contact information and login security.",
    },
    {
      icon: Shield,
      title: "Privacy & Permissions",
      description:
        "Control who can see your business metrics and health scores.",
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description:
        "Configure alerts for inquiries, follows, and market shifts.",
    },
    {
      icon: CreditCard,
      title: "Billing & Subscription",
      description: "view current tier status and historical invoices.",
    },
  ];

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tight">
          System Settings
        </h1>
        <p className="text-white/40 text-sm italic font-serif">
          Platform configuration and account security parameters.
        </p>
      </div>

      <div className="grid gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col md:flex-row items-center gap-6 p-8 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-accent-gold/20 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-slate-900 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-accent-gold transition-colors shrink-0">
              <section.icon size={24} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                {section.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed font-serif">
                {section.description}
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-white/10 group-hover:text-accent-gold group-hover:translate-x-1 transition-all"
            />
          </motion.div>
        ))}
      </div>

      <div className="pt-10 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>v1.0.4-Lagos</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-accent-gold/50">System Stable</span>
        </div>

        <button className="flex items-center gap-2 text-primary hover:brightness-125 transition-all text-[10px] font-bold uppercase tracking-widest">
          <LogOut size={14} />
          Sign Out of All Devices
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
