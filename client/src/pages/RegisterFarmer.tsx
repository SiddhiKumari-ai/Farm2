import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  INDIAN_STATES_DISTRICTS,
  PRIMARY_FARMING_ACTIVITIES,
  IRRIGATION_SOURCES,
  AREA_UNITS
} from '../data/indianLocations';
import { Sprout, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterFarmer: React.FC = () => {
  const { t } = useLanguage();
  const { registerFarmer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    state: 'Jharkhand',
    district: 'Ramgarh',
    village: '',
    pincode: '',
    farmArea: '',
    areaUnit: 'acres',
    primaryActivity: PRIMARY_FARMING_ACTIVITIES[0],
    currentCrop: '',
    previousCrop: '',
    irrigationSource: IRRIGATION_SOURCES[0],
    farmingPractices: '',
    soilReportAvailable: false
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Available districts for current state
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

    if (!formData.farmArea || isNaN(parseFloat(formData.farmArea)) || parseFloat(formData.farmArea) <= 0) {
      setErrorMsg('Please specify a valid farm area greater than 0.');
      return;
    }

    setIsLoading(true);
    const result = await registerFarmer(formData);
    setIsLoading(false);

    if (result.success) {
      navigate('/farmer');
    } else {
      setErrorMsg(result.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          {t('farmerRegister')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Create your verified farm profile to request soil carbon assessments, machinery coordination, and participate in verified programmes.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-1.5">
              1. Farmer Contact & Account Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('fullName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rameshwar Patel"
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
                  placeholder="+91 94311 02938"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('email')} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rameshwar@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
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
            </div>
          </div>

          {/* Section 2: Farm Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-1.5">
              2. Geographic Location (India)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('state')} *</label>
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('district')} *</label>
                <select
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {currentDistricts.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('village')} *</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Gola Block, Barlanga"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('pincode')}</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 829110"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Farm Land & Cultivation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-1.5">
              3. Land Area & Farming Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('farmArea')} *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.farmArea}
                    onChange={e => setFormData({ ...formData, farmArea: e.target.value })}
                    placeholder="e.g. 4.5"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('areaUnit')}</label>
                  <select
                    value={formData.areaUnit}
                    onChange={e => setFormData({ ...formData, areaUnit: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {AREA_UNITS.map(u => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('primaryActivity')} *</label>
                <select
                  value={formData.primaryActivity}
                  onChange={e => setFormData({ ...formData, primaryActivity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {PRIMARY_FARMING_ACTIVITIES.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('currentCrop')}</label>
                <input
                  type="text"
                  value={formData.currentCrop}
                  onChange={e => setFormData({ ...formData, currentCrop: e.target.value })}
                  placeholder="e.g. Paddy (Rice - MTU 1010)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('previousCrop')}</label>
                <input
                  type="text"
                  value={formData.previousCrop}
                  onChange={e => setFormData({ ...formData, previousCrop: e.target.value })}
                  placeholder="e.g. Wheat / Mustard"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('irrigationSource')}</label>
                <select
                  value={formData.irrigationSource}
                  onChange={e => setFormData({ ...formData, irrigationSource: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {IRRIGATION_SOURCES.map(i => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('farmingPractices')}</label>
                <input
                  type="text"
                  value={formData.farmingPractices}
                  onChange={e => setFormData({ ...formData, farmingPractices: e.target.value })}
                  placeholder="e.g. Conventional Tillage with organic FYM"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Soil report availability checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soilReportAvailable}
                  onChange={e => setFormData({ ...formData, soilReportAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">
                  {t('soilReportAvailable')} (Soil Card / Lab report)
                </span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Already have an account?{' '}
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
                <span>Registering Farm Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
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
