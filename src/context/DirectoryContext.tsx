import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DirectoryMember,
  PaymentRecord,
  CredentialRecord,
  AuditLogEntry,
  RegistrationStatus,
  PaymentStatus,
  MembershipTier,
  PaymentMethod
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_PAYMENTS,
  INITIAL_CREDENTIALS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface RegisterNewPayload {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: DirectoryMember['category'];
  description: string;
  city: string;
  state: string;
  country: string;
  website: string;
  licenseNumber: string;
  membershipTier: MembershipTier;
  annualFee: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  initialPassword?: string;
  enable2FA: boolean;
  tags: string[];
}

interface DirectoryContextType {
  members: DirectoryMember[];
  payments: PaymentRecord[];
  credentials: CredentialRecord[];
  auditLogs: AuditLogEntry[];
  currentRole: 'Admin' | 'Officer' | 'Member';
  setCurrentRole: (role: 'Admin' | 'Officer' | 'Member') => void;
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  registerEntity: (payload: RegisterNewPayload) => string;
  updateMemberStatus: (memberId: string, status: RegistrationStatus, notes?: string) => void;
  approveMemberRegistration: (memberId: string) => void;
  verifyPayment: (paymentId: string, notes?: string) => void;
  flagPaymentIssue: (paymentId: string, issue: string) => void;
  recordDirectPayment: (memberId: string, amount: number, method: PaymentMethod, reference: string) => void;
  generateTempPassword: (memberId: string) => string;
  sendPasswordResetLink: (memberId: string) => void;
  toggleMember2FA: (memberId: string) => void;
  revokeActiveSessions: (memberId: string) => void;
  updatePasswordByMember: (memberId: string, newPass: string) => boolean;
  resetAllData: () => void;
}

const DirectoryContext = createContext<DirectoryContextType | null>(null);

