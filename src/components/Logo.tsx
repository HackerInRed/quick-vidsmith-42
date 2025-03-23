
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-white">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-vidsmith-accent rounded-lg rotate-45 transform-gpu transition-transform duration-300 hover:rotate-[135deg]"></div>
        <div className="absolute inset-1 bg-vidsmith-dark rounded-lg rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-vidsmith-accent">CreA</span>Itive
      </span>
    </div>
  );
};

export default Logo;
