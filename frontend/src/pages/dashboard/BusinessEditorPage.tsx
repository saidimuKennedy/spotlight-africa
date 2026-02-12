import { useEffect, useState } from "react";
import {
  Save,
  Image as ImageIcon,
  Globe,
  MapPin,
  Briefcase,
  Plus,
  Loader2,
  Check,
} from "lucide-react";
import { fetchDashboardMe, updateBusiness, Business } from "../../lib/api";

const BusinessEditorPage = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardMe();
        setBusiness(data.business ?? null);
      } catch (err) {
        console.error("Editor load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTogglePublic = () => {
    if (!business) return;
    setBusiness({ ...business, is_public: !business.is_public });
  };

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateBusiness(business.id, {
        name: business.name,
        description: business.description,
        industry: business.industry,
        website: business.website,
        category: business.category,
        is_public: business.is_public,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tight">
            Profile Architect
          </h1>
          <p className="text-white/40 text-sm">
            Refine your public identity and strategic narrative.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-3 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-accent-gold/10 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : saved ? "Profile Updated" : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <section className="p-8 md:p-10 bg-white/2 border border-white/5 space-y-8">
            <h2 className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-accent-gold/30" />
              Core Identity
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Business Name
                </label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) =>
                    setBusiness({ ...business, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all placeholder:text-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Industry focus
                </label>
                <div className="relative">
                  <select
                    value={business.industry}
                    onChange={(e) =>
                      setBusiness({ ...business, industry: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white appearance-none focus:outline-none focus:border-accent-gold/40 transition-all cursor-pointer"
                  >
                    <option>Technology</option>
                    <option>Agriculture</option>
                    <option>Energy</option>
                    <option>FinTech</option>
                    <option>Health</option>
                  </select>
                  <Plus
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Strategic Bio / Vision
              </label>
              <textarea
                rows={5}
                value={business.description}
                onChange={(e) =>
                  setBusiness({ ...business, description: e.target.value })
                }
                placeholder="Describe your foundational story and mission..."
                className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-accent-gold/40 transition-all placeholder:text-white/10 resize-none font-serif italic text-lg leading-relaxed"
              />
            </div>
          </section>

          {/* Social & Web Section */}
          <section className="p-8 md:p-10 bg-white/2 border border-white/5 space-y-8">
            <h2 className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-accent-gold/30" />
              Digital Presence
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="text"
                  placeholder="Website URL"
                  value={business.website}
                  onChange={(e) =>
                    setBusiness({ ...business, website: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 pl-14 pr-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all"
                />
              </div>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="text"
                  placeholder="Primary Location"
                  defaultValue="Nairobi, Kenya"
                  className="w-full bg-white/5 border border-white/10 pl-14 pr-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar / Visuals */}
        <div className="space-y-8">
          <section className="p-8 bg-white/2 border border-white/5 space-y-6">
            <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">
              Hero Imagery
            </h2>
            <div className="aspect-4/5 bg-slate-900 border border-white/10 relative group overflow-hidden cursor-pointer">
              {business.avatar_url ? (
                <img
                  src={business.avatar_url}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/20 group-hover:text-accent-gold transition-colors">
                  <ImageIcon size={40} />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">
                    Upload New Hero
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] text-white/30 italic text-center leading-relaxed">
              High-resolution vertical or square imagery recommended for best
              results on the spotlight page.
            </p>
          </section>

          <section className="p-8 bg-accent-gold/5 border border-accent-gold/10 space-y-4">
            <div className="flex items-center gap-3 text-accent-gold font-bold text-[10px] uppercase tracking-widest">
              <Briefcase size={14} />
              Status
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">
                Public Visibility
              </span>
              <div
                onClick={handleTogglePublic}
                className={`w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${business.is_public ? "bg-accent-gold" : "bg-white/10"}`}
              >
                <div
                  className={`absolute top-1 bottom-1 w-3 bg-black rounded-full transition-all duration-300 ${business.is_public ? "right-1" : "right-6"}`}
                />
              </div>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed pt-2 border-t border-accent-gold/10">
              {business.is_public
                ? "Your profile is currently visible to visitors and partners."
                : "Your profile is hidden from public discovery."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessEditorPage;
