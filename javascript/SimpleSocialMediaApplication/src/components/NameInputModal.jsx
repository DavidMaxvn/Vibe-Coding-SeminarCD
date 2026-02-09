import { useState } from 'react';

const NameInputModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError(null);
    onSubmit(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <form className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative" onSubmit={handleSubmit}>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            aria-label="Name"
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          aria-label="Submit name"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NameInputModal;
