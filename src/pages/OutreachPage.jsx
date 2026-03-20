/**
 * OutreachPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * 4-step email outreach workflow (Manual Contact Mode):
 *  Step 1: Select a Lead (top scoring leads ≥ 10/18)
 *  Step 2: Add Contacts Manually (from Apollo web UI)
 *  Step 3: Review & Approve AI-drafted Emails
 *  Step 4: Send (SMTP delivery)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Search, Users, CheckCircle, XCircle, Loader2,
  Mail, Building2, ChevronDown, ChevronUp, Eye, Edit3,
  Zap, ArrowRight, RefreshCcw, Globe, Shield, AlertCircle,
  Plus, Trash2, UserPlus
} from 'lucide-react';
import api from '../api/axiosInstance';
import '../styles/Outreach.css';

// ── Step names ───────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Select Lead',      icon: Zap,        desc: 'Pick a top-scoring lead' },
  { id: 2, label: 'Add Contacts',     icon: UserPlus,   desc: 'Paste contacts from Apollo' },
  { id: 3, label: 'Review Drafts',    icon: Edit3,      desc: 'Review & approve AI emails' },
  { id: 4, label: 'Send Emails',      icon: Send,       desc: 'Deliver via SMTP' },
];

const EMPTY_CONTACT = { full_name: '', title: '', email: '', linkedin_url: '', seniority: '' };

const OutreachPage = () => {
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState(null);

  // Step 1 state
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Step 2 state — manual contact entry
  const [manualContacts, setManualContacts] = useState([{ ...EMPTY_CONTACT }]);
  const [addingContacts, setAddingContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());

  // Step 3 state
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [draftingEmails, setDraftingEmails] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [editingEmail, setEditingEmail] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  // Step 4 state
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // ── Load top leads ──────────────────────────────────────────────
  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const resp = await api.get('/outreach/top-leads', { params: { min_score: 10, limit: 50 } });
      setLeads(resp.data?.data || []);
    } catch (e) {
      console.error('Failed to load leads', e);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  // ── Load contacts ───────────────────────────────────────────────
  const loadContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const resp = await api.get('/outreach/contacts', { params: { page_size: 100 } });
      setContacts(resp.data?.data || []);
    } catch (e) {
      console.error('Failed to load contacts', e);
    } finally {
      setContactsLoading(false);
    }
  }, []);

  // ── Load emails ─────────────────────────────────────────────────
  const loadEmails = useCallback(async () => {
    setEmailsLoading(true);
    try {
      const resp = await api.get('/outreach/emails', { params: { page_size: 100 } });
      setEmails(resp.data?.data || []);
    } catch (e) {
      console.error('Failed to load emails', e);
    } finally {
      setEmailsLoading(false);
    }
  }, []);

  // ── Load stats ──────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const resp = await api.get('/outreach/stats');
      setStats(resp.data);
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  }, []);

  // ── Step-based data loading ─────────────────────────────────────
  useEffect(() => {
    loadStats();
    if (step === 1) loadLeads();
    if (step === 2) loadContacts();
    if (step === 3) loadEmails();
    if (step === 4) { loadEmails(); loadStats(); }
  }, [step, loadLeads, loadContacts, loadEmails, loadStats]);

  // ── Manual Contact Helpers ──────────────────────────────────────
  const updateContact = (index, field, value) => {
    setManualContacts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addRow = () => setManualContacts(prev => [...prev, { ...EMPTY_CONTACT }]);

  const removeRow = (index) => {
    setManualContacts(prev => prev.filter((_, i) => i !== index));
  };

  // ── Submit Manual Contacts ──────────────────────────────────────
  const handleAddContacts = async () => {
    if (!selectedLead) return;
    const valid = manualContacts.filter(c => c.full_name.trim() && c.email.trim());
    if (valid.length === 0) return;

    setAddingContacts(true);
    try {
      await api.post('/outreach/add-contacts', {
        company_id: selectedLead.id,
        contacts: valid,
      });
      setManualContacts([{ ...EMPTY_CONTACT }]);
      loadContacts();
      loadStats();
    } catch (e) {
      console.error('Add contacts failed', e);
    } finally {
      setAddingContacts(false);
    }
  };

  // ── Draft Emails ────────────────────────────────────────────────
  const handleDraftEmails = async () => {
    if (selectedContacts.size === 0) return;
    setDraftingEmails(true);
    try {
      await api.post('/outreach/draft-emails', {
        contact_ids: Array.from(selectedContacts),
      });
      setSelectedContacts(new Set());
      setStep(3);
      loadEmails();
      loadStats();
    } catch (e) {
      console.error('Draft emails failed', e);
    } finally {
      setDraftingEmails(false);
    }
  };

  // ── Approve / Reject ───────────────────────────────────────────
  const handleEmailAction = async (emailId, action) => {
    try {
      const payload = { action };
      if (action === 'approve' && editingEmail === emailId) {
        if (editSubject) payload.edited_subject = editSubject;
        if (editBody) payload.edited_body = editBody;
      }
      await api.put(`/outreach/emails/${emailId}`, payload);
      setEditingEmail(null);
      loadEmails();
      loadStats();
    } catch (e) {
      console.error(`Email ${action} failed`, e);
    }
  };

  // ── Send ────────────────────────────────────────────────────────
  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const resp = await api.post('/outreach/send');
      setSendResult(resp.data);
      loadEmails();
      loadStats();
    } catch (e) {
      setSendResult({ message: e.message || 'Send failed', sent: 0, failed: 0 });
    } finally {
      setSending(false);
    }
  };

  // ── Toggle selection helpers ────────────────────────────────────
  const toggleContact = (id) => setSelectedContacts(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const selectAllContacts = () => {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map(c => c.id)));
    }
  };

  // ── Color helpers ───────────────────────────────────────────────
  const verdictColor = (v) => {
    if (v === 'HOT') return 'var(--accent-hot)';
    if (v === 'WARM') return 'var(--accent-warm)';
    return 'var(--accent-cold)';
  };

  const statusColor = (s) => {
    switch (s) {
      case 'verified': return '#10b981';
      case 'guessed': return 'var(--accent-warm)';
      case 'draft': return 'var(--text-dim)';
      case 'approved': return 'var(--primary)';
      case 'sent': return '#10b981';
      case 'rejected': return 'var(--accent-hot)';
      default: return 'var(--text-dim)';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="outreach-page">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="outreach-header">
        <div>
          <h1 className="outreach-title">
            <Mail size={24} /> Email Outreach
          </h1>
          <p className="outreach-subtitle">Find decision makers in Apollo, add contacts, draft AI emails, and send.</p>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────── */}
      {stats && (
        <div className="outreach-stats-row">
          {[
            { label: 'Contacts', value: stats.total_contacts, color: 'var(--primary)' },
            { label: 'Verified', value: stats.verified_contacts, color: '#10b981' },
            { label: 'Drafts', value: stats.drafts, color: 'var(--text-dim)' },
            { label: 'Approved', value: stats.approved, color: 'var(--accent-warm)' },
            { label: 'Sent', value: stats.sent, color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="outreach-stat-card">
              <div className="outreach-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="outreach-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Stepper ─────────────────────────────────────────────── */}
      <div className="outreach-stepper">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isPast = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <button
                className={`stepper-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                onClick={() => setStep(s.id)}
              >
                <div className="stepper-icon">
                  {isPast ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>
                <div className="stepper-text">
                  <span className="stepper-label">{s.label}</span>
                  <span className="stepper-desc">{s.desc}</span>
                </div>
              </button>
              {i < STEPS.length - 1 && <div className={`stepper-line ${isPast ? 'past' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Step Content ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="outreach-step-content"
        >

          {/* ────────── STEP 1: SELECT A LEAD ────────── */}
          {step === 1 && (
            <div>
              <div className="step-toolbar">
                <div className="step-toolbar-left">
                  <h2 className="step-title">Select a Lead to Outreach</h2>
                  <span className="step-count">{leads.length} leads ≥10/18</span>
                </div>
              </div>

              {leadsLoading ? (
                <div className="outreach-loading"><Loader2 size={20} className="spin" /> Loading leads...</div>
              ) : leads.length === 0 ? (
                <div className="outreach-empty">
                  <AlertCircle size={32} />
                  <p>No leads scoring ≥10/18. Run the pipeline first.</p>
                </div>
              ) : (
                <div className="outreach-table-wrap glass-card">
                  <table className="page-table outreach-table">
                    <thead>
                      <tr>
                        <th className="th-cell" style={{ width: '40px' }}></th>
                        <th className="th-cell th-cell-first">Company</th>
                        <th className="th-cell">Score</th>
                        <th className="th-cell">Verdict</th>
                        <th className="th-cell">Location</th>
                        <th className="th-cell">Contacts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr
                          key={lead.id}
                          className={`table-row ${selectedLead?.id === lead.id ? 'row-selected' : ''}`}
                          onClick={() => {
                            setSelectedLead(lead);
                            setStep(2);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="td-cell" style={{ textAlign: 'center' }}>
                            <input
                              type="radio"
                              className="outreach-checkbox"
                              checked={selectedLead?.id === lead.id}
                              readOnly
                            />
                          </td>
                          <td className="td-cell td-cell-first">
                            <div className="lead-name">{lead.name_display}</div>
                            <div className="lead-sub">{lead.website}</div>
                          </td>
                          <td className="td-cell">
                            <div className="score-badge">{lead.final_score}/18</div>
                          </td>
                          <td className="td-cell">
                            <span className="verdict-pill" style={{
                              color: verdictColor(lead.verdict),
                              background: `${verdictColor(lead.verdict)}18`,
                            }}>
                              {lead.verdict}
                            </span>
                          </td>
                          <td className="td-cell">
                            <span className="loc-text">{lead.city}{lead.city && lead.country_code ? ', ' : ''}{lead.country_code}</span>
                          </td>
                          <td className="td-cell">
                            {lead.has_contacts ? (
                              <span className="contact-found-badge"><CheckCircle size={12} /> Added</span>
                            ) : (
                              <span className="contact-pending-badge">None yet</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ────────── STEP 2: ADD CONTACTS MANUALLY ────────── */}
          {step === 2 && (
            <div>
              <div className="step-toolbar">
                <div className="step-toolbar-left">
                  <h2 className="step-title">Add Contacts</h2>
                  {selectedLead && (
                    <span className="step-count" style={{ color: 'var(--primary)' }}>
                      <Building2 size={12} /> {selectedLead.name_display}
                    </span>
                  )}
                </div>
                <div className="step-toolbar-right">
                  <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(1)}>
                    ← Change Lead
                  </button>
                </div>
              </div>

              {!selectedLead ? (
                <div className="outreach-empty">
                  <Zap size={32} />
                  <p>Select a lead first.</p>
                  <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(1)}>
                    ← Go to Leads
                  </button>
                </div>
              ) : (
                <>
                  {/* Manual Entry Form */}
                  <div className="manual-entry-section glass-card">
                    <div className="manual-entry-header">
                      <h3 className="manual-entry-title"><UserPlus size={16} /> Paste Contacts from Apollo</h3>
                      <p className="manual-entry-desc">
                        Search for <strong>{selectedLead.name_display}</strong> in Apollo's web app, find decision makers (CEO, Founder, Head of HR, etc.), and paste their info below.
                      </p>
                    </div>

                    <div className="manual-contacts-form">
                      {manualContacts.map((c, i) => (
                        <div key={i} className="manual-contact-row">
                          <div className="mcr-fields">
                            <input
                              type="text"
                              className="mcr-input"
                              placeholder="Full Name *"
                              value={c.full_name}
                              onChange={(e) => updateContact(i, 'full_name', e.target.value)}
                            />
                            <input
                              type="email"
                              className="mcr-input"
                              placeholder="Email *"
                              value={c.email}
                              onChange={(e) => updateContact(i, 'email', e.target.value)}
                            />
                            <input
                              type="text"
                              className="mcr-input"
                              placeholder="Job Title"
                              value={c.title}
                              onChange={(e) => updateContact(i, 'title', e.target.value)}
                            />
                            <input
                              type="text"
                              className="mcr-input mcr-input-sm"
                              placeholder="LinkedIn URL"
                              value={c.linkedin_url}
                              onChange={(e) => updateContact(i, 'linkedin_url', e.target.value)}
                            />
                            <select
                              className="mcr-input mcr-select"
                              value={c.seniority}
                              onChange={(e) => updateContact(i, 'seniority', e.target.value)}
                            >
                              <option value="">Seniority</option>
                              <option value="c_suite">C-Suite</option>
                              <option value="founder">Founder</option>
                              <option value="vp">VP</option>
                              <option value="director">Director</option>
                              <option value="manager">Manager</option>
                              <option value="senior">Senior</option>
                            </select>
                          </div>
                          {manualContacts.length > 1 && (
                            <button className="mcr-remove" onClick={() => removeRow(i)} title="Remove">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="manual-form-actions">
                        <button className="outreach-btn outreach-btn-ghost" onClick={addRow}>
                          <Plus size={14} /> Add Another Row
                        </button>
                        <button
                          className="outreach-btn outreach-btn-primary"
                          disabled={addingContacts || manualContacts.every(c => !c.full_name.trim() || !c.email.trim())}
                          onClick={handleAddContacts}
                        >
                          {addingContacts ? (
                            <><Loader2 size={14} className="spin" /> Saving...</>
                          ) : (
                            <><CheckCircle size={14} /> Save Contacts</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Existing Contacts Table */}
                  <div className="step-toolbar" style={{ marginTop: '1.5rem' }}>
                    <div className="step-toolbar-left">
                      <h3 className="step-title" style={{ fontSize: '1rem' }}>Saved Contacts</h3>
                      <span className="step-count">{contacts.length} total</span>
                    </div>
                    <div className="step-toolbar-right">
                      <button className="outreach-btn outreach-btn-ghost" onClick={loadContacts}>
                        <RefreshCcw size={14} /> Refresh
                      </button>
                      {contacts.length > 0 && (
                        <>
                          <button className="outreach-btn outreach-btn-ghost" onClick={selectAllContacts}>
                            {selectedContacts.size === contacts.length ? 'Deselect All' : 'Select All'}
                          </button>
                          <button
                            className="outreach-btn outreach-btn-primary"
                            disabled={selectedContacts.size === 0 || draftingEmails}
                            onClick={handleDraftEmails}
                          >
                            {draftingEmails ? (
                              <><Loader2 size={14} className="spin" /> Drafting...</>
                            ) : (
                              <><Edit3 size={14} /> Draft Emails ({selectedContacts.size})</>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {contactsLoading ? (
                    <div className="outreach-loading"><Loader2 size={20} className="spin" /> Loading contacts...</div>
                  ) : contacts.length === 0 ? (
                    <div className="outreach-empty" style={{ padding: '1.5rem 0' }}>
                      <Users size={24} />
                      <p>No contacts saved yet. Add them using the form above.</p>
                    </div>
                  ) : (
                    <div className="outreach-table-wrap glass-card">
                      <table className="page-table outreach-table">
                        <thead>
                          <tr>
                            <th className="th-cell" style={{ width: '40px' }}></th>
                            <th className="th-cell th-cell-first">Name</th>
                            <th className="th-cell">Title</th>
                            <th className="th-cell">Company</th>
                            <th className="th-cell">Email</th>
                            <th className="th-cell">Seniority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map(c => (
                            <tr
                              key={c.id}
                              className={`table-row ${selectedContacts.has(c.id) ? 'row-selected' : ''}`}
                              onClick={() => toggleContact(c.id)}
                            >
                              <td className="td-cell" style={{ textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  className="outreach-checkbox"
                                  checked={selectedContacts.has(c.id)}
                                  onChange={() => toggleContact(c.id)}
                                />
                              </td>
                              <td className="td-cell td-cell-first">
                                <div className="lead-name">{c.full_name}</div>
                                {c.linkedin_url && (
                                  <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="linkedin-link"
                                    onClick={(e) => e.stopPropagation()}>
                                    LinkedIn ↗
                                  </a>
                                )}
                              </td>
                              <td className="td-cell">{c.title || '—'}</td>
                              <td className="td-cell">{c.company_name || '—'}</td>
                              <td className="td-cell">
                                <span className="email-text">{c.email || 'N/A'}</span>
                              </td>
                              <td className="td-cell">
                                <span className="seniority-text">{c.seniority || '—'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ────────── STEP 3: REVIEW DRAFTS ────────── */}
          {step === 3 && (
            <div>
              <div className="step-toolbar">
                <div className="step-toolbar-left">
                  <h2 className="step-title">Email Drafts</h2>
                  <span className="step-count">{emails.length} emails</span>
                </div>
                <div className="step-toolbar-right">
                  <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(2)}>
                    ← Back to Contacts
                  </button>
                  <button className="outreach-btn outreach-btn-ghost" onClick={loadEmails}>
                    <RefreshCcw size={14} /> Refresh
                  </button>
                </div>
              </div>

              {emailsLoading ? (
                <div className="outreach-loading"><Loader2 size={20} className="spin" /> Loading drafts...</div>
              ) : emails.length === 0 ? (
                <div className="outreach-empty">
                  <Mail size={32} />
                  <p>No email drafts yet. Select contacts and draft emails first.</p>
                  <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(2)}>
                    ← Go to Contacts
                  </button>
                </div>
              ) : (
                <div className="email-drafts-list">
                  {emails.map(email => {
                    const isExpanded = expandedEmail === email.id;
                    const isEditing = editingEmail === email.id;

                    return (
                      <div key={email.id} className={`email-draft-card glass-card ${email.status}`}>
                        <div className="email-draft-header" onClick={() => setExpandedEmail(isExpanded ? null : email.id)}>
                          <div className="email-draft-meta">
                            <span className="email-draft-to">
                              <Mail size={13} />
                              {email.contact_name || '?'} — {email.company_name}
                            </span>
                            <span className="email-draft-title-text">{email.contact_title}</span>
                          </div>
                          <div className="email-draft-right">
                            <span className="status-pill" style={{
                              color: statusColor(email.status),
                              background: `${statusColor(email.status)}18`,
                              borderColor: `${statusColor(email.status)}33`,
                            }}>
                              {email.status}
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        <div className="email-draft-subject-preview">
                          <strong>Subject:</strong> {email.edited_subject || email.subject}
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="email-draft-body-wrap"
                            >
                              {isEditing ? (
                                <div className="email-edit-form">
                                  <label className="edit-label">Subject</label>
                                  <input
                                    type="text"
                                    className="edit-input"
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                  />
                                  <label className="edit-label">Body</label>
                                  <textarea
                                    className="edit-textarea"
                                    rows={10}
                                    value={editBody}
                                    onChange={(e) => setEditBody(e.target.value)}
                                  />
                                </div>
                              ) : (
                                <div className="email-draft-body">
                                  <div className="email-to-line">
                                    <strong>To:</strong> {email.contact_email}
                                  </div>
                                  <pre className="email-body-text">{email.edited_body || email.body}</pre>
                                </div>
                              )}

                              {email.status === 'draft' && (
                                <div className="email-draft-actions">
                                  {!isEditing ? (
                                    <>
                                      <button className="outreach-btn outreach-btn-success" onClick={() => handleEmailAction(email.id, 'approve')}>
                                        <CheckCircle size={14} /> Approve
                                      </button>
                                      <button className="outreach-btn outreach-btn-ghost" onClick={() => {
                                        setEditingEmail(email.id);
                                        setEditSubject(email.edited_subject || email.subject);
                                        setEditBody(email.edited_body || email.body);
                                      }}>
                                        <Edit3 size={14} /> Edit & Approve
                                      </button>
                                      <button className="outreach-btn outreach-btn-danger" onClick={() => handleEmailAction(email.id, 'reject')}>
                                        <XCircle size={14} /> Reject
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button className="outreach-btn outreach-btn-success" onClick={() => handleEmailAction(email.id, 'approve')}>
                                        <CheckCircle size={14} /> Save & Approve
                                      </button>
                                      <button className="outreach-btn outreach-btn-ghost" onClick={() => setEditingEmail(null)}>
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}

                              {email.status === 'sent' && email.sent_at && (
                                <div className="email-sent-info">
                                  <CheckCircle size={13} /> Sent on {new Date(email.sent_at).toLocaleString()}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ────────── STEP 4: SEND ────────── */}
          {step === 4 && (
            <div>
              <div className="step-toolbar">
                <div className="step-toolbar-left">
                  <h2 className="step-title">Send Approved Emails</h2>
                </div>
                <div className="step-toolbar-right">
                  <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(3)}>
                    ← Back to Drafts
                  </button>
                </div>
              </div>

              <div className="send-section glass-card">
                <div className="send-summary">
                  <div className="send-summary-item">
                    <div className="send-summary-value">{stats?.approved || 0}</div>
                    <div className="send-summary-label">Approved & Ready</div>
                  </div>
                  <ArrowRight size={24} className="send-arrow" />
                  <div className="send-summary-item">
                    <div className="send-summary-value">{stats?.sent || 0}</div>
                    <div className="send-summary-label">Already Sent</div>
                  </div>
                </div>

                {(stats?.approved || 0) === 0 ? (
                  <div className="outreach-empty" style={{ padding: '2rem 0' }}>
                    <Mail size={28} />
                    <p>No approved emails to send. Review and approve drafts first.</p>
                    <button className="outreach-btn outreach-btn-ghost" onClick={() => setStep(3)}>
                      ← Review Drafts
                    </button>
                  </div>
                ) : (
                  <div className="send-action">
                    <button
                      className="outreach-btn outreach-btn-send"
                      disabled={sending}
                      onClick={handleSend}
                    >
                      {sending ? (
                        <><Loader2 size={16} className="spin" /> Sending...</>
                      ) : (
                        <><Send size={16} /> Send {stats?.approved} Emails Now</>
                      )}
                    </button>
                    <p className="send-warning">
                      <AlertCircle size={13} /> This will send emails via SMTP. Cannot be undone.
                    </p>
                  </div>
                )}

                {sendResult && (
                  <div className={`send-result ${sendResult.sent > 0 ? 'success' : 'error'}`}>
                    <p>{sendResult.message}</p>
                    {sendResult.sent !== undefined && (
                      <div className="send-result-stats">
                        <span className="sent-count">✅ {sendResult.sent} sent</span>
                        <span className="failed-count">❌ {sendResult.failed} failed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OutreachPage;
