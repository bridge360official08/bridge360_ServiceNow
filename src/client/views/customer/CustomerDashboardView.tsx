import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Calendar,
  Users,
  ShieldCheck,
  Plus,
  Send,
  LogOut,
  AlertCircle,
  Info,
  UserCheck,
  Bell,
  Sparkles,
  User,
  MapPin,
  Globe,
  HelpCircle,
  X,
  Eye,
  Edit3,
  Lock,
  Upload,
  Phone,
  Mail
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

interface Props {
  onLogout: () => void;
}

export const CustomerDashboardView: React.FC<Props> = ({ onLogout }) => {
  const {
    authenticatedAppId,
    liveDashboardData,
    raiseCustomerTicket,
    respondToTicket,
    tickets,
    documents,
    appointments,
    families,
    notifications,
    setNotifications,
    markNotificationRead,
    uploadCustomerDoc,
    updateCustomerProfile,
  } = useBridge360();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'tickets' | 'appointments'>('overview');
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);

  // Modal for Raising Ticket
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState<boolean>(false);
  const [ticketCategory, setTicketCategory] = useState<'Document Issue' | 'Status Inquiry' | 'Appointment Request' | 'General Support'>('Status Inquiry');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketAttachment, setTicketAttachment] = useState<string>('');

  // Ticket detail view
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState<string>('');

  // Document Viewer Modal
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // Member Application Detail Modal
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // Upload Requested Document Modal
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);
  const [uploadDocType, setUploadDocType] = useState<string>('National ID');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadFileSize, setUploadFileSize] = useState<string>('1.5 MB');
  const [uploadRawText, setUploadRawText] = useState<string>('');

  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [editMobile, setEditMobile] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editState, setEditState] = useState<string>('');
  const [editPostalCode, setEditPostalCode] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('English');

  // Use live SN data when available; graceful fallback for display
  const snFamily  = liveDashboardData?.family;
  const snMembers = liveDashboardData?.members  || [];
  const contextFam = families.find(f =>
    f.applicationId === authenticatedAppId ||
    f.id === authenticatedAppId ||
    f.bridge360Id === authenticatedAppId ||
    f.familyId === authenticatedAppId ||
    f.headOfFamily?.refugeeId === authenticatedAppId ||
    (f.members && f.members.some((m: any) => m.refugeeId === authenticatedAppId))
  );

  const isHeadMember = (m: any): boolean => {
    if (m.isHead || m.isHeadOfFamily) return true;
    const rel = (m.relationship || m.relationshipToHead || '').toLowerCase();
    if (rel === 'self' || rel === 'head of household' || rel === 'head_of_household' || rel === 'head of family' || rel === 'head') return true;
    if (contextFam && contextFam.headOfFamily && m.sys_id === contextFam.headOfFamily.id) return true;
    if (contextFam && contextFam.headOfFamily && m.firstName === contextFam.headOfFamily.firstName && m.lastName === contextFam.headOfFamily.lastName) return true;
    return false;
  };

  const resolvedHead = snMembers.find(isHeadMember) || (contextFam ? contextFam.headOfFamily : {
    firstName: 'Applicant', lastName: 'Family', email: snFamily?.email || '',
  });

  const rawMembers = snMembers.filter((m: any) => !isHeadMember(m));
  const resolvedMembers = rawMembers.length > 0 ? rawMembers : (contextFam ? contextFam.members.filter((m: any) => !isHeadMember(m)) : []);

  // Build a FamilyRecord-shaped object from live SN data or context
  const family: any = snFamily ? {
    applicationId:      snFamily.applicationId,
    bridge360Id:        snFamily.bridge360Id,
    familyId:           snFamily.familyId,
    familyName:         snFamily.familyName,
    countryOfOrigin:    snFamily.countryOfOrigin,
    primaryLanguage:    snFamily.primaryLanguage,
    householdSize:      snFamily.householdSize,
    immigrationStatus:  snFamily.immigrationStatus,
    registrationStatus: snFamily.registrationStatus,
    verificationStatus: snFamily.verificationStatus,
    caseStatus:         snFamily.caseStatus,
    assignedOfficer:    snFamily.assignedOfficer || 'Sarah Jenkins (Assigned)',
    allowCustomerEdit:  (snFamily as any).allowCustomerEdit || contextFam?.allowCustomerEdit || false,
    docRequestPending:  (snFamily as any).docRequestPending || contextFam?.docRequestPending || false,
    docRequestType:     (snFamily as any).docRequestType || contextFam?.docRequestType || 'Identity Document',
    docRequestNotes:    (snFamily as any).docRequestNotes || contextFam?.docRequestNotes || '',
    headOfFamily: resolvedHead,
    members: resolvedMembers,
  } : (contextFam || {
    applicationId: authenticatedAppId || 'APP-2026-000005',
    bridge360Id: 'FAM-2026-000005',
    familyName: 'Smith',
    countryOfOrigin: 'United States',
    primaryLanguage: 'English',
    householdSize: 1,
    immigrationStatus: 'Approved',
    registrationStatus: 'Approved',
    verificationStatus: 'Verified',
    caseStatus: 'Active',
    assignedOfficer: 'Sarah Jenkins',
    allowCustomerEdit: false,
    docRequestPending: false,
    docRequestType: '',
    docRequestNotes: '',
    headOfFamily: { firstName: 'John', lastName: 'Smith', email: 'applicant@example.com' },
    members: [],
  });

  // Combine live documents and context documents
  const allContextDocs = documents.filter(d => d.applicationId === family.applicationId || d.familyId === family.applicationId || d.applicationId === authenticatedAppId);
  const myDocs = (liveDashboardData?.documents && liveDashboardData.documents.length > 0) ? liveDashboardData.documents : allContextDocs;

  // Combine live tickets and context tickets
  const allContextTickets = tickets.filter(t => t.applicationId === family.applicationId || t.familyId === family.applicationId || t.familyId === family.bridge360Id || t.applicationId === authenticatedAppId);
  const myTickets = (liveDashboardData?.tickets && liveDashboardData.tickets.length > 0) ? liveDashboardData.tickets : allContextTickets;

  // Combine appointments
  const allContextApts = appointments.filter(a => a.familyId === family.applicationId || a.familyId === family.bridge360Id);
  const myAppointments = allContextApts;

  const selectedTicket: any = myTickets.find((t: any) => t.sys_id === selectedTicketId || t.id === selectedTicketId) || myTickets[0];

  // Filter Customer Notifications — match by any relevant ID the family might be known by
  const familyIds = [
    family.applicationId,
    family.bridge360Id,
    family.familyId,
    authenticatedAppId,
  ].filter(Boolean);
  const customerNotifs = notifications.filter(n =>
    n.recipient === 'customer' && (!n.targetAppId || familyIds.includes(n.targetAppId))
  );
  const unreadCustNotifs = customerNotifs.filter(n => !n.read);

  // Status Stepper Calculation
  const isVerified = (family.verificationStatus && (family.verificationStatus.toLowerCase() === 'verified' || family.verificationStatus.toLowerCase() === 'approved')) || (family.registrationStatus && family.registrationStatus.toLowerCase() === 'approved');
  const isInReview = (family.verificationStatus && family.verificationStatus.toLowerCase() === 'in_review') || (family.registrationStatus && family.registrationStatus.toLowerCase() === 'under_review');
  const currentStepIdx = isVerified ? 3 : (isInReview ? 2 : 1);
  const statusSteps = ['Registration Submitted', 'Document Screening', 'Officer Review', 'Verified & Protected'];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    const newId = raiseCustomerTicket({
      applicationId: family.applicationId,
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDesc,
      attachmentName: ticketAttachment || undefined,
    });
    setShowRaiseTicketModal(false);
    setTicketSubject('');
    setTicketDesc('');
    setTicketAttachment('');
    setSelectedTicketId(newId);
    setActiveTab('tickets');
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    const tId = selectedTicket ? (selectedTicket.id || selectedTicket.sys_id) : selectedTicketId;
    if (!tId || !replyMsg.trim()) return;
    respondToTicket(
      tId,
      replyMsg,
      'customer',
      `${family.headOfFamily.firstName || 'Applicant'} ${family.headOfFamily.lastName || ''}`
    );
    setReplyMsg('');
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      setUploadFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setUploadRawText(`Uploaded Document: ${file.name}\nType: ${uploadDocType}\nTimestamp: ${new Date().toLocaleString()}\nVerified by Applicant.`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    await uploadCustomerDoc(family.applicationId, uploadDocType, uploadFileName, uploadFileSize, uploadRawText);
    setShowUploadDocModal(false);
    setUploadFileName('');
  };

  const handleOpenEditProfile = () => {
    setEditMobile(family.headOfFamily.mobileNumber || '');
    setEditAddress(family.headOfFamily.address || '');
    setEditCity(family.headOfFamily.city || '');
    setEditState(family.headOfFamily.state || '');
    setEditPostalCode(family.headOfFamily.postalCode || '');
    setEditLanguage(family.primaryLanguage || 'English');
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCustomerProfile(family.applicationId, {
      mobileNumber: editMobile,
      address: editAddress,
      city: editCity,
      state: editState,
      postalCode: editPostalCode,
      primaryLanguage: editLanguage,
    });
    setShowEditProfileModal(false);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
      {/* Top Header Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '24px 28px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                {family.familyName.toUpperCase()} Family Dashboard
              </h2>
              <span className="badge badge-indigo">Customer Portal</span>
              <span className={`badge ${currentStepIdx === 3 ? 'badge-high' : 'badge-medium'}`}>
                {currentStepIdx === 3 ? '✓ Approved & Verified' : 'Under Officer Review'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {family.bridge360Id || family.familyId ? (
                <>
                  <span>Primary ID (Official):</span>
                  <span style={{ fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                    {family.familyId || family.bridge360Id}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    (Original App ID: {family.applicationId})
                  </span>
                </>
              ) : (
                <>
                  <span>Application ID:</span>
                  <strong style={{ color: '#0F172A' }}>{family.applicationId}</strong>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Notification Bell */}
          <div
            style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: showNotifDropdown ? '#EFF6FF' : '#F8FAFC', border: '1px solid #E2E8F0' }}
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Notifications"
          >
            <Bell size={18} style={{ color: showNotifDropdown ? '#2563EB' : '#64748B' }} />
            {unreadCustNotifs.length > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCustNotifs.length}
              </span>
            )}
          </div>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '360px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 300,
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>My Notifications</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-indigo">{customerNotifs.length} Alerts</span>
                  {customerNotifs.length > 0 && (
                    <button
                      onClick={() => setNotifications(prev => prev.filter(n => n.recipient !== 'customer'))}
                      style={{ fontSize: '0.72rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontWeight: 700, color: '#EF4444' }}
                      title="Clear all alerts"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {customerNotifs.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                    No alerts at this time.
                  </div>
                ) : (
                  customerNotifs.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: n.read ? '#F8FAFC' : '#EFF6FF',
                        border: n.read ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifDropdown(false);
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{n.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>{n.message}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px' }}>{n.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={() => setShowRaiseTicketModal(true)} style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            <Plus size={15} /> Raise Support Ticket
          </button>
          <button className="btn-secondary" onClick={onLogout} title="Sign Out" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* ACTION REQUIRED BANNER: ADDITIONAL DOCUMENT REQUESTED */}
      {family.docRequestPending && (
        <div
          style={{
            padding: '20px 24px',
            background: '#FEF2F2',
            border: '2px solid #F87171',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991B1B' }}>
                Action Required: Additional Document Requested by Officer
              </div>
              <div style={{ fontSize: '0.88rem', color: '#7F1D1D', marginTop: '2px' }}>
                Document: <strong>{family.docRequestType || 'Identity Document'}</strong>
                {family.docRequestNotes && <span> • Instructions: "{family.docRequestNotes}"</span>}
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowUploadDocModal(true)}
            style={{ background: '#DC2626', borderColor: '#DC2626', fontSize: '0.88rem', padding: '10px 18px' }}
          >
            <Upload size={16} /> Upload Requested Document
          </button>
        </div>
      )}

      {/* Progress Stepper Banner */}
      <div style={{ padding: '22px 28px', marginBottom: '20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
            Application Status Tracker
          </h3>
          <span className={`badge ${currentStepIdx === 3 ? 'badge-high' : 'badge-medium'}`}>
            Current State: {currentStepIdx === 3 ? 'Approved (Verified)' : statusSteps[currentStepIdx]}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '10px 20px' }}>
          <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '3px', background: '#E2E8F0', zIndex: 1 }} />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: 0,
              height: '3px',
              background: '#16A34A',
              width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
              zIndex: 1,
              transition: 'width 0.4s ease',
            }}
          />

          {statusSteps.map((stepName, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: isDone ? '#16A34A' : '#FFFFFF',
                    border: isDone ? '2px solid #16A34A' : '2px solid #CBD5E1',
                    color: isDone ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? '#0F172A' : '#64748B',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'overview', label: 'Overview & Profile', icon: Users },
          { key: 'documents', label: `My Documents (${myDocs.length})`, icon: ShieldCheck },
          { key: 'tickets', label: `Support Tickets (${myTickets.length})`, icon: MessageSquare },
          { key: 'appointments', label: `Appointments (${myAppointments.length})`, icon: Calendar },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={activeTab === t.key ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
              onClick={() => setActiveTab(t.key as any)}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                Family &amp; Household Details
              </h3>
              {family.allowCustomerEdit ? (
                <button className="btn-primary" onClick={handleOpenEditProfile} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem' }}>
                  <Lock size={12} /> Profile Locked by Admin
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Country of Origin</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{family.countryOfOrigin}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Household Size</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{1 + (family.members ? family.members.length : 0)} Members</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Primary Language</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{family.primaryLanguage}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Interpreter Requested</div>
                <div style={{ fontWeight: 800, color: family.needsInterpreter ? '#16A34A' : '#0F172A', marginTop: '2px' }}>
                  {family.needsInterpreter ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              Registered Family Members ({1 + (family.members ? family.members.length : 0)})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Head of Family card */}
              <div
                style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onClick={() => setSelectedMember({ ...family.headOfFamily, isHead: true, status: family.registrationStatus, verificationStatus: family.verificationStatus })}
                onMouseEnter={e => { e.currentTarget.style.border = '1px solid #BFDBFE'; e.currentTarget.style.background = '#F0F9FF'; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1px solid #E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                    {family.headOfFamily.firstName} {family.headOfFamily.lastName} (HEAD)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Head of Household • {family.headOfFamily.gender || 'Adult'} • DOB: {family.headOfFamily.dateOfBirth || '2000-01-01'}
                  </div>
                  {family.headOfFamily.mobileNumber && (
                    <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '2px' }}>
                      📞 {family.headOfFamily.mobileNumber}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    onClick={e => { e.stopPropagation(); setSelectedMember({ ...family.headOfFamily, isHead: true, status: family.registrationStatus, verificationStatus: family.verificationStatus }); }}
                  >
                    <Eye size={13} /> View Details
                  </button>
                  <span className="badge badge-high">Head of Family</span>
                </div>
              </div>

              {/* Accompanying Members */}
              {(family.members || []).map((m: any, idx: number) => (
                <div
                  key={idx}
                  style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedMember({ ...m, isHead: false, status: family.registrationStatus, verificationStatus: family.verificationStatus })}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid #BFDBFE'; e.currentTarget.style.background = '#F0F9FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid #E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {m.relationshipToHead || 'Dependent'} • {m.gender} • DOB: {m.dateOfBirth || 'N/A'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                      onClick={e => { e.stopPropagation(); setSelectedMember({ ...m, isHead: false, status: family.registrationStatus, verificationStatus: family.verificationStatus }); }}
                    >
                      <Eye size={13} /> View Details
                    </button>
                    <span className="badge badge-indigo">{m.relationshipToHead || 'Member'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Assigned Case Manager & Support info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Assigned Case Manager
              </h3>
              <div style={{ fontWeight: 800, color: '#2563EB', fontSize: '1.1rem' }}>
                {family.assignedOfficer || 'Sarah Jenkins'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                Operational Officer, Bridge360 Refugee Services
              </div>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }} onClick={() => setActiveTab('tickets')}>
                  <MessageSquare size={14} /> Send Message to Officer
                </button>
              </div>
            </div>

            <div style={{ background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FDE68A', padding: '20px', color: '#92400E' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>Notice to Applicants</div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                {family.allowCustomerEdit
                  ? 'Administration has enabled profile editing for your account. You may click "Edit Profile" above to update your contact information.'
                  : 'Submitted application details are locked for verification integrity. To request updates, please raise a Support Ticket or contact your case officer.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Uploaded Documents ({myDocs.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                View your uploaded identification documents and check their verification status.
              </p>
            </div>
            {(family.allowCustomerEdit || family.docRequestPending) ? (
              <button className="btn-primary" onClick={() => setShowUploadDocModal(true)} style={{ fontSize: '0.82rem' }}>
                <Upload size={14} /> Upload Additional Document
              </button>
            ) : (
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.82rem', opacity: 0.6, cursor: 'not-allowed' }}
                disabled={true}
                title="Document upload is locked. Admin request or Edit access required."
              >
                <Upload size={14} /> Upload Additional Document
              </button>
            )}
          </div>

          {myDocs.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
              No documents found on record.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myDocs.map((doc: any) => (
                <div key={doc.id || doc.sys_id} style={{ padding: '16px 20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{doc.fileName || 'Identity_Document.pdf'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Type: {doc.documentType} • Size: {doc.fileSize || '1.2 MB'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${doc.verificationStatus === 'verified' || doc.verificationStatus === 'Verified' ? 'badge-high' : 'badge-medium'}`}>
                      {doc.verificationStatus ? doc.verificationStatus.toUpperCase() : 'PENDING'}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye size={13} /> View Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUPPORT TICKETS & CHAT */}
      {activeTab === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1.1fr 1.5fr' : '1fr', gap: '20px' }}>
          {/* Left: Tickets List */}
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>My Support Tickets</h3>
              <button className="btn-primary" onClick={() => setShowRaiseTicketModal(true)} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                <Plus size={14} /> New Ticket
              </button>
            </div>

            {myTickets.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                No support tickets raised yet. Click "New Ticket" to communicate directly with your case officer.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myTickets.map((t: any) => {
                  const isSelected = selectedTicket && (selectedTicket.id === t.id || selectedTicket.sys_id === t.sys_id);
                  return (
                    <div
                      key={t.sys_id || t.id}
                      style={{
                        padding: '14px 16px',
                        background: isSelected ? '#EFF6FF' : '#F8FAFC',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedTicketId(t.id || t.sys_id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="badge badge-indigo">{t.id || t.sys_id}</span>
                        <span className={`badge ${t.status === 'Open' ? 'badge-medium' : 'badge-high'}`}>{t.status}</span>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{t.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                        Category: {t.category} • {t.responses ? t.responses.length : 1} message(s)
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Ticket Conversation Details */}
          {selectedTicket ? (
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{selectedTicket.subject}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Ticket ID: {(selectedTicket as any).id || (selectedTicket as any).sys_id} • Category: {selectedTicket.category}</div>
                  </div>
                  <span className="badge badge-high">{selectedTicket.status}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                  {((selectedTicket as any).responses || []).map((resp: any) => (
                    <div
                      key={resp.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: resp.role === 'customer' ? '#EFF6FF' : '#F0FDF4',
                        border: resp.role === 'customer' ? '1px solid #BFDBFE' : '1px solid #BBF7D0',
                        alignSelf: resp.role === 'customer' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: resp.role === 'customer' ? '#1D4ED8' : '#15803D', marginBottom: '2px' }}>
                        {resp.author} ({resp.role.toUpperCase()}) • {resp.timestamp}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#0F172A', lineHeight: 1.4 }}>{resp.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Reply Input */}
              <form onSubmit={handleSendTicketReply} style={{ display: 'flex', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <input
                  className="input-field"
                  placeholder="Type a message or response to officer..."
                  value={replyMsg}
                  onChange={e => setReplyMsg(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" disabled={!replyMsg.trim()}>
                  <Send size={15} /> Send
                </button>
              </form>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 4: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
            Scheduled Officer Appointments
          </h3>

          {myAppointments.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
              No appointments scheduled currently.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myAppointments.map((apt: any) => (
                <div key={apt.id} style={{ padding: '16px 20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-indigo">{apt.type}</span>
                        <h4 style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{apt.title}</h4>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '3px' }}>
                        Date &amp; Time: <strong style={{ color: '#2563EB' }}>{apt.date} at {apt.time}</strong> • Location: <strong>{apt.location}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-high">{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{previewDoc.fileName || 'Identity Document'}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Type: {previewDoc.documentType} • Size: {previewDoc.fileSize || '1.2 MB'}</div>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Verification Status</span>
                <span className="badge badge-high">{previewDoc.verificationStatus ? previewDoc.verificationStatus.toUpperCase() : 'VERIFIED'}</span>
              </div>

              {/* REAL UPLOADED IMAGE PREVIEW */}
              {(() => {
                const docImage = previewDoc.fileDataUrl || previewDoc.previewUrl || localStorage.getItem(`bridge360_doc_preview_${previewDoc.id || previewDoc.sys_id}`) || localStorage.getItem('bridge360_latest_uploaded_doc');
                if (docImage) {
                  if (docImage.startsWith('data:image') || docImage.startsWith('blob:') || docImage.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    return (
                      <div style={{ textAlign: 'center', background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                        <img
                          src={docImage}
                          alt={previewDoc.fileName || 'Document'}
                          style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '6px' }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <iframe src={docImage} style={{ width: '100%', height: '340px', border: 'none', borderRadius: '6px' }} title="Document Viewer" />
                    </div>
                  );
                }
                return null;
              })()}

              <div>
                <label className="input-label" style={{ marginBottom: '6px' }}>Extracted Document Information</label>
                <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.88rem', color: '#0F172A', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {previewDoc.ocrRawText || `Document Type: ${previewDoc.documentType}\nFile: ${previewDoc.fileName}\nApplication ID: ${family.applicationId}\nStatus: Verified`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-primary" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REQUESTED DOCUMENT MODAL */}
      {showUploadDocModal && (
        <div className="modal-overlay" onClick={() => setShowUploadDocModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Upload Document</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Submit requested files to verification officers</p>
                </div>
              </div>
              <button onClick={() => setShowUploadDocModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Document Category *</label>
                <select className="input-field" value={uploadDocType} onChange={e => setUploadDocType(e.target.value)}>
                  <option value="National ID">National ID / Civil Registry</option>
                  <option value="Passport">Passport</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Proof of Address">Proof of Address / Shelter Document</option>
                  <option value="Supporting Document">Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="input-label">Choose Document File (PDF, PNG, JPEG) *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="input-field"
                  onChange={handleFileUploadChange}
                  required
                />
                {uploadFileName && (
                  <div style={{ fontSize: '0.82rem', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>
                    ✓ Selected: {uploadFileName} ({uploadFileSize})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadDocModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={!uploadFileName}>
                  <Upload size={14} /> Submit Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Edit Contact Information</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Authorized by Administration</p>
                </div>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Mobile Phone Number</label>
                <input className="input-field" value={editMobile} onChange={e => setEditMobile(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>

              <div>
                <label className="input-label">Street Address</label>
                <input className="input-field" value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="123 Refugee Way" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label">City</label>
                  <input className="input-field" value={editCity} onChange={e => setEditCity(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">State / Province</label>
                  <input className="input-field" value={editState} onChange={e => setEditState(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label">Postal Code</label>
                  <input className="input-field" value={editPostalCode} onChange={e => setEditPostalCode(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Preferred Language</label>
                  <input className="input-field" value={editLanguage} onChange={e => setEditLanguage(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER APPLICATION DETAIL MODAL */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: '#FFFFFF', color: '#0F172A' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: selectedMember.isHead ? '#EFF6FF' : '#F0FDF4', color: selectedMember.isHead ? '#2563EB' : '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {(selectedMember.firstName || 'M')[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <span className={`badge ${selectedMember.isHead ? 'badge-high' : 'badge-indigo'}`}>
                    {selectedMember.isHead ? 'Head of Family' : (selectedMember.relationshipToHead || 'Member')}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {/* Application Status */}
            <div style={{ background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Application Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Registration</div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem', marginTop: '2px' }}>
                    {selectedMember.status || family.registrationStatus || 'Submitted'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verification</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '2px',
                    color: (selectedMember.verificationStatus || '').toLowerCase() === 'verified' ? '#16A34A' : '#D97706'
                  }}>
                    {selectedMember.verificationStatus || family.verificationStatus || 'Pending'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Application ID</div>
                  <div style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.85rem', marginTop: '2px' }}>
                    {family.applicationId || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Refugee ID</div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', marginTop: '2px',
                    color: selectedMember.refugeeId ? '#16A34A' : '#94A3B8'
                  }}>
                    {selectedMember.refugeeId || '— Not yet assigned'}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div style={{ background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Personal Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                {[
                  { label: 'Gender', value: selectedMember.gender },
                  { label: 'Date of Birth', value: selectedMember.dateOfBirth || 'N/A' },
                  { label: 'Nationality', value: selectedMember.nationality },
                  { label: 'Marital Status', value: selectedMember.maritalStatus || 'N/A' },
                  { label: 'Passport No.', value: selectedMember.passportNumber || 'N/A' },
                  { label: 'National ID', value: selectedMember.nationalId || 'N/A' },
                  { label: 'Mobile', value: selectedMember.mobileNumber || 'N/A' },
                  { label: 'Email', value: selectedMember.email || 'N/A' },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{row.label}</div>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '1px', wordBreak: 'break-all' }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setSelectedMember(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* RAISE SUPPORT TICKET MODAL */}
      {showRaiseTicketModal && (
        <div className="modal-overlay" onClick={() => setShowRaiseTicketModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Raise Support Ticket</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Direct line to your Bridge360 case officer</p>
                </div>
              </div>
              <button onClick={() => setShowRaiseTicketModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Inquiry Category *</label>
                <select className="input-field" value={ticketCategory} onChange={e => setTicketCategory(e.target.value as any)}>
                  <option value="Status Inquiry">Status Inquiry</option>
                  <option value="Document Issue">Document Issue / Resubmission</option>
                  <option value="Appointment Request">Appointment Request</option>
                  <option value="General Support">General Support &amp; Placement</option>
                </select>
              </div>

              <div>
                <label className="input-label">Subject / Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Update regarding uploaded passport document"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label">Message / Description *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Describe your inquiry or request in detail..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRaiseTicketModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={!ticketSubject.trim() || !ticketDesc.trim()}>
                  <Send size={14} /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboardView;
