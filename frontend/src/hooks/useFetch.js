import { useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/format';

export function useFetch(fetcher, deps = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const reload = async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(getErrorMessage(err));
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (active) setData(result);
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload, setData };
}
