import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Loader2,
  ArrowRight,
  Clock,
  Globe,
} from "lucide-react";
import { fetchEvents, AppEvent } from "../lib/api";
import {
  format,
  isPast,
  startOfToday,
  isSameWeek,
  isSameMonth,
  addWeeks,
  isBefore,
  parseISO,
  startOfMonth,
  addMonths,
} from "date-fns";

const EventCard = ({
  event,
  isExpanded,
  onToggle,
  isDimmed,
}: {
  event: AppEvent;
  isExpanded: boolean;
  onToggle: () => void;
  isDimmed: boolean;
}) => {
  return (
    <motion.div
      layout
      onClick={onToggle}
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: isDimmed ? 0.4 : 1,
        scale: isExpanded ? 1.02 : 1,
        x: 0,
        zIndex: isExpanded ? 40 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative flex-shrink-0 w-[300px] md:w-[400px] cursor-pointer group select-none ${isExpanded ? "z-40" : "z-0"}`}
    >
      <div className="flex flex-col gap-6 py-8 px-4 border-l border-white/5 group-hover:border-accent-gold/30 transition-colors">
        {/* Date Signal */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-heading font-light text-white/20 group-hover:text-accent-gold/40 transition-colors">
            {format(parseISO(event.start_date), "dd")}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {format(parseISO(event.start_date), "EEEE")}
          </span>
        </div>

        {/* Minimal Info */}
        <div className="space-y-3">
          <h3
            className={`text-xl md:text-2xl font-heading font-bold text-white transition-all duration-500 leading-tight ${isExpanded ? "text-accent-gold scale-110 origin-left" : "group-hover:text-accent-gold/80"}`}
          >
            {event.title}
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {format(parseISO(event.start_date), "HH:mm")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {event.is_virtual ? <Globe size={12} /> : <MapPin size={12} />}
              {event.location}
            </span>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-10 space-y-10 border-t border-white/5 mt-6">
                {/* One-line contextual insight */}
                <p className="text-2xl md:text-3xl font-heading font-light text-white leading-tight">
                  {event.description?.split('.')[0]}.
                </p>

                {event.image_url && (
                  <div className="aspect-video bg-slate-900 overflow-hidden relative group/img">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale-[0.8] brightness-50 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 to-transparent opacity-60" />
                  </div>
                )}
                
                <div className="flex flex-col gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                      <div className="w-8 h-px bg-accent-gold/30" />
                      Detail
                    </div>
                    <p className="text-white/50 leading-relaxed font-serif text-lg">
                      {event.description || "An exclusive gathering for selected ecosystem leaders and visionaries. Engagement is focused on strategic alignment and market expansion across the African technological landscape."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-white/5">
                    <div className="flex gap-12">
                      <div>
                        <span className="block text-[8px] text-white/20 uppercase tracking-[0.3em] mb-2 font-bold">Category</span>
                        <span className="text-[10px] text-white/60 uppercase font-bold tracking-[0.2em]">{event.category}</span>
                      </div>
                      {event.organizer && (
                        <div>
                          <span className="block text-[8px] text-white/20 uppercase tracking-[0.3em] mb-2 font-bold">Convener</span>
                          <span className="text-[10px] text-white/60 uppercase font-bold tracking-[0.2em]">{event.organizer}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={event.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-accent-gold hover:text-white transition-all text-[10px] font-bold uppercase tracking-[0.5em] group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Process Registration
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight size={14} />
                      </motion.span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const EventSection = ({
  title,
  events,
  expandedId,
  onToggle,
}: {
  title: string;
  events: AppEvent[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) return null;

  return (
    <div className="mb-24 last:mb-0">
      <div className="max-w-[1400px] mx-auto px-6 mb-8 flex items-end justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/5 mx-8 mb-2 hidden md:block" />
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto overflow-y-hidden no-scrollbar px-6 md:px-12 lg:px-24 snap-x cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-4 min-w-max pb-12">
          {events.map((event) => (
            <div key={event.id} className="snap-start">
              <EventCard
                event={event}
                isExpanded={expandedId === event.id}
                onToggle={() => onToggle(event.id)}
                isDimmed={expandedId !== null && expandedId !== event.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        // Filter out past events
        const upcoming = data.filter((e) => !isPast(parseISO(e.start_date)));
        // Sort by date
        const sorted = upcoming.sort(
          (a, b) =>
            parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime(),
        );
        setEvents(sorted);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const today = startOfToday();
  const nextWeek = addWeeks(today, 1);

  const sections = [
    {
      title: "This Week",
      events: events.filter((e) => isSameWeek(parseISO(e.start_date), today)),
    },
    {
      title: "Later This Month",
      events: events.filter(
        (e) =>
          isSameMonth(parseISO(e.start_date), today) &&
          !isSameWeek(parseISO(e.start_date), today),
      ),
    },
  ];

  // Group rest by month
  const futureMonths = [];
  let currentMonth = startOfMonth(addMonths(today, 1));

  // Look ahead 12 months for now
  for (let i = 0; i < 12; i++) {
    const monthEvents = events.filter((e) =>
      isSameMonth(parseISO(e.start_date), currentMonth),
    );
    if (monthEvents.length > 0) {
      futureMonths.push({
        title: format(currentMonth, "MMMM yyyy"),
        events: monthEvents,
      });
    }
    currentMonth = addMonths(currentMonth, 1);
  }

  const allSections = [...sections, ...futureMonths].filter(
    (s) => s.events.length > 0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
          Aligning Signal
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white overflow-x-hidden">
      {/* Editorial Header */}
      <section className="pt-32 pb-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-heading font-bold leading-[0.85] tracking-tighter mb-8">
              The <span className="text-accent-gold italic">Synchrony</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-2xl font-serif italic leading-relaxed">
              Curated business moments across the continent. A timeline of
              signals, summits, and elite networking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Temporal Timeline */}
      <section className="py-24">
        {allSections.length > 0 ? (
          allSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <EventSection
                title={section.title}
                events={section.events}
                expandedId={expandedId}
                onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
              />
            </motion.div>
          ))
        ) : (
          <div className="max-w-2xl mx-auto text-center py-40 px-6">
            <p className="text-white/20 font-serif italic text-2xl leading-relaxed">
              The current horizon is quiet. No upcoming signals detected for the
              next quarter.
            </p>
          </div>
        )}
      </section>

      {/* Global CSS for no-scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
