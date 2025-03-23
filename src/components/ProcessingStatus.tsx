
import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  stage: string;
  isComplete: boolean;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress, stage, isComplete }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Cpu size={20} className={`mr-2 ${isComplete ? 'text-green-400' : 'text-vidsmith-accent animate-pulse-slow'}`} />
          <h3 className="text-lg font-medium text-white">Processing</h3>
        </div>
        <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-vidsmith-border rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-vidsmith-accent-dark to-vidsmith-accent h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm text-gray-300">
        {isComplete ? (
          <span className="text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Processing complete
          </span>
        ) : (
          <span>
            {stage}{dots}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
