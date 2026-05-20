import React, { useMemo, useState } from "react";
import { getMantraImageCandidates } from "../utils/mantraImage";

const SquareMantraImage = ({
  mantraName,
  alt,
  className = "",
  circle = false,
  fallbackSrc = "/images/HANUMAN%20CHALISA.png",
  priority = false
}) => {
  const candidates = useMemo(() => getMantraImageCandidates(mantraName), [mantraName]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const shapeClass = circle ? "rounded-full" : "rounded-lg";
  const currentSrc = usingFallback ? fallbackSrc : candidates[candidateIndex];
  const loadingMode = priority ? 'eager' : 'lazy';
  const fetchPriorityMode = priority ? 'high' : 'low';

  const handleError = () => {
    if (!usingFallback && candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
      return;
    }
    setUsingFallback(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#232323] ${shapeClass} ${className}`}>
      <img
        src={currentSrc}
        alt=""
        aria-hidden="true"
        loading={loadingMode}
        decoding="async"
        fetchPriority={fetchPriorityMode}
        className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-md ${shapeClass}`}
      />
      <img
        src={currentSrc}
        alt={alt || mantraName}
        loading={loadingMode}
        decoding="async"
        fetchPriority={fetchPriorityMode}
        onError={handleError}
        className={`relative z-10 h-full w-full object-contain p-1 ${shapeClass}`}
      />
    </div>
  );
};

export default SquareMantraImage;
