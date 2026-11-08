import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  AlertTriangle,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { DirectoryMember, RegistrationStatus } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface RegistrationsControlProps {
  onSelectMember: (member: DirectoryMember) => void;
  onOpenDigitalId: (member: DirectoryMember) => void;
}

export const RegistrationsControl: React.FC<RegistrationsControlProps> = ({
  onSelectMember,
  onOpenDigitalId
}) => {
  const { 
    members, 
    updateMemberStatus, 
    approveMemberRegistration, 
    currentRole 
  } = useDirectory();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionReason, setActionReason] = useState<{ [id: string]: string }>({});
  const [showReasonInput, setShowReasonInput] = useState<string | null>(null);

  const pendingCount = members.filter(m => m.registrationStatus === 'Pending Approval').length;
  const underReviewCount = members.filter(m => m.registrationStatus === 'Under Review').length;
  const awaitingPaymentCount = members.filter(m => m.registrationStatus === 'Awaiting Payment').length;
  const activeCount = members.filter(m => m.registrationStatus === 'Verified Active').length;
  const suspendedCount = members.filter(m => m.registrationStatus === 'Suspended').length;

  const filteredMembers = members.filter(m => {
    if (statusFilter !== 'All' && m.registrationStatus !== statusFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.directoryId.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.licenseNumber.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSetStatus = (member: DirectoryMember, nextStatus: RegistrationStatus, reason?: string) => {
    updateMemberStatus(member.id, nextStatus, reason || `Status changed to ${nextStatus} by ${currentRole}`);
    setShowReasonInput(null);
  };

  return (
    <div className="space-y-4">
      {/* Control Room Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Registrations Control & Compliance Review
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify legal authority, state registrations, tax identifiers, and authorize official Directory ID credential issuance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-500">Active Reviewer: </span>
              <span className="font-semibold text-slate-800">
                {currentRole === 'Admin' ? 'Admin Chief Registrar' : 'Officer Sarah Jenkins'}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Registrations ({members.length})
          </button>

          <button
            onClick={() => setStatusFilter('Pending Approval')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'Pending Approval'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approval</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/30 rounded text-[10px]">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Under Review')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'Under Review'
                ? 'bg-sky-600 text-white'
                : 'text-sky-800 bg-sky-50 hover:bg-sky-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Under Review</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/30 rounded text-[10px]">
              {underReviewCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Awaiting Payment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'Awaiting Payment'
                ? 'bg-violet-600 text-white'
                : 'text-violet-800 bg-violet-50 hover:bg-violet-100'
            }`}
          >
            <span>Awaiting Payment</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/30 rounded text-[10px]">
              {awaitingPaymentCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Verified Active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'Verified Active'
                ? 'bg-emerald-700 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Active</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/30 rounded text-[10px]">
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Suspended')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'Suspended'
                ? 'bg-rose-700 text-white'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Suspended</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/30 rounded text-[10px]">
              {suspendedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applications by entity name, Directory ID, license, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Entity Details</th>
                <th className="py-3 px-4">Official License / Tax ID</th>
                <th className="py-3 px-4">Applied Date & Tier</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Verification Audit Notes</th>
                <th className="py-3 px-4 text-right">Registrar Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Entity Details */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{member.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-700">{member.directoryId}</span> · {member.contactPerson} ({member.email})
                    </div>
                  </td>

                  {/* License */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {member.licenseNumber}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{member.city}, {member.state}</div>
                  </td>

                  {/* Date & Tier */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{member.membershipTier}</div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">Applied {member.registrationDate}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <select
                      value={member.registrationStatus}
                      onChange={e => handleSetStatus(member, e.target.value as RegistrationStatus)}
                      aria-label="Change registration status"
                      className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer focus:outline-hidden ${
                        member.registrationStatus === 'Verified Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : member.registrationStatus === 'Pending Approval'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : member.registrationStatus === 'Under Review'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : member.registrationStatus === 'Awaiting Payment'
                          ? 'bg-violet-50 text-violet-800 border-violet-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Verified Active">Verified Active</option>
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {member.verificationNotes || 'No verification notes logged yet.'}
                    </div>
                    {member.verifiedBy && (
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        Approved by {member.verifiedBy} ({member.verifiedAt})
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* One Click Approve */}
                      {member.registrationStatus !== 'Verified Active' && (
                        <button
                          onClick={() => approveMemberRegistration(member.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                          title="Authorize and activate member listing"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Approve</span>
                        </button>
                      )}

                      {/* Request Info / Clarification */}
                      {member.registrationStatus !== 'Under Review' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Specify clarification or document requested from applicant:', 'Proof of current liability insurance and tax filing');
                            if (reason) {
                              handleSetStatus(member, 'Under Review', reason);
                            }
                          }}
                          className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          title="Place under review and request clarification"
                        >
                          Request Info
                        </button>
                      )}

                      {/* Suspend */}
                      {member.registrationStatus === 'Verified Active' && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to suspend directory listing for ${member.name}?`)) {
                              handleSetStatus(member, 'Suspended', 'Suspended by registrar officer for compliance investigation.');
                            }
                          }}
                          className="px-2 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                          title="Suspend listing"
                        >
                          Suspend
                        </button>
                      )}

                      {/* View Dossier Modal */}
                      <button
                        onClick={() => onSelectMember(member)}
                        className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        title="View complete application dossier"
                      >
                        Dossier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
