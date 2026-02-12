/**
 * Footer Component
 *
 * Site-wide footer with navigation links, social media, and branding.
 *
 * @component
 */
import { motion } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const EMAIL_ADDRESS =
    import.meta.env.VITE_EMAIL_ADDRESS || "hello@spotlightafrica.com";
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Businesses", href: "/businesses" },
    { label: "Contact", href: "/contact" },
  ];

  const resources = [
    { label: "Blog", href: "/blog" },
    { label: "Events", href: "/events" },
    { label: "Press", href: "/press" },
    { label: "Careers", href: "/careers" },
  ];

  const legal = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  const socialLinks = [
    {
      icon: <Twitter size={18} />,
      href: "https://twitter.com/spotlightafrica",
      label: "Twitter",
    },
    {
      icon: <Linkedin size={18} />,
      href: "https://linkedin.com/company/spotlightafrica",
      label: "LinkedIn",
    },
    {
      icon: <Instagram size={18} />,
      href: "https://instagram.com/spotlightafrica",
      label: "Instagram",
    },
    {
      icon: <Facebook size={18} />,
      href: "https://facebook.com/spotlightafrica",
      label: "Facebook",
    },
  ];

  return (
    <footer className="relative bg-bg-primary border-t border-white/5">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-heading font-bold text-white mb-2">
                Spotlight <span className="text-accent-gold">Africa</span>
              </h3>
              <p className="text-sm text-white/50 mb-6">
                Illuminating African Excellence. Connecting visionaries with
                opportunities.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-accent-gold transition-colors"
                >
                  <Mail size={16} />
                  {EMAIL_ADDRESS}
                </a>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <MapPin size={16} />
                  Nairobi, Kenya
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-white/40 flex items-center gap-1"
          >
            © {currentYear} Spotlight Africa.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-bg-surface border border-white/10 flex items-center justify-center text-white/40 hover:text-accent-gold hover:border-accent-gold/30 transition-all"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)",
        }}
      />
    </footer>
  );
};

export default Footer;
