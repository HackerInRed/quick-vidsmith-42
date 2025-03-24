
import React, { useState, useEffect } from 'react';
import { UploadStep } from './UploadStep';
import { EditOptionsStep } from './EditOptionsStep';
import { ProcessingStep } from './ProcessingStep';
import { ResultStep } from './ResultStep';
import { toast } from 'sonner';

export type UploadStepType = 'upload' | 'options' | 'processing' | 'result';
export type AspectRatioType = 'youtube' | 'square' | 'reel';

export interface VideoOptions {
  query: string;
  aspectRatio: AspectRatioType;
  burnCaptions: boolean;
}

export interface JobStatusType {
  job_id: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
  output_path?: string;
}

export const UploadProcessor = () => {
  const [currentStep, setCurrentStep] = useState<UploadStepType>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [options, setOptions] = useState<VideoOptions>({
    query: '',
    aspectRatio: 'youtube',
    burnCaptions: true
  });
  const [jobStatus, setJobStatus] = useState<JobStatusType | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);
  
  // Check if the API is available on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/status/test`, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
        });
        
        setIsApiAvailable(response.ok);
        console.log('API status check:', response.ok ? 'available' : 'unavailable');
      } catch (error) {
        console.log('API not available:', error);
        setIsApiAvailable(false);
      }
    };
    
    checkApiStatus();
  }, []);

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    
    if (!isApiAvailable) {
      toast.error('Backend API is not available. Please check your connection.');
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Upload the file to get a file ID
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const result = await response.json();
      setFileId(result.job_id);
      
      // Move to options step
      setCurrentStep('options');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitOptions = async (videoOptions: VideoOptions) => {
    setOptions(videoOptions);
    
    if (!fileId) {
      toast.error('File ID is missing. Please upload a file first.');
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Submit the processing request
      const response = await fetch(`${apiUrl}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: fileId,
          query: videoOptions.query,
          aspect_ratio: videoOptions.aspectRatio,
          burn_captions: videoOptions.burnCaptions
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const result = await response.json();
      setJobStatus(result);
      setCurrentStep('processing');
      
      // Start polling for job status
      pollJobStatus(result.job_id);
    } catch (error) {
      console.error('Error starting processing:', error);
      toast.error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Setup websocket connection for real-time updates if supported
      if ('WebSocket' in window) {
        const websocketUrl = `${apiUrl.replace('http', 'ws')}/ws/${jobId}`;
        const socket = new WebSocket(websocketUrl);
        
        socket.onopen = () => {
          console.log('WebSocket connection established');
        };
        
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setJobStatus(data);
          
          if (data.status === 'complete' && data.output_path) {
            setOutputUrl(`${apiUrl}/output/${jobId}`);
            setCurrentStep('result');
            socket.close();
          } else if (data.status === 'error') {
            toast.error(`Processing error: ${data.error || 'Unknown error'}`);
            socket.close();
          }
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Fall back to polling
          startPolling(jobId);
        };
        
        return;
      }
      
      // Fall back to polling if WebSockets aren't available
      startPolling(jobId);
    } catch (error) {
      console.error('Error setting up status updates:', error);
      // Fall back to polling
      startPolling(jobId);
    }
  };

  const startPolling = (jobId: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        setJobStatus(data);
        
        if (data.status === 'complete' && data.output_path) {
          setOutputUrl(`${apiUrl}/output/${jobId}`);
          setCurrentStep('result');
          clearInterval(pollInterval);
        } else if (data.status === 'error') {
          toast.error(`Processing error: ${data.error || 'Unknown error'}`);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        // Don't stop polling on network errors
      }
    }, 2000);
  };

  const resetProcess = () => {
    setFile(null);
    setFileId(null);
    setJobStatus(null);
    setOutputUrl(null);
    setCurrentStep('upload');
  };

  return (
    <section className="w-full py-6 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {!isApiAvailable && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
              <p className="font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Backend API is not available. Some features may be limited.
              </p>
            </div>
          )}

          {/* Step indicators */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {['upload', 'options', 'processing', 'result'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${currentStep === step 
                        ? 'bg-vidsmith-accent text-white' 
                        : ((['upload', 'options', 'processing'].indexOf(currentStep) >= ['upload', 'options', 'processing', 'result'].indexOf(step))
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-400')}`
                      }
                    >
                      {(['upload', 'options', 'processing'].indexOf(currentStep) >= ['upload', 'options', 'processing', 'result'].indexOf(step)) && step !== currentStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${currentStep === step ? 'text-white' : 'text-gray-400'}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                  </div>
                  
                  {index < 3 && (
                    <div 
                      className={`flex-1 h-0.5 ${
                        ['upload', 'options', 'processing'].indexOf(currentStep) > index 
                          ? 'bg-green-500' 
                          : 'bg-gray-700'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content based on current step */}
          <div className="glass-panel p-6 rounded-lg">
            {currentStep === 'upload' && (
              <UploadStep onFileSelected={handleFileUpload} />
            )}
            
            {currentStep === 'options' && (
              <EditOptionsStep 
                initialOptions={options} 
                onSubmit={handleSubmitOptions} 
                isApiAvailable={isApiAvailable}
              />
            )}
            
            {currentStep === 'processing' && jobStatus && (
              <ProcessingStep 
                jobStatus={jobStatus}
              />
            )}
            
            {currentStep === 'result' && outputUrl && (
              <ResultStep 
                videoUrl={outputUrl}
                onProcessAnother={resetProcess}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
