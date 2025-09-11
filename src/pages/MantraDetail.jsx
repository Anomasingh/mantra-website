import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const MantraDetail = () => {
  const { mantraId } = useParams();
  const [mantraInfo, setMantraInfo] = useState(null);
  const [selectedTransliterationLang, setSelectedTransliterationLang] = useState('english');
  const [selectedTranslationLang, setSelectedTranslationLang] = useState('english');
  const [lyricsData, setLyricsData] = useState({
    original: null,
    transliteration: null,
    translation: null
  });
  const [wordToWordData, setWordToWordData] = useState(null);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Refs for scroll containers
  const originalScrollRef = useRef(null);
  const transliterationScrollRef = useRef(null);
  const translationScrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
  // Load mantras metadata from backend-served assets
  fetch('/mantrasData.json')
      .then(response => response.json())
      .then(data => {
        const mantra = data.mantras.find(m => String(m.id) === mantraId);
        if (mantra) {
          setMantraInfo({
            ...mantra,
            availableLanguages: mantra.languages || []
          });
          const defaultLang = mantra.languages?.includes('english')
            ? 'english'
            : mantra.languages?.[0] || 'english';
          setSelectedTransliterationLang(defaultLang);
          setSelectedTranslationLang(defaultLang);
        }
      })
      .catch(error => {
        console.error('Error loading mantras data:', error);
      });
  }, [mantraId]);

  useEffect(() => {
    if (mantraInfo) {
      loadMantraData();
    }
  }, [mantraInfo, selectedTransliterationLang, selectedTranslationLang]);

  const loadMantraData = async () => {
    setLoading(true);
    try {
      const originalLang = mantraInfo.originalLanguage || 'hindi';
      
      console.log('Loading mantra data for:', mantraInfo.path);
      console.log('Original lang:', originalLang);
      console.log('Transliteration lang:', selectedTransliterationLang);
      console.log('Translation lang:', selectedTranslationLang);

      // Helper function to try loading word-to-word data with different naming conventions
      const loadWordToWordData = async () => {
        // Handle special cases for language name variations
        const getLanguageVariations = (lang) => {
          const baseVariations = [
            lang.charAt(0).toUpperCase() + lang.slice(1), // Capitalized (English)
            lang.toLowerCase(), // Lowercase (english)
            lang.toUpperCase(), // Uppercase (ENGLISH)
          ];

          // Add special cases for known variations
          if (lang === 'mandarin') {
            baseVariations.push('mandarine', 'Mandarine', 'MANDARINE');
          }
          if (lang === 'telugu') {
            baseVariations.push('telegu', 'Telegu', 'TELEGU');
          }
          if (lang === 'mandarine') {
            baseVariations.push('mandarin', 'Mandarin', 'MANDARIN');
          }
          if (lang === 'telegu') {
            baseVariations.push('telugu', 'Telugu', 'TELUGU');
          }

          return baseVariations;
        };

        // Try the selected language first
        const languageVariations = getLanguageVariations(selectedTranslationLang);

        for (const langVariation of languageVariations) {
          try {
            const response = await fetch(`/WORDTOWORD/${mantraInfo.path}/${langVariation}/wordtoword_translation.json`);
            console.log(`Trying word-to-word path: /WORDTOWORD/${mantraInfo.path}/${langVariation}/wordtoword_translation.json - Status:`, response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Successfully loaded word-to-word data with language variation:', langVariation);
              return data;
            }
          } catch (error) {
            console.log(`Failed to load with ${langVariation}:`, error.message);
          }
        }

        // If the selected language doesn't work, try fallback languages
        const fallbackLanguages = ['english', 'hindi', 'gujarati', 'arabic', 'telugu', 'urdu', 'mandarin'];
        
        for (const fallbackLang of fallbackLanguages) {
          if (fallbackLang === selectedTranslationLang) continue; // Skip if already tried
          
          const fallbackVariations = getLanguageVariations(fallbackLang);
          
          for (const langVariation of fallbackVariations) {
            try {
              const response = await fetch(`/WORDTOWORD/${mantraInfo.path}/${langVariation}/wordtoword_translation.json`);
              console.log(`Trying fallback word-to-word path: /WORDTOWORD/${mantraInfo.path}/${langVariation}/wordtoword_translation.json - Status:`, response.status);
              
              if (response.ok) {
                const data = await response.json();
                console.log('Successfully loaded word-to-word data with fallback language:', langVariation);
                return data;
              }
            } catch (error) {
              console.log(`Failed to load fallback ${langVariation}:`, error.message);
            }
          }
        }
        
        console.log('Could not load word-to-word data with any language variation or fallback');
        return null;
      };

      // Load lyrics data from Lyrics_data folder structure
      const [originalData, transliterationData, translationData, wordToWordTranslationData] = await Promise.all([
  fetch(`/Lyrics_data/${mantraInfo.path}/${originalLang}/lyrics_transliteration.json`)
          .then(r => {
            console.log('Original data response:', r.status);
            return r.json();
          }),
  fetch(`/Lyrics_data/${mantraInfo.path}/${selectedTransliterationLang}/lyrics_transliteration.json`)
          .then(r => {
            console.log('Transliteration data response:', r.status);
            return r.json();
          }),
  fetch(`/Lyrics_data/${mantraInfo.path}/${selectedTranslationLang}/lyrics_translation.json`)
          .then(r => {
            console.log('Translation data response:', r.status);
            return r.json();
          }),
        loadWordToWordData()
      ]);

      console.log('Loaded original data:', originalData);
      console.log('Loaded transliteration data:', transliterationData);
      console.log('Loaded translation data:', translationData);
      console.log('Loaded word-to-word data:', wordToWordTranslationData);

      setLyricsData({
        original: originalData,
        transliteration: transliterationData,
        translation: translationData
      });
      setWordToWordData(wordToWordTranslationData);
    } catch (error) {
      console.error('Error loading mantra data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to split text into words and create mappings
  const createWordMapping = (lyrics, wordToWordLines) => {
    if (!lyrics || !wordToWordLines) return [];
    
    const allWords = [];
    let wordIndex = 0;
    
    lyrics.forEach((line, lineIndex) => {
      // Filter out symbols, punctuation, and numbers using regex
      const words = line.split(/\s+/).filter(word => {
        const trimmedWord = word.trim();
        // Skip empty words and words that are only symbols/punctuation/numbers
        if (trimmedWord === '') return false;
        
        // Skip words that contain only:
        // - Devanagari punctuation (॥, ।, etc.)
        // - Numbers (including Devanagari numbers)
        // - Common punctuation marks
        // - Brackets, parentheses, etc.
        const symbolOnlyRegex = /^[॥।०-९0-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;
        
        return !symbolOnlyRegex.test(trimmedWord);
      });
      
      words.forEach((word, wordInLineIndex) => {
        allWords.push({
          word: word.trim(),
          lineIndex,
          wordInLineIndex,
          globalWordIndex: wordIndex,
          meaning: wordToWordLines[wordIndex] || ''
        });
        wordIndex++;
      });
    });
    
    return allWords;
  };

  // Create word mappings when data is loaded
  const originalWordMapping = wordToWordData && lyricsData.original 
    ? createWordMapping(lyricsData.original.lyrics, wordToWordData.lines)
    : [];

  const transliterationWordMapping = wordToWordData && lyricsData.transliteration 
    ? createWordMapping(lyricsData.transliteration.lyrics, wordToWordData.lines)
    : [];

  // Component for rendering interactive words
  const InteractiveWord = ({ word, globalWordIndex, meaning, isHighlighted, wordRef }) => (
    <span
      ref={wordRef}
      className={`inline-block px-0.5 py-0.5 mx-0 rounded cursor-pointer transition-colors duration-200 ${
        isHighlighted 
          ? 'bg-orange-500 text-white' 
          : 'hover:bg-gray-700/30 hover:text-orange-200'
      }`}
      onMouseEnter={() => {
        setHoveredWordIndex(globalWordIndex);
        scrollToCorrespondingWords(globalWordIndex);
      }}
      onMouseLeave={() => setHoveredWordIndex(null)}
      title={meaning}
    >
      {word}
    </span>
  );

  // Function to render line with words and symbols
  const renderLineWithWordsAndSymbols = (line, lineIndex, wordMapping, sectionType) => {
    const parts = line.split(/\s+/);
    let wordIndex = 0;
    
    // Define symbol colors based on section type
    const getSymbolColor = (sectionType) => {
      switch (sectionType) {
        case 'original':
          return 'text-orange-300';
        case 'transliteration':
          return 'text-white';
        case 'translation':
          return 'text-white';
        default:
          return 'text-gray-400';
      }
    };
    
    return parts.map((part, partIndex) => {
      const trimmedPart = part.trim();
      if (trimmedPart === '') return null;
      
      const symbolOnlyRegex = /^[॥।०-९0-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;
      const isSymbol = symbolOnlyRegex.test(trimmedPart);
      
      if (isSymbol) {
        // Render symbol with color matching the section type
        return (
          <span key={`symbol-${lineIndex}-${partIndex}`} className={`${getSymbolColor(sectionType)} mx-1`}>
            {trimmedPart}
          </span>
        );
      } else {
        // Render interactive word
        const globalIndex = wordMapping.find(
          (mapping) => mapping.lineIndex === lineIndex && mapping.wordInLineIndex === wordIndex
        )?.globalWordIndex;
        const meaning = globalIndex !== undefined && wordToWordData ? wordToWordData.lines[globalIndex] : '';
        
        const wordElement = (
          <span
            key={`word-${lineIndex}-${wordIndex}`}
            data-word-index={globalIndex}
          >
            <InteractiveWord
              word={trimmedPart}
              globalWordIndex={globalIndex}
              meaning={meaning}
              isHighlighted={hoveredWordIndex === globalIndex}
              wordRef={React.createRef()}
            />
          </span>
        );
        
        wordIndex++; // Only increment for actual words, not symbols
        return wordElement;
      }
    }).filter(Boolean);
  };

  // Function to scroll to corresponding words in other blocks
  const scrollToCorrespondingWords = (globalWordIndex) => {
    // Clear any existing timeout to debounce rapid hover events
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Find elements with the same global word index in all containers
    const scrollToWord = (containerRef, wordIndex) => {
      if (!containerRef.current) return;
      
      const targetElement = containerRef.current.querySelector(`[data-word-index="${wordIndex}"]`);
      if (targetElement) {
        // Check if element is already in view to avoid unnecessary scrolling
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        
        const isInView = (
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom
        );

        if (!isInView) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    };

    // Debounced scroll with longer delay for gentler experience
    scrollTimeoutRef.current = setTimeout(() => {
      scrollToWord(originalScrollRef, globalWordIndex);
      scrollToWord(transliterationScrollRef, globalWordIndex);
      // Removed translation scrolling: scrollToWord(translationScrollRef, globalWordIndex);
    }, 200); // Increased delay for gentler scrolling
  };

  if (!mantraInfo) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Mantra not found</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-6 px-12">
        <div className="max-w-7xl mx-auto flex items-center space-x-6">
          <div className="bg-white/20 rounded-lg p-4">
            <img
              src="/Hanuman.png"
              alt={mantraInfo.name}
              className="w-20 h-20 object-cover rounded"
              onError={(e) => {
                e.target.src = '/img1.png';
              }}
            />
          </div>
          <div>
            <div className="text-orange-200 text-sm mb-1">Ajay Bhushan</div>
            <h1 className="text-3xl font-bold text-white">
              {mantraInfo.name
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </h1>
            <div className="text-orange-200 text-sm mt-1">
              Song • Hindi • 2023 • 2.58 mins
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Audio Controls */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Original Audio</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTransliteration(!showTransliteration)}
                  className="bg-[#3A3A3A] text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-[#4A4A4A] transition-colors flex items-center gap-1"
                >
                  <span className="text-lg">{showTransliteration ? '−' : '+'}</span>
                  {showTransliteration ? 'Hide' : 'Add'} Transliteration
                </button>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="bg-[#3A3A3A] text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-[#4A4A4A] transition-colors flex items-center gap-1"
                >
                  <span className="text-lg">{showTranslation ? '−' : '+'}</span>
                  {showTranslation ? 'Hide' : 'Add'} Translation
                </button>
              </div>
            </div>
          </div>

          {/* Lyrics */}
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Lyrics</h2>
              {/* Fixed height container to prevent layout shifts */}
              <div className="h-12 flex items-center">
                {hoveredWordIndex !== null && wordToWordData && (
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2 max-w-md">
                    <div className="text-orange-400 text-xs font-semibold">Word Meaning:</div>
                    <div className="text-white text-sm">{wordToWordData.lines[hoveredWordIndex]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={`grid gap-6 ${
              !showTransliteration && !showTranslation
                ? 'grid-cols-1'
                : !showTransliteration || !showTranslation
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 lg:grid-cols-3'
            }`}>
              {/* Original */}
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-400">Original</h3>
                  <button className="text-gray-400 text-xs hover:text-white transition-colors">
                    Convert to original
                  </button>
                </div>
                <div className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2" ref={originalScrollRef}>
                  <div className="space-y-0.5 text-orange-300 text-sm leading-relaxed">
                    {Array.isArray(lyricsData.original?.lyrics) && wordToWordData
                      ? lyricsData.original.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                          >
                            {renderLineWithWordsAndSymbols(line, index, originalWordMapping, 'original')}
                          </div>
                        ))
                      : Array.isArray(lyricsData.original?.lyrics) &&
                        lyricsData.original.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                          >
                            {line}
                          </div>
                        ))}
                  </div>
                </div>
              </div>

              {/* Transliteration */}
              {showTransliteration && (
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Transliteration</h3>
                    <select
                      value={selectedTransliterationLang}
                      onChange={(e) => setSelectedTransliterationLang(e.target.value)}
                      className="bg-[#3A3A3A] text-white px-3 py-1 rounded text-xs border border-[#4A4A4A] hover:border-[#5A5A5A] transition-colors"
                    >
                      {mantraInfo.availableLanguages.map((lang) => (
                        <option key={lang} value={lang.toLowerCase()}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2" ref={transliterationScrollRef}>
                    <div className="space-y-0.5 text-white text-sm leading-relaxed">
                      {Array.isArray(lyricsData.transliteration?.lyrics) && wordToWordData
                        ? lyricsData.transliteration.lyrics.map((line, index) => (
                            <div
                              key={index}
                              className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                            >
                              {renderLineWithWordsAndSymbols(line, index, transliterationWordMapping, 'transliteration')}
                            </div>
                          ))
                        : Array.isArray(lyricsData.transliteration?.lyrics) &&
                          lyricsData.transliteration.lyrics.map((line, index) => (
                            <div
                              key={index}
                              className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                            >
                              {line}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Translation */}
              {showTranslation && (
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Translation</h3>
                    <select
                      value={selectedTranslationLang}
                      onChange={(e) => setSelectedTranslationLang(e.target.value)}
                      className="bg-[#3A3A3A] text-white px-3 py-1 rounded text-xs border border-[#4A4A4A] hover:border-[#5A5A5A] transition-colors"
                    >
                      {mantraInfo.availableLanguages.map((lang) => (
                        <option key={lang} value={lang.toLowerCase()}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2" ref={translationScrollRef}>
                    <div className="space-y-0.5 text-white text-sm leading-relaxed">
                      {Array.isArray(lyricsData.translation?.lyrics) &&
                        lyricsData.translation.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                            data-word-index={index}
                          >
                            {line}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ads */}
          <div className="bg-[#1E1E1E] rounded-lg p-8 mt-6 text-center text-gray-400">
            Ads Space
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64">
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Mostly Searched</h3>
            <div className="space-y-3">
              {[
                { name: "Mahamrityunjay Mantra", artist: "Sanskrit" },
                { name: "Hanuman Chalisa", artist: "Hanuman" },
                { name: "Gayatri Mantra", artist: "Gayatri Mata" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src="/img1.png"
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {item.name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                    </div>
                    <div className="text-gray-400 text-xs">{item.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-8 mt-6 text-center text-gray-400">
            Ads Space
          </div>
        </div>
      </div>
    </div>
  );
};

export default MantraDetail;
