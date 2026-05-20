import React, { useState, useRef, useEffect, useMemo } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { CATEGORY_OPTIONS, createCategoryPath, getMantraPathByTitle } from "../data/mantraCatalog";

const formatMantraTitle = (value = '') =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mantras, setMantras] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchQuery = searchParams.get('q') || '';
  
  // Fetch mantras data on mount
  useEffect(() => {
    fetch('/mantrasData.json')
      .then(response => response.json())
      .then(data => {
        setMantras(data.mantras || []);
      })
      .catch(error => {
        console.error('Error loading mantras data:', error);
      });
  }, []);

  // Filter mantras based on search query
  const filteredMantras = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const normalizedQuery = searchQuery.toLowerCase();
    return mantras
      .filter((mantra) => {
        const searchableText = [
          mantra.title || mantra.name,
          mantra.category || '',
          mantra.deity || ''
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 8); // Limit to 8 results
  }, [searchQuery, mantras]);
  
  const handleSearchChange = (value) => {
    if (value.trim()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', value);
      setSearchParams(newParams);
      setShowDropdown(true);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
      setShowDropdown(false);
    }
  };

  const handleMantraClick = (mantra) => {
    const mantraPath = getMantraPathByTitle(mantra.title || mantra.name);
    navigate(mantraPath);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (menuOpen || showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, showDropdown]);

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
          "fixed top-0 left-0 z-50 w-[300px] max-w-[88vw] bg-orange-600 text-white px-6 py-8 transition-transform duration-300 ease-in-out rounded-r-3xl shadow-xl max-h-[100dvh] overflow-y-auto",
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
          <Link to="/" className="block cursor-pointer hover:opacity-90" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/mantras" className="block cursor-pointer hover:opacity-90" onClick={() => setMenuOpen(false)}>
            All Mantras
          </Link>
          <Link to="/blogs" className="block cursor-pointer hover:opacity-90" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>
          {CATEGORY_OPTIONS.filter((item) => item.value !== "all").map((item) => (
            <Link
              key={item.value}
              to={createCategoryPath(item.value)}
              className="block cursor-pointer break-words leading-tight hover:opacity-90"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#121212] text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)}>
            <FiMenu className="text-2xl cursor-pointer" />
          </button>
          <h1 className="text-xl font-bold">
            Mantra<span className="text-orange-500">Spirit</span>
          </h1>
        </div>

        {/* Desktop Search Bar with Dropdown */}
        <div className="hidden lg:flex relative items-center bg-[#1E1E1E] rounded-full px-4 py-2 w-1/2" ref={dropdownRef}>
          <FiSearch className="text-white text-lg mr-2" />
          <input
            type="text"
            placeholder="Search mantras, languages, blogs..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowDropdown(true);
            }}
            className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-400"
          />
          
          {/* Dropdown Results */}
          {showDropdown && filteredMantras.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {filteredMantras.map((mantra) => (
                <button
                  key={mantra.id}
                  onClick={() => handleMantraClick(mantra)}
                  className="w-full px-4 py-3 text-left hover:bg-[#2A2A2A] transition border-b border-white/5 last:border-b-0 flex items-center gap-3"
                >
                  <FiSearch className="text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate font-medium">
                      {formatMantraTitle(mantra.title || mantra.name)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {mantra.deity || mantra.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No Results Message */}
          {showDropdown && searchQuery.trim() && filteredMantras.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-lg z-50 p-4 text-center text-gray-400 text-sm">
              No mantras found for "{searchQuery}"
            </div>
          )}
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
        <div className="lg:hidden px-4 py-2 bg-[#121212]" ref={dropdownRef}>
          <div className="relative flex items-center bg-gray-800 rounded-md px-3 py-2">
            <FiSearch className="text-white text-lg mr-2" />
            <input
              type="text"
              placeholder="Search mantras, languages, blogs..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowDropdown(true);
              }}
              className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-400"
            />
            
            {/* Mobile Dropdown Results */}
            {showDropdown && filteredMantras.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredMantras.map((mantra) => (
                  <button
                    key={mantra.id}
                    onClick={() => handleMantraClick(mantra)}
                    className="w-full px-4 py-3 text-left hover:bg-[#2A2A2A] transition border-b border-white/5 last:border-b-0 flex items-center gap-3"
                  >
                    <FiSearch className="text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate font-medium">
                        {formatMantraTitle(mantra.title || mantra.name)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {mantra.deity || mantra.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Mobile No Results Message */}
            {showDropdown && searchQuery.trim() && filteredMantras.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-lg z-50 p-4 text-center text-gray-400 text-sm">
                No mantras found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
