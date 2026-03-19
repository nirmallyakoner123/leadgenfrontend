/**
 * ui.jsx — Shared UI primitives
 * ─────────────────────────────────────────────────────────────────
 * KEY RULES:
 *  • SkeletonTable   → renders ONLY <tr> elements (no <table> wrapper)
 *                      Place it directly inside <tbody> in your page table.
 *  • TableHead       → renders <colgroup> + <thead> together.
 *                      The same widths array drives both real headers AND skeletons.
 *  • SkeletonCards   → renders full card blocks for non-table pages (Pipeline Runs).
 *  • ErrorBanner     → consistent API error display.
 * All styling is in App.css (class-based — no inline styles here).
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════
// TABLE PRIMITIVES
// ═══════════════════════════════════════════════════════════════════

/**
 * TableHead — colgroup + thead row.
 * @param {string[]} columns  — display labels
 * @param {string[]} widths   — col widths e.g. ['35%','12%','10%','15%','28%']
 */
export const TableHead = ({ columns, widths = [] }) => (
  <>
    {widths.length > 0 && (
      <colgroup>
        {widths.map((w, i) => <col key={i} style={{ width: w }} />)}
      </colgroup>
    )}
    <thead>
      <tr>
        {columns.map((col, i) => (
          <th key={i} className={`th-cell ${i === 0 ? 'th-cell-first' : ''}`}>{col}</th>
        ))}
      </tr>
    </thead>
  </>
);

/**
 * SkeletonTable — renders <tr> rows ONLY (no <table> wrapper).
 * Must be placed directly inside a <tbody> that is already inside a <table>.
 * The widths should match exactly the widths passed to TableHead for the same table.
 *
 * @param {string[]} colWidths — column widths (must match TableHead widths)
 * @param {number}   rows      — number of skeleton rows
 */
export const SkeletonTable = ({ colWidths = [], rows = 10 }) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
      <tr key={r} className="table-row">
        {colWidths.map((_, c) => (
          <td key={c} className={`td-cell ${c === 0 ? 'td-cell-first' : ''}`}>
            {/* Randomise each cell width slightly so it looks organic */}
            <div
              className="skeleton-cell"
              style={{ width: `${55 + ((r * 7 + c * 13) % 38)}%` }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ═══════════════════════════════════════════════════════════════════
// CARD SKELETON (Pipeline Runs page)
// ═══════════════════════════════════════════════════════════════════

export const SkeletonCards = ({ cards = 5 }) => (
  <div className="skeleton-cards">
    {Array.from({ length: cards }, (_, i) => (
      <div key={i} className="glass-card skeleton-card-item">
        <div className="skeleton-cell skeleton-cell--title" />
        <div className="skeleton-cell skeleton-cell--sub"   />
        <div className="skeleton-stat-grid">
          {Array.from({ length: 6 }, (_, j) => (
            <div key={j} className="skeleton-stat-box">
              <div className="skeleton-cell skeleton-cell--num"   />
              <div className="skeleton-cell skeleton-cell--label" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// ERROR BANNER
// ═══════════════════════════════════════════════════════════════════

export const ErrorBanner = ({ message }) => (
  <div className="error-banner">
    <span className="error-banner__icon">⚠</span>
    <div>
      <strong>API Error</strong> — {message}
      <div className="error-banner__hint">Ensure the FastAPI backend is running on port 8000.</div>
    </div>
  </div>
);

export default SkeletonTable;
