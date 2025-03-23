
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

interface ApiResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  
  // Processing stages with realistic timing
  const processingStages = [
    'Initializing',
    'Analyzing video content',
    'Identifying key moments',
    'Generating clips',
    'Applying optimizations',
    'Finalizing output'
  ];

  // Make API call to your endpoint
  const processVideoWithApi = async (data: VideoSource) => {
    const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint
    
    try {
      // Create form data for sending to API
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('query', data.query || '');
      
      if (data.type === 'url') {
        formData.append('url', data.source as string);
      } else {
        formData.append('file', data.source as File);
      }
      
      // Make the API call
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process video');
      }
      
      // Return the processed video URL
      return result.videoUrl;
    } catch (error) {
      console.error('API Processing Error:', error);
      throw error;
    }
  };

  // Simulate processing with progress updates
  useEffect(() => {
    if (!isProcessing || !videoSource) return;
    
    let currentProgress = 0;
    let currentStageIndex = 0;
    
    // Update progress and stage at intervals
    const progressInterval = setInterval(() => {
      // Increment progress
      const increment = Math.random() * 2 + 0.1;
      currentProgress += increment;
      
      // Update stage based on progress
      if (currentProgress > (currentStageIndex + 1) * (100 / processingStages.length)) {
        currentStageIndex = Math.min(currentStageIndex + 1, processingStages.length - 1);
        setProcessingStage(processingStages[currentStageIndex]);
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        return;
      }
      
      setProgress(currentProgress);
    }, 200);
    
    return () => clearInterval(progressInterval);
  }, [isProcessing, videoSource]);

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    
    toast.info('Starting video processing...');
    
    try {
      // Make the actual API call
      const videoUrl = await processVideoWithApi(data);
      
      // Simulate additional processing time for smoother UX
      setTimeout(() => {
        setProcessedVideoUrl(videoUrl);
        setIsProcessing(false);
        setProgress(100);
        toast.success('Video processing complete!');
      }, 1000);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      toast.error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
