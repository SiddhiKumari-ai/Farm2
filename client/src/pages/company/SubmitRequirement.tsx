import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile } from '../../types';
import { Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const PROJECT_TYPES = [
  'Soil Organic Carbon (SOC) Sequestration',
  'Regenerative Agriculture Carbon Programme (Mixed Practices)',
  'Residue Management & Biochar (Zero-Burning)',
  'Agroforestry & Tree Canopy Transition',
  'Methane Reduction in Direct Seeded Rice (DSR / AWD)'
];

export const SubmitRequirement: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token } = useAuth();
  const company = profile as CompanyProfile;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectType: PROJECT_TYPES[0],
    preferredRegion: 'Jharkhand, Bihar & Eastern UP',
    requiredCharacteristics: 'Smallholder aggregation (1-5 acres), verified baseline soil testing, digital MRV tracking',
    requestedQuantity: '5,000 tCO2e / yr',
    indicativeTimeline: 'Q3 2026 - Q2 2027',
    additionalRequirements: 'Must comply with Verra VM0042 or Gold Standard frameworks. Direct benefit transfer to farmer bank accounts required.',
    phone: company?.phone || ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/company/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          navigate('/company/inquiries');
        }, 1200);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit inquiry');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Network error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Submit Buyer Carbon Requirement
          </h2>
          <p className="text-xs text-slate-600">
            Log your organization&apos;s carbon credit volume, standard, and regional aggregation preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/company')}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {status === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Buyer requirement inquiry registered successfully! Redirecting to your inquiries...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('companyName')}</label>
              <input
                type="text"
                disabled
                value={company?.company_name || 'Organization on file'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('contactPerson')}</label>
              <input
                type="text"
                disabled
                value={company?.contact_person || 'Contact on file'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('businessEmail')}</label>
              <input
                type="email"
                disabled
                value={company?.business_email || 'Email on file'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('phone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-2" />

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('projectType')} *</label>
              <select
                value={formData.projectType}
                onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {PROJECT_TYPES.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('preferredRegion')} *</label>
                <input
                  type="text"
                  required
                  value={formData.preferredRegion}
                  onChange={e => setFormData({ ...formData, preferredRegion: e.target.value })}
                  placeholder="e.g. Jharkhand, Punjab, Eastern UP"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('requestedQuantity')}</label>
                <input
                  type="text"
                  value={formData.requestedQuantity}
                  onChange={e => setFormData({ ...formData, requestedQuantity: e.target.value })}
                  placeholder="e.g. 5,000 tCO2e / yr (indicative)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('indicativeTimeline')}</label>
              <input
                type="text"
                value={formData.indicativeTimeline}
                onChange={e => setFormData({ ...formData, indicativeTimeline: e.target.value })}
                placeholder="e.g. Q3 2026 - Q2 2027 Crop Cycles"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('requiredCharacteristics')} *</label>
              <textarea
                rows={2}
                required
                value={formData.requiredCharacteristics}
                onChange={e => setFormData({ ...formData, requiredCharacteristics: e.target.value })}
                placeholder="e.g. Verra VM0042 methodology, digital remote sensing MRV, direct benefit sharing"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t('additionalRequirements')}</label>
              <textarea
                rows={2}
                value={formData.additionalRequirements}
                onChange={e => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="e.g. Social co-benefits for smallholders, gender inclusion, water conservation audits"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'loading' ? 'Saving Inquiry...' : 'Submit Buyer Requirement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
