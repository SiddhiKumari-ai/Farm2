import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Wrench,
  Award,
  Users2,
  FileSearch,
  Scale,
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sprout className="w-4 h-4" />
          <span>Operational Architecture & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          How FarmSetu Coordinates Sustainable Farming
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          A transparent bridge connecting Indian smallholder agriculture with verified agro-climatic intelligence,
          local equipment rental hubs, and legitimate carbon-farming programmes.
        </p>
      </div>

      {/* 6 Step Detailed Process */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-200 pb-2">
          The 6-Stage End-to-End Coordination Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">1</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Farmer Onboarding & Geo-Profile</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              The farmer creates an account and records their plot area (acres/hectares/bigha), geographic district and village,
              seasonal crop rotation history, water accessibility (canal, borewell, rainfed), and baseline farming practices.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">2</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Soil Health & Baseline Assessment</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Farmers can upload an existing physical soil health card or request a fresh baseline sampling through FarmSetu’s partner agronomists.
              The request receives a unique identifier (e.g. SAR-2026-XXXX) tracked through the Admin operations desk.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">3</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Expert-Reviewed Agronomy Guidance</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Rather than generic AI claims, agronomists from local Krishi Vigyan Kendras (KVK) review the soil parameters (pH, organic carbon %, nitrogen)
              and prescribe regenerative practices such as Sesbania green manuring, reduced tillage, or legume intercropping.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">4</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Mechanization & Equipment Support</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Sustainable practices require specialized machinery like Happy Seeders, Zero-till Seed Drills, or Drip Laying kits.
              Farmers submit requisitions, and FarmSetu coordinates with nearby Custom Hiring Centers (CHCs) to arrange machinery during peak windows.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">5</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Carbon Programme Cohort Enrollment</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Eligible farm clusters are linked into credible carbon-farming programmes adhering to international carbon standards
              (such as Verra VM0042 or Gold Standard). Corporate buyers submit structured requirements without speculative bidding.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">6</span>
              <h3 className="font-bold text-slate-900 text-base font-serif">Auditable Monitoring & Genuine Verification</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Practice adoption is verified through geotagged field logs and remote sensing. Only when third-party auditors confirm genuine carbon additionality
              are credits officially registered, ensuring farmers receive legitimate long-term financial incentives.
            </p>
          </div>
        </div>
      </div>

      {/* Methodological Transparency Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Core Governance & Compliance Principles</span>
        </div>
        <h3 className="text-xl font-bold font-serif text-white">
          Why FarmSetu Does Not Make False AI or Carbon Trading Claims
        </h3>
        <p className="text-slate-300 text-xs leading-relaxed">
          Agricultural soil carbon sequestration is inherently biological and complex. Carbon models require baseline soil core tests,
          practice permanence over multiple seasons, and leakage control.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-200">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="font-bold text-emerald-400 mb-1">Human-in-the-Loop</div>
            Automated recommendations are clearly marked illustrative until signed off by a real agronomist.
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-400 mb-1">Realistic Machinery Status</div>
            Equipment requisitions transition honestly from &ldquo;Requested&rdquo; to &ldquo;Partner Search&rdquo; or &ldquo;Unavailable&rdquo; based on actual fleet availability.
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="font-bold text-teal-400 mb-1">Authentic Credit Issuance</div>
            Credits are never auto-generated upon registration. Only confirmed post-audit issuances are reflected in farmer dashboards.
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link
          to="/register/farmer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
        >
          <span>Begin Farmer Registration</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
