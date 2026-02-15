import { useEffect, useState } from "react";
import {
  Plus,
  Loader2,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  BookOpen,
  Calendar,
  User as UserIcon,
  X,
  Save,
  Check,
} from "lucide-react";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  Blog,
  fetchDashboardMe,
} from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [dashData, blogsData] = await Promise.all([
          fetchDashboardMe(),
          fetchBlogs(),
        ]);

        setIsAdmin(dashData.role === "admin" || dashData.user.role === "admin");
        setBlogs(blogsData);
      } catch (err) {
        console.error("Failed to load blog data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleCreateNew = () => {
    setEditingBlog({
      title: "",
      slug: "",
      content: "",
      image_url: "",
      author: "",
      published_at: new Date().toISOString(),
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditorOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(slug);
      setBlogs(blogs.filter((b) => b.slug !== slug));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setSaving(true);
    setError(null);

    try {
      if (editingBlog.id) {
        // Update
        const updated = await updateBlog(editingBlog.slug!, editingBlog);
        setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        // Create
        const created = await createBlog(editingBlog);
        setBlogs([created, ...blogs]);
      }
      setIsEditorOpen(false);
      setEditingBlog(null);
    } catch (err: any) {
      setError(err.message);
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

  if (!isAdmin) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-heading text-white mb-4 uppercase tracking-[0.2em] opacity-50">
          Access Restricted
        </h2>
        <p className="text-white/40 mb-8">
          Only high-level administrators can access the publication editorial
          suite.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tight">
            Editorial Suite
          </h1>
          <p className="text-white/40 text-sm">
            Manage Spotlight Africa's narrative through editorial content.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-3 px-8 py-3 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-accent-gold/10"
        >
          <Plus size={16} />
          Publish New Blog
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Articles",
            value: blogs.length,
            icon: <BookOpen className="text-accent-gold" size={18} />,
          },
          {
            label: "Published Items",
            value: blogs.length,
            icon: <Calendar className="text-accent-gold" size={18} />,
          },
          {
            label: "Total Creators",
            value: new Set(blogs.map((b) => b.author)).size,
            icon: <UserIcon className="text-accent-gold" size={18} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/2 border border-white/5 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <p className="text-3xl font-heading font-bold text-white tracking-widest leading-none">
              {stat.value.toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      {/* Blogs List */}
      <div className="bg-white/2 border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-8 h-px bg-accent-gold/30" />
            Publication Archives
          </h2>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search archives..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-[10px] uppercase font-bold tracking-widest text-white focus:outline-none focus:border-accent-gold/40 transition-all w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {blogs.length === 0 ? (
            <div className="p-20 text-center text-white/20 italic font-serif">
              No publications found in the archives.
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="group flex flex-col md:flex-row items-center gap-6 p-6 hover:bg-white/5 transition-all"
              >
                <div className="w-full md:w-32 aspect-square bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent-gold py-1 px-2 bg-accent-gold/10 border border-accent-gold/20">
                      Published
                    </span>
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-medium text-white truncate group-hover:text-accent-gold transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={12} /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full uppercase tracking-[0.1em]">
                      slug: /{blog.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-3 bg-white/5 hover:bg-accent-gold hover:text-black text-white/50 transition-all rounded-none border border-white/5"
                    title="Edit Publication"
                  >
                    <Edit2 size={16} />
                  </button>
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="p-3 bg-white/5 hover:bg-white/10 text-white/50 transition-all rounded-none border border-white/5"
                    title="View Live"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(blog.slug)}
                    className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-all rounded-none border border-white/5"
                    title="Delete Permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bg-surface border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <h2 className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.4em]">
                  {editingBlog?.id
                    ? "Update Publication"
                    : "Draft New Publication"}
                </h2>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSave}
                className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 custom-scrollbar"
              >
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase font-bold tracking-widest">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      value={editingBlog?.title || ""}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, "") // Remove non-word chars
                          .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
                          .replace(/^-+|-+$/g, ""); // Trim dashes from ends

                        setEditingBlog({
                          ...editingBlog!,
                          title,
                          slug,
                        });
                      }}
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex justify-between">
                      Slug
                      <span className="text-[8px] opacity-30 lowercase">
                        Auto-generated from title
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      value={editingBlog?.slug || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog!,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-0-]/g, ""),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white/60 focus:outline-none focus:border-accent-gold/40 transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                      Author
                    </label>
                    <input
                      required
                      type="text"
                      value={editingBlog?.author || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog!,
                          author: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                      Publish Date
                    </label>
                    <input
                      required
                      type="date"
                      value={
                        editingBlog?.published_at
                          ? editingBlog.published_at.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog!,
                          published_at: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all appearance-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    Hero Image URL
                  </label>
                  <input
                    required
                    type="url"
                    value={editingBlog?.image_url || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog!,
                        image_url: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-accent-gold/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    Article Body
                  </label>
                  <textarea
                    required
                    rows={12}
                    value={editingBlog?.content || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog!,
                        content: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-accent-gold/40 transition-all resize-none font-serif text-lg leading-relaxed italic"
                  />
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    disabled={saving}
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving
                      ? "Processing..."
                      : editingBlog?.id
                        ? "Update Publication"
                        : "Finalize & Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-8 py-4 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagementPage;
