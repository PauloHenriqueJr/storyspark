import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Zap } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    description: 'Trusted by developers worldwide'
  },
  {
    icon: Globe,
    value: '100+',
    label: 'Countries',
    description: 'Global reach and support'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable and always available'
  },
  {
    icon: TrendingUp,
    value: '500%',
    label: 'Growth',
    description: 'Year over year improvement'
  }
];

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
};

export const ModernStatsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="text-muted-foreground">
            Join the community of developers building the future
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center group"
              variants={statVariants}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border mb-4 group-hover:border-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};