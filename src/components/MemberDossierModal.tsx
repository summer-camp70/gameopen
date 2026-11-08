import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  IdCard, 
  CreditCard, 
  Key, 
  Check, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Star 
} from 'lucide-react';
import { DirectoryMember, RegistrationStatus } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface MemberDossierModalProps {
  member: DirectoryMember | null;
  onClose: () => void;
  onOpenDigitalId: (member: DirectoryMember) => void;
  onCheckPayment: (member: DirectoryMember) => void;
  onManageCredentials: (member: DirectoryMember) => void;
}

export const MemberDossierModal: React.FC<MemberDossierModalProps> = ({
  member,
  onClose,
  onOpenDigitalId,
  onCheckPayment,
  onManageCredentials
}) => {
  const { updateMemberStatus, approveMemberRegistration, currentRole, payments, credentials } = useDirectory();

  const [notes, setNotes] = useState(member?.verificationNotes || '');
  const [selectedStatus, setSelectedStatus] = useState<RegistrationStatus>(
    member?.registrationStatus || 'Pending Approval'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!member) return null;

  const payment = payments.find(p => p.memberId === member.id);
  const cred = credentials.find(c => c.memberId === member.id);

  const handleSaveStatus = () => {
    updateMemberStatus(member.id, selectedStatus, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApprove = () => {
    approveMemberRegistration(member.id);
    setSelectedStatus('Verified Active');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                {member.directoryId}
              </span>
              <span className="text-xs text-slate-500">Dossier & Registration File</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {member.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Quick Action Strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenDigitalId(member)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <IdCard className="w-3.5 h-3.5 text-slate-600" />
              <span>Official ID Badge</span>
            </button>
            <button
              onClick={() => onCheckPayment(member)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Details ({payment?.status || 'No record'})</span>
            </button>
            <button
              onClick={() => onManageCredentials(member)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-800 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors border border-violet-200"
            >
              <Key className="w-3.5 h-3.5 text-violet-600" />
              <span>Manage Password & Credentials</span>
            </button>
          </div>

          {/* Registration Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Category</span>
              <span className="font-bold text-slate-900">{member.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Membership Tier & Fee</span>
              <span className="font-bold text-slate-900">{member.membershipTier} (${member.annualFee}/year)</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Official State License / Tax ID</span>
              <span className="font-mono font-bold text-slate-900">{member.licenseNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Initial Application Date</span>
              <span className="font-mono text-slate-800">{member.registrationDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Contact Person</span>
              <span className="font-semibold text-slate-900">{member.contactPerson}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email & Phone</span>
              <span className="font-mono text-slate-800">{member.email} · {member.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Location</span>
              <span className="text-slate-800">{member.city}, {member.state}, {member.country}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Website</span>
              <a
                href={member.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline truncate block"
              >
                {member.website}
              </a>
            </div>
          </div>

          {/* Description & Tags */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">Entity Profile Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-3 rounded-lg">
              {member.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">Registered Specialties & Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {member.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Registrar Control & Approval Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Registrar Compliance Decision & Notes</span>
              {member.verifiedBy && (
                <span className="text-[11px] text-emerald-700 font-normal">
                  Approved by {member.verifiedBy} ({member.verifiedAt})
                </span>
              )}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Registration Status:
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as RegistrationStatus)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden"
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified Active">Verified Active</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quick Action:
                </label>
                {selectedStatus !== 'Verified Active' ? (
                  <button
                    onClick={handleApprove}
                    className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve & Validate Listing</span>
                  </button>
                ) : (
                  <div className="text-xs text-emerald-700 font-semibold py-1.5 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Listing Officially Verified & Active</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registrar Audit Notes:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Log internal comments, licensing checks, or compliance notes..."
                className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {savedSuccess ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Audit notes and status updated successfully!
                </span>
              ) : <div />}

              <button
                onClick={handleSaveStatus}
                className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
              >
                Save Review Notes
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
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
