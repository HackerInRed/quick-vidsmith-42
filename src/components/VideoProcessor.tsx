
import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';

interface VideoSource {
  type: 'file';
  source: File;
  query: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

interface ApiStatus {
  isConnected: boolean;
  message: string;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isConnected: false,
    message: 'Checking backend connection...'
  });
  
  const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual backend URL

  // Check API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (response.ok) {
          setApiStatus({
            isConnected: true,
            message: 'Connected to backend'
          });
        } else {
          setApiStatus({
            isConnected: false,
            message: 'Backend is unavailable'
          });
        }
      } catch (error) {
        setApiStatus({
          isConnected: false,
          message: 'Cannot connect to backend'
        });
      }
    };

    checkApiConnection();
    
    // Set up periodic checking
    const intervalId = setInterval(checkApiConnection, 10000);
    
    return () => clearInterval(intervalId);
  }, [API_BASE_URL]);

  // Poll job status
  useEffect(() => {
    let intervalId: number;

    if (jobId && isProcessing) {
      intervalId = window.setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/status/${jobId}`);
          
          if (!response.ok) {
            console.error('Error fetching job status:', response.statusText);
            return;
          }

          const data = await response.json();
          console.log('Job status response:', data);
          
          // Update progress based on status
          setProgress(Math.round(data.progress * 100));
          setProcessingStage(data.message || 'Processing video...');

          // Check if processing is complete
          if (data.status === 'completed') {
            clearInterval(intervalId);
            setIsProcessing(false);
            setProgress(100);
            
            // Get the video output URL
            try {
              const outputUrl = `${API_BASE_URL}/output/${jobId}`;
              console.log('Output video URL:', outputUrl);
              setProcessedVideoUrl(outputUrl);
              toast.success('Video processing complete!');
            } catch (err) {
              console.error('Error getting output video:', err);
              toast.error('Error retrieving the processed video');
            }
          }
          
          // Check if processing failed
          if (data.status === 'failed') {
            clearInterval(intervalId);
            setIsProcessing(false);
            toast.error(`Processing failed: ${data.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error polling job status:', error);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, isProcessing, API_BASE_URL]);

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    setJobId(null);
    
    toast.info('Starting video processing...');
    
    try {
      // Create form data for sending to API
      const formData = new FormData();
      formData.append('prompt', data.query || 'Extract interesting parts');
      
      // Map aspect ratio to backend format
      const backendAspectRatio = 
        data.aspectRatio === '1:1' ? 'square' : 
        data.aspectRatio === '9:16' ? 'reel' : 'youtube';
      
      formData.append('aspect_ratio', backendAspectRatio);
      formData.append('burn_captions', data.captions.toString());
      formData.append('video', data.source as File);
      
      // Call the API to start processing
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Process response:', result);
      setJobId(result.job_id);
      
    } catch (error) {
      console.error('API Processing Error:', error);
      setIsProcessing(false);
      toast.error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* API Status Indicator */}
      <div className={`text-center mb-4 text-sm ${apiStatus.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
        {apiStatus.message}
      </div>
      
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
