
import PostDetails from './PostDetails';
import PostModal from './PostModal';


const Home = ({ posts: externalPosts }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

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

  const handleOpenPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);
  const handlePostCreated = async () => {
    setShowPostModal(false);
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

  if (loading) return <div className="mt-8 text-gray-500">Loading posts...</div>;
  if (error) return <div className="mt-8 text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="bg-white rounded-lg shadow p-4 cursor-pointer" onClick={() => setSelectedPostId(post.id)} tabIndex={0} aria-label={`View post by ${post.username}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold">{post.username}</span>
              <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-gray-800">{post.content}</div>
            <div className="mt-2 flex gap-4 text-sm text-gray-500">
              <span>👍 {post.likeCount}</span>
              <span>💬 {post.commentCount}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleOpenPostModal}
        aria-label="Create new post"
      >
        New Post
      </button>
      {selectedPostId && (
        <PostDetails postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      )}
      {showPostModal && (
        <PostModal onClose={handleClosePostModal} onPostCreated={handlePostCreated} />
      )}
    </div>
  );
};

export default Home;
