import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SoilAssessmentRequest } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import {
  BarChart3,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  UserCheck,
  FileText
} from 'lucide-react';

export const AdminAssessments: React.FC = () => {
  const { token } = useAuth();
  const [assessments, setAssessments] = useState<SoilAssessmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected request for editing
  const [selected, setSelected] = useState<SoilAssessmentRequest[]>([]);
  const [editingItem, setEditingItem] = useState<SoilAssessmentRequest | null>(null);

  // Edit form state
  const [formState, setFormState] = useState({
    status: 'Submitted' as any,
    assignedExpert: '',
    adminNotes: '',
    farmerVisibleNotes: '',
    expertRecommendations: ''
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchAssessments = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/assessments', {
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

  const openEditor = (item: SoilAssessmentRequest) => {
    setEditingItem(item);
    setFormState({
      status: item.status,
      assignedExpert: item.assigned_expert || '',
      adminNotes: item.admin_notes || '',
      farmerVisibleNotes: item.farmer_visible_notes || '',
      expertRecommendations: item.expert_recommendations || ''
    });
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/assessments/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Assessment updated and persisted to database!');
        await fetchAssessments();
        setEditingItem(data.assessment);
      } else {
        setFeedback(data.error || 'Failed to update assessment');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = assessments.filter(a => {
    const matchesSearch =
      a.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.farm_location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Soil & Farm Assessment Management
        </h1>
        <p className="text-xs text-slate-600">
          Review soil health cards, assign certified KVK agronomists, and author verified regenerative guidance.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, farmer name, or location..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Expert Review Required">Expert Review Required</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Location & Area</th>
                <th className="py-3 px-4">Assigned Expert</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.farmer_name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{item.farm_location}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.farm_area}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.assigned_expert ? (
                        <span className="font-medium text-emerald-800">{item.assigned_expert}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <DemoBadge isDemo={item.is_demo} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditor(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-colors"
                      >
                        Review & Sign-off
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No soil assessment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Review Assessment: {editingItem.id}
                  </h3>
                  <DemoBadge isDemo={editingItem.is_demo} />
                </div>
                <div className="text-xs text-slate-500">
                  Farmer: <strong className="text-slate-800">{editingItem.farmer_name}</strong> • {editingItem.farm_location}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assessment Status *</label>
                <select
                  value={formState.status}
                  onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Expert Review Required">Expert Review Required</option>
                  <option value="Reviewed">Reviewed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assigned Agronomist / Expert</label>
                <input
                  type="text"
                  value={formState.assignedExpert}
                  onChange={e => setFormState({ ...formState, assignedExpert: e.target.value })}
                  placeholder="e.g. Dr. K. S. Murthy (ICAR-KVK Agronomist)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Internal Admin Notes (Private)</label>
              <textarea
                rows={2}
                value={formState.adminNotes}
                onChange={e => setFormState({ ...formState, adminNotes: e.target.value })}
                placeholder="Laboratory sample reference, core depth, internal verification notes..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-emerald-900">
                Shared Note for Farmer (Visible in Farmer Dashboard)
              </label>
              <textarea
                rows={2}
                value={formState.farmerVisibleNotes}
                onChange={e => setFormState({ ...formState, farmerVisibleNotes: e.target.value })}
                placeholder="Message displayed to farmer explaining soil health and next steps..."
                className="w-full px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">
                Certified Expert Agronomic Recommendations (Signed-off)
              </label>
              <textarea
                rows={3}
                value={formState.expertRecommendations}
                onChange={e => setFormState({ ...formState, expertRecommendations: e.target.value })}
                placeholder="1. Practice: Summer cover cropping with Dhaincha... 2. Legume intercrop..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Assessment Updates'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
