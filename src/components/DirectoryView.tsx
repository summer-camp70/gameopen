import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  IdCard, 
  CreditCard, 
  Key, 
  Copy, 
  Check, 
  MapPin, 
  Star, 
  Download,
  Building,
  ShieldAlert
} from 'lucide-react';
import { DirectoryMember, RegistrationStatus, MembershipTier } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface DirectoryViewProps {
  onSelectMember: (member: DirectoryMember) => void;
  onOpenDigitalId: (member: DirectoryMember) => void;
  onCheckPayment: (member: DirectoryMember) => void;
  onManageCredentials: (member: DirectoryMember) => void;
}

const CATEGORIES = [
  'All Categories',
  'Healthcare & Medical',
  'Legal & Compliance',
  'Engineering & Tech',
  'Financial Services',
  'Trade & Construction',
  'Education & Training',
  'Creative & Design'
];

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  onSelectMember,
  onOpenDigitalId,
  onCheckPayment,
  onManageCredentials
}) => {
  const { members, payments, currentRole, approveMemberRegistration } = useDirectory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Category filter
      if (selectedCategory !== 'All Categories' && m.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && m.registrationStatus !== selectedStatus) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'All' && m.membershipTier !== selectedTier) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesId = m.directoryId.toLowerCase().includes(q);
        const matchesCity = m.city.toLowerCase().includes(q);
        const matchesContact = m.contactPerson.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesLicense = m.licenseNumber.toLowerCase().includes(q);
        const matchesTag = m.tags.some(t => t.toLowerCase().includes(q));
        return matchesName || matchesId || matchesCity || matchesContact || matchesEmail || matchesLicense || matchesTag;
      }
      return true;
    });
  }, [members, selectedCategory, selectedStatus, selectedTier, searchQuery]);

  const exportDirectoryCSV = () => {
    const headers = ['Directory ID', 'Entity Name', 'Category', 'Contact Person', 'Email', 'City', 'Status', 'Tier', 'Annual Fee', 'Rating'];
    const rows = filteredMembers.map(m => [
      m.directoryId,
      `"${m.name.replace(/"/g, '""')}"`,
      m.category,
      `"${m.contactPerson}"`,
      m.email,
      `"${m.city}, ${m.state}"`,
      m.registrationStatus,
      m.membershipTier,
      `$${m.annualFee}`,
      m.rating
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DirectoHub_Registry_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'Verified Active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified Active
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Approval
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-md">
            <Filter className="w-3 h-3 text-sky-600" />
            Under Review
          </span>
        );
      case 'Awaiting Payment':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-800 bg-violet-50 border border-violet-200/80 px-2 py-0.5 rounded-md">
            <CreditCard className="w-3 h-3 text-violet-600" />
            Awaiting Payment
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3 text-rose-600" />
            Suspended
          </span>
        );
    }
  };

  const getPaymentStatusForMember = (memberId: string) => {
    const payment = payments.find(p => p.memberId === memberId);
    if (!payment) return { label: 'No Invoice', color: 'text-slate-400' };
    if (payment.status === 'Paid') return { label: 'Paid & Cleared', color: 'text-emerald-700 bg-emerald-50' };
    if (payment.status === 'Pending Verification') return { label: 'Payment In Review', color: 'text-amber-700 bg-amber-50' };
    if (payment.status === 'Overdue') return { label: 'Payment Overdue', color: 'text-rose-700 bg-rose-50' };
    return { label: payment.status, color: 'text-slate-600' };
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by entity name, Directory ID (DIR-...), license, contact, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Tier, Status, View mode, Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              aria-label="Filter by registration status"
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Verified Active">Verified Active</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Under Review">Under Review</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              aria-label="Filter by membership tier"
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Standard">Standard</option>
              <option value="Verified Professional">Verified Professional</option>
              <option value="Enterprise Elite">Enterprise Elite</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={exportDirectoryCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Export roster to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-semibold text-slate-800 font-mono tabular-nums">{filteredMembers.length}</span> of{' '}
          <span className="font-semibold text-slate-800 font-mono tabular-nums">{members.length}</span> entities
        </span>
        {searchQuery && (
          <span className="text-slate-600">
            Filtered by query: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No directory entities found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No entries matched your current search filters. Try clearing the search query or changing category and status selections.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedStatus('All');
              setSelectedTier('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => {
            const paymentInfo = getPaymentStatusForMember(member.id);
            return (
              <div
                key={member.id}
                onClick={() => onSelectMember(member)}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Bar on Card: Directory ID and Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      onClick={e => handleCopyId(e, member.directoryId)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                      title="Click to copy Directory ID"
                    >
                      <span>{member.directoryId}</span>
                      {copiedId === member.directoryId ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {getStatusBadge(member.registrationStatus)}
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-3">
                    <span className="font-medium text-slate-700">{member.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {member.city}, {member.state}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {member.rating}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {member.description}
                  </p>

                  {/* License & Fee row */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[11px]">License / Tax:</span>
                      <span className="font-mono text-[11px] font-semibold text-slate-800">{member.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Payment Status:</span>
                      <span className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-sm ${paymentInfo.color}`}>
                        {paymentInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Registry Tier:</span>
                      <span className="font-medium text-slate-700 text-[11px]">{member.membershipTier} (${member.annualFee}/yr)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onOpenDigitalId(member);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
                    title="View Digital ID Badge & Credentials"
                  >
                    <IdCard className="w-3.5 h-3.5 text-slate-600" />
                    <span>ID Card</span>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onCheckPayment(member);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
                    title="Inspect & Check Payments"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment</span>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onManageCredentials(member);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
                    title="Manage ID, Passwords & Access"
                  >
                    <Key className="w-3.5 h-3.5 text-violet-600" />
                    <span>Password</span>
                  </button>

                  {/* If Pending Approval and admin/officer, quick approve */}
                  {member.registrationStatus === 'Pending Approval' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        approveMemberRegistration(member.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-slate-900 hover:bg-slate-800 font-semibold transition-colors"
                      title="Quick Approve Registration"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredMembers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Directory ID</th>
                  <th className="py-3 px-4">Entity & Category</th>
                  <th className="py-3 px-4">Contact / Email</th>
                  <th className="py-3 px-4">Registration Status</th>
                  <th className="py-3 px-4">Payment Check</th>
                  <th className="py-3 px-4">Tier / Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.map(member => {
                  const paymentInfo = getPaymentStatusForMember(member.id);
                  return (
                    <tr
                      key={member.id}
                      onClick={() => onSelectMember(member)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={e => handleCopyId(e, member.directoryId)}
                          className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                        >
                          <span>{member.directoryId}</span>
                          {copiedId === member.directoryId ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-500">{member.category} · {member.city}, {member.state}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{member.contactPerson}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{member.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(member.registrationStatus)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${paymentInfo.color}`}>
                          {paymentInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        <div className="font-semibold text-slate-900">${member.annualFee}</div>
                        <div className="text-[10px] text-slate-400">{member.membershipTier}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenDigitalId(member)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Digital ID Card"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCheckPayment(member)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Check Payment"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onManageCredentials(member)}
                            className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                            title="Manage Password & Credentials"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          {member.registrationStatus === 'Pending Approval' && (
                            <button
                              onClick={() => approveMemberRegistration(member.id)}
                              className="px-2 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
