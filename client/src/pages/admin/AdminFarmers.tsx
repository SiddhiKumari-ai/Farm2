import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile, SoilAssessmentRequest, EquipmentRequest, CarbonProgrammeProject } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Save,
  BarChart3,
  Wrench,
  Award
} from 'lucide-react';

export const AdminFarmers: React.FC = () => {
  const { token } = useAuth();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected farmer for details modal
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [farmerDetails, setFarmerDetails] = useState<{
    farmer: FarmerProfile;
    assessments: SoilAssessmentRequest[];
    equipment: EquipmentRequest[];
    programmes: CarbonProgrammeProject[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status update state
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const fetchFarmers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/farmers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFarmers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [token]);

  const openFarmerModal = async (farmer: FarmerProfile) => {
    setSelectedFarmer(farmer);
    setNewStatus(farmer.profile_status || 'Profile Submitted');
    setStatusFeedback(null);
    setLoadingDetails(true);

    try {
      const res = await fetch(`/api/admin/farmers/${farmer.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFarmerDetails(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedFarmer) return;
    setUpdatingStatus(true);
    setStatusFeedback(null);

    try {
      const res = await fetch(`/api/admin/farmers/${selectedFarmer.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusFeedback('Profile review status updated successfully in database!');
        await fetchFarmers();
        // Update local selectedFarmer
        setSelectedFarmer({ ...selectedFarmer, profile_status: newStatus });
      } else {
        setStatusFeedback(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      setStatusFeedback(err.message || 'Network error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch =
      f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.email && f.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || f.profile_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Registered Farmers Directory</h1>
        <p className="text-xs text-slate-600">
          Inspect farmer plots, review onboarding submissions, and manage certification progress.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by farmer name, district, or email..."
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
            <option value="ALL">All Profile Statuses</option>
            <option value="Profile Submitted">Profile Submitted</option>
            <option value="Verified Profile">Verified Profile</option>
            <option value="Under Review">Under Review</option>
            <option value="Needs More Info">Needs More Info</option>
          </select>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Farm Area</th>
                <th className="py-3 px-4">Crops / Rotation</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map(farmer => (
                  <tr key={farmer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{farmer.full_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{farmer.phone || farmer.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{farmer.village}</div>
                      <div className="text-slate-500 text-[11px]">{farmer.district}, {farmer.state}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {farmer.farm_area} {farmer.area_unit}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{farmer.current_crop || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">Prev: {farmer.previous_crop || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <DemoBadge isDemo={farmer.is_demo} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {farmer.profile_status || 'Profile Submitted'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openFarmerModal(farmer)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No farmer records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farmer Inspection & Review Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {selectedFarmer.full_name}
                  </h3>
                  <DemoBadge isDemo={selectedFarmer.is_demo} />
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Farmer ID: {selectedFarmer.user_id}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusFeedback}</span>
              </div>
            )}

            {/* Status Update Control */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="font-bold text-xs text-slate-800 block">
                Manage Profile Verification Status
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Profile Submitted">Profile Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified Profile">Verified Profile</option>
                  <option value="Needs More Info">Needs More Info</option>
                </select>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{updatingStatus ? 'Updating DB...' : 'Save Status Update'}</span>
                </button>
              </div>
            </div>

            {/* Farm Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Location</span>
                <strong className="text-slate-900 mt-0.5 block">
                  {selectedFarmer.village}, {selectedFarmer.district}, {selectedFarmer.state}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Farm Area</span>
                <strong className="text-emerald-700 mt-0.5 block font-bold">
                  {selectedFarmer.farm_area} {selectedFarmer.area_unit}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Primary Activity</span>
                <strong className="text-slate-900 mt-0.5 block">{selectedFarmer.primary_activity}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Current Crop</span>
                <strong className="text-slate-900 mt-0.5 block">{selectedFarmer.current_crop || 'N/A'}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Irrigation Source</span>
                <strong className="text-slate-900 mt-0.5 block">{selectedFarmer.irrigation_source || 'Rainfed'}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 text-[11px] block">Soil Card</span>
                <strong className="text-slate-900 mt-0.5 block">
                  {selectedFarmer.soil_report_available ? 'Available' : 'None Reported'}
                </strong>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-700">Existing Farming Practices</span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                {selectedFarmer.farming_practices || 'No details entered'}
              </p>
            </div>

            {/* Linked Activities */}
            {farmerDetails && (
              <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
                <h4 className="font-bold text-slate-900 font-serif">Linked Requests & Projects</h4>

                <div className="space-y-2">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Soil Assessments ({farmerDetails.assessments.length})</span>
                  </div>
                  {farmerDetails.assessments.map(a => (
                    <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-800">{a.id}</span>
                      <StatusBadge status={a.status} size="sm" />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>Equipment Requests ({farmerDetails.equipment.length})</span>
                  </div>
                  {farmerDetails.equipment.map(e => (
                    <div key={e.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-800">{e.id} - {e.equipment_category}</span>
                      <StatusBadge status={e.status} size="sm" />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>Carbon Programmes ({farmerDetails.programmes.length})</span>
                  </div>
                  {farmerDetails.programmes.map(p => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-800">{p.project_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">{p.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
