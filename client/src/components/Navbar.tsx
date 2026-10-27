import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, Globe, Menu, X, Shield, User, Building, LogOut, ChevronDown, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer';
    if (user.role === 'company') return '/company';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] sm:text-xs py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>{t('demoModeNotice')}</span>
        <span className="hidden md:inline text-emerald-400">|</span>
        <Link to="/login" className="hidden md:inline underline hover:text-white transition-colors">
          {t('demoLoginQuick')} &rarr;
        </Link>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-serif">FarmSetu</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                MVP
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 hidden sm:block font-medium">Smart Farming & Carbon Hub</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-700">
          <Link
            to="/"
            className={`transition-colors hover:text-emerald-700 ${isActive('/') ? 'text-emerald-800 font-semibold' : ''}`}
          >
            {t('home')}
          </Link>
          <Link
            to="/about"
            className={`transition-colors hover:text-emerald-700 ${isActive('/about') ? 'text-emerald-800 font-semibold' : ''}`}
          >
            {t('about')}
          </Link>
          <Link
            to="/contact"
            className={`transition-colors hover:text-emerald-700 ${isActive('/contact') ? 'text-emerald-800 font-semibold' : ''}`}
          >
            {t('contact')}
          </Link>
        </div>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* User state / Auth buttons */}
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
              >
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-emerald-700" />
                ) : user.role === 'farmer' ? (
                  <Sprout className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Building className="w-4 h-4 text-emerald-700" />
                )}
                <span>
                  {user.role === 'admin'
                    ? t('adminDashboard')
                    : user.role === 'farmer'
                    ? t('farmerDashboard')
                    : t('companyDashboard')}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title={t('logout')}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
              >
                {t('login')}
              </Link>

              {/* Registration Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  onBlur={() => setTimeout(() => setRegisterDropdownOpen(false), 200)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>{t('register')}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
                    <Link
                      to="/register/farmer"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium"
                    >
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-slate-900">{t('farmerRegister')}</div>
                        <div className="text-[10px] text-slate-500">For Indian farmers & FPOs</div>
                      </div>
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <Link
                      to="/register/company"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium"
                    >
                      <Building className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-slate-900">{t('companyRegister')}</div>
                        <div className="text-[10px] text-slate-500">For ESG & Carbon credit buyers</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden gap-2">
          {/* Mobile language switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="p-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700"
          >
            {lang === 'en' ? 'हिंदी' : 'EN'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-emerald-900 hover:bg-emerald-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-emerald-700"
          >
            {t('home')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-emerald-700"
          >
            {t('about')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-emerald-700"
          >
            {t('contact')}
          </Link>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-sm"
                >
                  {user.role === 'admin'
                    ? t('adminDashboard')
                    : user.role === 'farmer'
                    ? t('farmerDashboard')
                    : t('companyDashboard')}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-center py-2 rounded-lg text-rose-600 border border-rose-200 text-sm font-medium"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg border border-slate-300 text-slate-800 font-semibold text-sm"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register/farmer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-sm"
                >
                  {t('farmerRegister')}
                </Link>
                <Link
                  to="/register/company"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg bg-slate-800 text-white font-semibold text-sm"
                >
                  {t('companyRegister')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
