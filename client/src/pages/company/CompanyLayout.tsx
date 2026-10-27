import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile } from '../../types';
import { Building, Send, FileText, CheckCircle2 } from 'lucide-react';
import { DemoBadge } from '../../components/StatusBadge';

export const CompanyLayout: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const company = profile as CompanyProfile;

  const navLinks = [
    { to: '/company', end: true, label: 'Company Overview', icon: <Building className="w-4 h-4" /> },
    { to: '/company/submit', label: 'Submit Buyer Requirement', icon: <Send className="w-4 h-4" /> },
    { to: '/company/inquiries', label: 'My Inquiries & Matches', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Company Dashboard Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Building className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-serif">{company?.company_name || user?.name}</h1>
                <DemoBadge isDemo={user?.is_demo} />
              </div>
              <div className="text-xs text-slate-400">
                Contact: <span className="text-slate-300 font-medium">{company?.contact_person || user?.name}</span> • {company?.company_type}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-mono">
              Corporate Carbon Portal
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
                      ? 'bg-slate-50 text-slate-900 border-emerald-500 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 border-transparent'
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

      {/* Main Outlet */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};
