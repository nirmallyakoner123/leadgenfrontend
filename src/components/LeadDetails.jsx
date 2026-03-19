import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Globe, Briefcase, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const LeadDetails = ({ lead, onClose }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '100%', 
        maxWidth: '500px', 
        height: '100vh', 
        background: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border-color)',
        zIndex: 100,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        padding: '2rem',
        overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem' }}>Lead Intelligence</h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--primary)33' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white'
          }}>
            {lead.name_display.charAt(0)}
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{lead.name_display}</h4>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
              <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Globe size={14} />
                Website <ExternalLink size={12} />
              </a>
              <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Briefcase size={14} />
                {lead.industry}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.team_size} Employees</span>
          <span style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.city}, {lead.country_code}</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h5 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--primary)" />
          AI VERDICT: {lead.verdict} (Score: {lead.final_score}/18)
        </h5>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            {lead.why_they_fit}
          </p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Recommended Outreach Opener</span>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              "{lead.outreach_opener}"
            </p>
          </div>
        </div>
      </div>

      <div>
        <h5 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dim)' }}>Verification Signals</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {lead.signal_results.map((signal, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem', 
              padding: '1rem', 
              background: 'var(--bg-card)', 
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              {signal.passed ? (
                <CheckCircle2 size={20} color="#10b981" />
              ) : (
                <AlertCircle size={20} color="var(--text-dim)" />
              )}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: signal.passed ? 'var(--text-main)' : 'var(--text-dim)' }}>
                  {signal.signal_id.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{signal.evidence}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button style={{ 
          flex: 1, 
          padding: '0.75rem', 
          borderRadius: '12px', 
          background: 'var(--primary)', 
          color: 'white', 
          border: 'none', 
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Copy Outreach
        </button>
        <button style={{ 
          flex: 1, 
          padding: '0.75rem', 
          borderRadius: '12px', 
          background: 'transparent', 
          color: 'var(--text-main)', 
          border: '1px solid var(--border-color)', 
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Export PDF
        </button>
      </div>
    </motion.div>
  );
};

export default LeadDetails;
