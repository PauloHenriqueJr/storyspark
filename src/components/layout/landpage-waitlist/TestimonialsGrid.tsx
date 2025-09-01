import React from 'react';
import { MOCK_TESTIMONIALS, TESTIMONIALS_NOTE } from '@/data/testimonials';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialsGrid: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs text-muted-foreground/70 italic">
          {TESTIMONIALS_NOTE}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_TESTIMONIALS.slice(0, 6).map((testimonial, index) => (
          <motion.div 
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            
            <blockquote className="text-sm mb-4 leading-relaxed text-foreground/90">
              "{testimonial.quote}"
            </blockquote>
            
            <div className="border-t border-border/10 pt-3">
              <div className="font-semibold text-foreground">{testimonial.name}</div>
              <div className="text-xs text-muted-foreground">
                {testimonial.role} • {testimonial.company}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
