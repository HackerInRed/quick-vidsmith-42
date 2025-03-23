
import React, { useState, useEffect, useRef } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';

interface VideoSource {
  type: 'url' | 'file';
  source: string | File;
  query: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

interface ApiResponse {
  video_id: string;
  message: string;
  output_path?: string;
  error?: string;
}

interface WebSocketMessage {
  status: string;
  output_video?: string;
  srt_file?: string;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [videoId, setVideoId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const mapAspectRatio = (ratio: '1:1' | '16:9' | '9:16'): string => {
    switch (ratio) {
      case '1:1': return 'square';
      case '16:9': return 'youtube';
      case '9:16': return 'reel';
      default: return 'youtube';
    }
  };

  useEffect(() => {
    return () => {
      // Clean up WebSocket connection when component unmounts
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Function to handle WebSocket connection
  const connectWebSocket = (videoId: string, data: VideoSource) => {
    // In a real app, you'd use the actual server URL
    const socketUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${videoId}`;
    
    // For demo purposes, we'll use a fake WebSocket to simulate backend responses
    // Replace this with actual WebSocket connection in production
    console.log(`Connecting to WebSocket: ${socketUrl}`);
    
    // Simulate the WebSocket with a timer that updates progress and stages
    const stages = [
      'Initializing',
      'Extracting audio from video',
      'Uploading audio file for transcription',
      'Transcribing audio with Gemini',
      'Transcription completed. Processing segments',
      'Structuring transcription data',
      'Finding relevant segments',
      'Found 3 relevant segments',
      'Editing video with selected segments',
      `Applying ${mapAspectRatio(data.aspectRatio)} aspect ratio`,
      'Rendering intermediate video',
      data.captions ? 'Generating captions with AssemblyAI' : 'Rendering final video',
      data.captions ? 'SRT file generated' : 'Finalizing video',
      data.captions ? 'Burning captions into the video' : 'Optimizing video quality',
      data.captions ? 'Video with burned captions completed' : 'Video processing completed',
      'Processing completed successfully'
    ];
    
    let currentStageIndex = 0;
    let currentProgress = 0;
    
    // Simulate WebSocket messages
    const intervalId = setInterval(() => {
      // Update progress based on current stage
      const progressIncrement = 100 / stages.length;
      currentProgress = Math.min(currentProgress + progressIncrement / 4, 
                               (currentStageIndex + 1) * progressIncrement);
      setProgress(currentProgress);
      
      // Send the current stage message
      setProcessingStage(stages[currentStageIndex]);
      
      // Move to next stage occasionally
      if (Math.random() > 0.7) {
        currentStageIndex++;
        if (currentStageIndex >= stages.length) {
          // Processing complete
          clearInterval(intervalId);
          setProgress(100);
          setIsProcessing(false);
          
          // Set the processed video URL
          const generatedVideoUrl = `/outputs/${videoId}_output.mp4`;
          toast.success("Video processing complete!");
          setProcessedVideoUrl(generatedVideoUrl);
          
          // In a real app, we'd get this URL from the WebSocket
          console.log("Processing complete, video URL:", generatedVideoUrl);
        }
      }
    }, 700);
    
    // Store interval ID in a ref so we can clear it later
    wsRef.current = {
      close: () => clearInterval(intervalId)
    } as unknown as WebSocket;
  };

  // Upload the video file to the server
  const uploadVideoFile = async (file: File): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // In a real app, replace with your actual API endpoint
      console.log("Uploading file:", file.name);
      
      // Simulate API response
      return {
        video_id: `demo-${Date.now()}`,
        message: "Video uploaded successfully. Processing started."
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload video file.');
    }
  };

  // Start the video processing
  const startProcessing = async (videoId: string, data: VideoSource): Promise<void> => {
    try {
      // In a real app, replace with your actual API endpoint
      const aspectRatioMapped = mapAspectRatio(data.aspectRatio);
      console.log("Starting processing with options:", {
        video_id: videoId,
        query: data.query || "",
        aspect_ratio: aspectRatioMapped,
        burn_captions: data.captions
      });
      
      // Connect to WebSocket for status updates
      connectWebSocket(videoId, data);
    } catch (error) {
      console.error('Error starting processing:', error);
      setErrorMessage('Failed to start video processing.');
      setIsProcessing(false);
    }
  };

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);
    setErrorMessage(undefined);
    
    try {
      let vid: string;
      
      if (data.type === 'file') {
        // Upload the file first
        const uploadResponse = await uploadVideoFile(data.source as File);
        vid = uploadResponse.video_id;
      } else {
        // For URLs, we'd normally have an API endpoint to handle this
        // For demo, we'll simulate it
        vid = `demo-url-${Date.now()}`;
        console.log("Processing URL:", data.source);
      }
      
      setVideoId(vid);
      
      // Start the processing
      await startProcessing(vid, data);
    } catch (error) {
      console.error('Error handling video submission:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
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
          error={errorMessage}
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
                setVideoId(null);
                if (wsRef.current) {
                  wsRef.current.close();
                }
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
