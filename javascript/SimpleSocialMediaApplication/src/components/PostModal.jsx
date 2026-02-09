import { useState } from 'react';

const PostModal = ({ onClose, onPostCreated }) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create post');
      }
      onPostCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <form className="bg-[#D49100] text-white rounded-2xl shadow-lg p-6 w-full max-w-md relative" onSubmit={handleSubmit}>
        <button
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="w-full rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-800"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="content">Content</label>
          <textarea
            id="content"
            className="w-full rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-800"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            aria-label="Post content"
            rows={4}
          />
        </div>
        {error && <div className="text-white/90 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-white text-[#D49100] px-4 py-2 rounded-lg"
          disabled={loading}
          aria-label="Create post"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default PostModal;
