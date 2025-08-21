import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'TechCorp', url: 'https://via.placeholder.com/120x40/6366F1/FFFFFF?text=TechCorp' },
  { name: 'Innovate', url: 'https://via.placeholder.com/120x40/06B6D4/FFFFFF?text=Innovate' },
  { name: 'Growth Co', url: 'https://via.placeholder.com/120x40/8B5CF6/FFFFFF?text=Growth+Co' },
  { name: 'Digital Plus', url: 'https://via.placeholder.com/120x40/EF4444/FFFFFF?text=Digital+Plus' },
  { name: 'NextGen', url: 'https://via.placeholder.com/120x40/10B981/FFFFFF?text=NextGen' },
  { name: 'CreativeLab', url: 'https://via.placeholder.com/120x40/F59E0B/FFFFFF?text=CreativeLab' },
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
                    <img
                      src={logo.url}
                      alt={`${logo.name} logo`}
                      className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
                    />
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {logos.map((logo, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0">
                    <img
                      src={logo.url}
                      alt={`${logo.name} logo`}
                      className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
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