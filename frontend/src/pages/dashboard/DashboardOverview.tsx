/**
 * DashboardOverview Component
 *
 * The main landing page of the dashboard providing quick insights,
 * health scores, and pipeline status.
 */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toast from "../../components/Toast";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
  Loader2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardMe, DashboardData } from "../../lib/api";
import { format } from "date-fns";
import ScheduleMeetingModal from "../../components/dashboard/ScheduleMeetingModal";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const StatCard = ({ label, value, change, trend, icon }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card-elevated p-6 relative overflow-hidden group"
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/5 text-white/70 group-hover:text-accent-gold transition-colors">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold ${trend === "up" ? "text-secondary" : "text-primary"}`}
        >
          {trend === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingUp size={12} className="rotate-180" />
          )}
          {change}
        </div>
      </div>
      <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </h3>
      <div className="text-3xl font-heading font-bold text-white">{value}</div>
    </div>

    {/* Background Glow */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors" />
  </motion.div>
);

const MeetingItem = ({ title, user, time, link }: any) => (
  <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
        <Calendar size={18} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
        <p className="text-xs text-white/40">
          With {user} • {time}
        </p>
      </div>
    </div>
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold text-accent-gold uppercase hover:underline"
      >
        Join
      </a>
    )}
  </div>
);

