import React, { useState } from 'react';
import { Upload, ArrowLeft, ArrowRight, Save, CheckCircle2, User, Users, FileText } from 'lucide-react';
import { NavTab, StepItem } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ProgressStepper } from '../components/common/ProgressStepper';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface WizardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const WizardView: React.FC<WizardViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    docName: 'Passport_Scan.pdf',
    fullName: 'Prawin Balaji',
    email: 'prawin.balaji@example.com',
    phone: '+91 98765 43210',
    dob: '2003-09-20',
    familyName: 'Balaji Family',
    membersCount: '4',
    additionalInfo: 'Priority registration requested with document verification.',
  });

  const steps: StepItem[] = [
    { id: 1, label: 'Documents', description: 'Upload Proof' },
    { id: 2, label: 'Applicant', description: 'Personal Details' },
    { id: 3, label: 'Family', description: 'Family Group' },
    { id: 4, label: 'Members', description: 'Family Members' },
    { id: 5, label: 'Additional Info', description: 'Notes & Extra' },
    { id: 6, label: 'Review', description: 'Submit App' },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      showToast('success', 'Application Submitted', 'Registration application created successfully in ServiceNow.');
      onNavigate('applications');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    showToast('info', 'Draft Saved', 'Draft application saved locally.');
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader
        title="Registration Application Wizard"
        subtitle="Step-by-step document-assisted applicant onboarding"
        breadcrumbs={['Bridge360', 'Wizard']}
        action={
          <Button variant="outline" size="sm" onClick={() => onNavigate('applications')}>
            Cancel & Exit
          </Button>
        }
      />

      {/* Stepper Header */}
      <ProgressStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Step Form Card */}
      <Card
        title={`Step ${currentStep}: ${steps[currentStep - 1].label}`}
        subtitle={steps[currentStep - 1].description}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Save size={14} />}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft size={14} />}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                rightIcon={currentStep === 6 ? <CheckCircle2 size={14} /> : <ArrowRight size={14} />}
                onClick={handleNext}
              >
                {currentStep === 6 ? 'Submit Application' : 'Continue'}
              </Button>
            </div>
          </div>
        }
      >
        {/* Step 1: Documents */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '32px',
                border: '2px dashed var(--color-neutral-300)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                backgroundColor: 'var(--color-neutral-50)',
                cursor: 'pointer',
              }}
              onClick={() => showToast('info', 'File Selector', 'Selected Passport_Scan.pdf')}
            >
              <Upload size={36} color="var(--color-primary-600)" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                Drag and drop identity document PDF or image here
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                Supports Passport, Birth Certificate, National ID (PDF, JPG, PNG up to 10MB)
              </p>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--color-success-text)" />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {formData.docName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)', display: 'block' }}>
                    Uploaded • Ready for AI Extraction
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => showToast('info', 'OCR', 'Previewing document OCR')}>
                Preview
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Applicant */}
        {currentStep === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        )}

        {/* Step 3: Family */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Family Group Name"
              value={formData.familyName}
              onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
            />
            <Select
              label="Relationship to Family Head"
              options={[
                { label: 'Primary Applicant / Head of Family', value: 'head' },
                { label: 'Spouse', value: 'spouse' },
                { label: 'Child', value: 'child' },
                { label: 'Dependent / Parent', value: 'dependent' },
              ]}
            />
          </div>
        )}

        {/* Step 4: Members */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Total Family Members to Register"
              type="number"
              value={formData.membersCount}
              onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
            />
            <div style={{ padding: '16px', backgroundColor: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                Registered Family Members
              </h4>
              <ul style={{ fontSize: '12px', color: 'var(--color-neutral-700)', marginTop: '8px', paddingLeft: '18px' }}>
                <li>Prawin Balaji (Primary Applicant)</li>
                <li>Ananya Balaji (Spouse)</li>
                <li>Rohan Balaji (Child)</li>
                <li>Maya Balaji (Child)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 5: Additional Information */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-navy-800)' }}>
                Special Instructions or Notes
              </label>
              <textarea
                rows={4}
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-neutral-300)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-200)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-900)', marginBottom: '12px' }}>
                Application Summary Confirmation
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><strong>Applicant:</strong> {formData.fullName}</div>
                <div><strong>DOB:</strong> {formData.dob}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone}</div>
                <div><strong>Family Group:</strong> {formData.familyName}</div>
                <div><strong>Document:</strong> {formData.docName}</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
