import React from 'react';
import { TrendingUp, Download, BarChart2, PieChart, FileSpreadsheet, Users, ShieldCheck } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

export const AnalyticsReportsView: React.FC = () => {
  const { families, cases, referrals } = useBridge360();

  const handleExportReport = (reportType: string) => {
    // Generate CSV data download
    const csvContent = "data:text/csv;charset=utf-8,ID,Family Name,Country,Status,Date\n" +
      families.map(f => `${f.applicationId},"${f.familyName}","${f.countryOfOrigin}",${f.registrationStatus},${f.arrivalDate}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Analytics &amp; Operational Reporting</h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Comprehensive data insights, verification velocity, demographics, and downloadable executive reports.
          </p>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Avg Verification Turnaround</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A', margin: '4px 0' }}>1.4 Days</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>⚡ 24% faster with AI OCR pre-fill</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>OCR Field Accuracy Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', margin: '4px 0' }}>94.2%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>High-confidence field extractions</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Interpreter Utilization</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', margin: '4px 0' }}>66.7%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Arabic, Tamil, Hindi languages</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Case Resolution Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0D9488', margin: '4px 0' }}>88.5%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Active partner referrals fulfilled</div>
        </div>
      </div>

      {/* Downloadable Reports Directory */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
          Standard Executive Reports Directory
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Refugee Family Demographics & Intake Report', type: 'Registration' },
            { title: 'AI OCR Document Verification Audit Log', type: 'Verification' },
            { title: 'Partner Agency Service Referral Fulfillment', type: 'Referrals' },
            { title: 'Case Management SLA & Task Completion Report', type: 'Cases' },
          ].map((rep, idx) => (
            <div
              key={idx}
              style={{
                padding: '18px 20px',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{rep.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Category: {rep.type} • Format: CSV / Excel</div>
                </div>
              </div>
              <button className="btn-secondary" onClick={() => handleExportReport(rep.title)} style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                <Download size={15} /> Export CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
