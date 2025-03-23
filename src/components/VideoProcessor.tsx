
import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';
import { useApiStatus } from '../hooks/useApiStatus';

interface VideoSource {
  type: 'url' | 'file';
  source: string | File;
  query: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const { isApiAvailable, checkApiStatus } = useApiStatus();
  
  // Check API availability on component mount
  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);
  
  // Poll for job status if we have a job ID
  useEffect(() => {
    if (!jobId || !isProcessing) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        setProgress(data.progress);
        setProcessingStage(data.message);
        
        if (data.status === 'completed') {
          setIsProcessing(false);
          setProcessedVideoUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${data.output_video}`);
          toast.success('Video processing complete!');
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setIsProcessing(false);
          toast.error(`Processing failed: ${data.error || 'Unknown error'}`);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        // Don't stop polling on network errors
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [jobId, isProcessing]);

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    
    if (isApiAvailable) {
      // Use the backend API
      await processWithBackend(data);
    } else {
      // Simulate processing with frontend-only logic
      simulateProcessing(data);
    }
  };
  
  const processWithBackend = async (data: VideoSource) => {
    try {
      toast.info('Starting video processing...');
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('query', data.query || 'Extract interesting moments');
      formData.append('aspect_ratio', mapAspectRatio(data.aspectRatio));
      formData.append('add_captions', String(data.captions));
      
      if (data.type === 'url') {
        formData.append('video_url', data.source as string);
      } else {
        formData.append('video_file', data.source as File);
      }
      
      // Send the request to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/process`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setJobId(result.id);
      setProcessingStage(result.message);
      setProgress(result.progress);
      
    } catch (error) {
      console.error('Error processing video with backend:', error);
      setIsProcessing(false);
      toast.error(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Map frontend aspect ratio to backend enum values
  const mapAspectRatio = (ratio: '1:1' | '16:9' | '9:16'): string => {
    switch (ratio) {
      case '1:1': return 'square';
      case '16:9': return 'youtube';
      case '9:16': return 'reel';
      default: return 'youtube';
    }
  };
  
  // Simulate processing for frontend-only mode
  const simulateProcessing = (data: VideoSource) => {
    toast.info('Starting video processing...');
    console.log('Processing with options:', {
      aspectRatio: data.aspectRatio,
      captions: data.captions
    });
    
    // Processing stages with realistic timing
    const processingStages = [
      'Initializing',
      'Analyzing video content',
      'Identifying key moments',
      'Generating clips',
      'Applying optimizations',
      'Finalizing output'
    ];
    
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
        
        setTimeout(() => {
          setProcessedVideoUrl('/sample-output.mp4'); // Sample video path
          setIsProcessing(false);
          setProgress(100);
          toast.success('Video processing complete!');
        }, 1000);
        
        return;
      }
      
      setProgress(currentProgress);
    }, 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isApiAvailable && (
        <div className="text-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            <span className="w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
            Connected to backend
          </span>
        </div>
      )}
      
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
                setJobId(null);
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
