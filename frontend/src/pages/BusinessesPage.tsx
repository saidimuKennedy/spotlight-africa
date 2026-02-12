import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchBusinesses, Business } from "../lib/api";
import { UpcomersSection } from "../components";
import { useNavigate } from "react-router-dom";

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBusinesses(100, 0);
        setBusinesses(data);
      } catch (err) {
        console.error("Failed to fetch businesses", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-hero text-6xl md:text-8xl"
        >
          The Ecosystem.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-xl font-serif italic mt-4 max-w-2xl"
        >
          Explore the visionaries, innovators, and market-shapers defining the
          next era of African excellence.
        </motion.p>
      </div>

      <UpcomersSection
        initialData={businesses}
        loading={loading}
        onNavigate={(biz) => navigate(`/business/${biz.id}`)}
      />
    </div>
  );
};

export default BusinessesPage;
