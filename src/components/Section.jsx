import SquareMantraImage from "./SquareMantraImage";
import { Link } from "react-router-dom";

const Section = ({ title, items, circle = false, artistDisable = false, topContent, getItemLink }) => (
  <div className="mt-10 px-4 md:px-10 lg:px-20 md:-mr-2">
    {/* Optional top content */}
    {topContent && (
      <div className="">
        {topContent}
      </div>
    )}

    {/* Header */}
    <div className="flex sm:flex-row justify-between sm:items-center gap-2 mb-6 sm:mb-10">
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>

    {/* Scrollable Items */}
    <div className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-3 lg:gap-4 xl:gap-6 pb-2 scroll-smooth whitespace-nowrap scrollbar-hide">
      {items.map((item, idx) => (
        (() => {
          const itemLink = getItemLink?.(item);
          const body = (
            <>
              <SquareMantraImage
                mantraName={item.title}
                alt={item.title}
                className="w-30 h-30 sm:w-30 sm:h-30 md:w-38 md:h-38"
                circle={circle}
                fallbackSrc={item.image}
              />
              <p className="mt-2 text-sm">
                {item.title
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')}
              </p>
              <p className={`text-xs text-gray-400 ${artistDisable ? "hidden" : "block"}`}>{item.artist}</p>
            </>
          );

          if (itemLink) {
            return (
              <Link
                key={idx}
                to={itemLink}
                className="max-w-[200px] text-center flex-shrink-0 cursor-pointer rounded-md transition hover:text-[#FF9256]"
              >
                {body}
              </Link>
            );
          }

          return (
            <div key={idx} className="max-w-[200px] text-center flex-shrink-0">
              {body}
            </div>
          );
        })()
      ))}
    </div>
  </div>
);

export default Section;
