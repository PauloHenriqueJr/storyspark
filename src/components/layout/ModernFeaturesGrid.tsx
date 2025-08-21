import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Palette, 
  Code, 
  Smartphone, 
  Globe,
  ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with performance in mind. Optimized for speed and efficiency.',
    category: 'Performance'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security with advanced protection mechanisms.',
    category: 'Security'
  },
  {
    icon: Palette,
    title: 'Customizable',
    description: 'Fully customizable design system with unlimited possibilities.',
    category: 'Design'
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Clean APIs and comprehensive documentation for developers.',
    category: 'Developer'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Responsive design that works perfectly on all devices.',
    category: 'Responsive'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Built to scale globally with CDN and edge computing support.',
    category: 'Scale'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const ModernFeaturesGrid = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              build better
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive set of tools and components designed for modern development workflows.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full border hover:border-primary/20 transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <feature.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};