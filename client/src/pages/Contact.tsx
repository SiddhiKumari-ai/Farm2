import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Platform Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'General Platform Inquiry', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit contact inquiry');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Network error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900">{t('contact')} FarmSetu</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Have questions regarding farmer onboarding, regional machinery Custom Hiring Centers, or corporate carbon partnership requirements? Reach out to our operational team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-emerald-950 text-white p-7 rounded-2xl space-y-6 shadow-md flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-bold font-serif text-lg text-emerald-100">FarmSetu Operations Desk</h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Central Operations Hub</div>
                  <div>ICAR-CRURRS Agro-Tech Complex</div>
                  <div>Ramgarh / Ranchi Agro-Climatic Zone, Jharkhand, India</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Farmer Support Helpline</div>
                  <div>+91 1800-FARM-SETU (Toll-free)</div>
                  <div>+91 94311 02938 (Mon-Sat, 9am - 6pm IST)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Electronic Communications</div>
                  <div>contact@farmsetu.in</div>
                  <div>partnerships@farmsetu.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Admin Dashboard Reflection</div>
                  <div>Every message is recorded directly to our relational database and surfaced immediately in the Admin Control Center.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900 text-[11px] text-emerald-300/80">
            Student Innovation Competition Working Prototype
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
          {status === 'success' ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Message Received!</h3>
              <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                Your message has been stored in the platform database and routed to our administrative queue.
                You can log in to the Admin Dashboard to inspect this live record.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('fullName')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('email')} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('phone')} (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Inquiry Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="General Platform Inquiry">General Platform Inquiry</option>
                    <option value="Farmer / FPO Onboarding Assistance">Farmer / FPO Onboarding Assistance</option>
                    <option value="Machinery Center (CHC) Partnership">Machinery Center (CHC) Partnership</option>
                    <option value="Corporate Buyer ESG Inquiry">Corporate Buyer ESG Inquiry</option>
                    <option value="KVK / Research Collaboration">KVK / Research Collaboration</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your requirements, location, or query..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Contact Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
