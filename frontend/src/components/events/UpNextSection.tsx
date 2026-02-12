/**
 * UpNextSection Component
 *
 * Showcases upcoming events, featured articles, and announcements.
 * Refined for "Luxury Editorial" aesthetic.
 *
 * @component
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Toast, { ToastType } from "../Toast";
import { subscribeNewsletter, fetchEvents, AppEvent } from "../../lib/api";
import { EditorialItem } from "./components/EditorialItems";
import { EventDisplay } from "./components/EventDisplay";

const UpNextSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Fetch events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const featuredEvent = {
    title: events[0]?.title || "African Innovators Summit 2026",
    date: events[0]?.start_date
      ? new Date(events[0].start_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Mar 15-17",
    location: events[0]?.location || "Nairobi, KE",
    link: events[0]?.link || "/network",
  };

  const articles = [
    {
      category: "Insight",
      title: "The Rise of African Fintech",
      description:
        "How startups are revolutionizing financial services across the continent.",
      link: "/blog",
    },
    {
      category: "Update",
      title: "New Categories Added",
      description:
        "Expanding our spotlight to include AgriTech, HealthTech, and EdTech sectors.",
      link: "/about",
    },
    {
      category: "Report",
      title: "Q1 Market Analysis",
      description:
        "A deep dive into investment trends shaping the coming year.",
      link: "/blog",
    },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email);
      setToast({
        message: "Successfully subscribed to the dispatch",
        type: "success",
        isVisible: true,
      });
      setEmail("");
    } catch (error) {
      setToast({
        message: "Failed to subscribe. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* 1. SECTION HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
      >
        <h2 className="heading-hero text-[clamp(2.5rem,5vw,5rem)] leading-none font-normal tracking-tight text-white max-w-2xl">
          On The Horizon
        </h2>

        <div className="flex flex-col items-end text-right">
          <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-4">
            Curated dispatches from the frontlines. Events, insights, and
            strategic announcements.
          </p>
        </div>
      </motion.div>

      {/* 2. MAIN CONTENT SPLIT */}
      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left: Headline Event (Dynamic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="w-full aspect-video bg-white/5 animate-pulse" />
          ) : (
            <EventDisplay {...featuredEvent} />
          )}

          {/* List of other events - NEW ADDITION */}
          {events.length > 1 && (
            <div className="mt-12 space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                More Upcoming Events
              </h4>
              {events.slice(1, 4).map((evt) => (
                <a
                  href={evt.link || "#"}
                  key={evt.id}
                  className="block group border-l-2 border-white/10 pl-4 hover:border-accent-gold transition-colors"
                >
                  <div className="text-[10px] font-bold text-accent-gold uppercase mb-1">
                    {new Date(evt.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {evt.location}
                  </div>
                  <div className="text-white font-heading text-lg group-hover:text-accent-gold transition-colors">
                    {evt.title}
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Editorial Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-between"
        >
          {/* List */}
          <div className="mb-16">
            {articles.map((item, index) => (
              <EditorialItem key={index} {...item} />
            ))}
          </div>

          {/* Newsletter - Minimal */}
          <div className="pt-8">
            <h5 className="text-xs uppercase tracking-widest text-white mb-6">
              The Weekly Dispatch
            </h5>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex items-center gap-4 border-b border-white/20 pb-4 group hover:border-white transition-colors"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-transparent border-none outline-none text-white placeholder:text-white/20 text-lg font-light w-full"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-bold uppercase tracking-widest text-accent-gold whitespace-nowrap opacity-50 group-hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "Join"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UpNextSection;
