import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCheck, 
  Building2,
  DollarSign
} from 'lucide-react';
import { PaymentRecord, PaymentStatus, PaymentMethod } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface PaymentsControlProps {
  onInspectPayment: (payment: PaymentRecord) => void;
  onRecordPayment: () => void;
}

export const PaymentsControl: React.FC<PaymentsControlProps> = ({
  onInspectPayment,
  onRecordPayment
}) => {
  const { payments, verifyPayment, flagPaymentIssue, currentRole } = useDirectory();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const totalCleared = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingList = payments.filter(p => p.status === 'Pending Verification');
  const pendingTotal = pendingList.reduce((sum, p) => sum + p.amount, 0);

  const overdueList = payments.filter(p => p.status === 'Overdue');
  const overdueTotal = overdueList.reduce((sum, p) => sum + p.amount, 0);

  const handleCopyRef = (e: React.MouseEvent, ref: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const filteredPayments = payments.filter(p => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (methodFilter !== 'All' && p.paymentMethod !== methodFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.memberName.toLowerCase().includes(q) ||
        p.directoryId.toLowerCase().includes(q) ||
        p.paymentId.toLowerCase().includes(q) ||
        p.transactionReference.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportPaymentsCSV = () => {
    const headers = ['Payment ID', 'Member Name', 'Directory ID', 'Invoice #', 'Amount', 'Status', 'Method', 'Transaction Ref', 'Submitted At', 'Verified At', 'Verified By'];
    const rows = filteredPayments.map(p => [
      p.paymentId,
      `"${p.memberName.replace(/"/g, '""')}"`,
      p.directoryId,
      p.invoiceNumber,
      `$${p.amount.toFixed(2)}`,
      p.status,
      `"${p.paymentMethod}"`,
      p.transactionReference,
      p.submittedAt,
      p.verifiedAt || 'Pending',
      p.verifiedBy || 'Pending'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DirectoHub_Payments_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Payment Verification & Treasury Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Check incoming wire confirmations, credit card settlements, PayPal authorizations, and reconcile invoices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportPaymentsCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Ledger</span>
            </button>
            <button
              onClick={onRecordPayment}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Record Direct Payment</span>
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-lg">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Total Verified Revenue
            </div>
            <div className="text-2xl font-bold text-emerald-950 font-mono tabular-nums mt-1">
              ${totalCleared.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Cleared directly to directory registry account
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-lg">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center justify-between">
              <span>Pending Verification</span>
              <span className="font-mono bg-amber-100 text-amber-900 px-1.5 rounded text-[10px]">
                {pendingList.length} items
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-950 font-mono tabular-nums mt-1">
              ${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              Awaiting officer verification of receipt / wire
            </div>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-lg">
            <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center justify-between">
              <span>Overdue / Unpaid Dues</span>
              <span className="font-mono bg-rose-100 text-rose-900 px-1.5 rounded text-[10px]">
                {overdueList.length} items
              </span>
            </div>
            <div className="text-2xl font-bold text-rose-950 font-mono tabular-nums mt-1">
              ${overdueTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              Payment deadline exceeded / action required
            </div>
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
            placeholder="Search payments by entity name, Directory ID, transaction ref, or invoice #..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by payment status"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Pending Verification">Pending Verification ({pendingList.length})</option>
            <option value="Paid">Paid & Cleared</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            aria-label="Filter by payment method"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
            <option value="Direct Wire / ACH">Direct Wire / ACH</option>
            <option value="Corporate Card">Corporate Card</option>
            <option value="PayPal Business">PayPal Business</option>
            <option value="Bank Transfer Receipt">Bank Transfer Receipt</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Invoice & ID</th>
                <th className="py-3 px-4">Member Entity</th>
                <th className="py-3 px-4">Fee Amount</th>
                <th className="py-3 px-4">Method & Transaction Ref</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-right">Verification Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map(payment => (
                <tr key={payment.paymentId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Invoice # & Payment ID */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">{payment.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400">{payment.paymentId}</div>
                  </td>

                  {/* Member Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{payment.memberName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{payment.directoryId}</div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <div className="text-sm font-bold text-slate-900">
                      ${payment.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400">{payment.billingPeriod}</div>
                  </td>

                  {/* Method & Ref */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{payment.paymentMethod}</div>
                    <button
                      onClick={e => handleCopyRef(e, payment.transactionReference)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded mt-0.5 transition-colors"
                      title="Copy transaction reference code"
                    >
                      <span className="truncate max-w-[150px]">{payment.transactionReference}</span>
                      {copiedRef === payment.transactionReference ? (
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </button>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {payment.status === 'Paid' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Paid & Cleared
                      </span>
                    )}
                    {payment.status === 'Pending Verification' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Verification
                      </span>
                    )}
                    {payment.status === 'Overdue' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Overdue / Unpaid
                      </span>
                    )}
                  </td>

                  {/* Audit Details */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-[11px] text-slate-600 line-clamp-2">
                      {payment.receiptNotes}
                    </div>
                    {payment.verifiedBy && (
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5 font-mono">
                        Verified by {payment.verifiedBy} ({payment.verifiedAt})
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Check & Verify Button */}
                      {payment.status === 'Pending Verification' && (
                        <button
                          onClick={() => verifyPayment(payment.paymentId, 'Payment verified against bank statement.')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                          title="Verify receipt and mark payment as cleared"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify & Clear</span>
                        </button>
                      )}

                      {/* Flag Issue */}
                      {payment.status === 'Pending Verification' && (
                        <button
                          onClick={() => {
                            const issue = prompt('Reason for flagging payment (e.g. invalid receipt or short payment):', 'Wire slip reference does not match treasury ledger');
                            if (issue) {
                              flagPaymentIssue(payment.paymentId, issue);
                            }
                          }}
                          className="px-2 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                          title="Flag payment discrepancy"
                        >
                          Flag
                        </button>
                      )}

                      {/* Inspect Receipt Modal */}
                      <button
                        onClick={() => onInspectPayment(payment)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        title="View official receipt slip"
                      >
                        Receipt Slip
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
