import React from 'react';
import { CalendarDays, Trash2, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency, formatTime12Hour } from '../../utils/helpers';
import CompanyLogo from '../shared/CompanyLogo';

export default function EventsDashboard({
  events, activeEventTab, eventDisplayMode, 
  openEventModal, handleDeleteEvent, companies
}) {
  const getCompany = (id) => companies.find(c => c.id === id);

  const viewEvents = activeEventTab === 'overview' ? events : events.filter(e => e.companyId === activeEventTab);
  const upcomingEvents = viewEvents.filter(e => new Date(`${e.eventDate}T12:00:00`) >= new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate));
  const pastEvents = viewEvents.filter(e => new Date(`${e.eventDate}T12:00:00`) < new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(b.eventDate) - new Date(a.eventDate));
  const currentCompany = activeEventTab === 'overview' ? null : getCompany(activeEventTab);

  const renderEventRow = (ev) => {
      const company = getCompany(ev.companyId);
      const evDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const isPast = new Date(`${ev.eventDate}T12:00:00`) < new Date(new Date().setHours(0,0,0,0));
      
      return (
          <tr key={ev.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${isPast ? 'opacity-60' : ''}`}>
            <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-purple-600 transition-colors flex items-center gap-2" onClick={() => openEventModal(ev)}>
              <CalendarDays size={16} className="text-purple-500" />{ev.title}
            </td>
            {activeEventTab === 'overview' && <td className="p-4"><div className="flex items-center gap-2"><CompanyLogo company={company} sizeClass="w-5 h-5" /><span className="text-sm text-slate-600">{company?.name}</span></div></td>}
            <td className="p-4 text-sm font-medium text-slate-700">{evDate} {ev.eventTime && <span className="text-slate-400 text-xs ml-1 block">{formatTime12Hour(ev.eventTime)}</span>}</td>
            <td className="p-4 font-medium text-slate-700">
              {ev.cost > 0 ? formatCurrency(ev.cost) : <span className="text-slate-400 text-sm font-normal">--</span>}
              {ev.installments && ev.installments.length > 0 && <span className="text-xs text-slate-400 font-normal ml-1 border bg-slate-50 px-1 rounded">Mult</span>}
            </td>
            <td className="p-4">
              {isPast ? (
                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full border bg-slate-50 text-slate-500 border-slate-200`}>N/A</span>
              ) : (
                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${ev.autoProject == 1 ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                   {ev.autoProject == 1 ? (ev.projectLeadUnit === 'now' ? 'YES (Immediate)' : `YES (${ev.projectLeadTime}${ev.projectLeadUnit.charAt(0)})`) : 'NO'}
                 </span>
              )}
            </td>
            <td className="p-4 text-right"><button onClick={() => handleDeleteEvent(ev.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
          </tr>
      );
  };

  return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><CalendarDays className="text-purple-600" size={28} />{activeEventTab === 'overview' ? 'Events' : `${currentCompany?.name} Events`}</h2>
          <p className="text-slate-500 text-sm mt-1">Plan for your major events.</p>
        </div>

        <div className="flex-1 overflow-hidden">
          {eventDisplayMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                 <h3 className="font-bold text-slate-700">All Scheduled Events</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4">Event Name</th>
                        {activeEventTab === 'overview' && <th className="p-4">Company</th>}
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Estimated Cost</th>
                        <th className="p-4">Auto-Project</th>
                        <th className="p-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingEvents.length > 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider p-2 px-4">Upcoming</td></tr>}
                      {upcomingEvents.map(renderEventRow)}
                      
                      {pastEvents.length > 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider p-2 px-4 border-t border-slate-200">Past Events</td></tr>}
                      {pastEvents.map(renderEventRow)}
                      
                      {viewEvents.length === 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="p-8 text-center text-slate-500">No events recorded yet.</td></tr>}
                    </tbody>
                  </table>
              </div>
            </div>
          )}

          {eventDisplayMode === 'timeline' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <h3 className="font-bold text-slate-700 mb-6">Upcoming Events Timeline</h3>
               <div className="relative border-l-2 border-purple-100 ml-3 space-y-8 pb-8">
                  {upcomingEvents.length > 0 ? upcomingEvents.map(ev => {
                    const company = getCompany(ev.companyId);
                    const displayDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div key={ev.id} className="relative pl-8">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-purple-500"></div>
                        <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                          <div>
                            <div className="text-sm font-bold mb-1 text-purple-600">{displayDate} {ev.eventTime && <span className="text-slate-400 font-normal ml-1">@ {formatTime12Hour(ev.eventTime)}</span>}</div>
                            <div className="font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 hover:text-purple-600" onClick={() => openEventModal(ev)}>{ev.title}</div>
                            <div className="flex items-center gap-2">
                              {activeEventTab === 'overview' && company && <div className="flex items-center gap-1"><CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" /><span className="text-[10px] text-slate-500 font-medium">{company.name}</span><span className="text-slate-300 px-1">•</span></div>}
                              {ev.autoProject == 1 && <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Prep Project: {ev.projectLeadUnit === 'now' ? 'Created Immediately' : `${ev.projectLeadTime} ${ev.projectLeadUnit} before`}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                             {ev.cost > 0 ? (
                                 <>
                                    <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(ev.cost)}</div>
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{ev.installments && ev.installments.length > 0 ? 'Multi-Payment' : 'Added to Expenses'}</span>
                                 </>
                             ) : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">No Cost</span>}
                          </div>
                        </div>
                      </div>
                    )
                  }) : <div className="p-8 text-slate-500 text-sm">No upcoming events planned. Click the + Event button above!</div>}
               </div>

               {pastEvents.length > 0 && (
                   <>
                      <h3 className="font-bold text-slate-400 mb-6 mt-12 pt-6 border-t border-slate-100">Past Events</h3>
                      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-8">
                          {pastEvents.map(ev => {
                              const company = getCompany(ev.companyId);
                              const displayDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                              return (
                              <div key={ev.id} className="relative pl-8 opacity-60 hover:opacity-100 transition-opacity">
                                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-slate-400"></div>
                                  <div className="p-3 rounded-lg border bg-white border-slate-200 group flex items-start justify-between">
                                  <div>
                                      <div className="font-medium text-slate-600 cursor-pointer flex items-center gap-1.5" onClick={() => openEventModal(ev)}>{ev.title}</div>
                                      {activeEventTab === 'overview' ? <div className="text-xs text-slate-400 mt-1">{displayDate} • {company?.name}</div> : <div className="text-xs text-slate-400 mt-1">{displayDate}</div>}
                                  </div>
                                  </div>
                              </div>
                              )
                          })}
                      </div>
                   </>
               )}
            </div>
          )}
        </div>
      </div>
  );
}