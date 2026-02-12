import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Loader2,
} from "lucide-react";
import {
  fetchDashboardMe,
  DashboardData,
  updateInquiryStatus,
} from "../../lib/api";
import { format } from "date-fns";

const LeadRow = ({
  id,
  name,
  type,
  source,
  status,
  date,
  onStatusUpdate,
}: any) => (
  <tr className="group hover:bg-white/5 transition-colors border-b border-white/5">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent-gold/10 flex items-center justify-center text-accent-gold font-bold text-xs uppercase">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/30 truncate max-w-[200px]">{type}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-4 text-xs text-white/50">{source}</td>
    <td className="py-4 px-4">
      <select
        value={status}
        onChange={(e) => onStatusUpdate(id, e.target.value)}
        className={`bg-transparent outline-none px-2 py-1 rounded-md text-[10px] font-bold uppercase cursor-pointer ${
          status === "replied"
            ? "text-secondary"
            : status === "pending"
              ? "text-accent-gold"
              : status === "in_progress"
                ? "text-primary"
                : "text-white/30"
        }`}
      >
        <option value="pending">Pending</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    </td>
    <td className="py-4 px-4 text-xs text-white/40">{date}</td>
    <td className="py-4 px-4">
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white">
          <MessageSquare size={14} />
        </button>
        <button className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white">
          <Phone size={14} />
        </button>
        <button className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </td>
  </tr>
);

const PipelinePage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboard = await fetchDashboardMe();
        setData(dashboard);
      } catch (err) {
        console.error("Pipeline load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateInquiryStatus(id, newStatus);
      // Refresh local state
      if (data) {
        const updatedPipeline = (data.pipeline || []).map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead,
        );
        setData({ ...data, pipeline: updatedPipeline });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredLeads = (data?.pipeline || []).filter(
    (lead) =>
      lead.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.user?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">
          Lead Pipeline
        </h2>
        <button className="btn-primary py-2 px-6 text-xs font-bold uppercase tracking-widest">
          + Add Lead
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-sm focus:border-accent-gold/50 transition-colors text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-white/60">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 border-b border-white/5">
                <th className="py-4 px-4 font-bold">Contact</th>
                <th className="py-4 px-4 font-bold">Inquiry Subject</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold">Received At</th>
                <th className="py-4 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads && filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    id={lead.id}
                    name={lead.user?.name || lead.user?.email || "Anonymous"}
                    type={lead.message.substring(0, 50) + "..."}
                    source={lead.subject}
                    status={lead.status}
                    onStatusUpdate={handleStatusUpdate}
                    date={format(new Date(lead.created_at), "MMM d, yyyy")}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-white/20 italic text-sm"
                  >
                    No leads discovered in the pipeline.
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

export default PipelinePage;
