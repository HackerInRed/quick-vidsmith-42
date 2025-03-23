
import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface VideoSource {
  type: 'url' | 'file';
  source: string | File;
  query: string;
  aspectRatio: 'square' | 'youtube' | 'reel';
  captions: boolean;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  // Create WebSocket connection when clientId changes
  useEffect(() => {
    if (!clientId || !isProcessing) return;
    
    const host = window.location.hostname;
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const port = 8000; // Default FastAPI port
    
    const wsUrl = `${protocol}://${host}:${port}/ws/${clientId}`;
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      // Send initial data to server
      if (videoSource && clientId) {
        newSocket.send(JSON.stringify({
          video_id: clientId,
          query: videoSource.query || '',
          aspect_ratio: videoSource.aspectRatio,
          burn_captions: videoSource.captions
        }));
      }
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.status) {
          // Update status and progress
          setProcessingStage(data.status);
          
          // Extract percentage from status if available
          const percentMatch = data.status.match(/(\d+)%/);
          if (percentMatch && percentMatch[1]) {
            setProgress(parseInt(percentMatch[1]));
          }
          
          // Check for completion
          if (data.status === 'completed' && data.output_video) {
            setProcessedVideoUrl(data.output_video);
            setIsProcessing(false);
            setProgress(100);
            toast.success('Video processing complete!');
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error. Please try again.');
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [clientId, isProcessing, videoSource]);

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    
    // Generate client ID for WebSocket connection
    const newClientId = uuidv4();
    setClientId(newClientId);
    
    toast.info('Starting video processing...');
    console.log('Processing with options:', {
      aspectRatio: data.aspectRatio,
      captions: data.captions
    });
    
    try {
      if (data.type === 'file') {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', data.source as File);
        
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        setClientId(result.video_id);
        
        // Trigger generation process
        const genResponse = await fetch('/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video_id: result.video_id,
            query: data.query || '',
            aspect_ratio: data.aspectRatio,
            burn_captions: data.captions
          }),
        });
        
        if (!genResponse.ok) {
          throw new Error(`Generation request failed: ${genResponse.statusText}`);
        }
      } else {
        // URL handling would require a different endpoint on the server
        toast.error('URL processing is not implemented in this demo');
        setIsProcessing(false);
      }
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
                setClientId('');
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
