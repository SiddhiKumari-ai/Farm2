import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EquipmentRequest } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import { Wrench, Search, Filter, Save, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export const AdminEquipment: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [editingItem, setEditingItem] = useState<EquipmentRequest | null>(null);
  const [formState, setFormState] = useState({
    status: 'Requested' as any,
    adminNotes: '',
    farmerVisibleNotes: ''
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchEquipment = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/equipment', {
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
    fetchEquipment();
  }, [token]);

  const openEditor = (item: EquipmentRequest) => {
    setEditingItem(item);
    setFormState({
      status: item.status,
      adminNotes: item.admin_notes || '',
      farmerVisibleNotes: item.farmer_visible_notes || ''
    });
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/equipment/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Equipment request updated and saved to database!');
        await fetchEquipment();
        setEditingItem(data.request);
      } else {
        setFeedback(data.error || 'Failed to update equipment request');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = requests.filter(r => {
    const matchesSearch =
      r.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.equipment_category.toLowerCase().includes(search.toLowerCase()) ||
      r.farm_location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Equipment & Machinery Dispatch Desk</h1>
        <p className="text-xs text-slate-600">
          Coordinate Custom Hiring Center (CHC) equipment deployment for zero-tillage seed drills and residue balers.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, farmer, equipment, or location..."
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
            <option value="Requested">Requested</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Partner Search">Partner Search</option>
            <option value="Arranged">Arranged</option>
            <option value="Unavailable">Unavailable</option>
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
                <th className="py-3 px-4">Equipment Category</th>
                <th className="py-3 px-4">Target Window</th>
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
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.farmer_name}</div>
                      <div className="text-[11px] text-slate-500">{item.farm_location}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{item.equipment_category}</td>
                    <td className="py-3 px-4 text-slate-600">{item.required_period}</td>
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
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-colors"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No equipment requests found.
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
                    Dispatch Requisition: {editingItem.id}
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

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div><strong>Equipment:</strong> {editingItem.equipment_category}</div>
              <div><strong>Intended Practice:</strong> {editingItem.intended_practice}</div>
              <div><strong>Target Window:</strong> {editingItem.required_period} ({editingItem.farm_area})</div>
              {editingItem.additional_details && (
                <div className="text-slate-600 italic mt-1">&ldquo;{editingItem.additional_details}&rdquo;</div>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Dispatch Status *</label>
              <select
                value={formState.status}
                onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Requested">Requested (Initial submission)</option>
                <option value="Reviewing">Reviewing (Checking hub radius)</option>
                <option value="Partner Search">Partner Search (Contacting CHCs / FPO banks)</option>
                <option value="Arranged">Arranged (Confirmed with local operator)</option>
                <option value="Unavailable">Unavailable (No compatible machinery within range)</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Internal Operational Log (Private)</label>
              <textarea
                rows={2}
                value={formState.adminNotes}
                onChange={e => setFormState({ ...formState, adminNotes: e.target.value })}
                placeholder="Notes on CHC vendor contact, driver phone, quote..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-amber-900">
                Shared Update for Farmer (Visible in Farmer Portal)
              </label>
              <textarea
                rows={2}
                value={formState.farmerVisibleNotes}
                onChange={e => setFormState({ ...formState, farmerVisibleNotes: e.target.value })}
                placeholder="e.g. Arranged through Ramgarh CHC Hub. Tractor operator Arvind will contact you on Nov 14..."
                className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
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
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Requisition Status'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