const STORAGE_KEYS = {
  MEMBERS: 'directohub_members_v1',
  PAYMENTS: 'directohub_payments_v1',
  CREDENTIALS: 'directohub_credentials_v1',
  LOGS: 'directohub_logs_v1',
  ROLE: 'directohub_role_v1'
};

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<DirectoryMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [credentials, setCredentials] = useState<CredentialRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      return saved ? JSON.parse(saved) : INITIAL_CREDENTIALS;
    } catch {
      return INITIAL_CREDENTIALS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [currentRole, setCurrentRole] = useState<'Admin' | 'Officer' | 'Member'>('Admin');
  const [activeMemberId, setActiveMemberId] = useState<string>('mem-001');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addLog = (
    actor: string,
    action: string,
    targetId: string,
    targetName: string,
    category: AuditLogEntry['category'],
    details: string
  ) => {
    const now = new Date();
    const formatted = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      actor: actor || (currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins'),
      action,
      targetId,
      targetName,
      category,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const registerEntity = (payload: RegisterNewPayload): string => {
    const count = members.length + 1;
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const directoryId = `DIR-${year}-${randNum}`;
    const newMemberId = `mem-${Date.now().toString().slice(-4)}`;

    const newMember: DirectoryMember = {
      id: newMemberId,
      directoryId,
      name: payload.name,
      contactPerson: payload.contactPerson,
      email: payload.email,
      phone: payload.phone,
      category: payload.category,
      description: payload.description || 'Verified directory registrant profile.',
      city: payload.city,
      state: payload.state,
      country: payload.country || 'United States',
      website: payload.website,
      registrationDate: new Date().toISOString().slice(0, 10),
      licenseNumber: payload.licenseNumber,
      registrationStatus: 'Pending Approval',
      membershipTier: payload.membershipTier,
      annualFee: payload.annualFee,
      verificationNotes: 'New application submitted; awaiting document review and fee clearance.',
      tags: payload.tags.length > 0 ? payload.tags : ['New Registrant'],
      rating: 5.0
    };

    const newPayment: PaymentRecord = {
      paymentId: `PAY-${Math.floor(8000 + Math.random() * 2000)}`,
      memberId: newMemberId,
      memberName: payload.name,
      directoryId,
      amount: payload.annualFee,
      currency: 'USD',
      status: 'Pending Verification',
      paymentMethod: payload.paymentMethod,
      transactionReference: payload.transactionReference || `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      invoiceNumber: `INV-${year}-${randNum}`,
      billingPeriod: `${year} - ${year + 1} Annual Registry`,
      submittedAt: `${new Date().toISOString().slice(0, 10)} ${new Date().toTimeString().slice(0, 5)}`,
      receiptNotes: `Registration payment via ${payload.paymentMethod}.`
    };

    const initialPass = payload.initialPassword || `DirPass#${year}!${Math.floor(100 + Math.random() * 900)}`;

    const newCredential: CredentialRecord = {
      credentialId: `CRED-${Math.floor(100 + Math.random() * 900)}`,
      memberId: newMemberId,
      directoryId,
      memberName: payload.name,
      username: payload.email,
      passwordStatus: 'Temporary Password Issued',
      tempPassword: initialPass,
      tempPasswordExpires: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      lastPasswordChange: `${new Date().toISOString().slice(0, 10)} ${new Date().toTimeString().slice(0, 5)}`,
      twoFactorEnabled: payload.enable2FA,
      lastLogin: 'Never (Pending Activation)',
      activeSessions: 0,
      role: 'Member'
    };

    setMembers(prev => [newMember, ...prev]);
    setPayments(prev => [newPayment, ...prev]);
    setCredentials(prev => [newCredential, ...prev]);

    addLog(
      'Applicant / Self-Register',
      'New Registration Submitted',
      directoryId,
      payload.name,
      'registration',
      `Application submitted under ${payload.membershipTier} tier. Payment ref: ${newPayment.transactionReference}. ID ${directoryId} reserved.`
    );

    return newMemberId;
  };

  const updateMemberStatus = (memberId: string, status: RegistrationStatus, notes?: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? {
              ...m,
              registrationStatus: status,
              verificationNotes: notes || m.verificationNotes,
              verifiedAt: status === 'Verified Active' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : m.verifiedAt,
              verifiedBy: status === 'Verified Active' ? (currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins') : m.verifiedBy
            }
          : m
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      `Status Updated: ${status}`,
      member.directoryId,
      member.name,
      'registration',
      notes || `Status changed from ${member.registrationStatus} to ${status}.`
    );
  };

  const approveMemberRegistration = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? {
              ...m,
              registrationStatus: 'Verified Active',
              verificationNotes: 'Full compliance approval granted. ID credentials active in directory registry.',
              verifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              verifiedBy: currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins'
            }
          : m
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      'Registration Approved & Activated',
      member.directoryId,
      member.name,
      'registration',
      `Officially sanctioned member record ${member.directoryId}. Public directory listing now live.`
    );
  };

  const verifyPayment = (paymentId: string, notes?: string) => {
    const payment = payments.find(p => p.paymentId === paymentId);
    if (!payment) return;

    const verifiedBy = currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins';
    const verifiedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');

    setPayments(prev =>
      prev.map(p =>
        p.paymentId === paymentId
          ? {
              ...p,
              status: 'Paid',
              verifiedAt,
              verifiedBy,
              receiptNotes: notes || `Payment cleared and verified by ${verifiedBy}.`
            }
          : p
      )
    );

    // If member was awaiting payment, update to Verified Active
    setMembers(prev =>
      prev.map(m =>
        m.id === payment.memberId && m.registrationStatus === 'Awaiting Payment'
          ? { ...m, registrationStatus: 'Verified Active', verificationNotes: 'Payment verified; account activated.' }
          : m
      )
    );

    addLog(
      verifiedBy,
      'Payment Verified & Cleared',
      payment.paymentId,
      payment.memberName,
      'payment',
      `Amount $${payment.amount.toFixed(2)} verified via ${payment.paymentMethod}. Ref: ${payment.transactionReference}.`
    );
  };

  const flagPaymentIssue = (paymentId: string, issue: string) => {
    const payment = payments.find(p => p.paymentId === paymentId);
    if (!payment) return;

    setPayments(prev =>
      prev.map(p =>
        p.paymentId === paymentId
          ? {
              ...p,
              status: 'Overdue',
              receiptNotes: `Issue flagged: ${issue}`
            }
          : p
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      'Payment Discrepancy Flagged',
      payment.paymentId,
      payment.memberName,
      'payment',
      `Payment flagged as overdue/discrepancy: ${issue}`
    );
  };

  const recordDirectPayment = (memberId: string, amount: number, method: PaymentMethod, reference: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const paymentId = `PAY-${Math.floor(8500 + Math.random() * 1500)}`;
    const verifiedBy = currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins';
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const newPayment: PaymentRecord = {
      paymentId,
      memberId: member.id,
      memberName: member.name,
      directoryId: member.directoryId,
      amount,
      currency: 'USD',
      status: 'Paid',
      paymentMethod: method,
      transactionReference: reference || `MANUAL-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      billingPeriod: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1} Manual Fee`,
      submittedAt: nowStr,
      verifiedAt: nowStr,
      verifiedBy,
      receiptNotes: `Offline / direct payment confirmed and logged by ${verifiedBy}.`
    };

    setPayments(prev => [newPayment, ...prev]);

    if (member.registrationStatus === 'Awaiting Payment') {
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, registrationStatus: 'Verified Active' } : m))
      );
    }

    addLog(
      verifiedBy,
      'Manual Payment Recorded & Cleared',
      paymentId,
      member.name,
      'payment',
      `Manual fee of $${amount.toFixed(2)} recorded via ${method}. Reference: ${reference}.`
    );
  };

  const generateTempPassword = (memberId: string): string => {
    const cred = credentials.find(c => c.memberId === memberId);
    const member = members.find(m => m.id === memberId);
    if (!cred || !member) return '';

    const randomSuffix = Math.random().toString(36).slice(-6).toUpperCase();
    const newTemp = `Dir#${new Date().getFullYear()}!${randomSuffix}`;
    const expires = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ');

    setCredentials(prev =>
      prev.map(c =>
        c.memberId === memberId
          ? {
              ...c,
              passwordStatus: 'Temporary Password Issued',
              tempPassword: newTemp,
              tempPasswordExpires: expires,
              lastPasswordChange: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          : c
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      'Generated Temporary Password',
      cred.directoryId,
      member.name,
      'credential',
      `New 72-hour one-time password generated for username ${cred.username}. Expires ${expires}.`
    );

    return newTemp;
  };

  const sendPasswordResetLink = (memberId: string) => {
    const cred = credentials.find(c => c.memberId === memberId);
    const member = members.find(m => m.id === memberId);
    if (!cred || !member) return;

    setCredentials(prev =>
      prev.map(c =>
        c.memberId === memberId
          ? {
              ...c,
              passwordStatus: 'Reset Requested'
            }
          : c
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      'Password Reset Link Dispatched',
      cred.directoryId,
      member.name,
      'credential',
      `Automated cryptographic reset token dispatched to verified email ${cred.username}.`
    );
  };

  const toggleMember2FA = (memberId: string) => {
    const cred = credentials.find(c => c.memberId === memberId);
    const member = members.find(m => m.id === memberId);
    if (!cred || !member) return;

    const nextState = !cred.twoFactorEnabled;

    setCredentials(prev =>
      prev.map(c =>
        c.memberId === memberId
          ? {
              ...c,
              twoFactorEnabled: nextState
            }
          : c
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      nextState ? '2FA Enforced' : '2FA Relaxed',
      cred.directoryId,
      member.name,
      'credential',
      `Multi-factor authentication (2FA) policy updated to: ${nextState ? 'Required / Enforced' : 'Optional'}.`
    );
  };

  const revokeActiveSessions = (memberId: string) => {
    const cred = credentials.find(c => c.memberId === memberId);
    const member = members.find(m => m.id === memberId);
    if (!cred || !member) return;

    setCredentials(prev =>
      prev.map(c =>
        c.memberId === memberId
          ? {
              ...c,
              activeSessions: 0
            }
          : c
      )
    );

    addLog(
      currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins',
      'Active Sessions Terminated',
      cred.directoryId,
      member.name,
      'credential',
      `Revoked all active OAuth and bearer session tokens. Member will be prompted for ID & Password.`
    );
  };

  const updatePasswordByMember = (memberId: string, newPass: string): boolean => {
    if (!newPass || newPass.length < 8) return false;
    const cred = credentials.find(c => c.memberId === memberId);
    const member = members.find(m => m.id === memberId);
    if (!cred || !member) return false;

    setCredentials(prev =>
      prev.map(c =>
        c.memberId === memberId
          ? {
              ...c,
              passwordStatus: 'Secure & Active',
              tempPassword: undefined,
              tempPasswordExpires: undefined,
              lastPasswordChange: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          : c
      )
    );

    addLog(
      'Member Self-Service',
      'Password Updated by Member',
      cred.directoryId,
      member.name,
      'credential',
      `Member successfully updated credentials. Password strength validated and saved.`
    );

    return true;
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    setMembers(INITIAL_MEMBERS);
    setPayments(INITIAL_PAYMENTS);
    setCredentials(INITIAL_CREDENTIALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <DirectoryContext.Provider
      value={{
        members,
        payments,
        credentials,
        auditLogs,
        currentRole,
        setCurrentRole,
        activeMemberId,
        setActiveMemberId,
        registerEntity,
        updateMemberStatus,
        approveMemberRegistration,
        verifyPayment,
        flagPaymentIssue,
        recordDirectPayment,
        generateTempPassword,
        sendPasswordResetLink,
        toggleMember2FA,
        revokeActiveSessions,
        updatePasswordByMember,
        resetAllData
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectory must be used within a DirectoryProvider');
  }
  return context;
};
