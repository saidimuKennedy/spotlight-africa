import { useEffect, useState } from "react";

import { Mail, ArrowUpRight, Search, Filter, Loader2 } from "lucide-react";
import { fetchDashboardMe, DashboardData } from "../../lib/api";
import { format } from "date-fns";

const InquiriesPage = () => {
  const [data, setData] = useState<DashboardData | null>(null); // handle absence of data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboard = await fetchDashboardMe(); //
        setData(dashboard);
      } catch (err) {
        console.error("Inquiries load failed", err);
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

  const inquiries = data?.pipeline || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tight">
            Strategic Inquiries
          </h1>
          <p className="text-white/40 text-sm">
            Manage connection requests and investment inquiries for{" "}
            {data?.business?.name || "the Ecosystem"}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Filter inquiries..."
              className="bg-white/5 border border-white/5 pl-12 pr-6 py-2.5 text-sm text-white focus:outline-none focus:border-accent-gold/40 transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/5 text-white/50 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white/2 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Sender
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Strategic Interest
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Timeline
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                          <Mail size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white mb-0.5">
                            {inquiry.user?.name || "Anonymous Partner"}
                          </div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider">
                            {inquiry.user?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-white/70 font-medium italic font-serif">
                        "{inquiry.subject}"
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-white/50">
                      {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border ${
                          inquiry.status === "pending"
                            ? "bg-accent-gold/10 text-accent-gold border-accent-gold/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                        Review{" "}
                        <ArrowUpRight size={14} className="text-accent-gold" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-white/20 italic text-sm"
                  >
                    No strategic inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
