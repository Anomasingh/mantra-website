import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MantrasList = () => {
  const [mantras, setMantras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/mantrasData.json')
      .then(response => response.json())
      .then(data => {
        setMantras(data.mantras);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading mantras data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading mantras...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">All Mantras</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mantras.map((mantra, index) => (
            <Link
              key={mantra.id}
              to={`/mantra/${mantra.id}`}
              className="bg-[#1E1E1E] rounded-lg p-6 hover:bg-[#2A2A2A] transition-colors duration-200 border border-[#383838]"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-3 flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {mantra.name
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ')}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Available in {mantra.languages.length} languages
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mantra.availableLanguages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="bg-[#FF9256]/20 text-[#FF9256] px-2 py-1 rounded text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                    {mantra.availableLanguages.length > 3 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{mantra.availableLanguages.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MantrasList;
