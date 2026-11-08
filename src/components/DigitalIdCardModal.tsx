import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle, 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink 
} from 'lucide-react';
import { DirectoryMember, CredentialRecord } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface DigitalIdCardModalProps {
  member: DirectoryMember | null;
  onClose: () => void;
}

export const DigitalIdCardModal: React.FC<DigitalIdCardModalProps> = ({
  member,
  onClose
}) => {
  const { credentials } = useDirectory();
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const cred = credentials.find(c => c.memberId === member.id);

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.directoryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Official Digital Credential & ID Badge
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Print credential card"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Digital ID Card Preview (Physical Badge Style) */}
        <div className="p-6 flex justify-center bg-slate-100/70">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700/80 relative overflow-hidden">
            
            {/* Holographic Security Overlay Pattern */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            {/* Header of Badge */}
            <div className="flex items-start justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase block font-semibold">
                  National Directory & Registry Authority
                </span>
                <span className="text-base font-extrabold tracking-tight text-white block mt-0.5">
                  VERIFIED DIRECTORY CREDENTIAL
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            {/* Entity Name & Tier */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Accredited Organization / Entity
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {member.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-indigo-200">
                <span>{member.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">{member.membershipTier}</span>
              </div>
            </div>

            {/* Directory ID & Security Code */}
            <div className="grid grid-cols-2 gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Official Directory ID
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-sm text-white tracking-wider">
                    {member.directoryId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="text-slate-400 hover:text-white"
                    title="Copy ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  License / Tax Record
                </span>
                <span className="font-mono text-xs text-slate-200 mt-0.5 block truncate">
                  {member.licenseNumber}
                </span>
              </div>
            </div>

            {/* QR Code and Validation Footprint */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/80 text-[11px]">
              <div>
                <div className="text-slate-400">Issued Date: <strong className="text-slate-200 font-mono">{member.registrationDate}</strong></div>
                <div className="text-slate-400">Valid Through: <strong className="text-slate-200 font-mono">2027-12-31</strong></div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>REGISTRY STATUS: {member.registrationStatus.toUpperCase()}</span>
                </div>
              </div>

              {/* QR Simulation Box */}
              <div className="bg-white p-2 rounded-lg shrink-0 flex flex-col items-center shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
                <span className="text-[8px] font-mono font-bold text-slate-800 mt-0.5">
                  AUTH VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Associated Password & Login Credentials Panel */}
        <div className="p-5 border-t border-slate-200 bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>Linked Portal Credentials:</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Username / Login ID:</span>
              <span className="font-mono font-semibold text-slate-900">{cred?.username || member.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Password State:</span>
              <span className="font-medium text-slate-800">{cred?.passwordStatus || 'Active'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Two-Factor (2FA):</span>
              <span className="font-medium text-slate-800">{cred?.twoFactorEnabled ? 'Enabled & Required' : 'Standard Password'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Last Session:</span>
              <span className="font-mono text-slate-700 text-[11px]">{cred?.lastLogin || 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
