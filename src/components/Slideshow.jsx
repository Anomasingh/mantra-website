import { Link } from 'react-router-dom';

const Slideshow = () => (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .glow-filter {
          filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.4)) brightness(0.85) saturate(1.1);
        }
        .circular-frame {
          border-radius: 50%;
          aspect-ratio: 1;
          border: 3px solid rgba(255, 165, 0, 0.3);
          mask-image: linear-gradient(to right, transparent 0%, black 20%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%);
        }
        .button-glow {
          border: 1px solid rgba(255, 165, 0, 0.3);
          box-shadow: inset 0 0 10px rgba(255, 165, 0, 0.1);
        }
        .button-glow:hover {
          border: 1px solid rgba(255, 165, 0, 0.6);
          box-shadow: 0 0 15px rgba(255, 165, 0, 0.3), inset 0 0 10px rgba(255, 165, 0, 0.15);
        }
      `}</style>

      {/* Top Ad Space */}
      <div className="border-b border-[#272727] py-2 px-4 bg-[#1E1E1E] flex items-center justify-center min-h-[50px]">
        <div className="w-full max-w-6xl border-2 border-dashed border-[#333333] rounded-lg py-2 text-center">
          <p className="text-gray-500 text-xs">Advertisement Space</p>
        </div>
      </div>
  
      <div className="md:flex py-4 md:py-6 space-y-8 md:space-y-0">
        <div className="md:w-full space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white min-h-[320px]">
            {/* Background Gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url('/images/Gradient.png')` }}
            ></div>
  
            {/* Text Content */}
            <div className="md:ml-16 z-20 flex flex-col items-center md:items-start text-center md:text-left px-6 md:px-12 py-8 md:py-16 max-w-2xl fade-in-up">
              <img src="/images/Vector.png" alt="Accent" className="mb-3 w-10 h-1" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Welcome to</h3>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-wide leading-tight">MantraSpirit</h1>
              <p className="text-sm md:text-base text-amber-100 mb-8 leading-relaxed">Discover Sacred Mantras, Chants & Spiritual Wisdom</p>
              <Link to="/blogs" className="bg-[#1A1A1A] hover:bg-[#242424] text-orange-500 hover:text-orange-300 transition-all duration-300 px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 button-glow no-underline">
                Learn More
                <span className="text-lg">→</span>
              </Link>
            </div>
  
            {/* Universal Image with Circular Frame */}
            <div className="z-20 pl-2 md:pl-4 pr-6 md:pr-16 w-full md:w-auto flex items-center justify-center py-6 md:py-0">
              <img
                src="/images/Om1-Desktop.jpg"
                alt="Sacred Om Symbol"
                className="hidden xl:block h-full object-cover max-h-[380px] glow-filter circular-frame"
              />
              <img
                src="/images/Om1-md.jpg"
                alt="Sacred Om Symbol"
                className="hidden md:block xl:hidden h-auto object-cover max-h-[300px] glow-filter circular-frame"
              />
              <img
                src="/images/Om1-mobile.jpg"
                alt="Sacred Om Symbol"
                className="block md:hidden w-72 h-72 object-cover glow-filter circular-frame"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
export default Slideshow;
  