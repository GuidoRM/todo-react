import { useState, useCallback } from 'react';

function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const defaultOptions = {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const mergedOptions = { ...defaultOptions, ...options };

      if (options.body instanceof FormData) {
        delete mergedOptions.headers['Content-Type'];
      }

      const response = await fetch(url, mergedOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}

export default useFetch;