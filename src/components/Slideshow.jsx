const Slideshow = () => (
    <>
      {/* Top Ad */}
      <div className="text-center pb-10 py-8 md:py-4 bg-[#1E1E1E]">Ads Space</div>
  
      <div className="-mt-8 md:-mt-6 md:flex py-4 md:py-6 space-y-10 md:space-y-0">
        <div className="md:w-full space-y-10">
          {/* Hero Section */}
          <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white min-h-[400px]">
            {/* Background Gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url('/Gradient.png')` }}
            ></div>
  
            {/* Text Content */}
            <div className="md:ml-20 z-20 flex flex-col items-center md:items-start text-center md:text-left px-6 md:px-10 py-10 md:py-20 max-w-xl">
              <img src="/Vector.png" alt="Vector" className="mb-4 w-12 h-1" />
              <h3 className="text-xl font-semibold text-white">Ajay Bhandari</h3>
              <h1 className="text-3xl md:text-5xl font-bold text-white">Hanuman Chalisa</h1>
              <p className="text-sm text-white">Song • Hindi • 2023 • 2.58 mins</p>
              <button className="mt-4 bg-orange-600 hover:bg-orange-700 transition px-5 py-2 rounded-md font-medium flex items-center gap-2">
                Learn More
                <span className="text-xl">▶</span>
              </button>
            </div>
  
            {/* Hanuman Image */}
            <div className="z-20 px-0 md:px-10 w-full md:w-auto">
              <img
                src="/Hanuman-Desktop.png"
                alt="Hanuman"
                className="hidden xl:block h-full object-contain"
              />
              <img
                src="/Hanuman-md.png"
                alt="Hanuman"
                className="hidden md:block xl:hidden h-1/4 object-contain"
              />
              <img
                src="/Hanuman.png"
                alt="Hanuman Mobile"
                className="block md:hidden w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
export default Slideshow;
  