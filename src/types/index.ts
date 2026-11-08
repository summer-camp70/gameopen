export type RegistrationStatus = 
  | 'Pending Approval'
  | 'Verified Active'
  | 'Awaiting Payment'
  | 'Under Review'
  | 'Suspended';

export type MembershipTier = 'Standard' | 'Verified Professional' | 'Enterprise Elite';

export type PaymentStatus = 'Paid' | 'Pending Verification' | 'Overdue' | 'Refunded';

export type PaymentMethod = 
  | 'Credit Card (Stripe)'
  | 'Direct Wire / ACH'
  | 'Corporate Card'
  | 'PayPal Business'
  | 'Bank Transfer Receipt';

export type PasswordStatus = 
  | 'Secure & Active'
  | 'Temporary Password Issued'
  | 'Reset Requested'
  | 'Expired';

export interface DirectoryMember {
  id: string;
  directoryId: string; // e.g. DIR-2026-8491
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: 
    | 'Healthcare & Medical'
    | 'Legal & Compliance'
    | 'Engineering & Tech'
    | 'Financial Services'
    | 'Trade & Construction'
    | 'Education & Training'
    | 'Creative & Design';
  description: string;
  city: string;
  state: string;
  country: string;
  website: string;
  registrationDate: string;
  licenseNumber: string; // Official Gov / Tax ID
  registrationStatus: RegistrationStatus;
  membershipTier: MembershipTier;
  annualFee: number;
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  tags: string[];
  rating: number;
}

export interface PaymentRecord {
  paymentId: string;
  memberId: string;
  memberName: string;
  directoryId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  invoiceNumber: string;
  billingPeriod: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  receiptNotes?: string;
}

export interface CredentialRecord {
  credentialId: string;
  memberId: string;
  directoryId: string;
  memberName: string;
  username: string; // email or login ID
  passwordStatus: PasswordStatus;
  tempPassword?: string;
  tempPasswordExpires?: string;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  activeSessions: number;
  role: 'Member' | 'Officer' | 'Admin';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetId: string;
  targetName: string;
  category: 'registration' | 'payment' | 'credential' | 'directory';
  details: string;
}
