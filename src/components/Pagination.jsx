import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderTop: '1px solid var(--border-color)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Info & Limit Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          Showing <strong style={{ color: 'var(--text-muted)' }}>{start}–{end}</strong> of{' '}
          <strong style={{ color: 'var(--text-muted)' }}>{totalItems}</strong> results
        </span>
        
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Per page:</span>
            <select 
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value={10} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>10</option>
              <option value={20} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>20</option>
              <option value={50} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>50</option>
              <option value={100} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>100</option>
            </select>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-main)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: '34px', height: '34px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px',
                background: page === currentPage ? 'var(--primary)' : 'var(--bg-card)',
                border: page === currentPage ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                color: page === currentPage ? 'white' : 'var(--text-muted)',
                fontWeight: page === currentPage ? 700 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
