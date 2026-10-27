import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ContactSubmission } from '../../types';
import { Mail, Clock, Phone, User, MessageSquare } from 'lucide-react';

export const AdminContacts: React.FC = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Public Contact Form Submissions
        </h1>
        <p className="text-xs text-slate-600">
          Messages received via the public website contact portal.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div
              key={msg.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{msg.subject}</span>
                  <span className="font-mono text-slate-400 text-[11px]">({msg.id})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-semibold text-slate-900">{msg.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${msg.email}`} className="text-emerald-700 hover:underline">{msg.email}</a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{msg.phone}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed">
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No contact submissions in the database.
          </div>
        )}
      </div>
    </div>
  );
};
