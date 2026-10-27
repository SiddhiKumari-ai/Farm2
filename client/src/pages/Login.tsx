import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, AlertCircle, ArrowRight, Shield, Building, User } from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Check redirected role by checking stored token / user
      // Navigate to dashboard
      const token = localStorage.getItem('farmsetu_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'admin') navigate('/admin');
          else if (payload.role === 'farmer') navigate('/farmer');
          else if (payload.role === 'company') navigate('/company');
          else navigate('/');
        } catch {
          navigate('/');
        }
      }
    } else {
      setErrorMsg(result.error || 'Invalid credentials');
    }
  };

  const handleDemo = async (role: UserRole, index: number = 0) => {
    setErrorMsg('');
    setIsLoading(true);
    const result = await demoLogin(role, index);
    setIsLoading(false);

    if (result.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'farmer') navigate('/farmer');
      else if (role === 'company') navigate('/company');
    } else {
      setErrorMsg(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">{t('login')} to FarmSetu</h1>
        <p className="text-xs text-slate-600">Access your farm, corporate buyer, or administrative portal</p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">{t('email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">{t('password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Verifying...</span> : <span>{t('login')}</span>}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-600">
          Don&apos;t have an account yet?{' '}
          <Link to="/register/farmer" className="text-emerald-700 font-semibold hover:underline">
            Register as Farmer
          </Link>
          {' · '}
          <Link to="/register/company" className="text-emerald-700 font-semibold hover:underline">
            Register as Buyer
          </Link>
        </div>
      </div>

      {/* Demo Quick Logins for Judges */}
      <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950 font-serif">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Judge & Evaluator Fast Demo Logins</span>
          </div>
          <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
            One-Click Access
          </span>
        </div>
        <p className="text-[11px] text-amber-900/80 leading-relaxed">
          Instantly simulate any stakeholder role with persistent sample profiles seeded in SQLite:
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* Admin */}
          <button
            type="button"
            onClick={() => handleDemo('admin')}
            disabled={isLoading}
            className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-left transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Central Operations Admin
                </div>
                <div className="text-[10px] text-slate-500 font-mono">admin@farmsetu.in</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Farmer 1 */}
          <button
            type="button"
            onClick={() => handleDemo('farmer', 0)}
            disabled={isLoading}
            className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-left transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Farmer: Rameshwar Patel (Ramgarh, JH)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">4.5 Acres • Paddy & Wheat Rotation</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Company 1 */}
          <button
            type="button"
            onClick={() => handleDemo('company', 0)}
            disabled={isLoading}
            className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-left transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Buyer: EcoRoots AgriVentures
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Corporate Carbon Solution Aggregator</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};
