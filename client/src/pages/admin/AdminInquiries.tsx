import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BuyerInquiry } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import { FileText, Search, Filter, Save, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [editingItem, setEditingItem] = useState<BuyerInquiry | null>(null);
  const [formState, setFormState] = useState({
    status: 'Submitted' as any,
    internalNotes: '',
    companyVisibleNotes: '',
    potentialMatches: ''
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchInquiries = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  const openEditor = (item: BuyerInquiry) => {
    setEditingItem(item);
    setFormState({
      status: item.status,
      internalNotes: item.internal_notes || '',
      companyVisibleNotes: item.company_visible_notes || '',
      potentialMatches: item.potential_matches || ''
    });
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Buyer inquiry updated and synchronized with corporate dashboard!');
        await fetchInquiries();
        setEditingItem(data.inquiry);
      } else {
        setFeedback(data.error || 'Failed to update inquiry');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = inquiries.filter(i => {
    const matchesSearch =
      i.company_name.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.project_type.toLowerCase().includes(search.toLowerCase()) ||
      i.preferred_region.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Buyer Inquiries & Demand Pipeline</h1>
        <p className="text-xs text-slate-600">
          Match corporate offtaker demand with aggregated smallholder carbon farming cohorts.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, company, project type, or region..."
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
            <option value="More Information Required">More Information Required</option>
            <option value="Potential Match Under Review">Potential Match Under Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Inquiry ID</th>
                <th className="py-3 px-4">Company Entity</th>
                <th className="py-3 px-4">Project Focus</th>
                <th className="py-3 px-4">Region & Volume</th>
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
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{item.company_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.contact_person}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{item.project_type}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{item.preferred_region}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.requested_quantity || 'Flexible'}</div>
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
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-xs border border-purple-200 transition-colors"
                      >
                        Manage Inquiry
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No buyer inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Inquiry: {editingItem.id}
                  </h3>
                  <DemoBadge isDemo={editingItem.is_demo} />
                </div>
                <div className="text-xs text-slate-500">
                  {editingItem.company_name} ({editingItem.contact_person})
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

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div><strong>Project Type:</strong> {editingItem.project_type}</div>
              <div><strong>Region & Volume:</strong> {editingItem.preferred_region} ({editingItem.requested_quantity || 'Flexible'})</div>
              <div><strong>Criteria:</strong> {editingItem.required_characteristics}</div>
              {editingItem.additional_requirements && (
                <div className="text-slate-600 mt-1 italic">&ldquo;{editingItem.additional_requirements}&rdquo;</div>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Inquiry Pipeline Status *</label>
              <select
                value={formState.status}
                onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Submitted">Submitted (Initial logging)</option>
                <option value="Under Review">Under Review (Scoping cluster fit)</option>
                <option value="More Information Required">More Information Required</option>
                <option value="Potential Match Under Review">Potential Match Under Review (Cohort mapping)</option>
                <option value="Closed">Closed (Completed or out of scope)</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mapped Cohort / Potential Cluster Match (Tentative)</span>
              </label>
              <input
                type="text"
                value={formState.potentialMatches}
                onChange={e => setFormState({ ...formState, potentialMatches: e.target.value })}
                placeholder="e.g. Cluster JH-01 (Ramgarh Smallholders - 45 Farmers, 180 Acres)"
                className="w-full px-3 py-2 rounded-lg border border-purple-300 bg-purple-50/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Internal Desk Notes (Private)</label>
              <textarea
                rows={2}
                value={formState.internalNotes}
                onChange={e => setFormState({ ...formState, internalNotes: e.target.value })}
                placeholder="Internal pricing assumptions, carbon additionality criteria, partner feedback..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">
                Company-Visible Update (Displayed in Buyer Portal)
              </label>
              <textarea
                rows={2}
                value={formState.companyVisibleNotes}
                onChange={e => setFormState({ ...formState, companyVisibleNotes: e.target.value })}
                placeholder="Message shown to corporate buyer regarding cohort feasibility and timing..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
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
                className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Inquiry Status'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
