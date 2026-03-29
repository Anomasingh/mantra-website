import React from "react";
import SquareMantraImage from "./SquareMantraImage";

const Card = ({ image, title }) => {
  return (
    <div className="max-w-[200px] text-center flex-shrink-0">
      <SquareMantraImage
        mantraName={title}
        alt={title}
        className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 lg:w-36 lg:h-36 mx-auto"
        fallbackSrc={image}
      />
      <p className="mt-2 text-sm truncate">
        {title
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')}
      </p>
    </div>
  );
};

export default Card;
