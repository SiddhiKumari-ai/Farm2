import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CarbonProgrammeProject, ProgrammeStage, FarmerProfile } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import {
  Award,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Clock,
  Layers,
  ShieldCheck,
  ChevronRight
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

export const AdminProgrammes: React.FC = () => {
  const { token } = useAuth();
  const [programmes, setProgrammes] = useState<CarbonProgrammeProject[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected project for stage progression
  const [selectedProj, setSelectedProj] = useState<CarbonProgrammeProject | null>(null);
  const [targetStage, setTargetStage] = useState<ProgrammeStage>('Registration');
  const [stageNotes, setStageNotes] = useState('');
  const [creditsAmount, setCreditsAmount] = useState('0');
  const [projectPartner, setProjectPartner] = useState('');

  // New project modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    farmerId: '',
    location: '',
    practiceType: 'Reduced Tillage & Cover Cropping',
    targetAcres: '',
    stage: 'Registration' as ProgrammeStage,
    projectPartner: 'ICAR-CRURRS & District Agriculture Office',
    statusNotes: 'Initial cohort enrollment.'
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [progRes, farmerRes] = await Promise.all([
        fetch('/api/admin/programmes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/farmers', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (progRes.ok) setProgrammes(await progRes.json());
      if (farmerRes.ok) {
        const fList = await farmerRes.json();
        setFarmers(fList);
        if (fList.length > 0 && !newProject.farmerId) {
          setNewProject(prev => ({ ...prev, farmerId: fList[0].user_id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const openStageEditor = (proj: CarbonProgrammeProject) => {
    setSelectedProj(proj);
    setTargetStage(proj.stage);
    setStageNotes('');
    setCreditsAmount(proj.credits_confirmed_amount ? proj.credits_confirmed_amount.toString() : '0');
    setProjectPartner(proj.project_partner || '');
    setFeedback(null);
  };

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/programmes/${selectedProj.id}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stage: targetStage,
          notes: stageNotes,
          creditsConfirmedAmount: parseFloat(creditsAmount) || 0,
          projectPartner
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(`Project stage advanced to "${targetStage}" and saved to database!`);
        await fetchData();
        setSelectedProj(data.project);
      } else {
        setFeedback(data.error || 'Failed to update stage');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/programmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreateModal(false);
        await fetchData();
        setFeedback('New carbon programme record created and assigned to farmer!');
      } else {
        setFeedback(data.error || 'Failed to create programme');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = programmes.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    p.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Carbon Programme Project Operations
          </h1>
          <p className="text-xs text-slate-600">
            Control the 9-stage auditable carbon-farming journey for enrolled farmers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreateModal(true);
            setFeedback(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Carbon Project Record</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Project ID & Title</th>
                <th className="py-3 px-4">Farmer Beneficiary</th>
                <th className="py-3 px-4">Practice Type</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Confirmed Credits</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(proj => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{proj.project_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{proj.id}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{proj.farmer_name}</div>
                      <div className="text-[11px] text-slate-500">{proj.location}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{proj.practice_type}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {proj.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {proj.credits_confirmed_amount
                        ? `${proj.credits_confirmed_amount} tCO2e`
                        : '0 (Pending)'}
                    </td>
                    <td className="py-3 px-4">
                      <DemoBadge isDemo={proj.is_demo} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openStageEditor(proj)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-xs border border-teal-200 transition-colors"
                      >
                        Advance Stage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No carbon programmes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage Progression Modal */}
      {selectedProj && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleUpdateStage}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Advance Programme Stage: {selectedProj.id}
                  </h3>
                  <DemoBadge isDemo={selectedProj.is_demo} />
                </div>
                <div className="text-xs text-slate-500">
                  Beneficiary Farmer: <strong className="text-slate-800">{selectedProj.farmer_name}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProj(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div><strong>Project:</strong> {selectedProj.project_name}</div>
              <div><strong>Current Active Stage:</strong> <span className="font-bold text-teal-800">{selectedProj.stage}</span></div>
              <div><strong>Target Practice:</strong> {selectedProj.practice_type} ({selectedProj.target_acres} acres)</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Advance to Stage *</label>
                <select
                  value={targetStage}
                  onChange={e => setTargetStage(e.target.value as ProgrammeStage)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  {ALL_STAGES.map((s, idx) => (
                    <option key={s} value={s}>
                      {idx + 1}. {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Partner / Registry</label>
                <input
                  type="text"
                  value={projectPartner}
                  onChange={e => setProjectPartner(e.target.value)}
                  placeholder="e.g. ICAR-CRURRS & Gold Standard Aggregator"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {targetStage === 'Credits Issued' && (
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Credit Issuance Confirmed Record</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Only enter confirmed credits if authorized third-party verification documents have been received.
                </p>
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-950">Confirmed Issued Volume (tCO2e):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={creditsAmount}
                    onChange={e => setCreditsAmount(e.target.value)}
                    className="w-full sm:w-48 px-3 py-1.5 rounded-lg border border-emerald-300 font-bold text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Stage Milestone Audit Note *</label>
              <textarea
                rows={3}
                required
                value={stageNotes}
                onChange={e => setStageNotes(e.target.value)}
                placeholder="e.g. Completed zero-tillage field demonstration workshop; baseline soil sampling core logs submitted to registry..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              />
            </div>

            {/* Stage History Timeline in Modal */}
            {selectedProj.history && selectedProj.history.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Stage Audit Trail:</span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {selectedProj.history.map(h => (
                    <div key={h.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{h.stage}</span>
                        <span className="font-mono text-slate-500 font-normal">
                          {new Date(h.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {h.notes && <p className="text-slate-600 mt-0.5">{h.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedProj(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Recording Stage...' : 'Commit Stage Update'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateProject}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Enroll Farmer in Carbon Programme Project
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Cohort Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.projectName}
                  onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
                  placeholder="e.g. Chotanagpur Regenerative Agriculture Cohort 2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Select Beneficiary Farmer *</label>
                <select
                  value={newProject.farmerId}
                  onChange={e => setNewProject({ ...newProject, farmerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {farmers.map(f => (
                    <option key={f.user_id} value={f.user_id}>
                      {f.full_name} ({f.village}, {f.district} - {f.farm_area} {f.area_unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Practice Type</label>
                  <input
                    type="text"
                    value={newProject.practiceType}
                    onChange={e => setNewProject({ ...newProject, practiceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Stage</label>
                  <select
                    value={newProject.stage}
                    onChange={e => setNewProject({ ...newProject, stage: e.target.value as ProgrammeStage })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    {ALL_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Initial Project Notes</label>
                <textarea
                  rows={2}
                  value={newProject.statusNotes}
                  onChange={e => setNewProject({ ...newProject, statusNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                {saving ? 'Creating...' : 'Enroll in Programme'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
