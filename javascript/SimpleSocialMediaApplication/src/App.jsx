import Home from './components/Home';
import Search from './components/Search';
import ApiStatus from './components/ApiStatus';
import { useState } from 'react';

const App = () => {
  const [searchResults, setSearchResults] = useState(null);
  return (
    <>
      <ApiStatus />
      <Search onResults={setSearchResults} />
      <Home posts={searchResults} />
    </>
  );
};

export default App;
