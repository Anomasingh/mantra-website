import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="flex flex-col items-center gap-4 px-4 lg:-ml-8 mt-5 lg:mt-20 lg:mr-10">
    {/* Mostly Searched */}
    <div className="bg-[#1E1E1E] text-white rounded-[12px] p-6 space-y-6 w-full lg:w-80">
      <div>
        <h2 className="text-lg font-semibold mb-4">Mostly Searched</h2>
        <div className="space-y-4 max-h-[554px] overflow-y-auto pr-1">
          {[
            { title: "Mahamitrunjay Mantra", artist: "Shankar" },
            { title: "Mahamitrunjay Mantra", artist: "Shankar" },
            { title: "Hanuman Chalisa", artist: "Hanuman" },
            { title: "Hanuman Chalisa", artist: "Hanuman" },
            { title: "Gayatri Mantra", artist: "Gayatri Maa" },
            { title: "Gayatri Mantra", artist: "Gayatri Maa" },
          ].map((item, index) => (
            <Link to="/mostly-searched" key={index}>
              <div className="flex items-start gap-3 cursor-pointer hover:bg-[#2A2A2A] p-2 rounded-md">
                <img
                  src="https://ygygguzbcwtcuquqjqfk.supabase.co/storage/v1/object/public/mantraImages/hanuman_chalisa/hindi/hanuman-hindi.png"
                  alt="thumbnail"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium leading-tight">{item.title}</p>
                  <p className="text-xs text-orange-400">{item.artist}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Ads Section */}
    <div className="bg-[#2B2B2B] flex items-center mt-10 justify-center w-full lg:w-80 h-100">
      <span className="text-sm text-center leading-snug">Ads<br />Space</span>
    </div>
  </div>
);

export default Sidebar;
