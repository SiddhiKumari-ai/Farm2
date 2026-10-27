import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminStats } from '../../types';
import { DemoBadge } from '../../components/StatusBadge';
import {
  Users,
  Building,
  BarChart3,
  Wrench,
  FileText,
  Award,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Platform Operations & Intelligence Overview
          </h1>
          <p className="text-xs text-slate-600">
            Real-time telemetry and database synchronization across all platform stakeholders.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh Database Metrics</span>
        </button>
      </div>

      {/* 6 Database Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Farmers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Farmers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-serif">
              {stats?.totalFarmers || 0}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-700 font-semibold">{stats?.realFarmers || 0} Live Submissions</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">{stats?.sampleFarmers || 0} Demo Records</span>
            </div>
          </div>
          <Link
            to="/admin/farmers"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>Manage Farmer Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Total Companies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Corporate Buyers / Funds</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-serif">
              {stats?.totalCompanies || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Registered procurement desks & aggregators
            </div>
          </div>
          <Link
            to="/admin/companies"
            className="text-xs font-semibold text-slate-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>View Company Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pending Soil Assessments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Soil Assessments</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-700 font-serif">
              {stats?.pendingAssessments || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Awaiting agronomist review or assignment
            </div>
          </div>
          <Link
            to="/admin/assessments"
            className="text-xs font-semibold text-amber-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>Process Assessments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Open Equipment Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open Equipment Requisitions</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-indigo-900 font-serif">
              {stats?.openEquipmentRequests || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              In Partner Search or Reviewing stage
            </div>
          </div>
          <Link
            to="/admin/equipment"
            className="text-xs font-semibold text-indigo-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>Dispatch Equipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Buyer Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Buyer Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-900 font-serif">
              {stats?.buyerInquiries || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Offtaker volume & credit criteria requisitions
            </div>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-semibold text-purple-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>Map Buyer Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Active Carbon Programmes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Carbon Programmes</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-teal-800 font-serif">
              {stats?.activeProgrammes || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Farmers undergoing 9-stage verified transition
            </div>
          </div>
          <Link
            to="/admin/programmes"
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>Manage Carbon Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Platform Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold font-serif text-slate-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Recent Platform Events & Audit Log</span>
          </h3>
          <span className="text-[11px] text-slate-500">Chronological SQLite events</span>
        </div>

        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {stats.recentActivity.map(act => (
              <div key={act.id + act.type} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                  <span className="font-semibold text-slate-900 truncate">{act.title}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({act.type.replace('_', ' ')})</span>
                  <DemoBadge isDemo={act.is_demo} />
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">
                  {new Date(act.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-500">No activity logged yet.</div>
        )}
      </div>
    </div>
  );
};
