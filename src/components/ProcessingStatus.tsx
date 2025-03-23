
import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  stage: string;
  isComplete: boolean;
  error?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress, stage, isComplete, error }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    return () => clearInterval(interval);
  }, [isComplete]);

  // Format stage message to be more user-friendly
  const formatStage = (stage: string) => {
    // Remove "ing" forms and add them back with proper capitalization
    const formattedStage = stage
      .replace(/^Initializing$/, "Initializing your request")
      .replace(/^Analyzing video content$/, "Analyzing video content")
      .replace(/^Identifying key moments$/, "Identifying key moments")
      .replace(/^Generating clips$/, "Generating video clips")
      .replace(/^Extracting audio from video$/, "Extracting audio")
      .replace(/^Uploading audio file for transcription$/, "Preparing for transcription")
      .replace(/^Transcribing audio with Gemini$/, "Transcribing with AI")
      .replace(/^Transcription completed/, "Transcription complete")
      .replace(/^Structuring transcription data/, "Processing transcription")
      .replace(/^Finding relevant segments/, "Finding key video segments")
      .replace(/^Editing video with selected segments/, "Editing video clips")
      .replace(/^Applying/, "Setting aspect ratio:")
      .replace(/^Rendering intermediate video/, "Rendering video")
      .replace(/^Generating captions/, "Creating captions")
      .replace(/^Burning captions/, "Adding captions to video")
      .replace(/^SRT file generated/, "Caption file created")
      .replace(/^Video with burned captions completed/, "Captions added to video")
      .replace(/^Processing completed successfully/, "Processing complete!");
    
    return formattedStage;
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle size={20} className="text-red-500" />;
    if (isComplete) return <CheckCircle size={20} className="text-green-400" />;
    return <Cpu size={20} className="text-vidsmith-accent animate-pulse-slow" />;
  };

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getStatusIcon()}
          <h3 className="text-lg font-medium text-white ml-2">
            {error ? 'Error' : isComplete ? 'Complete' : 'Processing'}
          </h3>
        </div>
        {!error && <span className="text-sm text-gray-300">{Math.round(progress)}%</span>}
      </div>
      
      <div className="w-full bg-vidsmith-border rounded-full h-2 mb-4">
        <div 
          className={`${error ? 'bg-red-500' : 'bg-gradient-to-r from-vidsmith-accent-dark to-vidsmith-accent'} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${error ? 100 : progress}%` }}
        />
      </div>
      
      <div className="text-sm">
        {error ? (
          <span className="text-red-400 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </span>
        ) : isComplete ? (
          <span className="text-green-400 flex items-center">
            <CheckCircle size={16} className="mr-1" />
            Processing complete
          </span>
        ) : (
          <span className="text-gray-300 flex items-center">
            <Info size={16} className="mr-1 text-vidsmith-accent" />
            {formatStage(stage)}{dots}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
