import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  CheckCircle,
  AlertCircle,
  Mail,
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

export const AdminTicketsView: React.FC = () => {
  const { tickets, respondToTicket, setSelectedFamilyId, setAdminView } = useBridge360();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets.length > 0 ? (tickets[0].id || tickets[0].sys_id || 'TKT-2026-000002') : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      (t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.familyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.applicationId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (t.status || 'open').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const selectedTicket = tickets.find(t => t.id === selectedTicketId || t.sys_id === selectedTicketId) || filteredTickets[0] || null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    const tId = selectedTicket.id || selectedTicket.sys_id || 'TKT-2026-000002';
    respondToTicket(tId, replyMessage.trim(), 'admin', 'Sarah Jenkins (Officer)');
    
    setReplyMessage('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#FFFFFF',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#2563EB', padding: '8px', borderRadius: '10px', color: '#FFFFFF' }}>
              <MessageSquare size={22} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Support Tickets & Officer Workspace
            </h1>
          </div>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.95rem' }}>
            View and respond to support inquiries raised by registered applicants. Officer responses automatically dispatch email notifications from <code>bridge360official08@gmail.com</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>{tickets.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Tickets</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
              {tickets.filter(t => (t.status || '').toLowerCase() === 'open').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Awaiting Reply</div>
          </div>
        </div>
      </div>

      {showSuccessToast && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #6EE7B7',
            color: '#065F46',
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
          }}
        >
          <CheckCircle size={20} style={{ color: '#10B981' }} />
          <span>Officer response posted successfully! Email notification dispatched to applicant.</span>
        </div>
      )}

      {/* Main Grid: Left Ticket List + Right Ticket Discussion Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
        {/* Left Side: Ticket Explorer & Filters */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            height: 'fit-content',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by ID, Name, Subject..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['all', 'open', 'in_progress', 'resolved'].map(statusKey => (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: statusFilter === statusKey ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: statusFilter === statusKey ? '#EFF6FF' : '#F8FAFC',
                  color: statusFilter === statusKey ? '#1D4ED8' : '#64748B',
                  fontWeight: statusFilter === statusKey ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Ticket List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8' }}>
                <AlertCircle size={32} style={{ marginBottom: '8px', color: '#CBD5E1' }} />
                <div>No support tickets match your search.</div>
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = selectedTicket && (selectedTicket.id === ticket.id || selectedTicket.sys_id === ticket.sys_id);
                const status = (ticket.status || 'open').toLowerCase();

                return (
                  <div
                    key={ticket.id || ticket.sys_id || 'TKT'}
                    onClick={() => setSelectedTicketId(ticket.id || ticket.sys_id || null)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: isSelected ? '#F0F9FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#2563EB' }}>
                        {ticket.id || ticket.sys_id || 'TKT-2026-00001'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          textTransform: 'uppercase',
                          background: status === 'open' ? '#FEF3C7' : status === 'in_progress' ? '#DBEAFE' : '#D1FAE5',
                          color: status === 'open' ? '#D97706' : status === 'in_progress' ? '#1D4ED8' : '#059669',
                        }}
                      >
                        {status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.subject || ticket.category || 'Support Inquiry'}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{ticket.familyName || 'Applicant'}</span>
                      <span>{ticket.category || 'General'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Selected Ticket Active Thread & Reply Card */}
        {selectedTicket ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Ticket Details Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {selectedTicket.subject || 'Support Ticket Details'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        background: '#EFF6FF',
                        color: '#1D4ED8',
                      }}
                    >
                      {selectedTicket.id || selectedTicket.sys_id}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#64748B', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span>Category: <strong>{selectedTicket.category || 'General'}</strong></span>
                    <span>Application ID: <strong>{selectedTicket.applicationId || 'APP-2026-000004'}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFamilyId(selectedTicket.familyId);
                    setAdminView('family360');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  <User size={16} /> Open Family 360 Profile
                </button>
              </div>

              {/* Message Thread History */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Conversation Thread ({selectedTicket.responses ? selectedTicket.responses.length : 1} messages)
                </div>

                {selectedTicket.responses && selectedTicket.responses.length > 0 ? (
                  selectedTicket.responses.map((resp: any, idx: number) => {
                    const isAdmin = resp.role === 'admin';
                    return (
                      <div
                        key={idx}
                        style={{
                          alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          background: isAdmin ? '#EFF6FF' : '#F8FAFC',
                          border: isAdmin ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '14px 18px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '6px', fontSize: '0.8rem' }}>
                          <strong style={{ color: isAdmin ? '#1E40AF' : '#0F172A' }}>
                            {resp.author} {isAdmin ? '(Support Officer)' : '(Applicant)'}
                          </strong>
                          <span style={{ color: '#94A3B8' }}>{resp.timestamp}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {resp.message}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                      <strong style={{ color: '#0F172A' }}>{selectedTicket.familyName || 'Applicant'}</strong>
                      <span style={{ color: '#94A3B8' }}>{selectedTicket.createdAt || 'Just now'}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.5 }}>
                      {selectedTicket.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Officer Reply Compose Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <form onSubmit={handleSendReply}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700, color: '#0F172A' }}>
                  <MessageSquare size={18} style={{ color: '#2563EB' }} />
                  <span>Chat with Applicant</span>
                </div>

                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Type your response here..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  style={{ width: '100%', marginBottom: '16px', fontSize: '0.92rem', resize: 'vertical' }}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Reply instantly via live chat platform
                  </span>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }} disabled={!replyMessage.trim()}>
                    <Send size={16} /> Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '60px',
              textAlign: 'center',
              color: '#64748B',
            }}
          >
            <MessageSquare size={48} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
            <h3>Select a Ticket</h3>
            <p>Choose any customer support ticket from the left panel to review thread history and reply.</p>
          </div>
        )}
      </div>
    </div>
  );
};
