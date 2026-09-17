import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Search,
  CheckCircle,
  Clock,
  Mail,
  User,
  Key,
  Award,
  MoreVertical,
  Lock
} from 'lucide-react';

interface OfficerUser {
  id: string;
  name: string;
  email: string;
  role: 'System Administrator' | 'Case Manager' | 'Verification Officer' | 'Legal Specialist' | 'Field Intake Agent';
  status: 'Active' | 'Inactive';
  assignedCases: number;
  lastActive: string;
}

const INITIAL_USERS: OfficerUser[] = [
  { id: 'USR-01', name: 'Sarah Jenkins', email: 'sarah.jenkins@refugee-gov.org', role: 'System Administrator', status: 'Active', assignedCases: 14, lastActive: '5 mins ago' },
  { id: 'USR-02', name: 'Marcus Vance', email: 'marcus.vance@refugee-gov.org', role: 'Verification Officer', status: 'Active', assignedCases: 9, lastActive: '12 mins ago' },
  { id: 'USR-03', name: 'Elena Rostova', email: 'elena.rostova@refugee-gov.org', role: 'Case Manager', status: 'Active', assignedCases: 21, lastActive: '1 hour ago' },
  { id: 'USR-04', name: 'Amira Al-Mansoor', email: 'amira.mansoor@refugee-gov.org', role: 'Legal Specialist', status: 'Active', assignedCases: 7, lastActive: '2 hours ago' },
  { id: 'USR-05', name: 'David Chen', email: 'david.chen@refugee-gov.org', role: 'Field Intake Agent', status: 'Active', assignedCases: 12, lastActive: 'Yesterday' },
];

export const UsersRolesView: React.FC = () => {
  const [users, setUsers] = useState<OfficerUser[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<OfficerUser['role']>('Verification Officer');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const u: OfficerUser = {
      id: `USR-0${users.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      assignedCases: 0,
      lastActive: 'Just now',
    };
    setUsers([...users, u]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            Officer Users &amp; Access Roles
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Role-Based Access Control (RBAC), verification officer assignments, and field staff security permissions.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: '0.85rem' }}>
          <UserPlus size={15} /> Add Officer / User
        </button>
      </div>

      {/* Role Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Personnel</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>{users.length}</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>System Admins</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#9333EA', marginTop: '4px' }}>
            {users.filter(u => u.role === 'System Administrator').length}
          </div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Verification Officers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
            {users.filter(u => u.role === 'Verification Officer').length}
          </div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Case Managers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EA580C', marginTop: '4px' }}>
            {users.filter(u => u.role === 'Case Manager').length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Personnel Roster ({filtered.length})</h3>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              className="input-field"
              placeholder="Search officer name, email, role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Officer Name</th>
                <th style={{ padding: '12px 14px' }}>Role / Permission</th>
                <th style={{ padding: '12px 14px' }}>Workload</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Last Activity</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-indigo">
                      <Shield size={12} style={{ marginRight: '4px', display: 'inline' }} /> {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {u.assignedCases} Active Cases
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-high">{u.status}</span>
                  </td>
                  <td style={{ padding: '14px', color: '#64748B', fontSize: '0.82rem' }}>
                    {u.lastActive}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      Edit Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', background: '#FFFFFF', color: '#0F172A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Provision New Officer</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <input className="input-field" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. John Miller" />
              </div>
              <div>
                <label className="input-label">Official Email</label>
                <input className="input-field" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="john.miller@refugee-gov.org" />
              </div>
              <div>
                <label className="input-label">System Role</label>
                <select className="input-field" value={newRole} onChange={e => setNewRole(e.target.value as any)}>
                  <option value="Verification Officer">Verification Officer (Document OCR &amp; Approval)</option>
                  <option value="Case Manager">Case Manager (Interventions &amp; Tasks)</option>
                  <option value="Legal Specialist">Legal Specialist (Asylum &amp; Representation)</option>
                  <option value="Field Intake Agent">Field Intake Agent (Registration)</option>
                  <option value="System Administrator">System Administrator (Full Access)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Provision User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
