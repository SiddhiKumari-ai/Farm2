import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShieldCheck, HeartHandshake, Leaf, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-serif tracking-tight">FarmSetu</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bridging Indian agriculture with climate finance, soil intelligence, and precision mechanization.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MVP Competition Edition 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide text-xs uppercase">{t('home')} & Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">{t('about')}</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">{t('contact')}</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">{t('login')}</Link></li>
            </ul>
          </div>

          {/* Platform Pillars */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide text-xs uppercase">Core Pillars</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('pillar1Title')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('pillar2Title')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('pillar3Title')}</span>
              </li>
            </ul>
          </div>

          {/* Verification Principles Notice */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide text-xs uppercase">{t('disclaimerTitle')}</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
              {t('disclaimerText')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <div>
            &copy; {new Date().getFullYear()} FarmSetu Agri-Tech Platform. Built for Student Innovation Competition.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Designed for Indian Farming Agro-Climatic Zones</span>
            <span>•</span>
            <span className="text-emerald-400">Database-backed Full Stack MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
