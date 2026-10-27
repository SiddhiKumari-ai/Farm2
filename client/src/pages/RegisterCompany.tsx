import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES_DISTRICTS } from '../data/indianLocations';
import { Building, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterCompany: React.FC = () => {
  const { t } = useLanguage();
  const { registerCompany } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    businessEmail: '',
    phone: '',
    companyType: 'Corporate ESG Buyer / Sustainability Aggregator',
    password: '',
    website: '',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    areaOfInterest: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentDistricts =
    INDIAN_STATES_DISTRICTS.find(s => s.state === formData.state)?.districts || [];

  const handleStateChange = (newState: string) => {
    const dists = INDIAN_STATES_DISTRICTS.find(s => s.state === newState)?.districts || [];
    setFormData({
      ...formData,
      state: newState,
      district: dists[0] || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const result = await registerCompany(formData);
    setIsLoading(false);

    if (result.success) {
      navigate('/company');
    } else {
      setErrorMsg(result.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Building className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          {t('companyRegister')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Register your corporate entity or fund to submit carbon credit purchase requirements and review regional agricultural clusters.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('companyName')} *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. EcoRoots AgriVentures Pvt Ltd"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('contactPerson')} *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Vikramaditya Rao"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('businessEmail')} *</label>
              <input
                type="email"
                required
                value={formData.businessEmail}
                onChange={e => setFormData({ ...formData, businessEmail: e.target.value })}
                placeholder="procurement@company.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('phone')} *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 99001 88223"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('companyType')} *</label>
              <select
                value={formData.companyType}
                onChange={e => setFormData({ ...formData, companyType: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Corporate ESG Buyer / Sustainability Aggregator">Corporate ESG Buyer / Sustainability Aggregator</option>
                <option value="Institutional Climate Impact Fund">Institutional Climate Impact Fund</option>
                <option value="Agri-Food Processing / Supply Chain Enterprise">Agri-Food Processing / Supply Chain Enterprise</option>
                <option value="Carbon Project Developer / Technical Partner">Carbon Project Developer / Technical Partner</option>
                <option value="Research & NGO Partner">Research & NGO Partner</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('password')} *</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('website')}</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.example.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('state')}</label>
              <select
                value={formData.state}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {INDIAN_STATES_DISTRICTS.map(s => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">{t('areaOfInterest')}</label>
            <textarea
              rows={2}
              value={formData.areaOfInterest}
              onChange={e => setFormData({ ...formData, areaOfInterest: e.target.value })}
              placeholder="e.g. Seeking high-integrity soil carbon sequestration credits from smallholder paddy-wheat clusters with direct farmer payments"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
                {t('login')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Registering Entity...</span>
              ) : (
                <>
                  <span>Create Buyer Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
