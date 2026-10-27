import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile } from '../../types';
import {
  LayoutDashboard,
  Sprout,
  BarChart3,
  Wrench,
  Award,
  MapPin,
  Leaf,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { DemoBadge } from '../../components/StatusBadge';

export const FarmerLayout: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile, logout } = useAuth();
  const farmerProfile = profile as FarmerProfile;

  const navLinks = [
    { to: '/farmer', end: true, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/farmer/my-farm', label: t('myFarm'), icon: <Sprout className="w-4 h-4" /> },
    { to: '/farmer/crop-analytics', label: t('cropAnalytics'), icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/farmer/equipment', label: t('equipmentSupport'), icon: <Wrench className="w-4 h-4" /> },
    { to: '/farmer/carbon-programme', label: t('carbonProgrammes'), icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Farmer Dashboard Header Bar */}
      <div className="bg-emerald-900 text-white border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center border border-emerald-700">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-serif">{farmerProfile?.full_name || user?.name}</h1>
                <DemoBadge isDemo={user?.is_demo} />
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {farmerProfile?.village ? `${farmerProfile.village}, ${farmerProfile.district}` : 'India'}
                </span>
                <span>•</span>
                <span>
                  {farmerProfile?.farm_area || '0'} {farmerProfile?.area_unit || 'acres'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700 text-emerald-200">
              Status: <strong className="text-white">{farmerProfile?.profile_status || 'Profile Submitted'}</strong>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-1 scrollbar-none">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'bg-slate-50 text-emerald-950 border-emerald-500 font-bold'
                      : 'text-emerald-100 hover:bg-emerald-800/60 border-transparent'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};
