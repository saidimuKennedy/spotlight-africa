/**
 * DashboardLayout Component
 *
 * Provides the shell for the dashboard including the sidebar navigation
 * and the main content area.
 * @param children - The content to be displayed in the main content area.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Building2,
  Globe,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchDashboardMe, DashboardData } from "../../lib/api";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({
  icon,
  label,
  path,
  active,
  collapsed,
}: SidebarItemProps) => (
  <Link to={path}>
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center gap-4 px-4 py-3 transition-all relative group ${
        active
          ? "text-accent-gold bg-accent-gold/10"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <div
        className={`${active ? "text-accent-gold" : "text-white/50 group-hover:text-white"}`}
      >
        {icon}
      </div>
      {!collapsed && (
        <span className="font-medium text-sm tracking-wide">{label}</span>
      )}
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
        />
      )}
    </motion.div>
  </Link>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardMe()
      .then(setData)
      .catch((err) => console.error("Layout data fetch failed", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
      path: "/dashboard",
    },
    {
      icon: <Users size={20} />,
      label: "Pipeline",
      path: "/dashboard/pipeline",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Inquiries",
      path: "/dashboard/inquiries",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Performance",
      path: "/dashboard/performance",
    },
    {
      icon: <Building2 size={20} />,
      label: "My Business",
      path: "/dashboard/business",
    },
  ];

  // Add Admin-only items
  if (data?.role === "admin" || data?.user?.role === "admin") {
    menuItems.push({
      icon: <BookOpen size={20} />,
      label: "Blogs",
      path: "/dashboard/blogs",
    });
  }

  return (
    <div className="flex h-screen bg-bg-primary text-white font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden lg:flex flex-col border-r border-white/5 bg-bg-surface/30 backdrop-blur-xl h-full z-30"
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          {!collapsed && (
            <Link to="/" className="group flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-heading font-bold text-white uppercase tracking-widest group-hover:text-accent-gold transition-colors"
              >
                Spotlight <span className="text-accent-gold">A.</span>
              </motion.span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            path="/dashboard/settings"
            active={location.pathname === "/dashboard/settings"}
            collapsed={collapsed}
          />
          <button
            className="w-full flex items-center gap-4 px-4 py-3 text-white/50 hover:text-red-400 hover:bg-red-400/5 transition-all"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header - Fixed */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-bg-primary/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-white/50"
            >
              <Menu size={24} />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-lg font-heading font-bold">Spotlight</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 px-4 py-2 w-96">
            <Search size={18} className="text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/20 ml-2 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 text-white/50 hover:text-accent-gold transition-colors hidden sm:block"
              title="View Website"
            >
              <Globe size={20} />
            </Link>
            <button className="relative p-2 text-white/50 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary border-2 border-bg-primary"></span>
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">
                  {data?.user?.name || data?.user?.email || "Guest"}
                </p>
                <p className="text-xs text-white/40">
                  {data?.role === "admin"
                    ? "Administrator"
                    : data?.business?.name
                      ? `Owner @ ${data.business.name}`
                      : "Private Member"}
                </p>
              </div>
              <div className="w-10 h-10 bg-accent-gold flex items-center justify-center font-bold text-bg-primary">
                {data?.user?.name ? data.user.name.charAt(0) : "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-10">{children}</div>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-bg-surface z-50 p-6 lg:hidden overflow-y-auto"
            >
              {/* Mobile Sidebar Content */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-heading font-bold">
                  Spotlight <span className="text-accent-gold">Africa</span>
                </span>
                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    {...item}
                    active={location.pathname === item.path}
                    collapsed={false}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
