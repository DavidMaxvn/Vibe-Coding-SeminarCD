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
      <form className="bg-[#D49100] text-white rounded-2xl shadow-lg p-6 w-full max-w-md relative" onSubmit={handleSubmit}>
        <button
          className="absolute top-2 right-2 text-white/80 hover:text-white"
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
            className="w-full rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-800"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            aria-label="Name"
          />
        </div>
        {error && <div className="text-white/90 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-white text-[#D49100] px-4 py-2 rounded-lg"
          aria-label="Submit name"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NameInputModal;
