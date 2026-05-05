import React, { useEffect } from 'react';
import { BookOpen } from 'lucide-react';

export default function KnowledgeBaseDashboard() {
    
    useEffect(() => {
        // We dynamically inject the Charla script into the document body if it isn't already there.
        // This ensures it loads perfectly without conflicting with React's routing.
        if (!document.querySelector('script[src="https://app.charla.com/help-center/help-center.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://app.charla.com/help-center/help-center.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={28} />
                        Knowledge Base
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Official guides, SOPs, and helpful documentation.</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[600px] flex items-center justify-center p-4">
                {/* React natively supports custom web components, so we can just render the Charla widget directly! */}
                <div className="w-full h-full max-w-4xl mx-auto">
                   <charla-help-center p="fd40e732-0396-460d-90e2-e07b45568809"></charla-help-center>
                </div>
            </div>
        </div>
    );
}