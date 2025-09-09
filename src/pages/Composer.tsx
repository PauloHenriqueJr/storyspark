import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ModernComposerWrapper } from './ModernComposerWrapper';
import { getMappingInfo } from '@/utils/templateMapping';

const Composer: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get template ID from URL params or location state
  const templateId = searchParams.get('template') || location.state?.templateId;
  const selectedHook = location.state?.selectedHook;
  
  return (
    <ModernComposerWrapper 
      preSelectedTemplateId={templateId}
      selectedHook={selectedHook}
      onTemplateChange={() => {
        // Clear the template from URL after it's been processed
        if (templateId) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('template');
          window.history.replaceState({}, '', `${location.pathname}?${newSearchParams.toString()}`);
        }
      }}
      onHookChange={() => {
        // Clear the hook from location state after it's been processed
        if (selectedHook) {
          window.history.replaceState({}, '', location.pathname + location.search);
        }
      }}
    />
  );
};

export default Composer;
export { Composer as Component };
