import { useState } from 'react';
import ApiStatus from './components/ApiStatus';
import Home from './components/Home';
import Search from './components/Search';
import IconHome from './components/IconHome';
import IconSearch from './components/IconSearch';
import IconPerson from './components/IconPerson';

const App = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white font-['Baloo_2',cursive] flex items-center justify-center p-6">
      <ApiStatus />
      <div className="w-[360px] h-[640px] rounded-[28px] bg-[#E0A200] shadow-2xl overflow-hidden">
        <div className="h-full flex gap-2 p-3">
          <aside className="w-12 rounded-2xl bg-[#D49100] flex flex-col items-center py-4 gap-4 shadow-md">
            <button className="p-2 rounded-lg bg-white/10 text-white" aria-label="Home" type="button">
              <IconHome className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/10 text-white" aria-label="Search" type="button">
              <IconSearch className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/10 text-white" aria-label="Profile" type="button">
              <IconPerson className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <button className="p-2 rounded-lg bg-white/10 text-white" aria-label="Close" type="button">
              ✕
            </button>
          </aside>
          <main className="flex-1 rounded-2xl bg-[#D49100] px-3 py-3 shadow-md">
            <Search onResults={setSearchResults} />
            <Home posts={searchResults} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen} />
          </main>
          <aside className="w-12 rounded-2xl bg-[#D49100] flex flex-col items-center py-4 shadow-md">
            <div className="flex-1" />
            <button
              className="w-9 h-9 rounded-xl bg-white text-[#D49100] text-2xl leading-none flex items-center justify-center shadow"
              aria-label="Create new post"
              type="button"
              onClick={() => setPostModalOpen(true)}
            >
              +
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
