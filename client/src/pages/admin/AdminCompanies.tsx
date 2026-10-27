import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile, BuyerInquiry } from '../../types';
import { DemoBadge, StatusBadge } from '../../components/StatusBadge';
import { Building, Search, ExternalLink, Mail, Phone, MapPin, Eye, X, FileText } from 'lucide-react';

export const AdminCompanies: React.FC = () => {
  const { token } = useAuth();
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('/api/admin/companies', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/inquiries', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([compData, inqData]) => {
        if (Array.isArray(compData)) setCompanies(compData);
        if (Array.isArray(inqData)) setInquiries(inqData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = companies.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_person.toLowerCase().includes(search.toLowerCase()) ||
    c.business_email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedInquiries = selectedCompany
    ? inquiries.filter(i => i.user_id === selectedCompany.user_id)
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Corporate Buyers & ESG Aggregators</h1>
        <p className="text-xs text-slate-600">
          Directory of registered carbon offtakers, institutional funds, and their demand inquiries.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company name, contact, or email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Company Entity</th>
                <th className="py-3 px-4">Contact Representative</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{comp.company_name}</div>
                      {comp.website && (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>{comp.website}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{comp.contact_person}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{comp.business_email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{comp.company_type}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {comp.district ? `${comp.district}, ${comp.state}` : 'National / International'}
                    </td>
                    <td className="py-3 px-4">
                      <DemoBadge isDemo={comp.is_demo} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(comp)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inquiries</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No company records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Company Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">{selectedCompany.company_name}</h3>
                  <DemoBadge isDemo={selectedCompany.is_demo} />
                </div>
                <div className="text-xs text-slate-500">{selectedCompany.company_type}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div>
                  <span className="text-slate-500 text-[11px] block">Area of ESG / Carbon Interest:</span>
                  <p className="font-medium text-slate-800 mt-0.5 leading-relaxed">
                    {selectedCompany.area_of_interest || 'No custom notes logged.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 font-serif flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Submitted Buyer Inquiries ({selectedInquiries.length})</span>
                </h4>

                {selectedInquiries.length > 0 ? (
                  selectedInquiries.map(inq => (
                    <div key={inq.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-900">{inq.id}</span>
                        <StatusBadge status={inq.status} size="sm" />
                      </div>
                      <div className="font-semibold text-slate-800">{inq.project_type}</div>
                      <div className="text-slate-600 text-[11px]">
                        Region: <strong>{inq.preferred_region}</strong> • Volume: {inq.requested_quantity || 'Flexible'}
                      </div>
                      <div className="text-slate-500 text-[11px]">Timeline: {inq.indicative_timeline || 'N/A'}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No inquiries submitted yet by this organization.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
