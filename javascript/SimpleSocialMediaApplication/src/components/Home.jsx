import { useEffect, useState } from 'react';
import PostDetails from './PostDetails';
import PostModal from './PostModal';


const Home = ({ posts: externalPosts, postModalOpen, setPostModalOpen }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    if (externalPosts) {
      setPosts(externalPosts);
      setLoading(false);
      setError(null);
      return;
    }
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError('Could not load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [externalPosts]);

  const handleOpenPostModal = () => setPostModalOpen(true);
  const handleClosePostModal = () => setPostModalOpen(false);
  const handlePostCreated = async () => {
    setPostModalOpen(false);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError('Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="mt-6 text-white/80">Loading posts...</div>;
  if (error) return <div className="mt-6 text-white/90">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-white/70" />
        <div>
          <div className="text-xs opacity-90">UserName</div>
          <div className="text-sm font-semibold">Hi, there!</div>
        </div>
      </div>
      <ul className="space-y-3">
        {posts.map(post => (
          <li key={post.id} className="rounded-xl bg-[#E4A91A] p-3 cursor-pointer shadow-sm" onClick={() => setSelectedPostId(post.id)} tabIndex={0} aria-label={`View post by ${post.username}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/70" />
              <div className="flex-1">
                <div className="text-xs font-semibold">{post.username}</div>
                <div className="text-[11px] opacity-80">Hi, there!</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-white/90">{post.content}</div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">❤ {post.likeCount}</span>
              <span className="flex items-center gap-1">💬 {post.commentCount}</span>
            </div>
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <div className="mt-4 rounded-xl bg-[#E4A91A] p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/70" />
            <div className="text-xs font-semibold">UserName</div>
          </div>
          <div className="mt-2 text-sm text-white/90">Hi, there!</div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">❤ 0</span>
            <span className="flex items-center gap-1">💬 0</span>
          </div>
        </div>
      )}
      {selectedPostId && (
        <PostDetails postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      )}
      {postModalOpen && (
        <PostModal onClose={handleClosePostModal} onPostCreated={handlePostCreated} />
      )}
    </div>
  );
};

export default Home;
