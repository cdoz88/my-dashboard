import React from 'react';

export default function CompanyLogo({ company, sizeClass = "w-5 h-5", textClass = "text-[10px]" }) {
  if (!company) return null;
  
  if (company.logoUrl) {
    return (
      <img 
        src={company.logoUrl} 
        alt={company.name} 
        className={`${sizeClass} rounded object-cover flex-shrink-0 shadow-sm border border-slate-200 bg-white`} 
      />
    );
  }
  
  return (
    <div className={`${sizeClass} rounded bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold ${textClass} flex-shrink-0 shadow-sm`}>
      {company.name.charAt(0).toUpperCase()}
    </div>
  );
}