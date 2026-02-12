/**
 * SearchInput Component
 */
import { X, Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative flex items-center transition-all duration-300 ${isOpen ? "w-64" : "w-auto"}`}
    >
      {isOpen ? (
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => !value && setIsOpen(false)}
            className="w-full bg-transparent border-b border-white/20 py-2 pl-0 pr-8 text-sm text-white focus:outline-none focus:border-white/40 placeholder:text-white/20 font-light"
          />
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="absolute right-0 top-2 text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
};
