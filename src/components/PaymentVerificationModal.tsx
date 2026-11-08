import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  Printer, 
  Check, 
  Copy, 
  Building2 
} from 'lucide-react';
import { PaymentRecord } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface PaymentVerificationModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  payment,
  onClose
}) => {
  const { verifyPayment, flagPaymentIssue, currentRole } = useDirectory();
  const [copiedRef, setCopiedRef] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);

  if (!payment) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(payment.transactionReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleConfirmVerify = () => {
    verifyPayment(payment.paymentId, `Verified against banking record by ${currentRole}`);
    onClose();
  };

  const handleConfirmFlag = () => {
    if (!flagReason.trim()) return;
    flagPaymentIssue(payment.paymentId, flagReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Payment Verification & Receipt Audit
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Document Simulation */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden">
            {/* Watermark / Seal */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  Official Registry Transaction Record
                </span>
                <span className="text-sm font-bold text-slate-900 block font-mono">
                  {payment.invoiceNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Payment ID</span>
                <span className="font-mono text-xs font-bold text-slate-700">{payment.paymentId}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant / Member:</span>
                <span className="font-bold text-slate-900">{payment.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Directory ID:</span>
                <span className="font-mono font-bold text-slate-800">{payment.directoryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Period:</span>
                <span className="font-medium text-slate-700">{payment.billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway / Rail:</span>
                <span className="font-medium text-slate-800">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transaction Reference:</span>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  <span>{payment.transactionReference}</span>
                  <button onClick={handleCopyRef} className="text-slate-400 hover:text-slate-600">
                    {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Timestamp:</span>
                <span className="font-mono text-slate-700">{payment.submittedAt}</span>
              </div>
            </div>

            {/* Total Fee Box */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700">Total Subscription Fee</span>
                <div className="text-[11px] text-slate-400">Taxes & registry levies included</div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ${payment.amount.toFixed(2)}
              </div>
            </div>

            {/* Current Status Banner */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Clearance Status:</span>
                {payment.status === 'Paid' ? (
                  <span className="font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified & Cleared ({payment.verifiedAt})
                  </span>
                ) : payment.status === 'Pending Verification' ? (
                  <span className="font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Pending Registrar Verification
                  </span>
                ) : (
                  <span className="font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                    {payment.status}
                  </span>
                )}
              </div>
              {payment.receiptNotes && (
                <p className="text-[11px] text-slate-500 mt-2 bg-white p-2 rounded border border-slate-200">
                  <strong>Notes: </strong>{payment.receiptNotes}
                </p>
              )}
            </div>
          </div>

          {/* Flag Issue Drawer */}
          {showFlagInput && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-amber-900">
                Specify Reason for Payment Flag / Discrepancy:
              </label>
              <textarea
                rows={2}
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                placeholder="e.g. Reference not found on bank statement, wire short by $50, or check bounced."
                className="w-full p-2 text-xs bg-white border border-amber-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowFlagInput(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-amber-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFlag}
                  className="px-3 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded"
                >
                  Submit Flag
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            {payment.status === 'Pending Verification' && !showFlagInput && (
              <>
                <button
                  onClick={() => setShowFlagInput(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  Flag Issue
                </button>
                <button
                  onClick={handleConfirmVerify}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify & Clear Payment</span>
                </button>
              </>
            )}

            {payment.status === 'Paid' && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Cleared by Treasury
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
