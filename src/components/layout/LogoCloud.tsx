import React from 'react';
import { motion } from 'framer-motion';

// Componente de logo SVG simples
const SimpleLogo = ({ name, bgColor, textColor }: { name: string; bgColor: string; textColor: string }) => (
  <div 
    className="inline-flex items-center justify-center w-[120px] h-[40px] rounded"
    style={{ backgroundColor: bgColor }}
  >
    <span 
      className="text-sm font-semibold"
      style={{ color: textColor }}
    >
      {name}
    </span>
  </div>
);

const logos = [
  { name: 'TechCorp', bgColor: '#6366F1', textColor: '#FFFFFF' },
  { name: 'Innovate', bgColor: '#06B6D4', textColor: '#FFFFFF' },
  { name: 'Growth Co', bgColor: '#8B5CF6', textColor: '#FFFFFF' },
  { name: 'Digital Plus', bgColor: '#EF4444', textColor: '#FFFFFF' },
  { name: 'NextGen', bgColor: '#10B981', textColor: '#FFFFFF' },
  { name: 'CreativeLab', bgColor: '#F59E0B', textColor: '#FFFFFF' },
];

export const LogoCloud = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <motion.p 
            className="text-sm font-medium text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Mais de 10.000 empresas confiam no Dialeto
          </motion.p>
          
          <div className="relative">
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />
            
            {/* Logos container */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-12 items-center"
                animate={{
                  x: [0, -1920]
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ width: "calc(200% + 48px)" }}
              >
                {/* First set */}
                {logos.map((logo, index) => (
                  <div key={index} className="flex-shrink-0">
                    <SimpleLogo
                      name={logo.name}
                      bgColor={logo.bgColor}
                      textColor={logo.textColor}
                    />
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {logos.map((logo, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0">
                    <SimpleLogo
                      name={logo.name}
                      bgColor={logo.bgColor}
                      textColor={logo.textColor}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};