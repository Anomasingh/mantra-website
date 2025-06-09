import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";
import Sidebar from "../components/Sidebar";

export default function DetailsPage() {
  const { id } = useParams();
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [transliterationLang, setTransliterationLang] = useState("english");
  const [translationLang, setTranslationLang] = useState("english");
  const [transliteration, setTransliteration] = useState("N/A");
  const [translation, setTranslation] = useState("N/A");

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  async function fetchDetails() {
    setLoading(true);

    const { data, error } = await supabase
      .from("texts")
      .select(
        `*, 
        deities (name, image_url), 
        categories (name),
        transliterations (language, transliteration), 
        translations (language, translation)`
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setText(data);
      const engTranslit = data.transliterations?.find(t => t.language.toLowerCase() === "english");
      const engTrans = data.translations?.find(t => t.language.toLowerCase() === "english");

      setTransliteration(engTranslit?.transliteration || "N/A");
      setTranslation(engTrans?.translation || "N/A");
    }

    setLoading(false);
  }

  const handleTransliterationLangChange = (lang) => {
    setTransliterationLang(lang);
    const langTranslit = text?.transliterations?.find(t => t.language.toLowerCase() === lang);
    setTransliteration(langTranslit?.transliteration || "N/A");
  };

  const handleTranslationLangChange = (lang) => {
    setTranslationLang(lang);
    const langTrans = text?.translations?.find(t => t.language.toLowerCase() === lang);
    setTranslation(langTrans?.translation || "N/A");
  };

  if (loading || !text) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="text-white bg-[#121212] min-h-screen">
      <div className="text-center pb-10 py-8 md:py-4 bg-[#1E1E1E]">Ads Space</div>
      <div className="sm:ml-8 flex flex-col lg:flex-row">
        <div className="flex-1 px-4 md:px-10 lg:px-20 mt-10">
          <div className="flex flex-col sm:flex-row items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white">
            {text.deities?.image_url && (
              <div className="bg-white rounded-lg p-0.5">
                <img src={text.deities.image_url} alt={text.deities.name} className="h-30 w-30 sm:h-50 sm:w-50 object-contain" />
              </div>
            )}
            <div className="flex flex-col justify-center items-center sm:items-start">
              <img src="/Vector.png" alt="Vector" className="mt-10 mb-4 w-12 h-1" />
              <p className="text-sm font-semibold">{text.artist || "Unknown Artist"}</p>
              <h1 className="text-3xl font-bold">{text.title}</h1>
              <p className="text-sm">
                Song <span className="text-lg font-extrabold">·</span> {text.language} <span className="text-lg font-extrabold">·</span> {text.year || "Year N/A"} <span className="text-lg font-extrabold">·</span> {text.duration || "Duration N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center my-8">
            <h2 className="text-3xl mb-5 sm:mb-0 font-semibold">Lyrics</h2>
            {(!showTransliteration || !showTranslation) && (
              <div className="flex justify-center gap-4">
                {!showTransliteration && (
                  <button
                    onClick={() => setShowTransliteration(true)}
                    className="cursor-pointer text-sm w-52 rounded-full px-4 py-4 bg-[#2C2C2C] text-[#CCCCCC] flex items-center gap-2"
                  >
                    <span className="border border-[#737373] rounded-full w-6 h-6 flex items-center justify-center">+</span>
                    Add Transliteration
                  </button>
                )}
                {!showTranslation && (
                  <button
                    onClick={() => setShowTranslation(true)}
                    className="cursor-pointer text-sm w-52 rounded-full px-4 py-4 bg-[#2C2C2C] text-[#CCCCCC] flex items-center gap-2"
                  >
                    <span className="border border-[#737373] rounded-full w-6 h-6 flex items-center justify-center">+</span>
                    Add Translation
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
            <div className="col-span-1 lg:col-span-1">
              <h3 className="font-normal mb-2 text-2xl text-[#CCCCCC]">Original</h3>
              <div className="flex flex-row gap-2 my-5.5 text-[#777777]">
                Convert to Original
                <img src="https://rgdqfofzptrmxehlmxzz.supabase.co/storage/v1/object/public/media//refresh-2.png" alt="" />
              </div>
              <pre className="bg-[#161616] p-6 rounded-lg whitespace-pre-wrap">{text.lyrics || "N/A"}</pre>
            </div>

            {showTransliteration && (
              <div className="col-span-1 lg:col-span-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-normal text-2xl text-[#CCCCCC]">Transliteration</h3>
                  <button
                    className="text-[#383838] cursor-pointer rounded-full w-5 h-5 flex items-center justify-center border border-[#383838]"
                    onClick={() => setShowTransliteration(false)}
                  >
                    x
                  </button>
                </div>
                <select
                  onChange={(e) => handleTransliterationLangChange(e.target.value)}
                  value={transliterationLang}
                  className="w-full border-b border-b-[#1E1E1E] rounded-lg px-4 py-2 focus:outline-none transition mb-4"
                >
                  <option className="bg-black" value="english">English</option>
                  <option className="bg-black" value="hindi">Hindi</option>
                </select>
                <pre className="bg-[#161616] p-6 rounded-lg whitespace-pre-wrap text-orange-400">{transliteration}</pre>
              </div>
            )}

            {showTranslation && (
              <div className="col-span-1 lg:col-span-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-normal text-2xl text-[#CCCCCC]">Translation</h3>
                  <button
                    className="text-[#383838] cursor-pointer rounded-full w-5 h-5 flex items-center justify-center border border-[#383838]"
                    onClick={() => setShowTranslation(false)}
                  >
                    x
                  </button>
                </div>
                <select
                  onChange={(e) => handleTranslationLangChange(e.target.value)}
                  value={translationLang}
                  className="w-full border-b border-b-[#1E1E1E] rounded-lg px-4 py-2 focus:outline-none transition mb-4"
                >
                  <option className="bg-black" value="english">English</option>
                  <option className="bg-black" value="hindi">Hindi</option>
                  <option className="bg-black" value="french">French</option>
                </select>
                <pre className="bg-[#161616] p-6 rounded-lg whitespace-pre-wrap text-orange-100">{translation}</pre>
              </div>
            )}
          </div>

          <div className="w-full text-center py-20 bg-[#1E1E1E] text-gray-400 my-5 border border-[#383838]">
            Ads Space
          </div>
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
