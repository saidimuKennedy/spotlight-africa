import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  Globe,
  Calendar,
  ArrowRight,
  UserPlus,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import NotificationDropdown from "./navbar/NotificationDropdown";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5 pointer-events-none"
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between pointer-events-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link
            to="/"
            className="group block"
            onClick={() => setIsMegaMenuOpen(false)}
          >
            {/* Mobile Logo */}
            <img
              src="/images/mini_spotlight_africa.png"
              alt="Spotlight Africa"
              className="h-10 w-auto lg:hidden object-contain"
            />
            {/* Desktop Logo */}
            <img
              src="/images/spotlight_africa.png"
              alt="Spotlight Africa"
              className="hidden lg:block h-16 xl:h-20 w-auto object-contain transition-transform group-hover:scale-105 duration-500"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-accent-gold transition-colors"
          >
            Explore
          </Link>
          <Link
            to="/about"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-accent-gold transition-colors"
          >
            Story
          </Link>
          <Link
            to="/network"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-accent-gold transition-colors"
          >
            Network
          </Link>

          {/* Mega Menu Trigger */}
          <div
            className="relative group h-full flex items-center cursor-pointer"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors flex items-center gap-2 ${isMegaMenuOpen ? "text-accent-gold" : "text-white/50 hover:text-accent-gold"}`}
            >
              Platform
              <ChevronDown
                size={12}
                className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`}
              />
            </span>
          </div>
        </div>

        {/* Action / User Area */}
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          {isLoggedIn ? (
            <>
              {(role === "admin" || role === "owner") && (
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-accent-gold/50 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <NotificationDropdown />
                <div className="group relative">
                  <div className="w-10 h-10 border border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer">
                    <User size={20} className="text-white/40" />
                  </div>
                  {/* Enhanced Dropdown for User Actions */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface border border-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl">
                    {role === "admin" || role === "owner" ? (
                      <Link
                        to="/dashboard/settings"
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all mb-1 border-b border-white/5"
                      >
                        <Settings size={14} className="text-accent-gold" />
                        Profile Settings
                      </Link>
                    ) : (
                      <Link
                        to="/register-business"
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-accent-gold hover:text-white hover:bg-accent-gold/10 transition-all mb-1 border-b border-white/5"
                      >
                        <UserPlus size={14} />
                        Register Business
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:brightness-125 hover:bg-white/5 transition-all"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-8 py-3 bg-accent-gold text-bg-primary text-[10px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-lg shadow-accent-gold/10"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 bg-bg-surface border-b border-white/5 transition-all duration-500 overflow-hidden pointer-events-auto shadow-2xl ${
          isMegaMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 invisible"
        }`}
        onMouseEnter={() => setIsMegaMenuOpen(true)}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Editorial */}
          <Link
            to="/blog"
            className="group/item p-8 bg-white/5 border border-white/5 hover:border-accent-gold/30 transition-all"
            onClick={() => setIsMegaMenuOpen(false)}
          >
            <div className="w-12 h-12 bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-6 group-hover/item:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              The Digital Pulse
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all"
              />
            </h3>
            <p className="text-xs text-white/40 leading-relaxed font-serif italic">
              Editorial insights, market trends, and scaling strategies from the
              African frontier.
            </p>
          </Link>

          {/* Column 2: Active Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">
              Active Channels
            </h4>

            <Link
              to="/businesses"
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group/sub"
              onClick={() => setIsMegaMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-white/5 flex items-center justify-center text-white/30 group-hover/sub:text-accent-gold transition-colors">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white uppercase tracking-widest">
                  The Ecosystem
                </div>
                <div className="text-[9px] text-white/30">
                  Directory of Innovation
                </div>
              </div>
            </Link>

            <Link
              to="/events"
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group/sub"
              onClick={() => setIsMegaMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-white/5 flex items-center justify-center text-white/30 group-hover/sub:text-accent-gold transition-colors">
                <Calendar size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white uppercase tracking-widest">
                  The Calendar
                </div>
                <div className="text-[9px] text-white/30">
                  Join the Live signal
                </div>
              </div>
            </Link>

            <Link
              to="/news"
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group/sub"
              onClick={() => setIsMegaMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-white/5 flex items-center justify-center text-white/30 group-hover/sub:text-accent-gold transition-colors">
                <BookOpen size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Business Intel
                </div>
                <div className="text-[9px] text-white/30">
                  Latest News & Analysis
                </div>
              </div>
            </Link>
          </div>

          {/* Column 3: Stats/CTA */}
          <div className="flex flex-col justify-between p-8 bg-accent-gold/5 border border-accent-gold/10">
            <div>
              <div className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] mb-4">
                Network Status
              </div>
              <div className="text-3xl font-heading font-bold text-white mb-2 leading-none">
                1,240+
              </div>
              <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Verified Entities
              </div>
            </div>
            <Link
              to="/network"
              className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
              onClick={() => setIsMegaMenuOpen(false)}
            >
              Join the Ecosystem <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
