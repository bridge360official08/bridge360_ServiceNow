import React, { useState } from 'react';
import { Building, Share2, Phone, Mail, MapPin, CheckCircle, Clock, Plus, X, Calendar, AlertCircle } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

export const ReferralsView: React.FC<{ onManageAgencies?: () => void }> = ({ onManageAgencies }) => {
  const { partnerAgencies, referrals, families, createReferral, updateReferralStatus } = useBridge360();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // Screenshot 1 Form Fields
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(families[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partnerAgencies[0]?.id || '');
  const [referralType, setReferralType] = useState<string>('Housing Placement');
  const [referralDate, setReferralDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [referralStatus, setReferralStatus] = useState<'Pending' | 'In Progress' | 'Accepted' | 'Completed' | 'Cancelled'>('Pending');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [dueDate, setDueDate] = useState<string>('2026-08-30');
  const [outcome, setOutcome] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const currentFamilyObj = families.find(f => f.id === selectedFamilyId) || families[0];
  const familyMembersList = currentFamilyObj ? [
    currentFamilyObj.headOfFamily,
    ...(currentFamilyObj.members || [])
  ].filter(Boolean) : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fam = families.find(f => f.id === selectedFamilyId) || families[0];
    const partner = partnerAgencies.find(p => p.id === selectedPartnerId) || partnerAgencies[0];

    if (!fam || !partner) return;

    createReferral({
      familyId: fam.id,
      familyName: fam.familyName,
      partnerAgencyId: partner.id,
      partnerAgencyName: partner.name,
      serviceType: referralType,
      priority: urgency,
      status: referralStatus,
      createdDate: referralDate,
      notes: notes || outcome || 'Inter-agency referral issued.',
    });

    setShowCreateModal(false);
    // Reset form
    setOutcome('');
    setNotes('');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Service Referrals Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Inter-agency referral management linking refugee families to external NGOs, health clinics, housing authorities, and legal aid.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {onManageAgencies && (
            <button className="btn-secondary" onClick={onManageAgencies} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} /> Manage Agencies
            </button>
          )}
          <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> New Partner Referral
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Partner Agency Directory */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
            Registered Partner Agencies ({partnerAgencies.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {partnerAgencies.map(agency => (
              <div key={agency.id} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{agency.name}</h4>
                    <span className="badge badge-indigo" style={{ marginTop: '4px' }}>{agency.type}</span>
                  </div>
                  <span className={`badge ${agency.status === 'Active' ? 'badge-high' : 'badge-medium'}`}>{agency.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                  <div>📍 {agency.location}</div>
                  <div>✉️ {agency.contactEmail} • 📞 {agency.contactPhone}</div>
                  <div style={{ color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>Available Capacity: {agency.availableCapacity} slots</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Referrals List */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
            Active Referrals Queue ({referrals.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {referrals.map(ref => (
              <div key={ref.id} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-indigo">{ref.id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${ref.status === 'Accepted' || ref.status === 'Completed' ? 'badge-high' : 'badge-medium'}`}>{ref.status}</span>
                    <select
                      value={ref.status}
                      onChange={(e) => updateReferralStatus(ref.id, e.target.value)}
                      style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #CBD5E1', outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{ref.familyName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  Partner: <strong style={{ color: '#0F172A' }}>{ref.partnerAgencyName}</strong> • Service: <strong style={{ color: '#2563EB' }}>{ref.serviceType}</strong>
                </div>
                {ref.notes && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    📝 {ref.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE REFERRAL MODAL — EXACT MATCH FOR SCREENSHOT 1 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', background: '#FFFFFF', color: '#0F172A', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>General New Record — Create Referral</h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>ServiceNow Table: <code style={{ color: '#2563EB' }}>u_bridge360_referral</code></div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="input-label" style={{ color: '#DC2626' }}>* Family</label>
                    <select
                      className="input-field"
                      value={selectedFamilyId}
                      onChange={e => setSelectedFamilyId(e.target.value)}
                      required
                    >
                      {families.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.familyName} ({f.applicationId}) — {f.countryOfOrigin}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Family Member</label>
                    <select
                      className="input-field"
                      value={selectedMemberId}
                      onChange={e => setSelectedMemberId(e.target.value)}
                    >
                      <option value="">-- All Family Members / Head --</option>
                      {familyMembersList.map((m: any, idx) => (
                        <option key={idx} value={m.id || idx}>
                          {m.firstName} {m.lastName} ({m.relationshipToHead || 'Member'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label" style={{ color: '#DC2626' }}>* Partner Agency</label>
                    <select
                      className="input-field"
                      value={selectedPartnerId}
                      onChange={e => setSelectedPartnerId(e.target.value)}
                      required
                    >
                      {partnerAgencies.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Referral Type</label>
                    <select
                      className="input-field"
                      value={referralType}
                      onChange={e => setReferralType(e.target.value)}
                    >
                      <option value="Housing Placement">Housing Placement</option>
                      <option value="Healthcare Referral">Healthcare Referral</option>
                      <option value="Legal Aid & Protection">Legal Aid & Protection</option>
                      <option value="Language Support">Language Support</option>
                      <option value="Food & Emergency Assistance">Food & Emergency Assistance</option>
                      <option value="Education & Training">Education & Training</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Referral Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={referralDate}
                      onChange={e => setReferralDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="input-label">Referral Status</label>
                    <select
                      className="input-field"
                      value={referralStatus}
                      onChange={e => setReferralStatus(e.target.value as any)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Urgency</label>
                    <select
                      className="input-field"
                      value={urgency}
                      onChange={e => setUrgency(e.target.value as any)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Due date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Textarea Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label className="input-label">Outcome</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Record inter-agency evaluation outcome or referral placement result..."
                    value={outcome}
                    onChange={e => setOutcome(e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label">Notes</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Enter additional officer intake notes or special accommodations needed..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 24px' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
