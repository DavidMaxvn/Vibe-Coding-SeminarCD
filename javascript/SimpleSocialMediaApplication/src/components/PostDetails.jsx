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
  if (loading) return <div className="mt-8 text-gray-500">Loading post details...</div>;
  if (error) return <div className="mt-8 text-red-600">{error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="mb-4">
          <span className="font-bold text-lg">{post.username}</span>
          <span className="ml-2 text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="mb-4 text-gray-800">{post.content}</div>
        <div className="mb-4 flex gap-4 text-sm text-gray-500">
          <span>👍 {post.likeCount}</span>
          <span>💬 {post.commentCount}</span>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Comments</h3>
          <ul className="space-y-2">
            {comments.length === 0 ? (
              <li className="text-gray-400">No comments yet.</li>
            ) : (
              comments.map(comment => (
                <li key={comment.id} className="bg-gray-100 rounded p-2">
                  <span className="font-bold">{comment.username}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  <div className="mt-1 text-gray-700">{comment.content}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
