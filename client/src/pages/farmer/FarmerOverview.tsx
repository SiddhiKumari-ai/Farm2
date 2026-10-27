import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile, SoilAssessmentRequest, EquipmentRequest, CarbonProgrammeProject } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Sprout,
  BarChart3,
  Wrench,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const FarmerOverview: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile, token } = useAuth();
  const farmer = profile as FarmerProfile;

  const [assessments, setAssessments] = useState<SoilAssessmentRequest[]>([]);
  const [equipment, setEquipment] = useState<EquipmentRequest[]>([]);
  const [programmes, setProgrammes] = useState<CarbonProgrammeProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch('/api/farmer/assessments', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/farmer/equipment', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/farmer/programmes', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([assData, eqData, progData]) => {
        if (Array.isArray(assData)) setAssessments(assData);
        if (Array.isArray(eqData)) setEquipment(eqData);
        if (Array.isArray(progData)) setProgrammes(progData);
      })
      .catch(err => console.error('Error fetching farmer dashboard data:', err))
      .finally(() => setLoading(false));
  }, [token]);

  // Compute profile completion percentage
  const computeCompletion = () => {
    if (!farmer) return 50;
    const fields = [
      farmer.full_name,
      farmer.phone,
      farmer.state,
      farmer.district,
      farmer.village,
      farmer.farm_area,
      farmer.primary_activity,
      farmer.current_crop,
      farmer.previous_crop,
      farmer.irrigation_source,
      farmer.farming_practices
    ];
    const filled = fields.filter(f => Boolean(f)).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPct = computeCompletion();
  const latestAssessment = assessments[0];
  const latestEquipment = equipment[0];
  const activeProgramme = programmes[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FarmSetu Farmer Coordination Hub</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">{t('welcomeBack')}, {farmer?.full_name || user?.name}!</h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Your farm profile in {farmer?.village || 'your village'}, {farmer?.district || 'district'} is linked to our agronomic desk.
            Track your soil assessment status, request machinery support, and follow your carbon transition.
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[200px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-200">Profile Completion</span>
            <span className="font-bold text-white">{completionPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <Link
            to="/farmer/my-farm"
            className="text-[11px] text-emerald-300 hover:text-white underline inline-block"
          >
            Update missing farm details &rarr;
          </Link>
        </div>
      </div>

      {/* 3 Core Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Soil Assessment Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              {latestAssessment ? (
                <StatusBadge status={latestAssessment.status} />
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Not Submitted
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">Soil & Health Assessment</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Baseline soil parameters, organic carbon (SOC), and agronomist review.
              </p>
            </div>
            {latestAssessment ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Request ID:</span>
                  <strong className="text-slate-900 font-mono">{latestAssessment.id}</strong>
                </div>
                {latestAssessment.assigned_expert && (
                  <div className="text-slate-600">
                    Expert: <span className="text-emerald-800 font-medium">{latestAssessment.assigned_expert}</span>
                  </div>
                )}
                {latestAssessment.farmer_visible_notes && (
                  <div className="text-slate-700 italic border-t border-slate-200 pt-1 text-[11px]">
                    &ldquo;{latestAssessment.farmer_visible_notes}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800">
                No active soil assessment request. Submit your report to unlock certified agronomic recommendations.
              </div>
            )}
          </div>
          <Link
            to="/farmer/crop-analytics"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>{latestAssessment ? 'View Assessment Details' : 'Submit Soil Report'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Equipment Request Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              {latestEquipment ? (
                <StatusBadge status={latestEquipment.status} />
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                  No Requests
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">{t('equipmentSupport')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero-till seed drills, residue balers, and micro-irrigation machinery.
              </p>
            </div>
            {latestEquipment ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Request ID:</span>
                  <strong className="text-slate-900 font-mono">{latestEquipment.id}</strong>
                </div>
                <div className="font-medium text-slate-800 truncate">{latestEquipment.equipment_category}</div>
                {latestEquipment.farmer_visible_notes && (
                  <div className="text-slate-700 italic border-t border-slate-200 pt-1 text-[11px]">
                    &ldquo;{latestEquipment.farmer_visible_notes}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                Request machinery from nearby Custom Hiring Centers (CHCs) for upcoming season.
              </div>
            )}
          </div>
          <Link
            to="/farmer/equipment"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>{latestEquipment ? 'Track Equipment Status' : 'Request Machinery'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carbon Programme Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              {activeProgramme ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
                  {activeProgramme.stage}
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Preliminary
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">Carbon Programme Progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                9-stage auditable timeline from registration to verified credit issuance.
              </p>
            </div>
            {activeProgramme ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-900 truncate">{activeProgramme.project_name}</div>
                <div className="text-slate-600">
                  Partner: <span className="font-medium text-slate-800">{activeProgramme.project_partner || 'FarmSetu Desk'}</span>
                </div>
                {activeProgramme.credits_confirmed_amount ? (
                  <div className="text-emerald-700 font-bold">
                    Confirmed Credits: {activeProgramme.credits_confirmed_amount} tCO2e
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">Credits subject to third-party verification</div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-teal-900">
                Your farm profile is currently undergoing preliminary eligibility screening for the next cohort.
              </div>
            )}
          </div>
          <Link
            to="/farmer/carbon-programme"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>View 9-Stage Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Farm Profile Summary Snippet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold font-serif text-slate-900 text-base">Farm Registered Parameters</h3>
          </div>
          <Link
            to="/farmer/my-farm"
            className="text-xs text-emerald-700 hover:underline font-semibold"
          >
            Edit Farm Details &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-slate-500 text-[11px]">Land Area</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              {farmer?.farm_area} {farmer?.area_unit}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-slate-500 text-[11px]">Primary Activity</div>
            <div className="font-semibold text-slate-900 mt-0.5 truncate">{farmer?.primary_activity}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-slate-500 text-[11px]">Current Crop</div>
            <div className="font-semibold text-slate-900 mt-0.5">{farmer?.current_crop || 'Not specified'}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-slate-500 text-[11px]">Irrigation Source</div>
            <div className="font-semibold text-slate-900 mt-0.5 truncate">{farmer?.irrigation_source || 'Rainfed'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
