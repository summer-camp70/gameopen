import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  CreditCard, 
  KeyRound, 
  ClipboardCheck, 
  FolderKanban 
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';
import { AuditLogEntry } from '../types';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useDirectory();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetName.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (cat: AuditLogEntry['category']) => {
    switch (cat) {
      case 'registration':
        return <ClipboardCheck className="w-4 h-4 text-indigo-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'credential':
        return <KeyRound className="w-4 h-4 text-violet-600" />;
      case 'directory':
        return <FolderKanban className="w-4 h-4 text-slate-600" />;
    }
  };

  const exportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `DirectoHub_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Registrar Security & Audit Activity Trail
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger of all directory approvals, payment checks, temporary password grants, and credential modifications.
            </p>
          </div>

          <button
            onClick={exportLogs}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Trail (JSON)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter audit trail by officer, target entity, ID, or keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events ({auditLogs.length})
            </button>
            <button
              onClick={() => setCategoryFilter('registration')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                categoryFilter === 'registration' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setCategoryFilter('payment')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                categoryFilter === 'payment' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setCategoryFilter('credential')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                categoryFilter === 'credential' ? 'bg-white text-violet-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ID & Passwords
            </button>
          </div>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map(log => (
            <div key={log.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/60 rounded-lg px-2 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(log.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{log.action}</span>
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                      {log.targetId}
                    </span>
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {log.targetName}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {log.details}
                </p>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span>Authorized by: <strong className="text-slate-700">{log.actor}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{log.category} domain</span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No audit records matching your current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
