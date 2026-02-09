import { useState } from 'react';

const Search = ({ onResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      const filtered = data.filter(post =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase())
      );
      onResults(filtered);
    } catch (err) {
      setError('Could not search posts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex items-center gap-2 mb-3" onSubmit={handleSearch}>
      <input
        type="text"
        className="flex-1 h-8 rounded-md bg-white/90 px-2 text-xs text-gray-800"
        placeholder="Enter keywords to search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search posts or users"
      />
      <button
        type="submit"
        className="h-8 px-3 rounded-md bg-sky-500 text-white text-xs"
        disabled={loading}
        aria-label="Search"
      >
        {loading ? '...' : 'Go'}
      </button>
      {error && <div className="text-white/90 text-[10px] ml-1">{error}</div>}
    </form>
  );
};

export default Search;
