import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Tag, Loader2, ArrowRight } from "lucide-react";
import { fetchNews, AppNews } from "../lib/api";

const NewsPage = () => {
  const [news, setNews] = useState<AppNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const categories = ["all", "news", "analysis", "opinion", "report"];
  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-bold leading-none mb-6">
              African Business
              <br />
              <span className="text-accent-gold">Intelligence</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Curated insights from leading African business publications.
              Technology, finance, innovation, and market analysis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <div className="flex gap-3 overflow-x-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-accent-gold text-black"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">
                No articles found in this category.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white/2 border border-white/5 hover:border-accent-gold/30 transition-all"
                >
                  <Link to={`/news/${article.slug}`} className="block">
                    {/* Image */}
                    {article.image_url && (
                      <div className="aspect-video bg-slate-900 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <span className="text-accent-gold">
                          {article.source}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(article.published_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-heading font-bold text-white group-hover:text-accent-gold transition-colors leading-tight">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Tags */}
                      {article.tags && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag size={12} className="text-white/20" />
                          {article.tags
                            .split(",")
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-white/30 uppercase tracking-wider"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-accent-gold group-hover:brightness-125 transition-all">
                        Read Article
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
