import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, AlertTriangle, Search, XCircle, Award, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useLanguage();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  let icon = <Clock className="w-3.5 h-3.5 mr-1" />;

  switch (status) {
    case 'Submitted':
    case 'Profile Submitted':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Under Review':
    case 'Reviewing':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Expert Review Required':
    case 'More Information Required':
      colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Partner Search':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      icon = <Search className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Potential Match Under Review':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      icon = <Sparkles className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Reviewed':
    case 'Arranged':
    case 'Verified Profile':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Unavailable':
    case 'Closed':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      icon = <XCircle className="w-3.5 h-3.5 mr-1" />;
      break;
    case 'Credits Issued':
      colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      icon = <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3.5 py-1.5' : 'text-xs px-2.5 py-1';

  // Translate status if available in dictionary
  const translatedText = t('status' + status.replace(/\s+/g, '')) || status;

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClasses} ${sizeClasses} transition-all`}>
      {icon}
      <span>{translatedText}</span>
    </span>
  );
};

export const DemoBadge: React.FC<{ isDemo?: number | boolean }> = ({ isDemo }) => {
  const { t } = useLanguage();
  if (isDemo) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-300">
        <span className="w-1.5 h-1.5 mr-1 rounded-full bg-amber-500 animate-pulse"></span>
        {t('sampleBadge')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
      <span className="w-1.5 h-1.5 mr-1 rounded-full bg-emerald-500"></span>
      {t('liveBadge')}
    </span>
  );
};
