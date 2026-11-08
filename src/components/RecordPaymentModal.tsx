import React, { useState } from 'react';
import { X, CreditCard, Check, DollarSign } from 'lucide-react';
import { PaymentMethod } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose
}) => {
  const { members, recordDirectPayment } = useDirectory();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [amount, setAmount] = useState<number>(299);
  const [method, setMethod] = useState<PaymentMethod>('Direct Wire / ACH');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    recordDirectPayment(
      selectedMemberId,
      amount,
      method,
      reference || `MANUAL-${Date.now().toString().slice(-6)}`
    );
    onClose();
  };

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Record Direct / Offline Payment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Directory Member / Entity
              </label>
              <select
                value={selectedMemberId}
                onChange={e => {
                  setSelectedMemberId(e.target.value);
                  const mem = members.find(m => m.id === e.target.value);
                  if (mem) setAmount(mem.annualFee);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.directoryId}) - ${m.annualFee}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount ($ USD)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                >
                  <option value="Direct Wire / ACH">Direct Wire / ACH</option>
                  <option value="Bank Transfer Receipt">Bank Transfer Receipt</option>
                  <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
                  <option value="Corporate Card">Corporate Card</option>
                  <option value="PayPal Business">PayPal Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Reference / Check #
              </label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="e.g. WIRE-FED-99410 or CHK-3041"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Treasury Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Bank slip verified on corporate ledger statement"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Record & Clear Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
