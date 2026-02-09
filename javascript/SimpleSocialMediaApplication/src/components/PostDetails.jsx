import { useEffect, useState } from 'react';

const PostDetails = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const postRes = await fetch(`http://localhost:8000/posts/${postId}`);
        if (!postRes.ok) throw new Error('Failed to fetch post');
        const postData = await postRes.json();
        setPost(postData);
        const commentsRes = await fetch(`http://localhost:8000/posts/${postId}/comments`);
        if (!commentsRes.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        setError('Could not load post details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [postId]);

  if (!postId) return null;
  if (loading) return <div className="mt-6 text-white/80">Loading post details...</div>;
  if (error) return <div className="mt-6 text-white/90">{error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-[#D49100] rounded-2xl shadow-lg p-5 w-full max-w-lg relative text-white">
        <button
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="mb-3">
          <span className="font-bold text-lg">{post.username}</span>
          <span className="ml-2 text-xs opacity-80">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="mb-3 text-white/90">{post.content}</div>
        <div className="mb-3 flex gap-4 text-sm">
          <span>❤ {post.likeCount}</span>
          <span>💬 {post.commentCount}</span>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Comments</h3>
          <ul className="space-y-2">
            {comments.length === 0 ? (
              <li className="text-white/80">No comments yet.</li>
            ) : (
              comments.map(comment => (
                <li key={comment.id} className="bg-[#E4A91A] rounded-lg p-2">
                  <span className="font-bold">{comment.username}</span>
                  <span className="ml-2 text-xs opacity-80">{new Date(comment.createdAt).toLocaleString()}</span>
                  <div className="mt-1 text-white/90">{comment.content}</div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 h-7 rounded-md bg-white/95 px-2 text-[11px] text-gray-800"
            placeholder="Enter comment"
            aria-label="Enter comment"
          />
          <button
            type="button"
            className="w-7 h-7 rounded-md bg-sky-500 text-white text-sm leading-none"
            aria-label="Add comment"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
