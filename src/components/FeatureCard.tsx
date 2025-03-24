
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <div className="rounded-full w-12 h-12 bg-vidsmith-accent/20 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-vidsmith-accent" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
