
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-panel p-8 rounded-xl h-full border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-glow group">
      <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
