import React, { createContext, useContext } from 'react';
import { useUI } from '../hooks/useUI';
import { useModals } from '../hooks/useModals';
import { useData } from '../hooks/useData';
import { useIntegrations } from '../hooks/useIntegrations';

const AppContext = createContext();

export function AppProvider({ children }) {
    // 1. Initialize the UI and Modals state
    const ui = useUI();
    const modals = useModals();
    
    // 2. Pass them directly into our Database hook so it doesn't have to guess what's open
    const data = useData({ ...ui, ...modals });
    
    // 3. Pass everything into the Integrations hook so it can make external API calls
    const integrations = useIntegrations({ ...ui, ...modals, ...data });

    // 4. Merge it all into a single, global data cloud!
    const value = {
        ...ui,
        ...modals,
        ...data,
        ...integrations
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// 5. This is the custom hook that other components will use to instantly grab whatever data they need
export function useAppContext() {
    return useContext(AppContext);
}