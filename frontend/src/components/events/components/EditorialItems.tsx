/**
 * Editorial List Item
 */
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface EditorialItemProps {
  category: string;
  title: string;
  description: string;
  link: string;
}

export const EditorialItem = ({
  category,
  title,
  description,
  link,
}: EditorialItemProps) => (
  <Link
    to={link}
    className="group block py-8 border-b border-white/10 first:border-t"
  >
    <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
      <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em] min-w-[100px]">
        {category}
      </span>
      <div className="flex-1">
        <h4 className="text-xl font-heading text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
          {title}
        </h4>
        <p className="text-sm text-white/50 max-w-md font-light leading-relaxed">
          {description}
        </p>
      </div>
      <div className="self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight size={18} className="text-white" />
      </div>
    </div>
  </Link>
);
