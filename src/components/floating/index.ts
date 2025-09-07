// Componente principal
export { default as FloatingAIAssistant } from "./FloatingAIAssistant";

// Utils
export { getPageContext, PAGE_CONTEXTS } from "./utils/contextDetector";
export { getActionsByContext, ACTIONS_MAP } from "./utils/actionMapper";

// Context Components
export { AnalyticsContext } from "./contexts/AnalyticsContext";
export { ComposerContext } from "./contexts/ComposerContext";
export { CampaignsContext } from "./contexts/CampaignsContext";
export { PersonasContext } from "./contexts/PersonasContext";
export { BrandVoicesContext } from "./contexts/BrandVoicesContext";

// Action Components
export { CopyGeneration } from "./actions/CopyGeneration";
export { DocumentUpload } from "./actions/DocumentUpload";

// Types (se necessário)
export type { PageContext } from "./utils/contextDetector";
