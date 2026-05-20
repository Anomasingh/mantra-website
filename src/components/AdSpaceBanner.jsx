import React from 'react';

const AdSpaceBanner = ({
  label = 'Advertisement Space',
  className = '',
  innerClassName = ''
}) => {
  return (
    <div className={`border-y border-[#272727] bg-[#1E1E1E] px-4 py-4 ${className}`}>
      <div className={`mx-auto flex min-h-[50px] w-full max-w-[1600px] items-center justify-center rounded-lg border-2 border-dashed border-[#333333] px-6 ${innerClassName}`}>
        <p className="text-sm font-medium text-[#738099]">{label}</p>
      </div>
    </div>
  );
};

export default AdSpaceBanner;