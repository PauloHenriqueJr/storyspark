import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ModernComposerWrapper } from './ModernComposerWrapper';
import { getMappingInfo } from '@/lib/templateMapping';

const Composer = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const templateParam = searchParams.get('template');
  const mapped = templateParam ? getMappingInfo(templateParam) : null;
  const selectedHook = (location.state as any)?.selectedHook;

  return (
    <div className="container py-8">
      <ModernComposerWrapper
        preSelectedTemplateId={mapped?.brazilianId || templateParam}
        selectedHook={selectedHook}
        onTemplateChange={() => { /* placeholder to clear state if needed */ }}
      />
    </div>
  );
};

export default Composer;
