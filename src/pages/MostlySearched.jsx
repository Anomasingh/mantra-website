import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

const MostlySearched = () => {
  const cardDetails = [
    { title: "Hanuman Chalisa", artist: "Geeta Rabari", image: "./img1.png" },
    { title: "Mahamrityunjaya Mantra", artist: "Shankar Mahadevan", image: "./img2.png" },
    { title: "Gayatri Mantra", artist: "Anuradha Paudwal", image: "./img3.png" },
    { title: "Shiv Tandav Stotram", artist: "Sanskrit", image: "./img4.png" },
    { title: "Durga Kavach", artist: "Devotional", image: "./img5.png" }
  ];

  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedArtist, setSelectedArtist] = useState("All");

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleArtistFilter = (e) => {
    setSelectedArtist(e.target.value);
  };

  const filteredCards = cardDetails
    .filter((card) => selectedArtist === "All" || card.artist === selectedArtist)
    .sort((a, b) => {
      const compare = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? compare : -compare;
    });
  const repeatedCards = Array(5).fill(filteredCards).flat();

  const uniqueArtists = ["All", ...new Set(cardDetails.map((c) => c.artist))];

  return (
    <div className="text-white bg-[#121212]">
        <div className="text-center pb-10 py-8 md:py-4 bg-[#1E1E1E]">Ads Space</div>
      <div className="flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 px-4 md:px-10 lg:px-20 mt-10">
          {/* Header */}
          <div className="flex flex-row  items-center justify-between gap-4 mb-12">
            <h3 className="text-xl font-semibold">Mostly Searched</h3>

            <div className="flex gap-2 ">
              {/* Sort Button */}
              <button
              onClick={toggleSortOrder}
              className="bg-[#2C2C2C] text-sm flex flex-row  p-4 gap-2 border border-[#383838] rounded-full hover:text-[#FF9256] transition cursor-pointer"
            >
              <img
                src="/sort.png"
                alt="Sort Icon"
                className={`transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
              <span>Sort By</span>
            </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-3 sm:gap-4 mb-15">
            {repeatedCards.map((item, idx) => (
                <Card key={idx} image={item.image} title={item.title} artist={item.artist} />
            ))}
            </div>

          {/* Ads Space */}
        <div className="w-full text-center py-20 bg-[#1E1E1E] text-gray-400 my-5 border border-[#383838]">
        Ads Space
        </div>

        </div>

        {/* Sidebar */}
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default MostlySearched;