const PipelineItem = ({
  title,
  company,
  status,
  date,
}: {
  title: string;
  company: string;
  status: string;
  date: string;
}) => (
  <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
        <MessageSquare size={18} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
        <p className="text-xs text-white/40">
          {company} • {date}
        </p>
      </div>
    </div>
    <div
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
        status === "new"
          ? "bg-primary/20 text-primary border border-primary/30"
          : status === "active"
            ? "bg-secondary/20 text-secondary border border-secondary/30"
            : "bg-white/10 text-white/40"
      }`}
    >
      {status}
    </div>
  </div>
);

const DashboardOverview = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastState({ isVisible: true, message, type });
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await fetchDashboardMe();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleScheduleMeeting = async (meetingData: any) => {
    console.log("Scheduling Meeting:", meetingData);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast("Meeting scheduled successfully (Mock Activity)");
    setIsMeetingModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-white/20">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
          Synching Ecosystem Data...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass p-12 text-center">
        <p className="text-primary mb-4 font-bold uppercase tracking-widest">
          Initialization Error
        </p>
        <p className="text-white/40 text-sm">
          {error || "Could not retrieve dashboard metrics."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 btn-outline-gold px-6 py-2 text-[10px] uppercase font-bold tracking-widest"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (data.role === "admin") {
    return (
      <div className="space-y-8 pb-10">
        <Toast
          isVisible={toastState.isVisible}
          message={toastState.message}
          type={toastState.type}
          onClose={handleCloseToast}
        />
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">
              System Control, <span className="text-accent-gold">Admin</span>.
            </h1>
            <p className="text-white/40 text-sm mt-1 italic font-accent">
              "The state is the servant of the citizen, not the other way
              around." — Aristotle
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                System Status: {data.system_health?.status || "Healthy"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Users"
            value={data.stats.total_users || 0}
            change="+18"
            trend="up"
            icon={<User size={20} />}
          />
          <StatCard
            label="Verified Businesses"
            value={data.stats.total_businesses || 0}
            change="+5"
            trend="up"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            label="System Inquiries"
            value={data.stats.total_inquiries || 0}
            change="+24"
            trend="up"
            icon={<MessageSquare size={20} />}
          />
          <StatCard
            label="Total Ecosystem Views"
            value={(data.stats.total_views || 0).toLocaleString()}
            change="+8.4k"
            trend="up"
            icon={<Eye size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Health */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-8">
              <h2 className="text-xl font-heading font-bold text-white mb-6">
                Network Health
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    Server Load (Alloc)
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {data.stats.server_load}
                  </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    Active Processes
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {data.system_health?.active_goroutines} Goroutines
                  </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    Network Uptime
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {data.system_health?.uptime}
                  </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    Projected Revenue
                  </div>
                  <div className="text-2xl font-bold text-accent-gold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(data.stats.total_revenue || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Admin Sidebar */}
          <div className="glass p-8">
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              Admin Protocols
            </h3>
            <ul className="space-y-4">
              <li className="text-[10px] font-bold text-white/40 uppercase hover:text-white cursor-pointer transition-colors pb-3 border-b border-white/5">
                Audit User Logs
              </li>
              <li className="text-[10px] font-bold text-white/40 uppercase hover:text-white cursor-pointer transition-colors pb-3 border-b border-white/5">
                Moderate Businesses
              </li>
              <li className="text-[10px] font-bold text-white/40 uppercase hover:text-white cursor-pointer transition-colors pb-3 border-b border-white/5">
                <Link to="/dashboard/blogs" className="block w-full">
                  Manage Editorial Content
                </Link>
              </li>
              <li className="text-[10px] font-bold text-white/40 uppercase hover:text-white cursor-pointer transition-colors pb-3 border-b border-white/5">
                System Configuration
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- REGULAR USER (NO BUSINESS) ---
  if (!data.has_business && data.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
        <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center text-accent-gold">
          <BarChart3 size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Build Your Presence
          </h1>
          <p className="text-white/40 max-w-md mx-auto italic font-serif leading-relaxed">
            You are currently a{" "}
            <span className="text-accent-gold underline uppercase font-bold tracking-widest">
              {data.role}
            </span>
            . Register your business to access real-time metrics, inquiry
            pipelines, and growth optimization.
          </p>
        </div>
        <Link
          to="/register-business"
          className="btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest"
        >
          Register My Business
        </Link>
      </div>
    );
  }

  // --- OWNER VIEW (HAS BUSINESS) ---
  return (
    <div className="space-y-8 pb-10">
      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onSubmit={handleScheduleMeeting}
      />
      <Toast
        isVisible={toastState.isVisible}
        message={toastState.message}
        type={toastState.type}
        onClose={handleCloseToast}
      />
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">
            Shalom,{" "}
            <span className="text-accent-gold">
              {data.user.name.split(" ")[0]}
            </span>
            .
          </h1>
          <p className="text-white/40 text-sm mt-1 italic font-accent">
            "We suffer more often in imagination than in reality." — Seneca
          </p>
          <div className="mt-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Owner @ {data.business?.name}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="btn-outline-gold py-2 px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Calendar size={14} />
            Schedule Meeting
          </button>
          <Link
            to={`/business/${data.business?.id}`}
            className="btn-primary py-2 px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            View Public Bio
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Health Score"
          value={`${data.stats.health_score}`}
          change="+4.2%"
          trend="up"
          icon={<Heart size={20} />}
        />
        <StatCard
          label="Profile Views"
          value={(data.stats.profile_views || 0).toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Eye size={20} />}
        />
        <StatCard
          label="Active Inquiries"
          value={data.pipeline?.length || 0}
          change={`+${data.pipeline?.filter((p) => new Date(p.created_at).getTime() > Date.now() - 86400000).length || 0}`}
          trend="up"
          icon={<MessageSquare size={20} />}
        />
        <StatCard
          label="Conversions"
          value={(data.stats.conversions || 0).toLocaleString()}
          change="+4.2%"
          trend="up"
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-white">
              Your Pipeline
            </h2>
            <Link
              to="/dashboard/inquiries"
              className="text-accent-gold text-xs font-bold uppercase tracking-widest hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {data.pipeline && data.pipeline.length > 0 ? (
              data.pipeline
                .slice(0, 4)
                .map((inquiry) => (
                  <PipelineItem
                    key={inquiry.id}
                    title={inquiry.subject}
                    company={
                      inquiry.user?.name ||
                      inquiry.user?.email ||
                      "Anonymous Partner"
                    }
                    status={inquiry.status}
                    date={format(new Date(inquiry.created_at), "MMM d, h:mm a")}
                  />
                ))
            ) : (
              <div className="p-8 text-center text-white/20 italic text-sm border border-white/5 bg-white/2">
                No active inquiries found in your pipeline.
              </div>
            )}
          </div>

          {/* Performance Insight Chart Placeholder */}
          <div className="card-elevated p-8 h-80 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="p-4 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-white font-bold mb-2">Projected Growth</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              Visualize your impact over time. This section will feature a
              dynamic SVG chart in the next build.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-white">
            Upcoming Meetings
          </h2>
          <div className="space-y-4">
            {data.meetings && data.meetings.length > 0 ? (
              data.meetings
                .slice(0, 3)
                .map((meeting) => (
                  <MeetingItem
                    key={meeting.id}
                    title={meeting.title}
                    user={meeting.user?.name || "Partner"}
                    time={format(new Date(meeting.start_time), "MMM d, h:mm a")}
                    status={meeting.status}
                    link={meeting.meeting_link}
                  />
                ))
            ) : (
              <div className="p-6 text-center text-white/20 italic text-xs border border-white/5 bg-white/2">
                No upcoming meetings scheduled.
              </div>
            )}
          </div>

          <h2 className="text-xl font-heading font-bold text-white pt-4">
            System Activities
          </h2>
          <div className="glass p-6 space-y-6">
            {data.activities && data.activities.length > 0 ? (
              data.activities.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {activity.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-white/40">
                      {activity.metadata ||
                        "Interaction recorded on the network."}
                    </p>
                    <span className="text-[10px] text-white/20 mt-2 block">
                      {format(new Date(activity.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">System Ready</p>
                  <p className="text-xs text-white/40">
                    Your portal is synchronized with real-time data.
                  </p>
                  <span className="text-[10px] text-white/20 mt-2 block">
                    Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Achievement Card */}
          <div className="bg-linear-to-br from-accent-gold/20 to-primary/20 border border-accent-gold/20 p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-accent-gold uppercase tracking-widest mb-2">
                Milestone Reached
              </p>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Top 5% in {data.business?.industry}
              </h3>
              <p className="text-xs text-white/60 mb-4 lh-relaxed">
                You've surpassed 2,000 views this month. Your business is
                trending in South Africa.
              </p>
              <button className="text-xs font-bold text-white hover:text-accent-gold transition-colors flex items-center gap-2">
                Share Achievement <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
