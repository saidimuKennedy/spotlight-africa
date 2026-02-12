import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import ComplexCard from "./ComplexCard";
import BusinessForm from "./BusinessForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  Business,
} from "../lib/api";
import Toast, { ToastType } from "./Toast";

interface LeadsSectionProps {
  allBusinesses: Business[];
  loading: boolean;
  refreshBusinesses: () => Promise<void>;
}

const LeadsSection = ({
  allBusinesses,
  loading,
  refreshBusinesses,
}: LeadsSectionProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = allBusinesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q),
    );

    return {
      leads: filtered.filter((b) => !b.is_featured && b.category === "startup"),
      upcomers: filtered.filter((b) => b.is_featured),
    };
  }, [allBusinesses, searchQuery]);

  const { leads, upcomers } = filteredItems;

  const handleCreate = () => {
    setEditingBusiness({
      category: "startup", // Default category for new entries
    } as any);
    setIsFormOpen(true);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setBusinessToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;

    try {
      await deleteBusiness(businessToDelete.id);
      showToast("Business deleted successfully", "success");
      await refreshBusinesses();
    } catch (err) {
      console.error("Failed to delete business", err);
      showToast("Failed to delete business", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setBusinessToDelete(null);
    }
  };

  const handleSave = async (data: Partial<Business>) => {
    try {
      if (editingBusiness && editingBusiness.id) {
        await updateBusiness(editingBusiness.id, data);
        showToast("Business updated", "success");
      } else {
        // Ensure default category if not provided
        const newData = {
          ...data,
          category: data.category || "startup",
        } as Omit<Business, "id" | "created_at" | "updated_at">;
        await createBusiness(newData);
        showToast("Business created", "success");
      }
      setIsFormOpen(false);
      setEditingBusiness(null);
      await refreshBusinesses();
    } catch (err) {
      console.error("Failed to save business", err);
      showToast("Failed to save business", "error");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-base gap-4 text-white">
          <h2 className="text-2xl font-light">New Leads</h2>
          <span className="text-sm text-white/40 border-b border-white/40 pb-0.5">
            {loading ? "..." : `${leads.length} Leads`}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Search Input Container */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search leads or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 px-10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-neon-lime/30 w-64 transition-all"
            />
            <Search className="absolute left-4 text-white/20" size={14} />
          </div>

          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
            <SlidersHorizontal size={16} />
          </button>

          <div className="h-8 w-px bg-white/10 mx-2"></div>

          <button className="px-4 py-2 rounded-full bg-forest-deep text-neon-lime text-xs font-bold border border-white/5">
            Startup watch
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-full border border-white/10 text-white/40 text-xs hover:text-white hover:border-white/30 transition-colors"
          >
            Newest
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-white/40">
            Loading businesses...
          </div>
        ) : leads.length === 0 ? (
          <div className="col-span-full py-10 text-center text-white/40 border border-dashed border-white/10 rounded-3xl">
            No leads found matching your criteria.
          </div>
        ) : (
          leads.map((biz) => (
            <ComplexCard
              key={biz.id}
              title={biz.name}
              subtitle={biz.industry}
              image={
                biz.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=random`
              }
              onEdit={() => handleEdit(biz)}
              onDelete={() => handleDelete(biz.id, biz.name)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <BusinessForm
        business={editingBusiness}
        isOpen={isFormOpen}
        onSave={handleSave}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingBusiness(null);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        businessName={businessToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setBusinessToDelete(null);
        }}
      />

      {/* Upcomers Section */}
      <div className="mt-20">
        <div className="flex items-center gap-4 text-white mb-8">
          <h2 className="text-2xl font-light">New Upcomers</h2>
          <span className="text-sm text-white/40 border-b border-white/40 pb-0.5">
            {upcomers.length} Featured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomers.length === 0 ? (
            <div className="col-span-full py-10 text-center text-white/40 border border-dashed border-white/10 rounded-3xl">
              No featured upcomers available.
            </div>
          ) : (
            upcomers.map((biz) => (
              <div
                key={biz.id}
                className="col-span-1 bg-white/5 hover:bg-white/10 rounded-[30px] p-6 relative h-64 border border-white/5 flex flex-col justify-between overflow-hidden group transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        biz.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=random`
                      }
                      className="w-10 h-10 rounded-full border border-white/10 object-cover"
                      alt={biz.name}
                    />
                    <div>
                      <div className="text-white text-sm font-bold">
                        {biz.name}
                      </div>
                      <div className="text-white/40 text-[10px]">
                        {biz.industry}
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons for Upcomers */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={() => handleEdit(biz)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-neon-lime hover:text-black transition-all"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 bg-neon-lime/20 rounded-xl flex items-center justify-center text-neon-lime mb-4">
                    <span className="text-xs font-black">
                      {biz.health_score}%
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-light leading-tight">
                    {biz.name} has been marked as a high-potential upcomer.
                  </h3>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-bold">
                    Health Score
                  </p>
                </div>

                <div className="relative z-10 w-full bg-black/40 rounded-full p-1 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 ml-3 uppercase font-bold tracking-tighter">
                    {biz.category} Spotlight
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neon-lime flex items-center justify-center text-black">
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default LeadsSection;
