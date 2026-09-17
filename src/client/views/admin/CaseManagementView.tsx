import React, { useState } from 'react';
import { Briefcase, Plus, CheckCircle, Clock, Filter, Eye, CheckSquare, Search, X, Calendar, User, ArrowRight } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { CaseRecord } from '../../types/bridge360';

export const CaseManagementView: React.FC = () => {
  const { cases, families, createCase, setSelectedFamilyId, setAdminView, toggleTask } = useBridge360();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State for new case
  const [selectedFamId, setSelectedFamId] = useState<string>(families[0]?.id || '');
  const [category, setCategory] = useState<'Housing' | 'Healthcare' | 'Legal' | 'Education' | 'Immigration' | 'Employment'>('Housing');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Critical'>('High');
  const [assignedOfficer, setAssignedOfficer] = useState<string>('Sarah Jenkins');
  const [dueDate, setDueDate] = useState<string>('2026-08-30');
  const [tasksText, setTasksText] = useState<string>('Review household requirements\nContact partner service provider\nSchedule verification check');

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fam = families.find(f => f.id === selectedFamId || f.applicationId === selectedFamId) || families[0];
    const newCaseTasks = tasksText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: `T-${Date.now()}-${idx}`,
        title: t,
        completed: false,
        dueDate,
      }));

    const newCase: CaseRecord = {
      id: `CAS-2026-${String(cases.length + 1).padStart(6, '0')}`,
      familyId: fam.id,
      familyName: fam.familyName || `${fam.headOfFamily?.lastName} Family`,
      category,
      title: title || `${category} Placement Case`,
      description,
      priority,
      status: 'In Progress',
      assignedOfficer,
      openedDate: new Date().toISOString().split('T')[0],
      dueDate,
      tasks: newCaseTasks.length > 0 ? newCaseTasks : [
        { id: `T-1`, title: 'Initial case assessment & intake review', completed: false, dueDate }
      ],
    };

    createCase(newCase);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const filteredCases = cases.filter(c => {
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>Refugee Case Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Operational case files, sub-tasks, officer assignments, and resolution tracking across all registered families.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ fontSize: '0.88rem' }}>
          <Plus size={16} /> Open New Case
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ color: '#94A3B8' }} />
          <input
            className="input-field"
            placeholder="Search cases by title, family name, officer, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Legal', 'Housing', 'Healthcare', 'Education', 'Employment'].map(cat => (
            <button
              key={cat}
              className={filterCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '20px' }}>
        {filteredCases.map(c => (
          <div key={c.id} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-indigo">{c.id}</span>
                    <span className="badge badge-indigo">{c.category}</span>
                    <span className="badge badge-high">{c.priority} Priority</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{c.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '3px' }}>
                    Applicant / Family: <strong style={{ color: '#0F172A' }}>{c.familyName}</strong> • Assigned: <strong style={{ color: '#2563EB' }}>{c.assignedOfficer}</strong>
                  </div>
                </div>
                <span className={`badge ${c.status === 'Closed' ? 'badge-high' : 'badge-medium'}`}>{c.status}</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
                {c.description}
              </p>

              {/* Checklist */}
              <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Action Tasks ({c.tasks.filter(t => t.completed).length} / {c.tasks.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.tasks.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTask(c.id, t.id)}
                        style={{ width: '16px', height: '16px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                      <span style={{ color: t.completed ? '#94A3B8' : '#0F172A', textDecoration: t.completed ? 'line-through' : 'none', fontWeight: t.completed ? 400 : 600 }}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}
              onClick={() => {
                setSelectedFamilyId(c.familyId);
                setAdminView('family360');
              }}
            >
              <Eye size={14} /> Open Family 360 Case File
            </button>
          </div>
        ))}
      </div>

      {/* OPEN NEW CASE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Open New Case</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Create operational case and tasks for registered family</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <label className="input-label">Case Title *</label>
                <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Transitional Housing Placement" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select className="input-field" value={category} onChange={e => setCategory(e.target.value as any)}>
                    <option value="Legal">Legal</option>
                    <option value="Housing">Housing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Employment">Employment</option>
                    <option value="Immigration">Immigration</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Priority</label>
                  <select className="input-field" value={priority} onChange={e => setPriority(e.target.value as any)}>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Assigned Officer</label>
                  <select className="input-field" value={assignedOfficer} onChange={e => setAssignedOfficer(e.target.value)}>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Michael Vance">Michael Vance</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="David Chen">David Chen</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Due Date</label>
                  <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="input-label">Case Description</label>
                <textarea className="input-field" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Details regarding this operational case..." required />
              </div>

              <div>
                <label className="input-label">Action Checklist Tasks (one per line)</label>
                <textarea className="input-field" rows={3} value={tasksText} onChange={e => setTasksText(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Plus size={14} /> Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagementView;
