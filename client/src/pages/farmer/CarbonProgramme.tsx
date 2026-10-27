import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CarbonProgrammeProject, ProgrammeStage } from '../../types';
import { DemoBadge } from '../../components/StatusBadge';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

const ALL_STAGES: ProgrammeStage[] = [
  'Registration',
  'Farm Information Submitted',
  'Preliminary Assessment',
  'Eligibility Review',
  'Programme/Partner Coordination',
  'Practice Adoption and Training',
  'Monitoring',
  'Verification Pending',
  'Credits Issued'
];

export const CarbonProgramme: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token } = useAuth();
  const [programmes, setProgrammes] = useState<CarbonProgrammeProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/farmer/programmes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProgrammes(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const activeProject = programmes[0];

  const getStageIndex = (stage: ProgrammeStage) => {
    return ALL_STAGES.indexOf(stage);
  };

  const currentStageIndex = activeProject ? getStageIndex(activeProject.stage) : 1;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-serif text-slate-900">
          Carbon Farming Programme Tracking
        </h2>
        <p className="text-xs text-slate-600">
          End-to-end auditable roadmap from baseline soil characterization to verified credit issuance.
        </p>
      </div>

      {/* Transparency Banner */}
      <div className="p-4 rounded-2xl bg-teal-900 text-teal-50 border border-teal-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-teal-200 uppercase tracking-wide text-[11px]">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Carbon Eligibility & Verification Protocol Notice</span>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed">
          Participation in agricultural carbon initiatives does not guarantee immediate credit issuance.
          Credits require multi-season practice permanence, third-party remote sensing MRV, and independent registry audit.
          Stages are managed and verified through the FarmSetu Operations Desk.
        </p>
      </div>

      {activeProject ? (
        <div className="space-y-6">
          {/* Project Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-serif text-slate-900">{activeProject.project_name}</h3>
                  <DemoBadge isDemo={activeProject.is_demo} />
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Project ID: {activeProject.id}</div>
              </div>

              <div className="text-xs px-3 py-1.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-200 self-start">
                Current Stage: {activeProject.stage}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Target Practice</span>
                <strong className="text-slate-900 mt-0.5 block">{activeProject.practice_type}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Technical Partner</span>
                <strong className="text-slate-900 mt-0.5 block">
                  {activeProject.project_partner || 'FarmSetu Agronomy Network'}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Confirmed Credits Issued</span>
                <strong className="text-emerald-700 text-sm mt-0.5 block">
                  {activeProject.credits_confirmed_amount
                    ? `${activeProject.credits_confirmed_amount} tCO2e`
                    : 'Pending Post-Audit Verification'}
                </strong>
              </div>
            </div>

            {activeProject.status_notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 block">Latest Coordination Note:</span>
                <p className="leading-relaxed text-slate-700">{activeProject.status_notes}</p>
              </div>
            )}
          </div>

          {/* 9-Stage Stepper Component */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h4 className="text-sm font-bold font-serif text-slate-900 uppercase tracking-wider">
              Project Milestones (Stage {currentStageIndex + 1} of {ALL_STAGES.length})
            </h4>

            <div className="space-y-4">
              {ALL_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                const historyItem = activeProject.history?.find(h => h.stage === stage);

                return (
                  <div key={stage} className="flex items-start gap-4 text-xs relative">
                    {/* Stepper icon & vertical connector line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono transition-all z-10 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-teal-600 text-white ring-4 ring-teal-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      {idx < ALL_STAGES.length - 1 && (
                        <div
                          className={`w-0.5 h-12 my-1 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step details */}
                    <div
                      className={`flex-1 p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-teal-50/60 border-teal-300 shadow-2xs'
                          : isCompleted
                          ? 'bg-white border-slate-200'
                          : 'bg-slate-50/50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span
                          className={`font-bold font-serif text-sm ${
                            isCurrent
                              ? 'text-teal-950 font-bold'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-500'
                          }`}
                        >
                          {stage}
                        </span>

                        {historyItem && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(historyItem.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {historyItem?.notes ? (
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                          {historyItem.notes}
                        </p>
                      ) : (
                        isCurrent && (
                          <p className="text-teal-800 text-[11px] mt-1 italic">
                            Currently active milestone under supervision of FarmSetu agronomy team.
                          </p>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold font-serif text-slate-900">
            No Carbon Project Assigned Yet
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your farm profile and soil health parameters are currently in the queue for aggregation into our next regional regenerative agriculture pilot cohort.
          </p>
        </div>
      )}
    </div>
  );
};
