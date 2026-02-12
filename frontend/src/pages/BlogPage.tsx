import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Tag, Loader2 } from "lucide-react";
import { fetchPosts, BlogPost } from "../lib/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="bg-bg-primary min-h-screen pt-24">
      {/* Header */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="text-accent-gold text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Insights & Perspectives
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter mb-8 leading-none">
            THE DIGITAL{" "}
            <span className="text-accent-gold italic-serif lowercase">
              pulse
            </span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl font-serif italic">
            Thought leadership from the forefront of African business innovation
            and strategic growth.
          </p>
        </motion.div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-accent-gold animate-spin" />
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Synchronizing Pulse...
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full bg-white/2 border border-white/5 hover:border-accent-gold/20 transition-all cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={post.image_url || "/images/blog_hero_africa.png"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase font-bold tracking-widest mb-4">
                    <div className="flex items-center gap-1.5 line-clamp-1">
                      <Calendar size={12} className="text-accent-gold" />
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-accent-gold" />
                      {post.author}
                    </div>
                  </div>

                  <h2 className="text-2xl font-heading font-bold text-white mb-4 group-hover:text-accent-gold transition-colors leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                    Read Article{" "}
                    <ArrowRight size={14} className="text-accent-gold" />
                  </div>
                </div>
              </motion.article>
            ))}

            {posts.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10">
                <p className="text-white/40 font-serif italic text-lg">
                  The editorial team is currently preparing the next dispatch.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative p-12 md:p-20 bg-linear-to-br from-white/5 to-white/1 border border-white/5 overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-accent-gold">
            <Tag size={120} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight">
              Stay ahead of the curve.
            </h2>
            <p className="text-white/50 mb-10 text-lg italic font-serif leading-relaxed">
              Get weekly insights into Africa's most promising startups and
              market shifts directly in your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-bg-surface border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                id="newsletter-email"
              />
              <button className="px-8 py-4 bg-accent-gold text-black font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
