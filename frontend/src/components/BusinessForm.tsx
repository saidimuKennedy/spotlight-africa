import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Business } from "../lib/api";

interface BusinessFormProps {
  business?: Business | null;
  onSave: (data: Partial<Business>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const BusinessForm = ({
  business,
  onSave,
  onCancel,
  isOpen,
}: BusinessFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    avatar_url: "",
    is_featured: false,
    health_score: 50,
    category: "startup",
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        description: business.description || "",
        industry: business.industry || "",
        website: business.website || "",
        avatar_url: business.avatar_url || "",
        is_featured: business.is_featured || false,
        health_score: business.health_score || 50,
        category: business.category || "startup",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        industry: "",
        website: "",
        avatar_url: "",
        is_featured: false,
        health_score: 50,
        category: "startup",
      });
    }
  }, [business]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-[30px] p-8 max-w-2xl w-full border border-white/10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-light text-white mb-6">
          {business ? "Edit Business" : "Create Business"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors appearance-none cursor-pointer"
              required
            >
              <option value="startup">Startup</option>
              <option value="innovator">Innovator</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Industry *
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors"
              placeholder="e.g. Fintech, AgriTech"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors"
              placeholder="https://example.com"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) =>
                setFormData({ ...formData, avatar_url: e.target.value })
              }
              className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Health Score */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Health Score: {formData.health_score}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.health_score}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  health_score: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="w-5 h-5 rounded bg-[#0A0A0A] border border-white/10"
            />
            <label htmlFor="is_featured" className="text-white/60 text-sm">
              Mark as Featured
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-full bg-neon-lime text-black font-bold hover:bg-neon-lime/90 transition-colors"
            >
              {business ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
