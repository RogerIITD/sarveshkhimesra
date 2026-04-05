"use client";


interface FilterBarProps {
  onTypeChange: (type: string) => void;
  onTagChange: (tag: string) => void;
  activeType: string;
  activeTag: string;
  availableTags: string[];
}

const types = ["All", "Short Takes", "Essays"];

export default function FilterBar({
  onTypeChange,
  onTagChange,
  activeType,
  activeTag,
  availableTags,
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === type
                ? "bg-primary text-white"
                : "bg-white text-secondary border border-secondary/15 hover:bg-primary/10"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagChange("")}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
            activeTag === ""
              ? "bg-accent text-white"
              : "bg-white text-text/70 border border-text/15 hover:bg-accent/10"
          }`}
        >
          all tags
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
              activeTag === tag
                ? "bg-accent text-white"
                : "bg-white text-text/70 border border-text/15 hover:bg-accent/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
