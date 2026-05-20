import { Link } from 'react-router-dom';
import SquareMantraImage from './SquareMantraImage';
import { MOSTLY_SEARCHED_ITEMS } from '../data/featuredMantras';
import { getMantraPathByTitle } from '../data/mantraCatalog';

const MostlySearchedList = ({ heading = 'Mostly Searched', showHeading = true }) => (
  <div>
    {showHeading && <h2 className="text-lg font-semibold mb-4">{heading}</h2>}
    <div className="space-y-4 max-h-[554px] overflow-y-auto pr-1">
      {MOSTLY_SEARCHED_ITEMS.map((item) => (
        <Link to={getMantraPathByTitle(item.title)} key={item.title}>
          <div className="flex items-start gap-3 cursor-pointer hover:bg-[#2A2A2A] p-2 rounded-md">
            <SquareMantraImage
              mantraName={item.title}
              alt={item.title}
              className="w-12 h-12"
            />
            <div>
              <p className="text-sm font-medium leading-tight">{item.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default MostlySearchedList;