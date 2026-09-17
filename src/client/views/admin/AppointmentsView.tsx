import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, Plus, Search, Filter, X, Eye } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { AppointmentRecord } from '../../types/bridge360';

export const AppointmentsView: React.FC = () => {
  const { appointments, families, createAppointment, setSelectedFamilyId, setAdminView } = useBridge360();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form State for new appointment
  const [selectedFamId, setSelectedFamId] = useState(families[0]?.id || '');
  const [title, setTitle] = useState('Document Verification & Intake Interview');
  const [type, setType] = useState<'Interview' | 'Orientation' | 'Medical' | 'Legal'>('Interview');
  const [date, setDate] = useState('2026-08-20');
  const [time, setTime] = useState('11:00 AM');
  const [location, setLocation] = useState('Bridge360 Intake Center - Room 3');
  const [officer, setOfficer] = useState('Sarah Jenkins');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fam = families.find(f => f.id === selectedFamId || f.applicationId === selectedFamId) || families[0];
    const newApt: AppointmentRecord = {
      id: `APT-2026-${String(appointments.length + 1).padStart(6, '0')}`,
      familyId: fam.id,
      familyName: fam.familyName || `${fam.headOfFamily?.lastName} Family`,
      title,
      type,
      date,
      time,
      location,
      officer,
      status: 'Scheduled',
      exposedToCustomer: true,
    };
    createAppointment(newApt);
    setShowScheduleModal(false);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || apt.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
            Appointments &amp; Scheduling Agenda
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Schedule and track interviews, medical checkups, and case orientation meetings across all assigned families.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowScheduleModal(true)} style={{ fontSize: '0.88rem' }}>
          <Plus size={16} /> Schedule New Appointment
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ color: '#94A3B8' }} />
          <input
            className="input-field"
            placeholder="Search appointments by family, title, officer, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Interview', 'Orientation', 'Medical', 'Legal'].map(t => (
            <button
              key={t}
              className={filterType === t ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Agenda List */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
          Scheduled Appointments ({filteredAppointments.length})
        </h3>

        {filteredAppointments.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
            No appointments found matching your search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  padding: '18px 20px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-indigo">{apt.type}</span>
                      <h4 style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{apt.title}</h4>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '4px' }}>
                      Applicant / Family: <strong style={{ color: '#0F172A' }}>{apt.familyName}</strong> • Date: <strong style={{ color: '#2563EB' }}>{apt.date} at {apt.time}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                      📍 Location: {apt.location} • Officer: <strong>{apt.officer}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-high">{apt.status}</span>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    onClick={() => {
                      setSelectedFamilyId(apt.familyId);
                      setAdminView('family360');
                    }}
                  >
                    <Eye size={13} /> View Family
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCHEDULE NEW APPOINTMENT MODAL */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Schedule Appointment</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Book an interview or orientation with applicant</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Select Registered Applicant / Family *</label>
                <select className="input-field" value={selectedFamId} onChange={e => setSelectedFamId(e.target.value)} required>
                  {families.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.headOfFamily?.firstName} {f.headOfFamily?.lastName} ({f.applicationId} - {f.countryOfOrigin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Appointment Title *</label>
                <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category / Type</label>
                  <select className="input-field" value={type} onChange={e => setType(e.target.value as any)}>
                    <option value="Interview">Interview</option>
                    <option value="Orientation">Orientation</option>
                    <option value="Medical">Medical Checkup</option>
                    <option value="Legal">Legal Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Assigned Officer</label>
                  <select className="input-field" value={officer} onChange={e => setOfficer(e.target.value)}>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Michael Vance">Michael Vance</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="David Chen">David Chen</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Date</label>
                  <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Time</label>
                  <input className="input-field" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:30 AM" required />
                </div>
              </div>

              <div>
                <label className="input-label">Location / Room</label>
                <input className="input-field" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Calendar size={14} /> Confirm &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;
