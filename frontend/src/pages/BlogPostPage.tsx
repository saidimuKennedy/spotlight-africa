import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Loader2, Share2 } from "lucide-react";
import { fetchPost, BlogPost } from "../lib/api";
import { format } from "date-fns";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      if (!slug) return;
      try {
        const data = await fetchPost(slug);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };
    getPost();
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

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-heading font-bold text-white">
          Post Not Found
        </h1>
        <button
          onClick={() => navigate("/blog")}
          className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Return to Pulse
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={post.image_url || "/images/blog_hero_africa.png"}
          alt={post.title}
          className="w-full h-full object-cover grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/50 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center pt-24">
          <div className="max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <span className="px-3 py-1 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-widest">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} className="text-accent-gold" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-heading font-bold text-white tracking-tighter leading-[0.9] mb-12"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-accent-gold">
                  <User size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
                    Author
                  </p>
                  <p className="text-sm text-white font-medium">
                    {post.author}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 -mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-bg-surface border border-white/5 p-8 md:p-16 shadow-2xl">
            <div className="flex items-center justify-between mb-16 pb-8 border-b border-white/5">
              <button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-accent-gold transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Pulse
              </button>
              <button className="text-white/40 hover:text-accent-gold transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            <div
              className="prose prose-invert prose-gold max-w-none text-white/70 leading-relaxed font-serif text-lg space-y-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
