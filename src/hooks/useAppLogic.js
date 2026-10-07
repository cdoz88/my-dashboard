import { useUI } from './useUI';
import { useModals } from './useModals';
import { useData } from './useData'; // Ensure you rename useData_2.js to useData.js!
import { useIntegrations } from './useIntegrations';

export function useAppLogic() {
  // 1. Initialize UI & Routing State
  const uiState = useUI();
  
  // 2. Initialize Modal Visibility State
  const modalsState = useModals();

  // 3. Initialize Core Data & API Functions (Passes UI & Modals down)
  const dataState = useData({ ...uiState, ...modalsState });

  // 4. Initialize 3rd-Party Integrations (Passes everything down)
  const integrationsState = useIntegrations({ ...uiState, ...modalsState, ...dataState });

  // Merge all custom hooks into a single context payload
  return {
    ...uiState,
    ...modalsState,
    ...dataState,
    ...integrationsState
  };
}