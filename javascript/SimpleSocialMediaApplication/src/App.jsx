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
    <div className="min-h-screen bg-[#E0A200] text-white font-['Baloo_2',cursive]">
      <ApiStatus />
      <div className="mx-auto max-w-[420px] px-3 py-6">
        <div className="flex gap-3 items-stretch">
          <aside className="w-12 rounded-3xl bg-[#D49100] flex flex-col items-center py-4 gap-4 shadow-lg">
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
          <main className="flex-1 rounded-3xl bg-[#D49100] px-3 py-3 shadow-lg min-h-[520px]">
            <Search onResults={setSearchResults} />
            <Home posts={searchResults} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen} />
          </main>
          <aside className="w-12 rounded-3xl bg-[#D49100] flex flex-col items-center py-4 shadow-lg">
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
