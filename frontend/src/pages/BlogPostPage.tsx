import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Loader2,
  Share2,
  Bookmark,
} from "lucide-react";
import { fetchBlog, Blog } from "../lib/api";
import { format } from "date-fns";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlog = async () => {
      if (!slug) return;
      try {
        const data = await fetchBlog(slug);
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };
    getBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-accent-gold animate-spin" />
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
          Retrieving Editorial...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest opacity-50">
          Archive Missing
        </h1>
        <button
          onClick={() => navigate("/blog")}
          className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-heading"
        >
          Return to Pulse
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative h-[70vh] w-full overflow-hidden border-b border-white/5">
        <img
          src={blog.image_url || "/images/blog_hero_africa.png"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-12 md:p-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6 mb-8"
            >
              <span className="px-4 py-1.5 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.3em]">
                Exclusive Dispatch
              </span>
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={14} className="text-accent-gold" />
                {format(
                  new Date(blog.published_at || blog.created_at),
                  "MMMM d, yyyy",
                )}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-heading font-bold text-white tracking-tighter leading-[0.95] mb-12 max-w-4xl"
            >
              {blog.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-bg-primary py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Meta */}
          <aside className="lg:col-span-3 space-y-12 order-2 lg:order-1">
            <div className="flex flex-col gap-6 p-8 bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold border border-accent-gold/20">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">
                    Editorial By
                  </p>
                  <p className="text-sm text-white font-medium font-heading">
                    {blog.author}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <button className="w-full flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-accent-gold transition-colors">
                  Share Article <Share2 size={14} />
                </button>
                <button className="w-full flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-accent-gold transition-colors">
                  Save to Archive <Bookmark size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] pl-8 border-l border-accent-gold/30">
                Key Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Innovation", "Markets", "Digital Economy"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-white/30 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Article Body */}
          <main className="lg:col-span-8 lg:col-start-5 order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-white/5">
              <button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-accent-gold transition-all"
              >
                <ArrowLeft size={16} />
                Return to Dispatch List
              </button>
            </div>

            <div className="prose prose-invert prose-gold max-w-none">
              <div
                className="text-white/80 leading-[1.8] font-serif text-xl space-y-10 whitespace-pre-wrap selection:bg-accent-gold selection:text-black"
                style={{ lineClamp: "initial" }}
              >
                {blog.content}
              </div>
            </div>

            {/* Post Footer */}
            <div className="mt-24 pt-12 border-t border-white/5">
              <div className="p-12 bg-linear-to-br from-white/[0.03] to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">
                    Continue the journey.
                  </h3>
                  <p className="text-white/40 text-sm italic font-serif">
                    Deep insights delivered to your inbox weekly.
                  </p>
                </div>
                <button className="px-8 py-4 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
