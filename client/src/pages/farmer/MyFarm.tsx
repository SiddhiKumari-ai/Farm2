import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile } from '../../types';
import {
  INDIAN_STATES_DISTRICTS,
  PRIMARY_FARMING_ACTIVITIES,
  IRRIGATION_SOURCES,
  AREA_UNITS
} from '../../data/indianLocations';
import { Sprout, Edit3, Save, CheckCircle2, AlertCircle, MapPin, X } from 'lucide-react';

export const MyFarm: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token, refreshProfile } = useAuth();
  const farmer = profile as FarmerProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    village: farmer?.village || '',
    district: farmer?.district || '',
    state: farmer?.state || 'Jharkhand',
    pincode: farmer?.pincode || '',
    farmArea: farmer?.farm_area || 0,
    areaUnit: farmer?.area_unit || 'acres',
    primaryActivity: farmer?.primary_activity || PRIMARY_FARMING_ACTIVITIES[0],
    currentCrop: farmer?.current_crop || '',
    previousCrop: farmer?.previous_crop || '',
    irrigationSource: farmer?.irrigation_source || IRRIGATION_SOURCES[0],
    farmingPractices: farmer?.farming_practices || '',
    soilReportAvailable: Boolean(farmer?.soil_report_available)
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/farmer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Farm profile updated and persisted to database successfully!');
        setIsEditing(false);
        await refreshProfile();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to update farm profile');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Network error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">{t('myFarm')} Profile</h2>
          <p className="text-xs text-slate-600">
            Maintain your plot boundaries, crop history, and irrigation infrastructure.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 self-start"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Farm Details</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      {status === 'success' && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {!isEditing ? (
        /* Read-only view */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Farmer Full Name</span>
              <p className="text-slate-900 font-bold text-sm">{farmer?.full_name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Phone Number</span>
              <p className="text-slate-900 font-semibold">{farmer?.phone || 'Not provided'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Profile Review Status</span>
              <div>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {farmer?.profile_status || 'Profile Submitted'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Location</span>
              <p className="text-slate-900 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {farmer?.village}, {farmer?.district}, {farmer?.state} (PIN: {farmer?.pincode || 'N/A'})
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Total Cultivated Area</span>
              <p className="text-slate-900 font-bold text-sm text-emerald-800">
                {farmer?.farm_area} {farmer?.area_unit}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Primary Farming Activity</span>
              <p className="text-slate-900 font-semibold">{farmer?.primary_activity}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Current Season Crop</span>
              <p className="text-slate-900 font-semibold">{farmer?.current_crop || 'Not specified'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Previous Season Crop</span>
              <p className="text-slate-900 font-semibold">{farmer?.previous_crop || 'Not specified'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Irrigation Source</span>
              <p className="text-slate-900 font-semibold">{farmer?.irrigation_source || 'Rainfed'}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <span className="text-slate-500 font-medium">Existing Farming Practices & Soil Management</span>
            <p className="text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
              {farmer?.farming_practices || 'No specific practices entered yet.'}
            </p>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-bold font-serif text-slate-900 border-b border-slate-100 pb-2">
            Edit Permitted Farm Records
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('district')}</label>
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('farmArea')} *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.farmArea}
                  onChange={e => setFormData({ ...formData, farmArea: parseFloat(e.target.value) || 0 })}
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
              <label className="text-xs font-semibold text-slate-700">{t('primaryActivity')}</label>
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('previousCrop')}</label>
              <input
                type="text"
                value={formData.previousCrop}
                onChange={e => setFormData({ ...formData, previousCrop: e.target.value })}
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
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">{t('farmingPractices')}</label>
            <textarea
              rows={2}
              value={formData.farmingPractices}
              onChange={e => setFormData({ ...formData, farmingPractices: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{status === 'loading' ? 'Saving to Database...' : t('saveChanges')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
