import React from "react";
import Section from "../components/Section";
import Sidebar from '../components/Sidebar';
import Slideshow from "../components/Slideshow";

const HomePage = () => {
  const cards = [
    {
      title: "Hanuman Chalisa",
      artist: "Geeta Rabari",
      image: "/images/HANUMAN%20CHALISA.png"
    },
    {
      title: "Mahamrityunjai Mantra",
      artist: "Shankar Mahadevan",
      image: "/images/MAHAMRITYUNJAI%20MANTRA.png"
    },
    {
      title: "Gayatri Mantra",
      artist: "Anuradha Paudwal",
      image: "/images/GAYATRI%20MANTRA.png"
    },
    {
      title: "Shiv Tandav Stotra",
      artist: "Sanskrit",
      image: "/images/SHIV%20TANDAV%20STOTRA.png"
    },
    {
      title: "Durga Mantra 1",
      artist: "Devotional",
      image: "/images/DURGA%20MANTRA%201.png"
    }
  ];
  const categoriesTable = (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 scroll-smooth">
      <div className="flex gap-3 pb-4 w-max">
        {["Mantra", "Stotra", "Aarti", "Chalisa", "Gods", "Goddesses"].map((item, idx) => (
          <div
            key={idx}
            className="mb-4 md:gap-4 text-sm md:text-sm font-semibold tracking-wide px-6 md:px-7 py-2 
                       rounded-full cursor-pointer whitespace-nowrap
                       text-white border border-[#383838]
                       hover:text-[#FF9256] transition"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
  

  return (
    <div className="bg-[#121212] text-white">
      <Slideshow />

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <Section 
            title="Mostly Searched" 
            items={cards} 
            topContent={categoriesTable}
          />
          <Section title="Most Famous" items={cards} artistDisable />
          <Section title="Gods/Goddesses" items={cards} artistDisable circle />
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
