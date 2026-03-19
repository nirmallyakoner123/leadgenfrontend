import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  { id: 'US', name: 'United States', flag: '🇺🇸', color: '#3b82f6' },
  { id: 'GB', name: 'United Kingdom', flag: '🇬🇧', color: '#ef4444' },
  { id: 'AU', name: 'Australia', flag: '🇦🇺', color: '#10b981' },
  { id: 'VN', name: 'Vietnam', flag: '🇻🇳', color: '#f59e0b' },
];

const RegionModal = ({ isOpen, onClose, onConfirm }) => {
  const [selected, setSelected] = React.useState('US');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="region-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>Start Pipeline Execution</h3>
            <p>Select target geography for discovery & enrichment</p>
          </div>

          <div className="region-grid">
            {regions.map((r) => (
              <div
                key={r.id}
                className={`region-card ${selected === r.id ? 'active' : ''}`}
                onClick={() => setSelected(r.id)}
              >
                <span className="region-flag">{r.flag}</span>
                <span className="region-name">{r.name}</span>
                {selected === r.id && (
                  <motion.div
                    layoutId="outline"
                    className="card-outline"
                    style={{ borderColor: r.color }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="execute-btn"
              onClick={() => onConfirm(selected)}
            >
              ⚡ Start Execution
            </button>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .region-modal {
          background: #121212;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          padding: 32px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
        }

        .modal-header h3 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #fff;
          font-weight: 700;
        }

        .modal-header p {
          margin: 0 0 32px 0;
          color: #888;
          font-size: 14px;
        }

        .region-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .region-card {
          position: relative;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .region-card:hover {
          background: #222;
          border-color: #444;
        }

        .region-card.active {
          background: #222;
        }

        .region-flag { font-size: 24px; }
        .region-name { font-size: 15px; color: #ddd; font-weight: 500; }

        .card-outline {
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border: 2px solid #3b82f6;
          border-radius: 13px;
          pointer-events: none;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
        }

        .cancel-btn {
          flex: 1;
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .execute-btn {
          flex: 2;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .execute-btn:hover { background: #2563eb; }
      `}} />
    </AnimatePresence>
  );
};

export default RegionModal;
