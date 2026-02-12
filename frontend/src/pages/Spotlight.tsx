import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Business {
  ID: number;
  Name: string;
  Description: string;
  Industry: string;
  IsFeatured: boolean;
  HealthScore: number;
}

const Spotlight = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/businesses")
      .then((res) => res.json())
      .then((data) => {
        // Sort by HealthScore descending
        const sorted = (data || []).sort(
          (a: Business, b: Business) => b.HealthScore - a.HealthScore,
        );
        setBusinesses(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch businesses:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-obsidian text-white flex items-center justify-center">
        Loading...
      </div>
    );

  const topBusiness = businesses[0];
  const risingStars = businesses.slice(1, 4);
  const remainingBusinesses = businesses.slice(4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-6 gap-4 h-screen p-4 bg-obsidian selection:bg-neon-lime selection:text-black">
      {/* 1. THE CROWN JEWEL - Top Left (Large) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 md:row-span-3 bg-forest-deep rounded-[40px] p-8 border border-white/5 relative overflow-hidden group"
      >
        {topBusiness ? (
          <>
            <div className="absolute top-6 right-6 px-3 py-1 bg-neon-lime text-black text-[10px] font-bold rounded-full uppercase">
              Top Ranked
            </div>
            <div className="mt-20 relative z-10">
              <span className="text-white/40 font-mono text-sm">
                #01 Spotlight
              </span>
              <h2 className="text-5xl font-black text-white mt-2 leading-tight">
                {topBusiness.Name}
              </h2>
              <p className="text-white/60 mt-4 max-w-xs text-sm">
                {topBusiness.Description}
              </p>
            </div>
            {/* Metric Bar mirroring the reference */}
            <div className="mt-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-lime transition-all duration-1000 ease-out"
                style={{ width: `${topBusiness.HealthScore}%` }}
              ></div>
            </div>
            <div className="mt-2 text-neon-lime text-xs font-mono">
              Health Score: {topBusiness.HealthScore}/100
            </div>

            {/* Background Glow Effect */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-neon-lime/5 rounded-full blur-3xl group-hover:bg-neon-lime/10 transition-colors duration-500"></div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            No data available
          </div>
        )}
      </motion.div>

      {/* 2. THE ECOSYSTEM PULSE - Top Right (Small) */}
      <div className="md:col-span-1 md:row-span-2 bg-[#141414] rounded-[30px] p-6 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
        <div>
          <h4 className="text-white/40 text-xs uppercase tracking-tighter">
            Total Valuation
          </h4>
          <div className="text-3xl font-bold text-white mt-2">$24.8M</div>
          <div className="text-neon-lime text-xs mt-1">+12.4% this month</div>
        </div>
      </div>

      {/* 3. QUICK STATS - Far Right (Small) */}
      <div className="md:col-span-1 md:row-span-2 bg-forest-deep/50 rounded-[30px] p-6 border border-white/5 flex flex-col justify-center items-center hover:bg-forest-deep/60 transition-colors">
        <div className="w-16 h-16 rounded-full border-4 border-neon-lime flex items-center justify-center text-white font-bold text-xl">
          {businesses.length}
        </div>
        <span className="text-[10px] text-white/40 uppercase mt-4 tracking-widest">
          Listed Businesses
        </span>
      </div>

      {/* 4. THE RISING STARS - Middle Right (Medium) */}
      <div className="md:col-span-2 md:row-span-2 bg-[#111] rounded-[30px] p-6 border border-white/5 overflow-y-auto custom-scrollbar">
        <h4 className="text-white/40 text-xs uppercase mb-4 sticky top-0 bg-[#111] py-2 z-10">
          Rising Stars
        </h4>
        <div className="space-y-4">
          {risingStars.map((biz) => (
            <div
              key={biz.ID}
              className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] text-white/60 font-mono">
                  {biz.Name.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-medium text-white block group-hover:text-neon-lime transition-colors">
                    {biz.Name}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {biz.Industry}
                  </span>
                </div>
              </div>
              <span className="text-neon-lime font-mono text-xs">
                {biz.HealthScore}%
              </span>
            </div>
          ))}
          {risingStars.length === 0 && (
            <div className="text-white/20 text-xs text-center">
              No rising stars to display.
            </div>
          )}
        </div>
      </div>

      {/* 5. THE MAIN GALLERY - Bottom Full Width */}
      <div className="md:col-span-4 md:row-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-1">
        {remainingBusinesses.map((biz) => (
          <div
            key={biz.ID}
            className="bg-forest-deep rounded-[30px] p-4 border border-white/5 flex items-center gap-4 hover:border-neon-lime/30 transition-all hover:-translate-y-1"
          >
            <div className="w-10 h-10 min-w-10 rounded-full bg-linear-to-tr from-neon-lime to-forest-deep flex items-center justify-center text-black font-bold text-xs">
              {biz.HealthScore}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-bold truncate">
                {biz.Name}
              </div>
              <div className="text-white/40 text-[10px] truncate">
                {biz.Industry}
              </div>
            </div>
          </div>
        ))}
        {remainingBusinesses.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-[30px] p-4 border border-white/5 flex items-center justify-center"
            >
              <span className="text-white/10 text-xs">Slot Available</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Spotlight;
