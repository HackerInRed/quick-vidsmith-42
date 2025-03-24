
import React from 'react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-extrabold text-xl tracking-tight font-mono">
        Cre<span className="text-vidsmith-accent font-black">AI</span>tive
      </span>
    </div>
  );
};

export default Logo;
