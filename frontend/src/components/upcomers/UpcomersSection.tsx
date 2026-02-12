/**
 * UpcomersSection Component
 *
 * Displays emerging businesses (startups/upcomers) with search,
 * filter, and sort functionality.
 * Refined for "Luxury Editorial" aesthetic.
 *
 * @component
 */
import { motion, AnimatePresence } from "framer-motion";
import { Business } from "../../lib/api";
import { CompactCard } from "./components/CompactCard";
import { FilterDropdown } from "./components/FilterDropDowns";
import { SearchInput } from "./components/SearchInput";
import {
  useUpcomersLogic,
  SortOption,
  CategoryFilter,
} from "./hooks/useUpcomersLogic";

interface UpcomersSectonProps {
  initialData?: Business[];
  loading?: boolean;
  onNavigate?: (business: Business) => void;
}

const UpcomersSection = ({
  initialData = [],
  loading: parentLoading = false,
  onNavigate,
}: UpcomersSectonProps) => {
  const {
    filteredBusinesses,
    loading,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
  } = useUpcomersLogic({ initialData });

  const sortOptions = [
    { value: "recent", label: "Recent" },
    { value: "health_score", label: "Score" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "startup", label: "Startups" },
    { value: "innovator", label: "Innovators" },
    { value: "mentor", label: "Mentors" },
  ];

  return (
    <section className="relative py-32 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col">
      {/* 1. CENTRAL TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="heading-hero text-[clamp(2.5rem,5vw,5rem)] leading-none font-normal tracking-tight text-white mb-6">
          Businesses To Look Out For
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 relative z-10">
        {/* 2. EDITORIAL BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 lg:col-start-2 pl-6 sm:pl-8 border-l border-white/20"
        >
          <p className="font-heading text-lg sm:text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
            A curated selection of African businesses gaining momentum right
            now. These are companies attracting attention through growth,
            innovation, and relevance—not hype. Some are quietly scaling. Others
            are redefining their category. All are worth watching.
          </p>
        </motion.div>

        {/* 3. TEXTUAL ACTIONS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 lg:col-start-8 flex flex-col justify-end items-start gap-3 mt-8 lg:mt-0"
        >
          <a
            href="#selection"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest text-accent-gold hover:text-white transition-colors"
          >
            <span>View this week’s selection</span>
            <span className="w-8 h-[1px] bg-accent-gold group-hover:w-16 transition-all duration-300"></span>
          </a>
          <a
            href="#learn"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <span>See why they matter</span>
            <span className="w-0 h-[1px] bg-white group-hover:w-8 transition-all duration-300"></span>
          </a>
        </motion.div>
      </div>

      {/* 4. FILTERS (Invisible Power) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-6 mb-12 border-t border-white/5 pt-6"
      >
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        <div className="flex items-center gap-6">
          <FilterDropdown
            label="Sort:"
            value={sortBy}
            options={sortOptions}
            onChange={(v) => setSortBy(v as SortOption)}
          />
          <span className="text-white/10">|</span>
          <FilterDropdown
            label="Cat:"
            value={categoryFilter}
            options={categoryOptions}
            onChange={(v) => setCategoryFilter(v as CategoryFilter)}
          />
        </div>
      </motion.div>

      {/* 5. CONTENT REVEAL */}
      <div className="min-h-[400px]">
        {/* Results Info - Barely visible */}
        {filteredBusinesses.length > 0 && (
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6 text-right">
            Volume: {filteredBusinesses.length}
          </p>
        )}

        {/* Business Grid - Pinterest style Masonry layout */}
        {filteredBusinesses.length > 0 || parentLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {parentLoading || loading
                ? // Loading Skeletons
                  [...Array(6)].map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="break-inside-avoid mb-6"
                    >
                      <div
                        className={`w-full bg-white/5 animate-pulse ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-[3/4]"} mb-2`}
                      />
                      <div className="h-2 w-1/3 bg-white/5 animate-pulse mb-1" />
                      <div className="h-2 w-1/4 bg-white/5 animate-pulse" />
                    </motion.div>
                  ))
                : filteredBusinesses.map((business, index) => (
                    <div key={business.id} className="mb-6 break-inside-avoid">
                      <CompactCard
                        business={business}
                        onNavigate={onNavigate}
                        variant={index % 3}
                      />
                    </div>
                  ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-center py-20 flex flex-col items-center justify-center opacity-50"
          >
            <p className="font-heading text-xl text-white mb-2 italic">
              "Silence is also an answer."
            </p>
            <p className="text-sm text-white/40 uppercase tracking-widest">
              No businesses found
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-xs border-b border-white/20 hover:border-white pb-1 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Helper to load more if needed, subtle */}
      {filteredBusinesses.length > 6 && hasMore && (
        <div className="flex justify-center mt-24">
          <button
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white pb-2 duration-500"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default UpcomersSection;
