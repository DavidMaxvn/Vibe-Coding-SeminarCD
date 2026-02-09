import { useEffect, useState } from 'react';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:8000/openapi.yaml');
        if (res.ok) {
          setStatus('ok');
        } else {
          setStatus('unreachable');
        }
      } catch {
        setStatus('unreachable');
      }
    };
    checkApi();
  }, []);

  if (status === 'checking') return null;
  if (status === 'ok') return null;
  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50">
      Backend API unavailable or unreachable
    </div>
  );
};

export default ApiStatus;
