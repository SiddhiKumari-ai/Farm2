import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile, BuyerInquiry } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Building,
  Send,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const CompanyOverview: React.FC = () => {
  const { t } = useLanguage();
  const { profile, token } = useAuth();
  const company = profile as CompanyProfile;

  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/company/inquiries', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setInquiries(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buyer & Offtaker Coordination Cell</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">{company?.company_name}</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Welcome to FarmSetu&apos;s corporate portal. Submit your volume, practice, and geographic preferences for agricultural carbon credits.
            Our operations desk maps your requirements to verified farmer aggregation clusters.
          </p>
        </div>

        <Link
          to="/company/submit"
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 transition-all flex items-center gap-2 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Submit New Requirement</span>
        </Link>
      </div>

      {/* Disclaimers & Integrity Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
        <strong className="block font-serif text-amber-950">Important Carbon Procurement Framework:</strong>
        Buyer inquiries represent programmatic interest only. FarmSetu coordinates aggregation and independent MRV verification.
        Submitting requirements does not imply completed purchases, binding commitments, or pre-reserved credits until bilateral agreements and verification audits are finalized.
      </div>

      {/* Profile & Recent Inquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold font-serif text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>Entity Profile</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Company Name:</span>
              <strong className="text-slate-900 block mt-0.5">{company?.company_name}</strong>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Contact Representative:</span>
              <p className="text-slate-800 font-medium mt-0.5">{company?.contact_person}</p>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Business Email:</span>
              <p className="text-slate-800 font-mono mt-0.5">{company?.business_email}</p>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Sector / Entity Type:</span>
              <p className="text-slate-800 font-medium mt-0.5">{company?.company_type}</p>
            </div>

            {company?.website && (
              <div>
                <span className="text-slate-500 text-[11px] block">Website:</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                >
                  <span>{company.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Inquiries Summary Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold font-serif text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Active Buyer Inquiries ({inquiries.length})</span>
            </h3>
            <Link
              to="/company/inquiries"
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              View All Inquiries &rarr;
            </Link>
          </div>

          {inquiries.length > 0 ? (
            <div className="space-y-3 text-xs">
              {inquiries.slice(0, 3).map(inq => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-mono font-bold text-slate-900">{inq.id}</span>
                    <StatusBadge status={inq.status} />
                  </div>
                  <div className="font-semibold text-slate-900">{inq.project_type}</div>
                  <div className="text-slate-600 text-[11px]">
                    Preferred Region: <strong className="text-slate-800">{inq.preferred_region}</strong> • Volume: {inq.requested_quantity || 'Flexible'}
                  </div>
                  {inq.company_visible_notes && (
                    <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      <strong>Admin Update:</strong> {inq.company_visible_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>You haven&apos;t submitted any buyer requirements yet.</p>
              <Link
                to="/company/submit"
                className="inline-block px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
              >
                Submit First Requirement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
