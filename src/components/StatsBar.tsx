import React from 'react';
import { 
  Building, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Key, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';
import { ActiveTab } from './Navbar';

interface StatsBarProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ onNavigateTab }) => {
  const { members, payments, credentials } = useDirectory();

  const totalMembers = members.length;
  const verifiedMembers = members.filter(m => m.registrationStatus === 'Verified Active').length;
  const pendingApprovals = members.filter(
    m => m.registrationStatus === 'Pending Approval' || m.registrationStatus === 'Under Review'
  ).length;

  const verifiedPaidTotal = payments
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingPaymentsList = payments.filter(p => p.status === 'Pending Verification');
  const pendingPaymentsTotal = pendingPaymentsList.reduce((acc, p) => acc + p.amount, 0);

  const activeCreds = credentials.filter(c => c.passwordStatus === 'Secure & Active').length;
  const tempCreds = credentials.filter(c => c.passwordStatus === 'Temporary Password Issued').length;
  const twoFactorCount = credentials.filter(c => c.twoFactorEnabled).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* Card 1: Total Registered Entities */}
      <div 
        onClick={() => onNavigateTab('directory')}
        className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Directory Roster
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalMembers}
          </span>
          <span className="text-xs text-slate-500">entities</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{verifiedMembers} verified active</span>
          <span aria-hidden="true">·</span>
          <span>{members.filter(m => m.registrationStatus === 'Awaiting Payment').length} awaiting fee</span>
        </div>
      </div>

      {/* Card 2: Registration Approvals */}
      <div 
        onClick={() => onNavigateTab('registrations')}
        className={`bg-white p-4 rounded-xl border transition-all cursor-pointer group shadow-2xs ${
          pendingApprovals > 0 ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Review Queue
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {pendingApprovals}
          </span>
          <span className="text-xs font-medium text-amber-700">need action</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>{members.filter(m => m.registrationStatus === 'Pending Approval').length} new applications</span>
          <span aria-hidden="true">·</span>
          <span>{members.filter(m => m.registrationStatus === 'Under Review').length} under review</span>
        </div>
      </div>

      {/* Card 3: Payments Verified & Pending */}
      <div 
        onClick={() => onNavigateTab('payments')}
        className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Payments
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            ${verifiedPaidTotal.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-600 font-medium">cleared</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-mono tabular-nums font-semibold text-amber-700">
            {pendingPaymentsList.length} pending (${pendingPaymentsTotal.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Card 4: Credential & Password Security */}
      <div 
        onClick={() => onNavigateTab('credentials')}
        className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Credentials & Passwords
          </span>
          <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
            <Key className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {credentials.length}
          </span>
          <span className="text-xs text-slate-500">registered IDs</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>{twoFactorCount} 2FA enabled</span>
          <span aria-hidden="true">·</span>
          <span>{tempCreds} temp keys</span>
        </div>
      </div>
    </div>
  );
};
