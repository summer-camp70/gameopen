import React from 'react';
import { 
  Building2, 
  FolderKanban, 
  ClipboardCheck, 
  CreditCard, 
  KeyRound, 
  History, 
  PlusCircle, 
  ShieldCheck, 
  UserCheck, 
  RotateCcw,
  User
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export type ActiveTab = 'directory' | 'registrations' | 'payments' | 'credentials' | 'audit';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRegister: () => void;
  onOpenMemberPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister,
  onOpenMemberPortal
}) => {
  const { 
    members, 
    payments, 
    currentRole, 
    setCurrentRole, 
    resetAllData 
  } = useDirectory();

  const pendingRegistrations = members.filter(
    m => m.registrationStatus === 'Pending Approval' || m.registrationStatus === 'Under Review'
  ).length;

  const pendingPayments = payments.filter(
    p => p.status === 'Pending Verification'
  ).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                DirectoHub
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Registry & Control Portal
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-slate-500" />
              <span>Public Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === 'registrations'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              <span>Registrations Control</span>
              {pendingRegistrations > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md font-mono">
                  {pendingRegistrations}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'payments'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Check Payments</span>
              {pendingPayments > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md font-mono">
                  {pendingPayments}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <KeyRound className="w-4 h-4 text-violet-600" />
              <span>ID & Passwords</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Audit Log</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Role Mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500">Role:</span>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value as 'Admin' | 'Officer' | 'Member')}
                aria-label="Active user role"
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="Admin">Admin (Full Control)</option>
                <option value="Officer">Officer (Verifier)</option>
                <option value="Member">Member Perspective</option>
              </select>
            </div>

            {/* Member Portal Button */}
            <button
              onClick={onOpenMemberPortal}
              title="Test Member Self-Service Portal"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Member Portal</span>
            </button>

            {/* Reset data */}
            <button
              onClick={() => {
                if (confirm('Reset all directory, payment, and password data to initial demo state?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-indigo-300" />
              <span className="whitespace-nowrap">Register Entity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-2 py-1 rounded ${activeTab === 'directory' ? 'text-slate-900 font-bold bg-white' : ''}`}
        >
          Directory
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'registrations' ? 'text-indigo-900 font-bold bg-white' : ''}`}
        >
          Registers
          {pendingRegistrations > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded-sm">{pendingRegistrations}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'payments' ? 'text-emerald-900 font-bold bg-white' : ''}`}
        >
          Payments
          {pendingPayments > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded-sm">{pendingPayments}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-2 py-1 rounded ${activeTab === 'credentials' ? 'text-violet-900 font-bold bg-white' : ''}`}
        >
          IDs & Passwords
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-2 py-1 rounded ${activeTab === 'audit' ? 'text-slate-900 font-bold bg-white' : ''}`}
        >
          Logs
        </button>
      </div>
    </header>
  );
};
