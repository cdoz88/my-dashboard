import React from 'react';
import { BarChart3, Users, MousePointerClick, Clock, Globe, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function AnalyticsDashboard({ analyticsProperties, activeAnalyticsId }) {
    
    const activeProperty = analyticsProperties.find(p => p.id === activeAnalyticsId);

    if (!analyticsProperties || analyticsProperties.length === 0) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
                <BarChart3 size={64} className="mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-slate-700 mb-2">No Analytics Connected</h2>
                <p className="max-w-md text-center">Connect your Google Analytics 4 (GA4) property using the "+" button in the sidebar to start tracking your web traffic.</p>
            </div>
        );
    }

    if (!activeProperty) return null;

    // Parse the JSON data securely
    const overview = activeProperty.overview ? JSON.parse(activeProperty.overview) : { activeUsers: 0, sessions: 0, avgSessionDuration: 0 };
    const topPages = activeProperty.topPages ? JSON.parse(activeProperty.topPages) : [];
    const trafficSources = activeProperty.trafficSources ? JSON.parse(activeProperty.trafficSources) : [];
    const geoData = activeProperty.geoData ? JSON.parse(activeProperty.geoData) : [];

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="text-orange-500" size={28} />
                        {activeProperty.name}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        GA4 Property ID: {activeProperty.propertyId} • Last Synced: {activeProperty.lastSynced ? new Date(activeProperty.lastSynced).toLocaleString() : 'Never'}
                    </p>
                </div>
            </div>

            {/* TOPLINE METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 flex-shrink-0">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Users size={14}/> Active Users</div>
                    <div className="text-3xl font-black text-slate-800">{parseInt(overview.activeUsers || 0).toLocaleString()}</div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MousePointerClick size={14}/> Total Sessions</div>
                    <div className="text-3xl font-black text-slate-800">{parseInt(overview.sessions || 0).toLocaleString()}</div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={14}/> Avg Engagement Time</div>
                    <div className="text-3xl font-black text-slate-800">{formatDuration(overview.avgSessionDuration || 0)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                {/* TOP PAGES */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><LinkIcon size={16} className="text-slate-400"/> Top Performing Pages</h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Page Path</th>
                                    <th className="p-4 text-right">Views</th>
                                    <th className="p-4 text-right">Users</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topPages.length > 0 ? topPages.map((page, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-700 text-sm max-w-[250px] truncate" title={page.path}>{page.path}</td>
                                        <td className="p-4 text-right font-bold text-slate-800">{parseInt(page.views).toLocaleString()}</td>
                                        <td className="p-4 text-right text-slate-600">{parseInt(page.users).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-8 text-center text-slate-400 italic">No page data available for this timeframe.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="flex flex-col gap-8">
                    {/* TRAFFIC SOURCES */}
                    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><MousePointerClick size={16} className="text-slate-400"/> Top Traffic Sources</h3>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-100">
                                    {trafficSources.length > 0 ? trafficSources.map((source, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-medium text-slate-700 text-sm capitalize">{source.source.replace('(none)', 'Direct')}</td>
                                            <td className="p-3 text-right font-bold text-slate-800">{parseInt(source.sessions).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="2" className="p-6 text-center text-slate-400 italic text-sm">No source data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* GEO DATA */}
                    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Globe size={16} className="text-slate-400"/> Top Countries</h3>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-100">
                                    {geoData.length > 0 ? geoData.map((geo, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-medium text-slate-700 text-sm">{geo.country}</td>
                                            <td className="p-3 text-right font-bold text-slate-800">{parseInt(geo.users).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="2" className="p-6 text-center text-slate-400 italic text-sm">No geographic data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}