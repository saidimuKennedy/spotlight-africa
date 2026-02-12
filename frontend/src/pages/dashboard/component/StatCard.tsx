import React from "react";

/**
 * Stat Card for business metrics
 */
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

const StatCard = ({
  icon,
  value,
  label,
  color = "text-accent-gold",
}: StatCardProps) => (
  <div className="relative p-4 sm:p-6 bg-white/5 border border-white/5 overflow-hidden group">
    <div
      className={`absolute top-0 right-0 p-4 opacity-10 ${color} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-heading font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
        {label}
      </div>
    </div>
  </div>
);

export default StatCard;
