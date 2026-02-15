import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Tag, Loader2 } from "lucide-react";
import { fetchBlogs, Blog } from "../lib/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  return (
    <div className="bg-bg-primary min-h-screen pt-24">
      {/* Header */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
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
              Thought leadership from the forefront of African business
              innovation and strategic growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="text-accent-gold animate-spin" />
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                Synchronizing Pulse...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, i) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative h-[500px] flex flex-col justify-end overflow-hidden border border-white/5 hover:border-accent-gold/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={blog.image_url || "/images/blog_hero_africa.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                    />
                    {/* Subtle Darkening Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-8 pt-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {/* Glassmorphic Background with Gradient Mask */}
                    <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/90 to-transparent backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 -z-20 bg-linear-to-t from-black via-black/60 to-transparent transition-all" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-accent-gold text-black text-[9px] font-bold uppercase tracking-[0.2em]">
                          Publication
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[9px] text-white/40 uppercase font-bold tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-accent-gold" />
                          {format(
                            new Date(blog.published_at || blog.created_at),
                            "MMM d, yyyy",
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 font-heading">
                          <User size={12} className="text-accent-gold" />
                          {blog.author}
                        </div>
                      </div>

                      <h2 className="text-2xl font-heading font-bold text-white group-hover:text-accent-gold transition-colors leading-tight">
                        {blog.title}
                      </h2>

                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                        {blog.content.substring(0, 120)}...
                      </p>

                      <div className="flex items-center gap-3 text-white text-[9px] font-bold uppercase tracking-[0.3em] pt-2">
                        <span className="group-hover:mr-2 transition-all">
                          Read Dispatch
                        </span>
                        <ArrowRight size={14} className="text-accent-gold" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}

              {blogs.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10">
                  <p className="text-white/40 font-serif italic text-lg">
                    The editorial team is currently preparing the next dispatch.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
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
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
