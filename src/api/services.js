/**
 * services.js
 * ─────────────────────────────────────────────────────────────────
 * One function per FastAPI endpoint.
 * Each function returns an Axios promise.
 * All pagination, filtering, and search parameters are passed as
 * query params — the server handles actual DB range queries.
 *
 * Response envelope (from every endpoint):
 *   { data: [], total: number, page: number, page_size: number, total_pages: number }
 */

import api from './axiosInstance';

/** Dashboard stat cards */
export const getDashboardStats = () =>
  api.get('/dashboard/stats');

/**
 * Active leads (active_leads view + AI signal enrichment)
 * @param {{ page, page_size, verdict?, country? }} params
 */
export const getLeads = (params = {}) =>
  api.get('/leads', { params });

/**
 * All companies (companies table)
 * @param {{ page, page_size, country?, search? }} params
 */
export const getCompanies = (params = {}) =>
  api.get('/companies', { params });

/**
 * Raw scrape events
 * @param {{ page, page_size, source?, country? }} params
 */
export const getScrapes = (params = {}) =>
  api.get('/scrapes', { params });

/**
 * Job check results
 * @param {{ page, page_size, hr_only? }} params
 */
export const getJobEvents = (params = {}) =>
  api.get('/job-events', { params });

/**
 * AI evaluation results
 * @param {{ page, page_size, verdict? }} params
 */
export const getAIResults = (params = {}) =>
  api.get('/ai-results', { params });

/**
 * Pipeline run history
 * @param {{ page, page_size }} params
 */
export const getPipelineRuns = (params = {}) =>
  api.get('/pipeline-runs', { params });

/**
 * Token cache / freshness view
 * @param {{ page, page_size, stale_only? }} params
 */
export const getTokenCache = (params = {}) =>
  api.get('/token-cache', { params });
