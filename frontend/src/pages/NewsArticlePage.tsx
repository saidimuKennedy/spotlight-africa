import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  ExternalLink,
  ArrowLeft,
  Clock,
  Share2,
} from "lucide-react";
import { fetchNewsArticle, fetchNews, AppNews } from "../lib/api";

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<AppNews | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<AppNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;
      try {
        const data = await fetchNewsArticle(slug);
        setArticle(data);

        // Fetch related articles (same category or source)
        const allNews = await fetchNews();
        const related = allNews
          .filter(
            (item) =>
              item.id !== data.id &&
              (item.category === data.category || item.source === data.source),
          )
          .slice(0, 5);
        setRelatedArticles(related);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-white/40">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Article Not Found
          </h2>
          <Link
            to="/news"
            className="text-accent-gold hover:brightness-125 transition-all"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {/* Hero Image */}
      {article.image_url && (
        <div className="relative h-[60vh] bg-slate-900 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/50 to-transparent" />
        </div>
      )}

      {/* Main Content Container */}
      <div
        className={`relative ${article.image_url ? "-mt-20 md:-mt-24" : "pt-24 md:pt-32"} z-10`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Main Article Column - Centered Prose */}
            <article className="lg:col-span-8 xl:col-span-9">
              {/* Back Button */}
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-accent-gold transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                Back to News
              </Link>

              {/* Article Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
                  <span className="text-accent-gold">{article.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    {new Date(article.published_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    {Math.ceil(article.content.length / 1000)} min read
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                  {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-xl text-white/60 leading-relaxed font-serif italic border-l-2 border-accent-gold pl-6">
                    {article.excerpt}
                  </p>
                )}

                {/* Author & Tags */}
                <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/10">
                  {article.author && (
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                        Author
                      </div>
                      <div className="text-sm font-bold text-white">
                        {article.author}
                      </div>
                    </div>
                  )}
                  {article.tags && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag size={14} className="text-white/20" />
                      {article.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 text-[10px] text-white/40 uppercase tracking-wider"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.header>

              {/* Article Content - Centered Prose */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                {/* Main Article Image (if different from hero) */}
                {article.image_url && (
                  <div className="mb-12 -mx-6 md:mx-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                {/* Article Body - Centered Prose */}
                <div className="prose prose-invert prose-lg max-w-3xl mx-auto">
                  {/* Content - Format paragraphs */}
                  <div className="text-white/80 leading-relaxed space-y-6 text-lg font-serif">
                    {article.content.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-6">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Read Full Article CTA */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col gap-4">
                      <p className="text-white/50 leading-relaxed italic font-serif text-base">
                        This is a curated summary. For the complete article with
                        all details, multimedia content, and interactive
                        elements, visit the original source.
                      </p>
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent-gold hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                      >
                        Read further on {article.source}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Article Footer Info */}
                  <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50">
                    <p>
                      <strong className="text-white/70">Source:</strong>{" "}
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-gold hover:brightness-125 transition-all"
                      >
                        {article.source}
                      </a>
                    </p>
                    <p className="mt-2">
                      <strong className="text-white/70">Published:</strong>{" "}
                      {new Date(article.published_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Share & Actions */}
              <div className="flex items-center gap-4 py-8 border-t border-white/10">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-all text-sm">
                  <Share2 size={16} />
                  Share Article
                </button>
              </div>
            </article>

            {/* Sidebar - Related Articles & Ad Space */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
              <div className="sticky top-24 space-y-8">
                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 pb-4 border-b border-white/10">
                      Related Articles
                    </h3>
                    <div className="space-y-6">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.id}
                          to={`/news/${related.slug}`}
                          className="block group"
                        >
                          {related.image_url && (
                            <div className="aspect-video bg-slate-900 mb-3 overflow-hidden">
                              <img
                                src={related.image_url}
                                alt={related.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="text-[10px] text-accent-gold uppercase tracking-widest mb-2">
                            {related.source}
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors leading-tight line-clamp-2">
                            {related.title}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsArticlePage;
