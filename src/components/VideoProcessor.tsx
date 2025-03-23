
import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';

interface VideoSource {
  type: 'url' | 'file';
  source: string | File;
  query: string;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  
  // Mock processing stages with realistic timing
  const processingStages = [
    'Initializing',
    'Analyzing video content',
    'Identifying key moments',
    'Generating clips',
    'Applying optimizations',
    'Finalizing output'
  ];

  // Simulate processing with staged progress
  useEffect(() => {
    if (!isProcessing || !videoSource) return;
    
    let currentProgress = 0;
    let currentStageIndex = 0;
    
    // Mock processing with stages
    const interval = setInterval(() => {
      // Randomly increment progress, but ensure smooth progression
      const increment = Math.random() * 2 + 0.1;
      currentProgress += increment;
      
      // Update stage based on progress
      if (currentProgress > (currentStageIndex + 1) * (100 / processingStages.length)) {
        currentStageIndex = Math.min(currentStageIndex + 1, processingStages.length - 1);
        setProcessingStage(processingStages[currentStageIndex]);
      }
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Simulate a little delay before completing
        setTimeout(() => {
          // Mock result video (in production, this would be a real URL)
          const demoVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          setProcessedVideoUrl(demoVideoUrl);
          setIsProcessing(false);
          setProgress(100);
          toast.success('Video processing complete!');
        }, 500);
        
        return;
      }
      
      setProgress(currentProgress);
    }, 200);
    
    return () => clearInterval(interval);
  }, [isProcessing, videoSource]);

  const handleVideoSubmit = (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    
    // In a real app, you would call your API here
    toast.info('Starting video processing...');
    
    // If it's a file, we'd typically upload it first
    if (data.type === 'file') {
      console.log('Processing file:', data.source);
      console.log('User query:', data.query);
      // In a real implementation, upload the file to your server
    } else {
      console.log('Processing URL:', data.source);
      console.log('User query:', data.query);
      // In a real implementation, send the URL to your server
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isProcessing && !processedVideoUrl && (
        <VideoInput onVideoSubmit={handleVideoSubmit} isProcessing={isProcessing} />
      )}
      
      {isProcessing && (
        <ProcessingStatus 
          progress={progress} 
          stage={processingStage} 
          isComplete={!isProcessing && processedVideoUrl !== null} 
        />
      )}
      
      {processedVideoUrl && (
        <div className="space-y-6">
          <VideoPlayer src={processedVideoUrl} title="Your Processed Video" />
          
          <div className="flex justify-center">
            <button 
              className="btn-secondary"
              onClick={() => {
                setVideoSource(null);
                setProcessedVideoUrl(null);
                setIsProcessing(false);
              }}
            >
              Process another video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;
