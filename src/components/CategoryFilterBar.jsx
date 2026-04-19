import clsx from "clsx";
import { Link } from "react-router-dom";
import { CATEGORY_OPTIONS, createCategoryPath, normalizeCategoryValue } from "../data/mantraCatalog";

const CategoryFilterBar = ({
  selectedCategory = "all",
  onSelect,
  useLinks = false,
  className = ""
}) => {
  const activeCategory = normalizeCategoryValue(selectedCategory);

  return (
    <div className={clsx("overflow-x-auto scrollbar-hide -mx-4 px-4 scroll-smooth", className)}>
      <div className="flex w-max gap-3 pb-4">
        {CATEGORY_OPTIONS.map((item) => {
          const isActive = activeCategory === item.value;
          const sharedClasses = clsx(
            "mb-4 whitespace-nowrap rounded-full border px-6 py-2 text-sm font-semibold tracking-wide transition",
            isActive
              ? "border-[#FF9256] bg-[#FF9256] text-[#121212] shadow-[0_0_0_1px_rgba(255,146,86,0.22)]"
              : "border-[#383838] text-white hover:border-[#FF9256]/70 hover:text-[#FF9256]"
          );

          if (useLinks) {
            return (
              <Link key={item.value} to={createCategoryPath(item.value)} className={sharedClasses}>
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect?.(item.value)}
              aria-pressed={isActive}
              className={sharedClasses}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterBar;