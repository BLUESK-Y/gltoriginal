import { useEffect, useState } from 'react';

import { getHubs } from '../lib/api';

/**
 * Loads the hub network once for the map. On failure the map simply renders
 * empty with an inline notice rather than taking the page down.
 */
export function useHubs() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getHubs()
      .then((data) => {
        if (!cancelled) setHubs(data.hubs ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { hubs, loading, error };
}
