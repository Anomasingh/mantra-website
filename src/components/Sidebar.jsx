import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AdSpaceBanner from './AdSpaceBanner';
import MostlySearchedList from './MostlySearchedList';

const Sidebar = ({ showHomeButton = true, showAds = true, fluid = false, compact = false, className = '' }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const shouldShowHomeButton = showHomeButton && !isHomePage;
  const panelWidthClass = fluid ? 'w-full' : 'w-full lg:w-80';
  const wrapperClasses = fluid
    ? `flex flex-col gap-4 w-full ${className}`
    : `flex flex-col items-center gap-4 px-4 lg:-ml-8 mt-5 lg:mt-20 lg:mr-10 ${className}`;

  return (
  <div className={wrapperClasses}>
    {shouldShowHomeButton && (
      <div className={`bg-[#1E1E1E] text-white rounded-[12px] ${compact ? 'p-3' : 'p-4'} ${panelWidthClass}`}>
        <Link
          to="/"
          className="block w-full text-center bg-[#2A2A2A] hover:bg-[#FF9256] transition-colors rounded-md py-2 text-sm font-medium"
        >
          Home
        </Link>
      </div>
    )}

    {/* Mostly Searched */}
    <div className={`bg-[#1E1E1E] text-white rounded-[12px] ${compact ? 'p-4 space-y-4' : 'p-6 space-y-6'} ${panelWidthClass}`}>
      <MostlySearchedList />
    </div>

    {/* Ads Section */}
    {showAds && (
      <div className={panelWidthClass}>
        <AdSpaceBanner
          className={`mt-10 ${panelWidthClass}`}
          innerClassName="min-h-[420px]"
        />
      </div>
    )}
  </div>
  );
};

export default Sidebar;
