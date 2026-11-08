import React, { useState } from 'react';
import { 
  X, 
  User, 
  IdCard, 
  CreditCard, 
  KeyRound, 
  Lock, 
  Check, 
  CheckCircle, 
  ShieldCheck, 
  ExternalLink, 
  Clock 
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

interface MemberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDigitalId: (memberId: string) => void;
}

export const MemberPortalModal: React.FC<MemberPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenDigitalId
}) => {
  const { 
    members, 
    payments, 
    credentials, 
    activeMemberId, 
    setActiveMemberId, 
    updatePasswordByMember 
  } = useDirectory();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentMember = members.find(m => m.id === activeMemberId) || members[0];
  const currentCred = credentials.find(c => c.memberId === currentMember?.id);
  const currentPayment = payments.find(p => p.memberId === currentMember?.id);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const success = updatePasswordByMember(currentMember.id, newPass);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'Password successfully updated! Account is active and secure.' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Member Self-Service Portal
              </h3>
              <p className="text-[11px] text-slate-500">
                Logged in as: {currentMember?.name} ({currentMember?.directoryId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch preview member */}
            <select
              value={activeMemberId}
              onChange={e => {
                setActiveMemberId(e.target.value);
                setPasswordMsg(null);
              }}
              className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  Switch Member: {m.name.slice(0, 24)}...
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Dashboard Content */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Member Card Summary */}
          <div className="bg-slate-900 text-white rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase block font-semibold">
                  Member Directory Account
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {currentMember?.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                  <span>{currentMember?.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-400 font-bold">{currentMember?.directoryId}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenDigitalId(currentMember.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
              >
                <IdCard className="w-3.5 h-3.5 text-slate-800" />
                <span>View ID Badge</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Status:</span>
                <span className="font-semibold text-emerald-400">{currentMember?.registrationStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Membership Tier:</span>
                <span className="font-semibold text-white">{currentMember?.membershipTier}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Annual Registry Fee:</span>
                <span className="font-mono font-semibold text-white">${currentMember?.annualFee} / yr</span>
              </div>
            </div>
          </div>

          {/* Payment Status Row */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Registry Subscription & Invoicing
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Invoice <span className="font-mono font-semibold text-slate-700">{currentPayment?.invoiceNumber || 'INV-2026-N/A'}</span> ·
                  Status: <strong className="text-slate-800">{currentPayment?.status || 'Active'}</strong> (${currentPayment?.amount})
                </div>
              </div>
            </div>

            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
              currentPayment?.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentPayment?.status === 'Paid' ? 'Paid & Valid' : 'Under Review'}
            </span>
          </div>

          {/* Self-Service Password & Credential Update Form */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-violet-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Update Account Password & Security
                </h4>
                <p className="text-[11px] text-slate-500">
                  Current Status: <strong className="text-slate-800">{currentCred?.passwordStatus}</strong>
                  {currentCred?.tempPassword && (
                    <span className="text-amber-700 ml-1">
                      (Temporary password active: <code className="font-mono font-bold">{currentCred.tempPassword}</code>)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password / Temporary Passkey
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="Enter current or temporary password"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Update & Secure Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
