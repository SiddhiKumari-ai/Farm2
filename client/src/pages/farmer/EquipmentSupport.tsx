import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile, EquipmentRequest } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import {
  Wrench,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  MapPin,
  Info
} from 'lucide-react';

const EQUIPMENT_CATEGORIES = [
  'Zero-till / Reduced Tillage Seed Drill (Happy Seeder / DSR)',
  'Residue Management Equipment (Straw Chopper / Mulcher / Baler)',
  'Irrigation & Moisture Retention (Solar Micro-Drip / Sprinklers)',
  'Laser Land Leveler (Precision Grading)',
  'Other Sustainable Farming Tool'
];

export const EquipmentSupport: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token } = useAuth();
  const farmer = profile as FarmerProfile;

  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    equipmentCategory: EQUIPMENT_CATEGORIES[0],
    intendedPractice: 'Direct Seeded Rice (DSR) & Zero-till Wheat sowing to avoid residue burning',
    requiredPeriod: 'Upcoming Sowing Window (15 Days)',
    additionalDetails: '',
    farmLocation: farmer ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : '',
    farmArea: farmer ? `${farmer.farm_area} ${farmer.area_unit}` : ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEquipmentRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/farmer/equipment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentRequests();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/farmer/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Equipment requisition logged successfully! Tracking ID: ${data.request.id}`
        });
        setShowModal(false);
        setFormData({
          equipmentCategory: EQUIPMENT_CATEGORIES[0],
          intendedPractice: '',
          requiredPeriod: 'Upcoming Sowing Window (15 Days)',
          additionalDetails: '',
          farmLocation: farmer ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : '',
          farmArea: farmer ? `${farmer.farm_area} ${farmer.area_unit}` : ''
        });
        await fetchEquipmentRequests();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit requisition' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">{t('equipmentSupport')}</h2>
          <p className="text-xs text-slate-600">
            Mechanization support for zero-tillage, residue conservation, and micro-irrigation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 self-start"
        >
          <Wrench className="w-4 h-4" />
          <span>Request Equipment Support</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Requisition Modal / Form Drawer */}
      {showModal && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-amber-500 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Submit Machinery Requisition</span>
            </h3>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
              Local CHC Network Coordination
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Equipment Category *</label>
              <select
                value={formData.equipmentCategory}
                onChange={e => setFormData({ ...formData, equipmentCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {EQUIPMENT_CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Required Date / Operating Window *</label>
              <input
                type="text"
                required
                value={formData.requiredPeriod}
                onChange={e => setFormData({ ...formData, requiredPeriod: e.target.value })}
                placeholder="e.g. Next Rabi Season (Nov 15 - Nov 30)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
              </input>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Intended Farming Practice & Target Field *</label>
              <input
                type="text"
                required
                value={formData.intendedPractice}
                onChange={e => setFormData({ ...formData, intendedPractice: e.target.value })}
                placeholder="e.g. Zero-till wheat drilling into standing rice residue without burning"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Farm Location</label>
              <input
                type="text"
                value={formData.farmLocation}
                onChange={e => setFormData({ ...formData, farmLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Area Requiring Mechanization</label>
              <input
                type="text"
                value={formData.farmArea}
                onChange={e => setFormData({ ...formData, farmArea: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700">Additional Details / Custom Specifications</label>
            <textarea
              rows={2}
              value={formData.additionalDetails}
              onChange={e => setFormData({ ...formData, additionalDetails: e.target.value })}
              placeholder="e.g. Tractor with 50+ HP required, need skilled operator..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              {submitting ? 'Registering...' : 'Submit Equipment Request'}
            </button>
          </div>
        </form>
      )}

      {/* Active Equipment Requests List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900">Your Equipment Requisitions</h3>
            <p className="text-xs text-slate-500">
              Live status tracking: Requested &rarr; Reviewing &rarr; Partner Search &rarr; Arranged / Unavailable.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 font-mono">
            {requests.length} Request{requests.length === 1 ? '' : 's'}
          </span>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-50/80 border border-slate-200/80 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{req.id}</span>
                    <DemoBadge isDemo={req.is_demo} />
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Category:</span>
                    <strong className="text-slate-900">{req.equipment_category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Practice:</span>
                    <span>{req.intended_practice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Target Period:</span>
                    <span>{req.required_period}</span>
                  </div>
                </div>

                {/* Farmer-visible Admin Note */}
                {req.farmer_visible_notes && (
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-0.5">
                    <div className="font-bold text-[11px] text-amber-950 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>CHC Desk Update:</span>
                    </div>
                    <p className="italic leading-relaxed">{req.farmer_visible_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 space-y-2">
            <p>You haven&apos;t submitted any equipment support requests yet.</p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700"
            >
              Submit First Request
            </button>
          </div>
        )}
      </div>

      {/* Informational Machinery Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-slate-900">
            Regenerative Machinery Catalog (Educational Overview)
          </h3>
          <span className="text-[10px] text-slate-500">Non-binding illustrative specifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <div className="font-bold font-serif text-slate-900 text-sm">
              Happy Seeder / Turbo Seeder
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Tractor-mounted zero-till implement that cuts standing rice straw, deposits seed in the soil furrow, and spreads the chopped straw as surface mulch.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
              <strong>Best suited for:</strong> Combined harvested paddy fields prior to wheat or mustard sowing.
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <div className="font-bold font-serif text-slate-900 text-sm">
              Direct Seeded Rice (DSR) Multi-Crop Drill
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Sows un-puddled paddy seeds at precise depth with inverted-T openers and optional Sesbania co-metering box.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
              <strong>Best suited for:</strong> Medium to well-drained soils with access to early pre-emergence weed control.
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <div className="font-bold font-serif text-slate-900 text-sm">
              Micro-Drip & Mulch Film Layer
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Combined bed former, drip lateral dispenser, and organic/biodegradable mulch layer for dryland millet and horticulture.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
              <strong>Best suited for:</strong> Water-scarce plateau zones and undulating terrains.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
