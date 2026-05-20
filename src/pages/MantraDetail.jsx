import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SquareMantraImage from '../components/SquareMantraImage';
import Sidebar from '../components/Sidebar';
import FAQ from '../components/FAQ';
import { getMantraPathByMeta, resolveMantraMeta } from '../data/mantraCatalog';
import {
  buildMantraSeo,
  getMantraContentSections,
  getRelatedMantras,
  normalizeLanguageSlug,
  Seo
} from '../seo';

const MantraDetail = () => {
  const { slug, lang, mantraId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routeMantraKey = slug || mantraId || '';
  const routeLanguage = normalizeLanguageSlug(lang || 'english');
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
  const [hoveredLineIndex, setHoveredLineIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Refs for scroll containers
  const originalScrollRef = useRef(null);
  const transliterationScrollRef = useRef(null);
  const translationScrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const activePanelRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [routeMantraKey, routeLanguage]);

  useEffect(() => {
    if (hoveredLineIndex === null) return;

    const scrollToLine = (containerRef, lineIndex) => {
      if (!containerRef.current) return;

      const targetElement = containerRef.current.querySelector(
        `[data-line-index="${lineIndex}"]`
      );
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    };

    if (activePanelRef.current !== 'translation') {
      scrollToLine(translationScrollRef, hoveredLineIndex);
    }
  }, [hoveredLineIndex]);

  useEffect(() => {
    // Load mantras metadata from backend-served assets
    fetch('/mantrasData.json')
      .then(response => response.json())
      .then(data => {
        const normalizedRouteKey = String(routeMantraKey).trim().toLowerCase();
        const mantra = (data.mantras || []).find((entry) => {
          const resolved = resolveMantraMeta(entry);
          const candidates = [
            String(entry.id || '').toLowerCase(),
            String(entry.path || '').toLowerCase(),
            String(entry.name || '').toLowerCase(),
            String(resolved.slug || '').toLowerCase()
          ];

          return candidates.includes(normalizedRouteKey);
        });

        if (mantra) {
          const resolvedMantra = resolveMantraMeta(mantra);
          const availableLanguages = (mantra.languages || []).map((value) => normalizeLanguageSlug(value));
          const defaultLang = availableLanguages.includes(routeLanguage)
            ? routeLanguage
            : (availableLanguages.includes('english') ? 'english' : availableLanguages[0] || 'english');

          setMantraInfo({
            ...resolvedMantra,
            ...mantra,
            slug: resolvedMantra.slug,
            availableLanguages
          });

          setSelectedTransliterationLang(defaultLang);
          setSelectedTranslationLang(defaultLang);

          if (!slug && resolvedMantra.slug) {
            navigate(getMantraPathByMeta(resolvedMantra, defaultLang), { replace: true });
          }
        }
      })
      .catch(error => {
        console.error('Error loading mantras data:', error);
      });
  }, [navigate, routeLanguage, routeMantraKey, slug]);

  const loadMantraData = useCallback(async () => {
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
  }, [mantraInfo, selectedTransliterationLang, selectedTranslationLang]);

  useEffect(() => {
    if (mantraInfo) {
      loadMantraData();
    }
  }, [mantraInfo, loadMantraData]);

  useEffect(() => {
    if (!mantraInfo?.slug) return;

    const availableLanguages = mantraInfo.availableLanguages || [];
    const normalizedParam = normalizeLanguageSlug(lang || '');

    // Keep canonical URL clean by collapsing /english to /mantras/:slug.
    if (lang && normalizedParam === 'english') {
      navigate(getMantraPathByMeta(mantraInfo), { replace: true });
      return;
    }

    // If route language is invalid for this mantra, redirect to best available canonical path.
    if (lang && !availableLanguages.includes(normalizedParam)) {
      const fallbackLanguage = availableLanguages.includes('english') ? 'english' : availableLanguages[0];
      navigate(getMantraPathByMeta(mantraInfo, fallbackLanguage), { replace: true });
    }
  }, [lang, mantraInfo, navigate]);

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
        // - Numbers from all 14 language scripts
        // - Common punctuation marks
        // - Brackets, parentheses, etc.
        // - Verse markers like ॥१॥, ॥൧॥, ॥೧॥, etc.
        const symbolOnlyRegex = /^[॥।\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0660-\u06690-9()[\]{}.,;:!?\-\s"']+$/;
        
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
  const InteractiveWord = ({ word, globalWordIndex, meaning, isHighlighted, wordRef, lineIndex }) => (
    <span
      ref={wordRef}
      className={`inline-block px-0.5 py-0.5 mx-0 rounded cursor-pointer transition-colors duration-200 ${
        isHighlighted 
          ? 'bg-orange-500 text-white' 
          : 'hover:bg-gray-700/30 hover:text-orange-200'
      }`}
      onMouseEnter={() => {
        setHoveredWordIndex(globalWordIndex);
        setHoveredLineIndex(lineIndex);
        scrollToCorrespondingWords(globalWordIndex);
      }}
      onMouseLeave={() => {
        setHoveredWordIndex(null);
        setHoveredLineIndex(null);
      }}
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
      
      // Enhanced regex to detect verse numbers and punctuation symbols
      // Includes all 14 language script numbers and verse markers
      const symbolOnlyRegex = /^[॥।\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0660-\u06690-9()[\]{}.,;:!?\-\s"']+$/;
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
              lineIndex={lineIndex}
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
      if (activePanelRef.current !== 'original') {
        scrollToWord(originalScrollRef, globalWordIndex);
      }
      if (activePanelRef.current !== 'transliteration') {
        scrollToWord(transliterationScrollRef, globalWordIndex);
      }
    }, 200); // Increased delay for gentler scrolling
  };

  if (!mantraInfo) {
    return (
      <>
        <Seo
          title="Mantra Not Found | MantraSpirit"
          description="The requested mantra page could not be found. Browse all mantras, transliterations, and translations."
          canonical={location.pathname}
          robots="noindex,follow"
        />
        <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
          <div className="text-xl">Mantra not found</div>
        </div>
      </>
    );
  }

  const seoMeta = buildMantraSeo({
    mantra: mantraInfo,
    pathname: location.pathname,
    lang: routeLanguage || selectedTranslationLang
  });
  const contentSections = getMantraContentSections(mantraInfo, routeLanguage || selectedTranslationLang);
  const relatedMantras = getRelatedMantras(mantraInfo, 6);

  const handleTranslationLanguageChange = (nextLanguage) => {
    const normalizedLanguage = normalizeLanguageSlug(nextLanguage);
    setSelectedTranslationLang(normalizedLanguage);

    if (mantraInfo?.slug) {
      navigate(getMantraPathByMeta(mantraInfo, normalizedLanguage), { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }


  return (
    <article className="bg-[#121212] text-white min-h-screen">
      <Seo {...seoMeta} />
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 md:py-6 px-3 md:px-4 lg:px-6">
        <div className="w-full flex items-center space-x-4 md:space-x-6">
          <div className="bg-white/20 rounded-lg p-3 md:p-4">
            <SquareMantraImage
              mantraName={mantraInfo.name}
              alt={mantraInfo.name}
              className="w-16 md:w-20 h-16 md:h-20"
              fallbackSrc="/images/HANUMAN%20CHALISA.png"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {mantraInfo.name
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </h1>
            <p className="text-orange-100 text-sm md:text-base mt-2 max-w-2xl">{contentSections.intro || seoMeta.tagline}</p>
          </div>
        </div>
      </div>

      <main className="w-full px-3 md:px-4 lg:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2.4fr_0.9fr] xl:grid-cols-[2.8fr_0.85fr] gap-4 md:gap-6 items-start">
        {/* Main Content */}
        <div className="min-w-0">
          {/* Intro removed per request: intro now shown beneath the title */}

          {/* Audio Controls */}
          <div className="bg-[#1E1E1E] rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
              <h3 className="text-base md:text-lg font-semibold text-white">Original Audio</h3>
              <div className="flex flex-wrap items-center gap-2">
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
          <section className="bg-[#1E1E1E] rounded-lg p-6" aria-labelledby="lyrics-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="lyrics-heading" className="text-2xl font-bold">Lyrics</h2>
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
                : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
            }`}>
              {/* Original */}
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-400">Original</h3>
                  <button className="text-gray-400 text-xs hover:text-white transition-colors">
                    Convert to original
                  </button>
                </div>
                <div
                  className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2"
                  ref={originalScrollRef}
                  onMouseEnter={() => {
                    activePanelRef.current = 'original';
                  }}
                  onMouseLeave={() => {
                    activePanelRef.current = null;
                  }}
                >
                  <div className="space-y-0.5 text-orange-300 text-sm leading-relaxed">
                    {Array.isArray(lyricsData.original?.lyrics) && wordToWordData
                      ? lyricsData.original.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                            data-line-index={index}
                            onMouseEnter={() => setHoveredLineIndex(index)}
                            onMouseLeave={() => setHoveredLineIndex(null)}
                          >
                            {renderLineWithWordsAndSymbols(line, index, originalWordMapping, 'original')}
                          </div>
                        ))
                      : Array.isArray(lyricsData.original?.lyrics) &&
                        lyricsData.original.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                            data-line-index={index}
                            onMouseEnter={() => setHoveredLineIndex(index)}
                            onMouseLeave={() => setHoveredLineIndex(null)}
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
                  <div
                    className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2"
                    ref={transliterationScrollRef}
                    onMouseEnter={() => {
                      activePanelRef.current = 'transliteration';
                    }}
                    onMouseLeave={() => {
                      activePanelRef.current = null;
                    }}
                  >
                    <div className="space-y-0.5 text-white text-sm leading-relaxed">
                      {Array.isArray(lyricsData.transliteration?.lyrics) && wordToWordData
                        ? lyricsData.transliteration.lyrics.map((line, index) => (
                            <div
                              key={index}
                              className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                              data-line-index={index}
                              onMouseEnter={() => setHoveredLineIndex(index)}
                              onMouseLeave={() => setHoveredLineIndex(null)}
                            >
                              {renderLineWithWordsAndSymbols(line, index, transliterationWordMapping, 'transliteration')}
                            </div>
                          ))
                        : Array.isArray(lyricsData.transliteration?.lyrics) &&
                          lyricsData.transliteration.lyrics.map((line, index) => (
                            <div
                              key={index}
                              className="whitespace-normal hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200"
                              data-line-index={index}
                              onMouseEnter={() => setHoveredLineIndex(index)}
                              onMouseLeave={() => setHoveredLineIndex(null)}
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
                      onChange={(e) => handleTranslationLanguageChange(e.target.value)}
                      className="bg-[#3A3A3A] text-white px-3 py-1 rounded text-xs border border-[#4A4A4A] hover:border-[#5A5A5A] transition-colors"
                    >
                      {mantraInfo.availableLanguages.map((lang) => (
                        <option key={lang} value={lang.toLowerCase()}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="h-88 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2"
                    ref={translationScrollRef}
                    onMouseEnter={() => {
                      activePanelRef.current = 'translation';
                    }}
                    onMouseLeave={() => {
                      activePanelRef.current = null;
                    }}
                  >
                    <div className="space-y-0.5 text-white text-sm leading-relaxed">
                      {Array.isArray(lyricsData.translation?.lyrics) &&
                        lyricsData.translation.lyrics.map((line, index) => (
                          <div
                            key={index}
                            className={`whitespace-normal px-2 py-1 rounded transition-all duration-200 ${
                              hoveredLineIndex === index
                                ? 'bg-orange-500/25'
                                : 'hover:bg-orange-900/20'
                            }`}
                            data-line-index={index}
                          >
                            {line}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-[#1E1E1E] rounded-lg p-6 mt-4 md:mt-6">
            <h2 className="text-2xl font-bold mb-4">Meaning</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              {contentSections.meaningPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="bg-[#1E1E1E] rounded-lg p-6 mt-4 md:mt-6">
            <h2 className="text-2xl font-bold mb-4">Benefits</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              {contentSections.benefits.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="bg-[#1E1E1E] rounded-lg p-6 mt-4 md:mt-6">
            <h2 className="text-2xl font-bold mb-4">How To Chant</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              {contentSections.chantGuide.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
          </section>

          <FAQ faqs={contentSections.faq} />

          <section className="bg-[#1E1E1E] rounded-lg p-6 mt-4 md:mt-6">
            <h2 className="text-2xl font-bold mb-4">Related Mantras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedMantras.map((item) => (
                <Link
                  key={item.id}
                  to={getMantraPathByMeta(item)}
                  className="rounded-md border border-[#343434] bg-[#252525] px-3 py-2 text-sm hover:border-[#FF9256]/60 hover:text-[#FF9256] transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="min-w-0">
          <Sidebar showHomeButton={false} showAds={false} fluid compact className="mt-0" />
        </div>
        </div>
      </main>
    </article>
  );
};

export default MantraDetail;
