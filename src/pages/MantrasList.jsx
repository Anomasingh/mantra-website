import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import CategoryFilterBar from '../components/CategoryFilterBar';
import SquareMantraImage from '../components/SquareMantraImage';
import {
  filterMantrasByCategory,
  getCategoryLabel,
  normalizeCategoryValue,
  resolveMantraMeta
} from '../data/mantraCatalog';

const formatMantraTitle = (value = '') =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const MantraCard = ({ mantra }) => {
  const tagLanguages = (mantra.availableLanguages || []).slice(0, 2);
  const remainingCount = Math.max((mantra.availableLanguages || []).length - 2, 0);

  return (
    <Link
      to={`/mantra/${mantra.id}`}
      className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] p-4 transition duration-200 hover:scale-[1.015] hover:border-[#FF9256]/50 hover:shadow-[0_0_0_1px_rgba(255,146,86,0.12),0_16px_32px_rgba(0,0,0,0.34)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-0 h-[2px] w-24 rounded-full bg-gradient-to-r from-[#FF9256] via-[#FF7A30] to-transparent opacity-90"
      />

      <div className="flex items-center gap-4">
        <div className="h-28 w-16 flex-shrink-0 rounded-xl border border-white/10 bg-[#2D2D2D] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(255,146,86,0.28)] transition group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_0_28px_rgba(255,146,86,0.38)]"> 
          <SquareMantraImage
            mantraName={mantra.name}
            alt={mantra.name}
            className="h-full w-full"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg">
              {mantra.title || formatMantraTitle(mantra.name)}
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-medium">
              <span className="rounded-full bg-[#383838] px-2 py-0.5 text-gray-100">
                {getCategoryLabel(mantra.category)}
              </span>
              <span className="rounded-full bg-[#383838] px-2 py-0.5 text-gray-100">
                {mantra.deity}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-600">
              {(mantra.languages || []).length} languages available
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {tagLanguages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-white/15 bg-transparent px-2 py-0.5 text-[10px] text-gray-400"
              >
                {lang}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-[10px] text-gray-500">+{remainingCount} more</span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FF9256]/70 px-3 py-1 text-xs font-semibold text-[#FF9256] transition group-hover:border-[#FFB07D] group-hover:text-[#FFB07D]">
              View
              <FiArrowRight className="text-sm" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MantrasList = () => {
  const [mantras, setMantras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const { type } = useParams();
  const searchQuery = searchParams.get('q') || '';

  const routeCategory = normalizeCategoryValue(searchParams.get('category') || type || 'all');

  useEffect(() => {
    fetch('/mantrasData.json')
      .then(response => response.json())
      .then(data => {
        setMantras(data.mantras || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading mantras data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedCategory(routeCategory);
  }, [routeCategory]);

  const enrichedMantras = useMemo(
    () => mantras.map((mantra) => resolveMantraMeta(mantra)),
    [mantras]
  );

  const handleCategorySelect = (category) => {
    const nextCategory = normalizeCategoryValue(category);
    setSelectedCategory(nextCategory);

    const newParams = new URLSearchParams(searchParams);
    
    if (nextCategory === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', nextCategory);
    }
    
    setSearchParams(newParams);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMantras = useMemo(() => {
    const categoryFilteredMantras = filterMantrasByCategory(enrichedMantras, selectedCategory);

    if (!normalizedQuery) {
      return categoryFilteredMantras;
    }

    return categoryFilteredMantras.filter((mantra) => {
      const searchableText = [
        mantra.title || formatMantraTitle(mantra.name),
        mantra.category,
        mantra.deity,
        mantra.deityGroup,
        ...(mantra.availableLanguages || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [enrichedMantras, normalizedQuery, selectedCategory]);

  const pageHeading = selectedCategory === 'all' ? 'All Mantras' : getCategoryLabel(selectedCategory);
  const resultLabel = filteredMantras.length === 1 ? 'result' : 'results';

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading mantras...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center">{pageHeading}</h1>
        </div>

        <div className="mb-4 md:mb-6">
          <CategoryFilterBar selectedCategory={selectedCategory} onSelect={handleCategorySelect} />
        </div>

        <div className="mb-4 text-xs md:text-sm text-gray-400">
          Showing {filteredMantras.length} {resultLabel}
          {selectedCategory !== 'all' ? ` for ${getCategoryLabel(selectedCategory)}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}.
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {filteredMantras.map((mantra) => (
            <MantraCard key={mantra.id} mantra={mantra} />
          ))}
        </div>

        {!filteredMantras.length && (
          <div className="mt-8 rounded-xl border border-[#343434] bg-[#1B1B1B] p-6 text-center text-gray-400">
            No mantras found
            {selectedCategory !== 'all' ? ` in ${getCategoryLabel(selectedCategory)}` : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}.
          </div>
        )}
      </div>
    </div>
  );
};

export default MantrasList;
