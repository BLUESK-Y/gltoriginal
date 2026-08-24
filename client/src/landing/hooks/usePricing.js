import { useEffect, useRef, useState } from 'react';

import { getPricingConfig, getQuote } from '../lib/api';

/** Rate card + coverage tree. Fetched once, the first time the modal opens. */
export function usePricingConfig(enabled) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || config) return undefined;
    let cancelled = false;

    getPricingConfig()
      .then((data) => !cancelled && setConfig(data))
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [enabled, config]);

  return { config, error };
}

/**
 * Live quote. Debounced so dragging the hub slider does not fire a request per
 * pixel, and the previous request is aborted whenever inputs change again.
 */
export function useQuote({ hubs, duration, storeMix }, enabled) {
  const [quote, setQuote] = useState(null);
  const [pending, setPending] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    setPending(true);
    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      getQuote({ hubs, duration, storeMix }, { signal: controller.signal })
        .then((data) => {
          if (!controller.signal.aborted) {
            setQuote(data);
            setPending(false);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setPending(false);
        });
    }, 220);

    return () => clearTimeout(timer);
  }, [hubs, duration, storeMix, enabled]);

  return { quote, pending };
}
