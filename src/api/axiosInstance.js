/**
 * axiosInstance.js
 * ─────────────────────────────────────────────────────────────────
 * Central Axios instance for all LeadGen API calls.
 *
 * Features:
 *  - Base URL points at the FastAPI backend (http://localhost:8000)
 *  - Request interceptor: logs outgoing requests in development
 *  - Response interceptor: unwraps data, normalises errors
 *  - All Supabase credentials stay on the server — the frontend
 *    never needs an API key.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,          // 15 s hard timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.debug(`[API →] ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug(`[API ←] ${response.status} ${response.config.url}`, response.data);
    }
    return response;      // Return the full response — consumers pick .data
  },
  (error) => {
    const status  = error.response?.status;
    const detail  = error.response?.data?.detail ?? error.message ?? 'Unknown error';

    if (import.meta.env.DEV) {
      console.error(`[API ✗] ${status ?? 'NETWORK'} — ${detail}`);
    }

    // Normalise the error so every consumer gets the same shape
    return Promise.reject({
      status,
      message: detail,
      original: error,
    });
  },
);

export default api;
