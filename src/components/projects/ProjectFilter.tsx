"use client";

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function ProjectFilter({
  categories,
  activeCategory,
  onChange,
}: ProjectFilterProps) {
  const filters = ["ALL", ...categories];

  return (
    <div
      className="
        flex
        max-w-[760px]
        flex-wrap
        items-center
        justify-end
        gap-x-7
        gap-y-4
      "
      aria-label="Project categories"
    >
      {filters.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`
              relative
              shrink-0
              pb-1
              font-[var(--font-sans)]
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              transition-colors
              duration-300
              sm:text-[10px]
              ${
                isActive
                  ? "text-[#FFFFFF]"
                  : "text-[#FFFFFF]/40 hover:text-[#FFFFFF]/80"
              }
            `}
          >
            {category}

            <span
              className={`
                absolute
                bottom-0
                left-0
                h-px
                bg-[#FFFFFF]
                transition-all
                duration-300
                ${isActive ? "w-full" : "w-0"}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
