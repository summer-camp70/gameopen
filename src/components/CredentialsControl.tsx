import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  IdCard, 
  LogOut, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  UserCheck, 
  Clock 
} from 'lucide-react';
import { CredentialRecord, PasswordStatus } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface CredentialsControlProps {
  onOpenDigitalIdById: (memberId: string) => void;
  onOpenPasswordModal: (cred: CredentialRecord) => void;
}

export const CredentialsControl: React.FC<CredentialsControlProps> = ({
  onOpenDigitalIdById,
  onOpenPasswordModal
}) => {
  const { 
    credentials, 
    generateTempPassword, 
    sendPasswordResetLink, 
    toggleMember2FA, 
    revokeActiveSessions,
    currentRole 
  } = useDirectory();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleReveal = (credId: string) => {
    setRevealedPasswords(prev => ({ ...prev, [credId]: !prev[credId] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredCredentials = credentials.filter(c => {
    if (statusFilter !== 'All' && c.passwordStatus !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.memberName.toLowerCase().includes(q) ||
        c.directoryId.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPasswordStatusBadge = (status: PasswordStatus) => {
    switch (status) {
      case 'Secure & Active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Secure & Active
          </span>
        );
      case 'Temporary Password Issued':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-600" />
            Temp Pass Issued
          </span>
        );
      case 'Reset Requested':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
            <RefreshCw className="w-3 h-3 text-sky-600" />
            Reset Requested
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Password Expired
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Member ID & Password Credential Manager
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issue and revoke official Directory IDs, generate temporary one-time passwords, enforce 2FA, and terminate compromised sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-500">Security Clearance: </span>
              <span className="font-semibold text-slate-800">
                {currentRole === 'Admin' ? 'Tier 1 Administrator' : 'Tier 2 Registry Officer'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Managed IDs
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1 block">
              {credentials.length}
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Active & Protected
            </span>
            <span className="text-xl font-bold text-emerald-950 font-mono tabular-nums mt-1 block">
              {credentials.filter(c => c.passwordStatus === 'Secure & Active').length}
            </span>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
              Temporary Passwords
            </span>
            <span className="text-xl font-bold text-amber-950 font-mono tabular-nums mt-1 block">
              {credentials.filter(c => c.passwordStatus === 'Temporary Password Issued').length}
            </span>
          </div>

          <div className="bg-violet-50/60 border border-violet-100 p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-violet-800 uppercase tracking-wider block">
              Two-Factor (2FA) Enforced
            </span>
            <span className="text-xl font-bold text-violet-950 font-mono tabular-nums mt-1 block">
              {credentials.filter(c => c.twoFactorEnabled).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search credentials by Directory ID, entity name, or login email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by password status"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Password Statuses</option>
            <option value="Secure & Active">Secure & Active</option>
            <option value="Temporary Password Issued">Temporary Password Issued</option>
            <option value="Reset Requested">Reset Requested</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Credentials Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Directory ID & Entity</th>
                <th className="py-3 px-4">Login Username</th>
                <th className="py-3 px-4">Password Status</th>
                <th className="py-3 px-4">Temp Key / Security Code</th>
                <th className="py-3 px-4">2FA Policy</th>
                <th className="py-3 px-4">Last Login & Sessions</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCredentials.map(cred => {
                const isRevealed = !!revealedPasswords[cred.credentialId];
                return (
                  <tr key={cred.credentialId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Directory ID & Member Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{cred.directoryId}</span>
                        <button
                          onClick={() => handleCopy(cred.directoryId)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copy Directory ID"
                        >
                          {copiedText === cred.directoryId ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="font-medium text-slate-700 text-[11px] mt-0.5">{cred.memberName}</div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-semibold text-slate-800">{cred.username}</div>
                      <div className="text-[10px] text-slate-400">Role: {cred.role}</div>
                    </td>

                    {/* Password Status */}
                    <td className="py-3.5 px-4">
                      {getPasswordStatusBadge(cred.passwordStatus)}
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Changed: {cred.lastPasswordChange}
                      </div>
                    </td>

                    {/* Temp Key */}
                    <td className="py-3.5 px-4">
                      {cred.tempPassword ? (
                        <div className="bg-amber-50 border border-amber-200/70 p-1.5 rounded-md inline-block">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-950">
                              {isRevealed ? cred.tempPassword : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleReveal(cred.credentialId)}
                              className="text-amber-700 hover:text-amber-900"
                              title={isRevealed ? 'Hide' : 'Reveal'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopy(cred.tempPassword!)}
                              className="text-amber-700 hover:text-amber-900"
                              title="Copy temporary password"
                            >
                              {copiedText === cred.tempPassword ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {cred.tempPasswordExpires && (
                            <div className="text-[10px] text-amber-800 mt-0.5 font-mono">
                              Expires: {cred.tempPasswordExpires}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Encrypted by member</span>
                      )}
                    </td>

                    {/* 2FA Policy Switch */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleMember2FA(cred.memberId)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          cred.twoFactorEnabled
                            ? 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to toggle 2FA requirement"
                      >
                        {cred.twoFactorEnabled ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                            <span>Enforced</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Optional</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last Login & Active Sessions */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-700 font-mono">{cred.lastLogin}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-slate-800 font-mono tabular-nums">{cred.activeSessions}</span>
                        <span>active sessions</span>
                        {cred.activeSessions > 0 && (
                          <button
                            onClick={() => revokeActiveSessions(cred.memberId)}
                            className="ml-1 text-[10px] text-rose-600 hover:underline flex items-center gap-0.5"
                            title="Force log out all sessions"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Access Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Generate Temp Password */}
                        <button
                          onClick={() => onOpenPasswordModal(cred)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          title="Generate new temporary password or reset credentials"
                        >
                          <KeyRound className="w-3 h-3 text-violet-600" />
                          <span>Reset Password</span>
                        </button>

                        {/* Send Reset Link */}
                        <button
                          onClick={() => {
                            sendPasswordResetLink(cred.memberId);
                            alert(`Password reset link dispatched to ${cred.username}`);
                          }}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Send reset link to member email"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-600" />
                        </button>

                        {/* Digital ID Badge */}
                        <button
                          onClick={() => onOpenDigitalIdById(cred.memberId)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Official Digital ID Badge & QR"
                        >
                          <IdCard className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
