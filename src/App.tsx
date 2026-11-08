import React, { useState } from 'react';
import { DirectoryProvider, useDirectory } from './context/DirectoryContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { DirectoryView } from './components/DirectoryView';
import { RegistrationsControl } from './components/RegistrationsControl';
import { PaymentsControl } from './components/PaymentsControl';
import { CredentialsControl } from './components/CredentialsControl';
import { AuditLogView } from './components/AuditLogView';
import { RegisterModal } from './components/RegisterModal';
import { MemberDossierModal } from './components/MemberDossierModal';
import { DigitalIdCardModal } from './components/DigitalIdCardModal';
import { PaymentVerificationModal } from './components/PaymentVerificationModal';
import { PasswordResetModal } from './components/PasswordResetModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { MemberPortalModal } from './components/MemberPortalModal';
import { DirectoryMember, PaymentRecord, CredentialRecord } from './types';

function MainApp() {
  const { members, payments, credentials } = useDirectory();

  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isMemberPortalOpen, setIsMemberPortalOpen] = useState(false);

  const [selectedMemberForDossier, setSelectedMemberForDossier] = useState<DirectoryMember | null>(null);
  const [selectedMemberForIdCard, setSelectedMemberForIdCard] = useState<DirectoryMember | null>(null);
  const [selectedPaymentForInspect, setSelectedPaymentForInspect] = useState<PaymentRecord | null>(null);
  const [selectedCredForPassword, setSelectedCredForPassword] = useState<CredentialRecord | null>(null);

  // Handlers
  const handleOpenDigitalIdById = (memberId: string) => {
    const member = members.find(m => m.id === memberId) || null;
    setSelectedMemberForIdCard(member);
  };

  const handleCheckPaymentByMember = (member: DirectoryMember) => {
    const pay = payments.find(p => p.memberId === member.id) || null;
    if (pay) {
      setSelectedPaymentForInspect(pay);
    } else {
      setActiveTab('payments');
    }
  };

  const handleManageCredentialsByMember = (member: DirectoryMember) => {
    const cred = credentials.find(c => c.memberId === member.id) || null;
    if (cred) {
      setSelectedCredForPassword(cred);
    } else {
      setActiveTab('credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenMemberPortal={() => setIsMemberPortalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Strip */}
        <StatsBar onNavigateTab={setActiveTab} />

        {/* Tab Viewport */}
        {activeTab === 'directory' && (
          <DirectoryView
            onSelectMember={setSelectedMemberForDossier}
            onOpenDigitalId={setSelectedMemberForIdCard}
            onCheckPayment={handleCheckPaymentByMember}
            onManageCredentials={handleManageCredentialsByMember}
          />
        )}

        {activeTab === 'registrations' && (
          <RegistrationsControl
            onSelectMember={setSelectedMemberForDossier}
            onOpenDigitalId={setSelectedMemberForIdCard}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsControl
            onInspectPayment={setSelectedPaymentForInspect}
            onRecordPayment={() => setIsRecordPaymentOpen(true)}
          />
        )}

        {activeTab === 'credentials' && (
          <CredentialsControl
            onOpenDigitalIdById={handleOpenDigitalIdById}
            onOpenPasswordModal={setSelectedCredForPassword}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">DirectoHub</span>
            <span aria-hidden="true">·</span>
            <span>Central Directory, Registration Control, Payment Verification & ID Credential Authority</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Verified 256-Bit SSL/TLS Security</span>
            <span aria-hidden="true">·</span>
            <span>ISO 27001 Accredited</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={newId => {
          const newlyAdded = members.find(m => m.id === newId);
          if (newlyAdded) {
            setSelectedMemberForIdCard(newlyAdded);
          }
        }}
      />

      <MemberDossierModal
        member={selectedMemberForDossier}
        onClose={() => setSelectedMemberForDossier(null)}
        onOpenDigitalId={m => {
          setSelectedMemberForDossier(null);
          setSelectedMemberForIdCard(m);
        }}
        onCheckPayment={m => {
          setSelectedMemberForDossier(null);
          handleCheckPaymentByMember(m);
        }}
        onManageCredentials={m => {
          setSelectedMemberForDossier(null);
          handleManageCredentialsByMember(m);
        }}
      />

      <DigitalIdCardModal
        member={selectedMemberForIdCard}
        onClose={() => setSelectedMemberForIdCard(null)}
      />

      <PaymentVerificationModal
        payment={selectedPaymentForInspect}
        onClose={() => setSelectedPaymentForInspect(null)}
      />

      <PasswordResetModal
        cred={selectedCredForPassword}
        onClose={() => setSelectedCredForPassword(null)}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />

      <MemberPortalModal
        isOpen={isMemberPortalOpen}
        onClose={() => setIsMemberPortalOpen(false)}
        onOpenDigitalId={memberId => {
          handleOpenDigitalIdById(memberId);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <DirectoryProvider>
      <MainApp />
    </DirectoryProvider>
  );
}
