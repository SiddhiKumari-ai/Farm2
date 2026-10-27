import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile, SoilAssessmentRequest } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import {
  BarChart3,
  FileCheck2,
  AlertTriangle,
  Send,
  CheckCircle2,
  Leaf,
  Droplets,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const CropAnalytics: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token } = useAuth();
  const farmer = profile as FarmerProfile;

  const [assessments, setAssessments] = useState<SoilAssessmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form to submit new soil assessment request
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [soilType, setSoilType] = useState('Sandy Loam / Alluvial');
  const [requestNotes, setRequestNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAssessments = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/farmer/assessments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [token]);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/farmer/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          soilType,
          notes: requestNotes,
          existingReportFilename: farmer.soil_report_available ? 'soil_test_sample.pdf' : null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Soil assessment request submitted! Unique ID: ' + data.request.id });
        setShowRequestForm(false);
        setRequestNotes('');
        await fetchAssessments();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit assessment request' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const activeAssessment = assessments[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">{t('cropAnalytics')} & Soil Intelligence</h2>
          <p className="text-xs text-slate-600">
            Soil health parameters, certified agronomist review, and agro-climatic crop guidance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{showRequestForm ? 'Close Form' : 'Request Soil Health Review'}</span>
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
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* New Request Modal / Card */}
      {showRequestForm && (
        <form
          onSubmit={handleCreateAssessment}
          className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold font-serif text-slate-900">
              Submit Farm Soil Assessment Requisition
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Direct Database Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Observed Soil Texture / Type</label>
              <select
                value={soilType}
                onChange={e => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Sandy Loam / Alluvial">Sandy Loam / Alluvial (बलुई दोमट)</option>
                <option value="Clay Loam / Heavy Alluvial">Clay Loam (चिकनी दोमट)</option>
                <option value="Red / Lateritic Sandy Soil">Red / Lateritic Soil (लाल मिट्टी)</option>
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (काली मिट्टी)</option>
                <option value="Saline / Alkaline Problem Soil">Saline / Alkaline Problem Soil</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Farm Location & Area Confirmation</label>
              <input
                type="text"
                disabled
                value={`${farmer?.village || 'Local'}, ${farmer?.district || 'District'} • ${farmer?.farm_area || 0} ${farmer?.area_unit || 'acres'}`}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700">Notes / Objectives for Soil Test</label>
            <textarea
              rows={3}
              value={requestNotes}
              onChange={e => setRequestNotes(e.target.value)}
              placeholder="e.g. Assessing organic carbon baseline before transitioning to reduced-tillage and green manure..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              {submitting ? 'Registering...' : 'Submit Assessment Request'}
            </button>
          </div>
        </form>
      )}

      {/* Farm Information Summary: Known Inputs & Missing Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-700" />
          <span>Farm Baseline Diagnostics</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Location & Zone</span>
            <strong className="text-slate-900 mt-0.5 block">{farmer?.district}, {farmer?.state}</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Current Season Crop</span>
            <strong className="text-slate-900 mt-0.5 block">{farmer?.current_crop || 'Pending input'}</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Water Availability</span>
            <strong className="text-slate-900 mt-0.5 block">{farmer?.irrigation_source || 'Rainfed'}</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Soil Baseline Report</span>
            <strong className="text-slate-900 mt-0.5 block">
              {farmer?.soil_report_available ? 'Card On File' : 'Baseline Required'}
            </strong>
          </div>
        </div>
      </div>

      {/* Soil Health Status & Expert Review Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-700" />
              <span>Soil Health Review Status</span>
            </h3>
            <p className="text-xs text-slate-500">Official review records assigned to certified agronomy partners.</p>
          </div>
          {activeAssessment ? (
            <div className="flex items-center gap-2">
              <DemoBadge isDemo={activeAssessment.is_demo} />
              <StatusBadge status={activeAssessment.status} />
            </div>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Not Submitted
            </span>
          )}
        </div>

        {activeAssessment ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <span className="text-slate-500 text-[11px]">Request Identifier</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{activeAssessment.id}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Assigned Agronomist</span>
                <p className="font-semibold text-emerald-900 mt-0.5">
                  {activeAssessment.assigned_expert || 'Awaiting Agronomist Assignment'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Soil Texture Category</span>
                <p className="font-semibold text-slate-900 mt-0.5">{activeAssessment.soil_type}</p>
              </div>
            </div>

            {/* Agronomist Shared Notes */}
            {activeAssessment.farmer_visible_notes ? (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Agronomist Feedback:</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  {activeAssessment.farmer_visible_notes}
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Assessment Pending:</strong> Your soil report has been registered and is queued for KVK/agronomy desk review.
                  Personalized recommendations will appear here once verified.
                </span>
              </div>
            )}

            {/* Expert Recommendations if reviewed */}
            {activeAssessment.expert_recommendations && (
              <div className="p-4 rounded-xl bg-white border border-emerald-300 shadow-2xs space-y-2">
                <div className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                  Verified Agronomic Recommendations:
                </div>
                <pre className="text-xs text-slate-800 whitespace-pre-line font-sans leading-relaxed">
                  {activeAssessment.expert_recommendations}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No soil assessment has been requested yet. Submit your baseline parameters to receive personalized agronomy guidance.
            </p>
            <button
              type="button"
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
            >
              Submit First Soil Assessment Request
            </button>
          </div>
        )}
      </div>

      {/* Illustrative Crop & Practice Guidance */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900">
              Regional Crop Options & Sustainable Practice Reference
            </h3>
            <p className="text-xs text-slate-500">Agro-climatically suitable options for {farmer?.district || 'Eastern Plateau'} zone.</p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold self-start">
            <Info className="w-3 h-3 text-amber-700" />
            <span>{t('sampleNotice')}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Kharif / Rainy Season
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Example Guide</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Direct Seeded Rice (DSR) + Sesbania Brown Manuring
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Co-sowing Dhaincha alongside short/medium paddy. Knocked down with 2,4-D at 25-30 days to form in-situ soil mulch.
              </p>
              <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                <div>• <strong>Water Saving:</strong> 25-30% vs flooded puddling</div>
                <div>• <strong>Soil Carbon Addition:</strong> 0.8 - 1.2 t dry biomass/acre</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100">
              Illustrative Example — Subject to Soil Test Review
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                  Rabi / Winter Season
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Example Guide</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Zero-Tillage Wheat into Standing Paddy Stubble
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Direct drilling wheat with a Happy Seeder directly into residual stubble, completely eliminating crop burning.
              </p>
              <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                <div>• <strong>Diesel Saving:</strong> ₹1,500 - ₹2,000 / acre in field prep</div>
                <div>• <strong>Moisture Retention:</strong> Stubble mulch buffers against terminal heat</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100">
              Illustrative Example — Subject to Soil Test Review
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                  Zaid / Summer Catch Crop
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Example Guide</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Short-Duration Moong (Green Gram - 60 Days)
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Summer legume crop fixing atmospheric nitrogen in root nodules, improving soil organic matter prior to Kharif paddy.
              </p>
              <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                <div>• <strong>Nitrogen Fixation:</strong> ~30-40 kg N/ha credit</div>
                <div>• <strong>Cash Income:</strong> Valuable pulse grain harvest</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100">
              Illustrative Example — Subject to Soil Test Review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
