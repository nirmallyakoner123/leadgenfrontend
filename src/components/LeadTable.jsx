import React from 'react';
import { ExternalLink, ChevronRight, MapPin } from 'lucide-react';

// 6 columns matching skeleton: company 35%, industry 12%, location 10%, score 10%, verdict 10%, action 23%
const LEAD_COL_WIDTHS = ['35%', '12%', '10%', '10%', '10%', '23%'];

const VERDICT_BG = {
  HOT:  { color: 'var(--accent-hot)',  bg: 'rgba(239,68,68,0.1)' },
  WARM: { color: 'var(--accent-warm)', bg: 'rgba(245,158,11,0.1)' },
  COLD: { color: 'var(--accent-cold)', bg: 'rgba(59,130,246,0.1)' },
};

const LeadTable = ({ leads, onSelectLead }) => {
  if (!leads || leads.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <span className="text-muted">No leads found.</span>
      </div>
    );
  }

  return (
    <table className="page-table">
      <colgroup>
        {LEAD_COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
      </colgroup>
      <thead>
        <tr>
          {['COMPANY', 'INDUSTRY', 'LOCATION', 'SCORE', 'VERDICT', 'ACTION'].map((h, i) => (
            <th key={i} className={`th-cell ${i === 0 ? 'th-cell-first' : ''} ${i === 5 ? 'text-end pe-4' : ''}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leads.map(lead => {
          const vs = VERDICT_BG[lead.verdict] || VERDICT_BG.COLD;
          return (
            <tr
              key={lead.id}
              className="table-row"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectLead(lead)}
            >
              {/* Company */}
              <td className="td-cell td-cell-first">
                <div className="d-flex align-items-center gap-2">
                  <div className="company-avatar">{(lead.name_display || '?').charAt(0)}</div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.88rem' }}>{lead.name_display}</div>
                    <div className="text-muted" style={{ fontSize: '0.73rem' }}>
                      {(lead.website || '').replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </div>
              </td>

              {/* Industry */}
              <td className="td-cell text-muted" style={{ fontSize: '0.85rem' }}>{lead.industry || '—'}</td>

              {/* Location */}
              <td className="td-cell">
                <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.82rem' }}>
                  <MapPin size={12} />
                  {[lead.city, lead.country_code].filter(Boolean).join(', ') || '—'}
                </span>
              </td>

              {/* Score */}
              <td className="td-cell">
                <span className="fw-bold" style={{ fontSize: '0.92rem' }}>{lead.final_score}</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>/18</span>
              </td>

              {/* Verdict */}
              <td className="td-cell">
                <span className="verdict-pill" style={{ background: vs.bg, color: vs.color }}>
                  {lead.verdict}
                </span>
              </td>

              {/* Action */}
              <td className="td-cell text-end pe-4">
                <button
                  className="d-inline-flex align-items-center gap-1"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  View Details <ChevronRight size={14} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LeadTable;
