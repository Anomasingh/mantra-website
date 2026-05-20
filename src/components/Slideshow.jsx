import { Link } from 'react-router-dom';
import AdSpaceBanner from './AdSpaceBanner';

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
      <AdSpaceBanner
        className=""
      />
  
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
            <div className="z-20 pl-2 md:pl-4 pr-12 md:pr-32 w-full md:w-auto flex items-center justify-center py-6 md:py-0">
              <img
                src="/images/Om1-Desktop.jpg"
                alt="Sacred Om Symbol"
                width="760"
                height="760"
                decoding="async"
                className="hidden xl:block w-[380px] h-[380px] object-cover glow-filter circular-frame"
              />
              <img
                src="/images/Om1-md.jpg"
                alt="Sacred Om Symbol"
                width="600"
                height="600"
                decoding="async"
                className="hidden md:block xl:hidden w-[300px] h-[300px] object-cover glow-filter circular-frame"
              />
              <img
                src="/images/Om1-mobile.jpg"
                alt="Sacred Om Symbol"
                width="288"
                height="288"
                decoding="async"
                className="block md:hidden w-72 h-72 object-cover glow-filter circular-frame"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
export default Slideshow;
  