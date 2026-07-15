import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function PlaylistSplitModal({
    isOpen,
    onClose,
    playlist,
    users,
    onSave
}) {
    const [splits, setSplits] = useState([]);

    useEffect(() => {
        if (playlist) {
            if (playlist.splits && playlist.splits.length > 0) {
                setSplits(playlist.splits);
            } else {
                // Default: fallback to assigning 100% of the net creator pool to the playlist owner
                setSplits([{ userId: playlist.userId, percent: 100 }]);
            }
        }
    }, [playlist]);

    if (!isOpen || !playlist) return null;

    const totalPercent = splits.reduce((sum, split) => sum + (parseFloat(split.percent) || 0), 0);

    const handleAddSplit = () => {
        setSplits([...splits, { userId: '', percent: 0 }]);
    };

    const handleRemoveSplit = (indexToRemove) => {
        const filteredSplits = splits.filter((_, index) => index !== indexToRemove);
        
        // Auto-balance the primary owner (index 0) if a co-host is removed
        if (filteredSplits.length > 0) {
            let otherTotal = 0;
            for (let i = 1; i < filteredSplits.length; i++) {
                otherTotal += (parseFloat(filteredSplits[i].percent) || 0);
            }
            filteredSplits[0].percent = Number(Math.max(0, 100 - otherTotal).toFixed(2));
        }
        
        setSplits(filteredSplits);
    };

    const handleSplitChange = (index, field, value) => {
        const newSplits = [...splits];
        
        if (field === 'percent') {
            const num = parseFloat(value);
            newSplits[index][field] = isNaN(num) ? 0 : num;
            
            // Auto-calculate the owner's split (index 0) when a co-host's percentage changes
            if (index !== 0 && newSplits.length > 0) {
                let otherTotal = 0;
                for (let i = 1; i < newSplits.length; i++) {
                    otherTotal += (parseFloat(newSplits[i].percent) || 0);
                }
                // Ensure the owner's percentage doesn't drop below 0
                newSplits[0].percent = Number(Math.max(0, 100 - otherTotal).toFixed(2));
            }
        } else {
            newSplits[index][field] = value;
        }
        
        setSplits(newSplits);
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (splits.some(s => !s.userId)) {
            alert("Please select a valid user for every split entry.");
            return;
        }

        if (Math.round(totalPercent * 100) / 100 !== 100) {
            alert(`Total split configurations must equal exactly 100%. Currently evaluated at: ${totalPercent}%.`);
            return;
        }

        onSave(playlist.id, splits);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Payout Splits</h2>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{playlist.playlistName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <p className="text-sm text-slate-600 mb-6">
                        Splits apply directly to the <strong>net creator pool</strong>. After the company takes its structural share, the remaining amount is broken up exactly as defined below.
                    </p>

                    <form id="split-form" onSubmit={handleSave} className="space-y-4">
                        {splits.map((split, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <select
                                        value={split.userId}
                                        onChange={(e) => handleSplitChange(index, 'userId', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                        required
                                    >
                                        <option value="">Select Creator...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24 relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={split.percent === 0 && index !== 0 ? '' : split.percent}
                                        onChange={(e) => handleSplitChange(index, 'percent', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-8 text-right"
                                        required
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                                </div>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSplit(index)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                {index === 0 && (
                                    <div className="w-8"></div> // Spacing placeholder so the inputs align perfectly
                                )}
                            </div>
                        ))}
                    </form>

                    <button
                        type="button"
                        onClick={handleAddSplit}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-slate-200 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-colors"
                    >
                        <Plus size={16} />
                        Add Split Rule
                    </button>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-semibold">Total Assigned</span>
                        <span className={`text-lg font-bold ${totalPercent === 100 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {totalPercent.toFixed(2)}%
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            form="split-form"
                            type="submit"
                            disabled={totalPercent !== 100}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                        >
                            Save Splits
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}