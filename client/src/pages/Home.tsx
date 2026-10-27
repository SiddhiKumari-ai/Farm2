import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  BarChart3,
  Wrench,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    registeredFarmers: 2,
    coordinatedAcres: 7.3,
    activeProgrammes: 2,
    equipmentRequests: 2
  });

  useEffect(() => {
    fetch('/api/stats/public')
      .then(res => res.json())
      .then(data => {
        if (data && data.registeredFarmers !== undefined) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative glowing mesh */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sustainable Agriculture & Carbon Farming Coordination Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight sm:leading-tight">
            {t('heroHeading')}
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
            {t('heroSubheading')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register/farmer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('ctaFarmer')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register/company"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('ctaCompany')}</span>
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-sm border border-amber-500/40 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('demoLoginQuick')}</span>
            </Link>
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-emerald-800/60 max-w-4xl mx-auto">
            <div className="bg-emerald-900/40 backdrop-blur-sm p-4 rounded-xl border border-emerald-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.registeredFarmers}+</div>
              <div className="text-xs text-slate-300 mt-1">Registered Farmers</div>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm p-4 rounded-xl border border-emerald-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.coordinatedAcres}</div>
              <div className="text-xs text-slate-300 mt-1">Coordinated Acres</div>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm p-4 rounded-xl border border-emerald-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.activeProgrammes}</div>
              <div className="text-xs text-slate-300 mt-1">Active Pilot Cohorts</div>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm p-4 rounded-xl border border-emerald-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.equipmentRequests}</div>
              <div className="text-xs text-slate-300 mt-1">Equipment Enquiries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider">The FarmSetu Framework</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">Three Interconnected Pillars</h2>
          <p className="text-slate-600 text-sm">
            Bridging on-the-ground agronomic reality with mechanization and verified environmental markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">{t('pillar1Title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('pillar1Desc')}</p>
              <ul className="text-xs space-y-2 text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physical soil report review & baseline tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clear distinction between samples & certified advice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Agronomist-supervised guidance notes</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                to="/register/farmer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
              >
                <span>Explore Soil Review</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">{t('pillar2Title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('pillar2Desc')}</p>
              <ul className="text-xs space-y-2 text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Zero-till Happy Seeders & DSR machinery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Local Custom Hiring Center (CHC) coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Structured request tracking (Requested &rarr; Arranged)</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                to="/register/farmer"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
              >
                <span>Request Equipment Access</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">{t('pillar3Title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('pillar3Desc')}</p>
              <ul className="text-xs space-y-2 text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>9-stage auditable progress timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Strict methodology & eligibility verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Corporate buyer requirement matching</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                to="/register/company"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
              >
                <span>Submit Buyer Requirements</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider">Step-by-Step Pathway</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">{t('howItWorksTitle')}</h2>
            <p className="text-slate-600 text-sm">
              From farmer onboarding and agronomy review to corporate buyer inquiry matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 01</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep1Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep1Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 02</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep2Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep2Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 03</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep3Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep3Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 04</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep4Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep4Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 05</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep5Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep5Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-emerald-700 font-bold text-sm font-mono">STEP 06</div>
              <h4 className="font-bold text-slate-900 font-serif">{t('howStep6Title')}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{t('howStep6Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Review & Carbon Integrity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium border border-emerald-700/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Fake Claims • Science-Backed Coordination</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif leading-snug">
                Transparent Expert Review & Credible Carbon Verification
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Too many agricultural carbon projects overpromise automated AI yields or guaranteed credit payouts.
                At FarmSetu, we maintain unwavering integrity:
              </p>
              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Human Agronomist Review:</strong> Soil parameters are reviewed by certified KVK / ICAR specialists before recommendations are stamped verified.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Speculative Carbon Prices:</strong> Buyer inquiries represent genuine interest and programmatic requirements, never speculative trades.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Rigorous Milestone Tracking:</strong> Credits are only marked as issued when confirmed by authorized registry bodies after third-party MRV.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold font-mono">
                Platform Rules for Students & Judges
              </div>
              <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="font-semibold text-white mb-1">Functional Submissions Only</div>
                  All farmer registrations, soil assessment requests, and machinery requisitions are written to a persistent relational database.
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="font-semibold text-white mb-1">Clearly Demarcated Sample Records</div>
                  Seeded demo examples are visibly flagged with a &ldquo;Sample Demo Record&rdquo; badge to ensure full transparency.
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="font-semibold text-white mb-1">Bi-directional Admin Synchronization</div>
                  Any status updated by the Admin is immediately reflected in the respective Farmer or Buyer portal.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Judge Quick Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm font-serif">Testing for the Innovation Competition?</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Use our pre-configured demo logins to inspect pre-seeded data, or register a new farmer and open the Admin Center to observe real-time CRUD persistence.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Open Fast Demo Logins
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold text-xs hover:bg-amber-100/50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
