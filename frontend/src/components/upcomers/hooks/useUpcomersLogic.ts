import { useState, useMemo, useEffect } from "react";
import { Business, fetchBusinesses } from "../../../lib/api";

export type SortOption = "recent" | "health_score" | "alphabetical";
export type CategoryFilter = "all" | "startup" | "innovator" | "mentor";

interface UseUpcomersLogicProps {
  initialData: Business[];
  limit?: number;
}

export const useUpcomersLogic = ({
  initialData,
  limit = 10,
}: UseUpcomersLogicProps) => {
  const [businesses, setBusinesses] = useState<Business[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  // Sync internal state when initialData changes
  useEffect(() => {
    if (initialData.length > 0) {
      setBusinesses(initialData);
    }
  }, [initialData]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const offset = businesses.length;
      const newData = await fetchBusinesses(limit, offset);

      if (newData.length < limit) {
        setHasMore(false);
      }
      // Append new data to existing list, avoiding duplicates
      setBusinesses((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));
        const uniqueNewData = newData.filter((b) => !existingIds.has(b.id));
        return [...prev, ...uniqueNewData];
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading more businesses:", error);
      setLoading(false);
    }
  };

  const filteredBusinesses = useMemo(() => {
    let result = [...businesses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.industry?.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (b) => b.category?.toLowerCase() === categoryFilter,
      );
    }

    switch (sortBy) {
      case "health_score":
        result.sort((a, b) => b.health_score - a.health_score);
        break;
      case "alphabetical":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return result;
  }, [businesses, searchQuery, sortBy, categoryFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("recent");
  };

  return {
    businesses,
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
  };
};
