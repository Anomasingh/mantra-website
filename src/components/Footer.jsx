import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] border-t border-t-[#272727] text-white px-4 py-6 pt-4 text-center text-sm mx-20">
      
      <div className="flex flex-col lg:flex-row justify-between items-center max-w-6xl mx-auto gap-2 ">
      <div className="justify-center md:hidden">
          <img src="./Mantra.Fy.png" alt="" />
      </div>
        <p>
          © {currentYear}Mantra.Fy | <span className="font-semibold">All Rights Reserved.</span>
        </p>
        <div className="hidden md:block">
          <img src="./Mantra.Fy.png" alt="" />
        </div>
        <div className="space-x-4">
          <a href="#" className="hover:text-orange-400">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-orange-400">Terms of Service</a>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
