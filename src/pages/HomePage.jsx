import React, { useMemo } from "react";
import Section from "../components/Section";
import Sidebar from '../components/Sidebar';
import Slideshow from "../components/Slideshow";
import CategoryFilterBar from "../components/CategoryFilterBar";
import { getMantraPathByTitle } from "../data/mantraCatalog";
import { HOME_FEATURED_MANTRAS } from "../data/featuredMantras";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const categoriesTable = (
    <CategoryFilterBar useLinks />
  );

  const getHomeMantraLink = (item) => getMantraPathByTitle(item?.title);
  
  // Filter featured mantras based on search query
  const filteredMantras = useMemo(() => {
    if (!searchQuery.trim()) {
      return HOME_FEATURED_MANTRAS;
    }
    
    const normalizedQuery = searchQuery.toLowerCase();
    return HOME_FEATURED_MANTRAS.filter((item) => {
      const searchableText = [
        item.title,
        item.artist,
        item.category || ''
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      
      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery]);

  return (
    <div className="bg-[#121212] text-white">
      <Slideshow />

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <Section 
            title="Mostly Searched" 
            items={filteredMantras} 
            topContent={categoriesTable}
            getItemLink={getHomeMantraLink}
          />
          <Section title="Most Famous" items={filteredMantras} artistDisable getItemLink={getHomeMantraLink} />
          <Section title="Gods/Goddesses" items={filteredMantras} artistDisable circle getItemLink={getHomeMantraLink} />
          <div className="w-full md:w-5/6 mx-2 lg:ml-20 lg:mr-40 text-center py-20 bg-[#1E1E1E] text-gray-400 my-5">Ads Space</div>
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
