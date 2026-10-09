import React, { useState } from 'react';
import { Globe, FileText, ExternalLink, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function WordpressTab({ wpLedgerData, currentUser, users }) {
    const [selectedWpUserId, setSelectedWpUserId] = useState(null);

    const visibleWpLedger = wpLedgerData.filter(wpRecord => currentUser?.isAdmin || wpRecord.wp_user_id == currentUser?.wpUserId);

    // --- CREATOR VIEW OR ADMIN VIEWING SPECIFIC CREATOR ---
    if (!currentUser?.isAdmin || selectedWpUserId) {
        const targetUserId = currentUser?.isAdmin ? selectedWpUserId : currentUser?.wpUserId;
        const myWpData = visibleWpLedger.find(wp => wp.wp_user_id == targetUserId) || null;
        
        const totalArticles = myWpData ? parseInt(myWpData.articles || 0) : 0;
        const totalViews = myWpData ? parseInt(myWpData.views || 0) : 0;
        const totalRevenue = myWpData ? parseFloat(myWpData.total_earned || 0) : 0;
        const articleDetails = myWpData?.article_details || myWpData?.posts || []; 
        const writerName = myWpData?.name || 'Writer';

        return (
            <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
                <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            {currentUser?.isAdmin && (
                                <button onClick={() => setSelectedWpUserId(null)} className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 flex-shrink-0" title="Back to Master List">
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Globe className="text-sky-600" size={28} />
                                    {currentUser?.isAdmin ? `${writerName}'s Article Performance` : 'Your Article Performance'}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Detailed breakdown of {currentUser?.isAdmin ? 'their' : 'your'} published WordPress articles.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-800">
                            <div className="text-slate-500 text-sm font-medium mb-1">Total Articles</div>
                            <div className="text-3xl font-bold text-slate-800">{totalArticles.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-sky-500">
                            <div className="text-slate-500 text-sm font-medium mb-1">Total Views</div>
                            <div className="text-3xl font-bold text-slate-800">{totalViews.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                            <div className="text-slate-500 text-sm font-medium mb-1">Total Earnings</div>
                            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[700px]">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Article Title</th>
                                        <th className="px-6 py-4 text-center">Views</th>
                                        <th className="px-6 py-4 text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {articleDetails.length > 0 ? articleDetails.map((article, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    <FileText size={16} className="text-sky-500 flex-shrink-0" />
                                                    <span className="truncate max-w-[300px]" title={article.title}>{article.title}</span>
                                                    {article.url && (
                                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-600 transition-colors">
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                                {article.date && <div className="text-[10px] text-slate-500 mt-1">{new Date(article.date).toLocaleDateString()}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-slate-700">{parseInt(article.views || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(parseFloat(article.earned || 0))}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Globe size={48} className="text-slate-3300 mb-3" />
                                                    <p className="font-semibold text-slate-700">No individual article data available yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- ADMIN VIEW (Master List) ---
    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Globe className="text-sky-600" size={28} />
                            WordPress Articles
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">View article counts, views, and generated revenue for your writers.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">WordPress Writer</th>
                                    <th className="px-6 py-4">Linked User Profile</th>
                                    <th className="px-6 py-4 text-center">Articles</th>
                                    <th className="px-6 py-4 text-center">Views</th>
                                    <th className="px-6 py-4 text-right">Revenue Generated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibleWpLedger.map(wpRecord => {
                                    const earned = parseFloat(wpRecord.total_earned || 0);
                                    const linkedUser = users.find(u => u.wpUserId == wpRecord.wp_user_id);
                                    
                                    return (
                                    <tr key={wpRecord.wp_user_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer hover:text-sky-600 transition-colors w-fit" onClick={() => setSelectedWpUserId(wpRecord.wp_user_id)} title="View Article Breakdown">
                                                <Globe size={16} className="text-sky-500" /> {wpRecord.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {linkedUser ? linkedUser.name : <span className="text-slate-400 italic">Unlinked</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{wpRecord.articles || 0}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{parseInt(wpRecord.views || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(earned)}</td>
                                    </tr>
                                )})}
                                {visibleWpLedger.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No WordPress article data available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}