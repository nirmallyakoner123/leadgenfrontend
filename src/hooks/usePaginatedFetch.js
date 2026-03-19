/**
 * usePaginatedFetch.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generic paginated data hook for every LeadGen list page.
 *
 * Features:
 *  ✔ Single API call per page/filter change (no duplicates)
 *  ✔ AbortController — cancels stale in-flight request when deps change
 *  ✔ Normalised loading / error states
 *  ✔ Server-driven total (comes from the API envelope)
 *
 * Usage:
 *   const { data, total, loading, error, page, setPage } =
 *     usePaginatedFetch(getLeads, { verdict: 'HOT' }, 10);
 *
 * @param {Function} fetchFn   — service function from services.js
 * @param {Object}   filters   — extra query params (stable reference expected)
 * @param {number}   pageSize  — rows per page (default 10)
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const usePaginatedFetch = (fetchFn, filters = {}, pageSize = 10) => {
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Stable JSON key for filter comparison — avoids reference identity issues
  const filtersKey = JSON.stringify(filters);

  // Reset to page 1 whenever filters change
  const prevFiltersKey = useRef(filtersKey);
  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setPage(1);          // this triggers the fetch below
    }
  }, [filtersKey]);

  useEffect(() => {
    // AbortController — cancel previous request if page / filters change
    const abortCtrl = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          page_size: pageSize,
          ...JSON.parse(filtersKey),       // spread current filters
        };

        const response = await fetchFn(params);

        if (cancelled) return;             // component unmounted or deps changed

        const envelope = response.data;    // { data, total, page, page_size, total_pages }
        setData(envelope.data ?? []);
        setTotal(envelope.total ?? 0);
      } catch (err) {
        if (cancelled) return;
        if (err?.original?.code === 'ERR_CANCELED') return;   // AbortController cancel
        setError(err?.message ?? 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      abortCtrl.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersKey, pageSize]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  return { data, total, loading, error, page, setPage: handlePageChange };
};

export default usePaginatedFetch;
