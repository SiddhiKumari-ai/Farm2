import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  Building,
  BarChart3,
  Wrench,
  FileText,
  Award,
  Mail,
  RotateCcw,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { t } = useLanguage();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navItems = [
    { to: '/admin', end: true, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/farmers', label: 'Farmers', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
    { to: '/admin/assessments', label: 'Soil Assessments', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/admin/equipment', label: 'Equipment Requests', icon: <Wrench className="w-4 h-4" /> },
    { to: '/admin/inquiries', label: 'Buyer Inquiries', icon: <FileText className="w-4 h-4" /> },
    { to: '/admin/programmes', label: 'Carbon Programmes', icon: <Award className="w-4 h-4" /> },
    { to: '/admin/contacts', label: 'Contact Messages', icon: <Mail className="w-4 h-4" /> }
  ];

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset sample demo records? Genuine user submissions will remain completely safe!')) {
      return;
    }

    setResetting(true);
    setResetMsg(null);

    try {
      const res = await fetch('/api/admin/reset-demo-data', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg({ type: 'success', text: 'Demo records refreshed successfully!' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setResetMsg({ type: 'error', text: data.error || 'Failed to reset demo data' });
      }
    } catch (err: any) {
      setResetMsg({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Admin Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm font-serif">FarmSetu Admin</div>
              <div className="text-[10px] text-emerald-400 font-mono">Operations Control Desk</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`p-3 space-y-1 flex-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Core Modules
          </div>

          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Reset Demo Data Button */}
          <div className="pt-4 mt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDemoData}
              disabled={resetting}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-950/40 border border-amber-500/30 transition-all text-left"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Refreshing...' : 'Safe Reset Demo Data'}</span>
            </button>
            <p className="text-[10px] text-slate-400 px-3 pt-1">
              Refreshes sample seed records without deleting user data.
            </p>
          </div>
        </div>

        {/* User bar & Logout */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <div className="font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-emerald-400 font-mono">admin@farmsetu.in</div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Notification Bar if any */}
        {resetMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between ${
              resetMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {resetMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700" />
              )}
              <span>{resetMsg.text}</span>
            </div>
            <button onClick={() => setResetMsg(null)} className="text-xs font-bold">✕</button>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
