import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Copy, 
  Check, 
  ShieldCheck, 
  Send, 
  RefreshCw, 
  LogOut, 
  Lock 
} from 'lucide-react';
import { CredentialRecord } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface PasswordResetModalProps {
  cred: CredentialRecord | null;
  onClose: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  cred,
  onClose
}) => {
  const { 
    generateTempPassword, 
    sendPasswordResetLink, 
    toggleMember2FA, 
    revokeActiveSessions 
  } = useDirectory();

  const [newTempPass, setNewTempPass] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resetDispatched, setResetDispatched] = useState(false);

  if (!cred) return null;

  const handleGenerate = () => {
    const pass = generateTempPassword(cred.memberId);
    setNewTempPass(pass);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendLink = () => {
    sendPasswordResetLink(cred.memberId);
    setResetDispatched(true);
    setTimeout(() => setResetDispatched(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-violet-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Security & Credential Administration
              </h3>
              <p className="text-[11px] text-slate-500">
                Member ID: {cred.directoryId} · {cred.memberName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Current Credential Profile */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Login Username / Email:</span>
              <span className="font-mono font-bold text-slate-900">{cred.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Password Security State:</span>
              <span className="font-semibold text-slate-800">{cred.passwordStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Password Change:</span>
              <span className="font-mono text-slate-700">{cred.lastPasswordChange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Bearer Sessions:</span>
              <span className="font-mono font-semibold text-slate-900">{cred.activeSessions}</span>
            </div>
          </div>

          {/* Action 1: Generate Temporary Password */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Generate 72-Hour One-Time Password
                </h4>
                <p className="text-[11px] text-slate-500">
                  Issues a high-entropy temporary passkey for initial login or emergency access.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-violet-700 hover:bg-violet-800 rounded-lg transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </div>

            {/* Display newly generated or existing temp pass */}
            {(newTempPass || cred.tempPassword) && (
              <div className="bg-violet-50 border border-violet-200 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-violet-800 font-semibold block uppercase">
                    Temporary Passkey:
                  </span>
                  <span className="font-mono font-bold text-sm text-violet-950">
                    {newTempPass || cred.tempPassword}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(newTempPass || cred.tempPassword!)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-900 bg-white border border-violet-200 rounded hover:bg-violet-100 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action 2: Dispatch Password Reset Email */}
          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Dispatch Reset Token Link
              </h4>
              <p className="text-[11px] text-slate-500">
                Sends an email notification with secure URL to {cred.username}.
              </p>
            </div>
            <button
              onClick={handleSendLink}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>{resetDispatched ? 'Sent!' : 'Send Link'}</span>
            </button>
          </div>

          {/* Action 3: 2FA & Session Revocation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-900 block mb-1">Two-Factor (2FA)</span>
              <button
                onClick={() => toggleMember2FA(cred.memberId)}
                className={`w-full py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                  cred.twoFactorEnabled
                    ? 'bg-violet-100 text-violet-900 border-violet-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cred.twoFactorEnabled ? '2FA Enforced (Active)' : 'Enable 2FA Requirement'}
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-900 block mb-1">Session Security</span>
              <button
                onClick={() => {
                  revokeActiveSessions(cred.memberId);
                  alert('All active sessions terminated. Member must log in again with ID and password.');
                }}
                className="w-full py-1.5 px-2 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Revoke All Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
