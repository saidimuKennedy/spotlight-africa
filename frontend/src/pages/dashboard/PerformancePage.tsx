import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer2,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react";
import StatCard from "./component/StatCard";
import { fetchDashboardMe, DashboardData } from "../../lib/api";

const PerformancePage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboard = await fetchDashboardMe();
        setData(dashboard);
      } catch (err) {
        console.error("Performance load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tight">
            Performance Insights
          </h1>
          <p className="text-white/40 text-sm italic font-serif">
            Comprehensive analytics for {data.business?.name}.
          </p>
        </div>

        <button className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:border-accent-gold/40 transition-all">
          <Calendar size={14} className="text-accent-gold" />
          Last 30 Days
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Eye size={20} />}
          value={data.stats.profile_views?.toLocaleString() ?? "0"}
          label="Profile Views"
          color="text-accent-gold"
        />
        <StatCard
          icon={<Users size={20} />}
          value={data.stats.likes ?? 0}
          label="Total Endorsements"
          color="text-white"
        />
        <StatCard
          icon={<MousePointer2 size={20} />}
          value={`${(((data.pipeline?.length || 0) / (data.stats.profile_views || 1)) * 100).toFixed(1)}%`}
          label="Conversion rate"
          color="text-accent-gold"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          value={data.stats.health_score ?? 0}
          label="Current Health Score"
          color="text-white"
        />
      </div>

      {/* Analytics Chart Placeholder */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 bg-white/2 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Visibility Trend
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-accent-gold tracking-widest">
                <div className="w-2 h-2 rounded-full bg-accent-gold" />
                This Period
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-white/20 tracking-widest">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                Previous
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full flex items-end justify-between gap-1">
            {[
              40, 60, 35, 75, 90, 55, 65, 80, 45, 70, 85, 95, 100, 60, 50, 80,
              70, 90, 100, 85,
            ].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                className="flex-1 bg-accent-gold/20 hover:bg-accent-gold/50 transition-colors relative group/bar"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] text-accent-gold font-bold">
                  {h}%
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest">
            <span>Jan 01</span>
            <span>Jan 15</span>
            <span>Jan 31</span>
          </div>
        </div>

        <div className="p-10 bg-white/2 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">
              Engagement Mix
            </h3>
            <div className="space-y-6">
              {[
                {
                  label: "Inquiries",
                  value: Math.round(
                    ((data.pipeline?.length || 0) /
                      ((data.stats.likes || 0) + (data.pipeline?.length || 0) ||
                        1)) *
                      100,
                  ),
                  color: "bg-accent-gold",
                },
                {
                  label: "Likes/Endorsements",
                  value: Math.round(
                    ((data.stats.likes || 0) /
                      ((data.stats.likes || 0) + (data.pipeline?.length || 0) ||
                        1)) *
                      100,
                  ),
                  color: "bg-white",
                },
                { label: "Bio Interactions", value: 15, color: "bg-white/40" },
                { label: "Other Events", value: 10, color: "bg-white/10" },
              ].map((source, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-white/50">{source.label}</span>
                    <span className="text-white">{source.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.value}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className={`h-full ${source.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 mt-8">
            <p className="text-xs text-white/40 leading-relaxed italic font-serif">
              "Your business is currently performing in the top 10% of the{" "}
              {data.business?.industry || "industry"} sector."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
