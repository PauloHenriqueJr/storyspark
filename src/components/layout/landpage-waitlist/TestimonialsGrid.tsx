import React from 'react';
import { MOCK_TESTIMONIALS } from '@/data/testimonials';

const TestimonialsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MOCK_TESTIMONIALS.map(t => (
        <div key={t.id} className="p-4 bg-card/80 rounded-xl border border-border/10">
          <div className="font-semibold">{t.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{t.role} • {t.company}</div>
          <div className="text-sm">"{t.quote}"</div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsGrid;
