import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import clsx from "clsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-opacity-150 z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        ref={menuRef}
        className={clsx(
          "fixed top-0 left-0 z-50 h-3/4 w-[300px] bg-orange-600 text-white px-6 py-8 transition-transform duration-300 ease-in-out rounded-r-3xl shadow-xl",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-start">
          <p className="text-md font-normal">Menu</p>
          <button onClick={() => setMenuOpen(false)}>
            <FiX className="text-xl cursor-pointer" />
          </button>
        </div>
        <div className="mt-6 space-y-6 text-2xl font-semibold">
          <Link to="/mantras" className="block cursor-pointer hover:opacity-90" onClick={() => setMenuOpen(false)}>
            All Mantras
          </Link>
          <Link to="/blogs" className="block cursor-pointer hover:opacity-90" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>
          {["Stotra", "Aarti", "Chalisa", "Gods", "Goddesses"].map(
            (item) => (
              <div key={item} className="cursor-pointer hover:opacity-90">
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#121212] text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)}>
            <FiMenu className="text-2xl cursor-pointer" />
          </button>
          <h1 className="text-xl font-bold">
            Mantra.<span className="text-orange-500">Fy</span>
          </h1>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center bg-[#1E1E1E] rounded-full px-4 py-2 w-1/2">
          <FiSearch className="text-white text-lg mr-2" />
          <input
            type="text"
            placeholder="Search Playlists, Artists, etc"
            className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-400"
          />
        </div>
        <div>

        </div>

        {/* Mobile Search Icon */}
        <div className="lg:hidden">
          <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
            <img src="/images/Search_Bar.png" alt="" />
          </button>
        </div>
      </header>

      {/* Mobile Search Bar - Appears Below Header */}
      {showMobileSearch && (
        <div className="lg:hidden px-4 py-2 bg-[#121212]">
          <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
            <FiSearch className="text-white text-lg mr-2" />
            <input
              type="text"
              placeholder="Search Playlists, Artists, etc"
              className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
