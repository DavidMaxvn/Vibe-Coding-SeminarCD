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
    <form className="w-full max-w-xl mx-auto mt-4 flex gap-2" onSubmit={handleSearch}>
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Search posts or users..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search posts or users"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
        aria-label="Search"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div className="text-red-600 ml-2">{error}</div>}
    </form>
  );
};

export default Search;
