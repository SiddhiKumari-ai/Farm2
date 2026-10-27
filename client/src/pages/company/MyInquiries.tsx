import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BuyerInquiry } from '../../types';
import { StatusBadge, DemoBadge } from '../../components/StatusBadge';
import { FileText, Send, Clock, Sparkles, AlertCircle, Info } from 'lucide-react';

export const MyInquiries: React.FC = () => {
  const { t } = useLanguage();
  const { token } = useAuth();
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">{t('myInquiries')}</h2>
          <p className="text-xs text-slate-600">
            Track status updates, tentative cluster matches, and feedback from the FarmSetu Operations Desk.
          </p>
        </div>

        <Link
          to="/company/submit"
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <Send className="w-3.5 h-3.5" />
          <span>New Requirement</span>
        </Link>
      </div>

      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{inq.id}</span>
                  <DemoBadge isDemo={inq.is_demo} />
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 text-[11px]">{new Date(inq.created_at).toLocaleDateString()}</span>
                </div>
                <StatusBadge status={inq.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">Carbon Project Interest:</span>
                  <strong className="text-slate-900 block text-xs">{inq.project_type}</strong>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">Preferred Region:</span>
                  <p className="text-slate-800 font-medium">{inq.preferred_region}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">Indicative Volume:</span>
                  <p className="text-slate-800 font-medium">{inq.requested_quantity || 'Flexible Volume'}</p>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                <span className="font-semibold text-slate-900 text-[11px] block">Required Standards & Criteria:</span>
                <p className="leading-relaxed">{inq.required_characteristics}</p>
              </div>

              {/* Tentative Matches from Admin */}
              {inq.potential_matches && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Mapped Regional Cluster (Tentative Match):</span>
                  </div>
                  <p className="text-purple-900 font-semibold">{inq.potential_matches}</p>
                  <p className="text-[11px] text-purple-800 italic">
                    Note: Match is tentative subject to seasonal baseline audits and verification milestone sign-off.
                  </p>
                </div>
              )}

              {/* Company Visible Admin Note */}
              {inq.company_visible_notes && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 space-y-1">
                  <span className="font-bold text-xs text-emerald-900 block">Operations Desk Response:</span>
                  <p className="leading-relaxed text-xs">{inq.company_visible_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold font-serif text-slate-900">No Inquiries Found</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            You haven&apos;t registered any carbon purchase or project interest requisitions yet.
          </p>
          <Link
            to="/company/submit"
            className="inline-block px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
          >
            Submit First Buyer Requirement
          </Link>
        </div>
      )}
    </div>
  );
};
