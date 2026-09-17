import React, { useState } from 'react';
import {
  Building,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ExternalLink,
  Shield,
  Activity,
  Users,
  Clock,
  X,
  Share2,
  Trash2
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { PartnerAgency } from '../../types/bridge360';

export const PartnerAgenciesView: React.FC = () => {
  const { partnerAgencies, referrals, families } = useBridge360();
  const [agenciesList, setAgenciesList] = useState<PartnerAgency[]>(partnerAgencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'referrals'>('directory');

  const [name, setName] = useState('');
  const [type, setType] = useState('Legal Aid');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState('30');

  const handleRemoveAgency = (id: string, agencyName: string) => {
    if (window.confirm(`Are you sure you want to remove "${agencyName}" from the partner agency directory?`)) {
      setAgenciesList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (editingId) {
      setAgenciesList(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, name, type: type as any, location, contactEmail: email, contactPhone: phone, availableCapacity: parseInt(capacity || '20', 10) }
          : p
      ));
    } else {
      const newAgency: PartnerAgency = {
        id: `PA-0${agenciesList.length + 1}`,
        name,
        type: type as any,
        location: location || 'Regional Office',
        contactEmail: email || 'contact@agency.org',
        contactPhone: phone || '+1 800 555 0199',
        availableCapacity: parseInt(capacity || '20', 10),
        status: 'Active',
      };
      setAgenciesList(prev => [newAgency, ...prev]);
    }
    
    setShowAddModal(false);
    setEditingId(null);
    setName('');
    setLocation('');
    setEmail('');
    setPhone('');
  };

  const handleEditClick = (agency: PartnerAgency) => {
    setEditingId(agency.id);
    setName(agency.name);
    setType(agency.type);
    setLocation(agency.location);
    setEmail(agency.contactEmail);
    setPhone(agency.contactPhone);
    setCapacity(agency.availableCapacity.toString());
    setShowAddModal(true);
  };

  const filtered = agenciesList.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
            Partner Agencies &amp; NGO Directory
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Accredited humanitarian partners, shelter networks, legal aid, and active capacity management for refugee service referrals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('directory')}
            style={{ fontSize: '0.85rem' }}
          >
            <Building size={15} /> Partner Directory ({agenciesList.length})
          </button>
          <button
            className={activeTab === 'referrals' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('referrals')}
            style={{ fontSize: '0.85rem' }}
          >
            <Share2 size={15} /> Active Referrals ({referrals.length})
          </button>
          <button className="btn-primary" onClick={() => {
            setEditingId(null);
            setName('');
            setLocation('');
            setEmail('');
            setPhone('');
            setCapacity('30');
            setShowAddModal(true);
          }} style={{ fontSize: '0.85rem' }}>
            <Plus size={15} /> Onboard New Partner
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          {/* Filter & Search */}
          <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                className="input-field"
                placeholder="Search partners by name, service type, location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Legal Aid', 'Healthcare', 'Housing', 'Language Support', 'Education'].map(t => (
                <button
                  key={t}
                  className={selectedType === t ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Partners */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => handleEditClick(p)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{p.name}</h3>
                        <span className="badge badge-indigo" style={{ marginTop: '3px' }}>{p.type}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-high">{p.status}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(p);
                        }}
                        style={{
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#2563EB',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          transition: 'all 0.2s'
                        }}
                        title="Edit Partner Agency"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAgency(p.id, p.name);
                        }}
                        style={{
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          color: '#DC2626',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          transition: 'all 0.2s'
                        }}
                        title="Remove Partner Agency"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} style={{ color: '#94A3B8' }} /> {p.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={15} style={{ color: '#94A3B8' }} /> {p.contactEmail}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={15} style={{ color: '#94A3B8' }} /> {p.contactPhone}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Available Slots</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A' }}>{p.availableCapacity} Active</div>
                  </div>
                  <span className="badge badge-indigo" style={{ fontSize: '0.78rem' }}>
                    Accredited Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ACTIVE REFERRALS TAB */
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Dispatched Service Referrals ({referrals.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {referrals.map(ref => (
              <div
                key={ref.id}
                style={{
                  padding: '16px 20px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-indigo">{ref.id}</span>
                    <h4 style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{ref.serviceType}</h4>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '3px' }}>
                    Referred Family: <strong style={{ color: '#0F172A' }}>{ref.familyName}</strong> • Assigned Partner: <strong style={{ color: '#2563EB' }}>{ref.partnerAgencyName}</strong>
                  </div>
                  {ref.notes && <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Notes: {ref.notes}</div>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-high">{ref.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{editingId ? 'Edit Partner Agency' : 'Onboard Partner Agency'}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>{editingId ? 'Update partner details' : 'Add accredited NGO or service provider'}</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAgency} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="input-label">Agency Name *</label>
                <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. UN Migration Care" required />
              </div>
              <div>
                <label className="input-label">Service Specialization</label>
                <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
                  <option value="Legal Aid">Legal Aid &amp; Representation</option>
                  <option value="Healthcare">Healthcare &amp; Clinical Services</option>
                  <option value="Housing">Housing &amp; Shelter Support</option>
                  <option value="Language Support">Language Support</option>
                  <option value="Education">Education &amp; Language Training</option>
                </select>
              </div>
              <div>
                <label className="input-label">Location / Address</label>
                <input className="input-field" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. 450 Hope Blvd, Metro City" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label">Contact Email</label>
                  <input className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="intake@agency.org" />
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 800 555 0122" />
                </div>
              </div>
              <div>
                <label className="input-label">Initial Capacity Intake (Slots)</label>
                <input className="input-field" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update Partner' : 'Save & Accredit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerAgenciesView;
