import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  KeyRound, 
  Check, 
  Lock 
} from 'lucide-react';
import { DirectoryMember, MembershipTier, PaymentMethod } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMemberId: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { registerEntity } = useDirectory();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<DirectoryMember['category']>('Engineering & Tech');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [website, setWebsite] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [membershipTier, setMembershipTier] = useState<MembershipTier>('Verified Professional');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card (Stripe)');
  const [transactionReference, setTransactionReference] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(true);
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const getTierFee = (tier: MembershipTier) => {
    switch (tier) {
      case 'Standard': return 149;
      case 'Verified Professional': return 299;
      case 'Enterprise Elite': return 599;
    }
  };

  const handleNext = () => {
    const errs: { [key: string]: string } = {};
    if (step === 1) {
      if (!name.trim()) errs.name = 'Entity / Business name is required';
      if (!contactPerson.trim()) errs.contactPerson = 'Primary contact name is required';
      if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
      if (!city.trim()) errs.city = 'City is required';
      if (!state.trim()) errs.state = 'State / Region is required';
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!licenseNumber.trim()) errs.licenseNumber = 'Official state license or tax ID is required';
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newId = registerEntity({
      name,
      contactPerson,
      email,
      phone: phone || '+1 (555) 000-0000',
      category,
      description: description || 'Registered professional directory entry.',
      city,
      state,
      country: 'United States',
      website: website || `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      licenseNumber,
      membershipTier,
      annualFee: getTierFee(membershipTier),
      paymentMethod,
      transactionReference: transactionReference || `TXN_${Date.now().toString().slice(-8)}`,
      initialPassword: initialPassword || undefined,
      enable2FA,
      tags: tags.length > 0 ? tags : ['Directory Member']
    });

    onSuccess(newId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Register New Entity into Directory
            </h3>
            <p className="text-xs text-slate-500">
              Step {step} of 3: {step === 1 ? 'Entity & Contact Info' : step === 2 ? 'Official Licenses & ID' : 'Plan, Payment & Credentials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-slate-100 text-xs font-semibold">
          <div className={`py-2 text-center ${step === 1 ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>
            1. Details
          </div>
          <div className={`py-2 text-center ${step === 2 ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>
            2. Authority & License
          </div>
          <div className={`py-2 text-center ${step === 3 ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>
            3. Payment & Credentials
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entity / Business / Practice Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Cambridge Biomedical Associates"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                  />
                  {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Directory Category *
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    >
                      <option value="Healthcare & Medical">Healthcare & Medical</option>
                      <option value="Legal & Compliance">Legal & Compliance</option>
                      <option value="Engineering & Tech">Engineering & Tech</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Trade & Construction">Trade & Construction</option>
                      <option value="Education & Training">Education & Training</option>
                      <option value="Creative & Design">Creative & Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Contact Person *
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="e.g. Dr. Julian Hayes"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                    {errors.contactPerson && <p className="text-xs text-rose-600 mt-1">{errors.contactPerson}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Contact Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jhayes@domain.org"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Boston"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                    {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="MA"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                    {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://example.org"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Directory Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Briefly describe services, specialties, or operations..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-slate-800 inline mr-1" />
                  Official credentials are cross-referenced with regional licensing boards and corporate registries before final directory activation.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State License Number / Tax Identification (TIN) *
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="e.g. MED-MA-904128 or TAX-EIN-1294819"
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                  />
                  {errors.licenseNumber && <p className="text-xs text-rose-600 mt-1">{errors.licenseNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specialty Keywords / Search Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="e.g. Oncology, Outpatient Surgery, Clinical Diagnostics"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                  />
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800 block">
                    Verification Checklist for Registrar Review:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-slate-900" />
                      <span>Entity legal existence confirmed in state database</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-slate-900" />
                      <span>Contact email domain matches registered web domain</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-slate-900" />
                      <span>Agree to public directory registry code of ethics</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {/* Membership Tier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Registry Membership Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['Standard', 'Verified Professional', 'Enterprise Elite'] as MembershipTier[]).map(t => (
                      <div
                        key={t}
                        onClick={() => setMembershipTier(t)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          membershipTier === t
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold">{t}</div>
                        <div className="text-lg font-mono font-bold mt-1 tabular-nums">
                          ${getTierFee(t)}
                          <span className="text-[10px] font-normal opacity-75">/yr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Verification Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    >
                      <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
                      <option value="Direct Wire / ACH">Direct Wire / ACH</option>
                      <option value="Corporate Card">Corporate Card</option>
                      <option value="PayPal Business">PayPal Business</option>
                      <option value="Bank Transfer Receipt">Bank Transfer Receipt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Reference / Slip #
                    </label>
                    <input
                      type="text"
                      value={transactionReference}
                      onChange={e => setTransactionReference(e.target.value)}
                      placeholder="e.g. WIRE_BOS_99182 or CH_88190"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                  </div>
                </div>

                {/* ID & Password Setup */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-violet-700" />
                    <span className="text-xs font-bold text-slate-900">
                      Member Credential & Password Provisioning
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Temporary Password (Optional - system generates if blank)
                    </label>
                    <input
                      type="text"
                      value={initialPassword}
                      onChange={e => setInitialPassword(e.target.value)}
                      placeholder="Leave blank for secure auto-generated passkey"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-800"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={enable2FA}
                      onChange={e => setEnable2FA(e.target.checked)}
                      className="rounded text-slate-900"
                    />
                    <span>Enforce Two-Factor Authentication (2FA) for this member account</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step === 3 ? 2 : 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Continue to Step {step + 1}
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Submit Registration & Issue ID</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
