import React from 'react';
import { Mic, Play, Download, MapPin, Compass } from 'lucide-react';

export default function SpreakerDashboard({ spreakerShows, activeSpreakerShowId, spreakerTimeFilter }) {
  const activeShow = spreakerShows.find(c => c.id === activeSpreakerShowId);
  
  if (!activeShow) {
    return (
      <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center bg-slate-50/50">
        <Mic size={64} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-500">No Spreaker Podcasts Found</h2>
        <p className="text-slate-400 mt-2 text-center max-w-md">Select a show from the sidebar or add a new one to start tracking your podcast analytics.</p>
      </div>
    );
  }

  const getSpreakerTimeLabel = () => {
    switch(spreakerTimeFilter) {
        case '1': return 'Today';
        case '2': return 'Yesterday';
        case '7': return 'Last 7 Days';
        case '30': return 'Last 30 Days';
        case '365': return 'Last 12 Months';
        default: return 'All Time';
    }
  };
  
  const spLabel = getSpreakerTimeLabel();

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Mic className="text-[#ffc005]" size={28} />
             {activeShow.name} Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">Overview of your podcast performance and reach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-[#ffc005]">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Play size={16} className="text-[#ffc005]" /> Total Plays {spLabel !== 'All Time' && `(${spLabel})`}
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeShow.plays || '0'}</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Download size={16} className="text-blue-500" /> Downloads {spLabel !== 'All Time' && `(${spLabel})`}
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeShow.downloads || '0'}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <MapPin size={16} className="text-red-500" /> Top Location {spLabel !== 'All Time' && `(${spLabel})`}
          </div>
          <div className="text-3xl font-bold text-slate-800 truncate" title={activeShow.topGeo || 'N/A'}>{activeShow.topGeo || 'N/A'}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Compass size={16} className="text-emerald-500" /> Top Source {spLabel !== 'All Time' && `(${spLabel})`}
          </div>
          <div className="text-3xl font-bold text-slate-800 truncate" title={activeShow.topSource || 'N/A'}>{activeShow.topSource || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}