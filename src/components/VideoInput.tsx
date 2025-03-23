
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Link2, Upload, PlayCircle, Captions } from 'lucide-react';
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { FormControl, FormItem, FormLabel } from "./ui/form";

interface VideoInputProps {
  onVideoSubmit: (data: { 
    type: 'url' | 'file', 
    source: string | File, 
    query: string,
    aspectRatio: 'square' | 'youtube' | 'reel',
    captions: boolean
  }) => void;
  isProcessing: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit, isProcessing }) => {
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'youtube' | 'reel'>('youtube');
  const [enableCaptions, setEnableCaptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast.error('Please enter a valid video URL');
      return;
    }
    
    onVideoSubmit({ 
      type: 'url', 
      source: videoUrl,
      query: userQuery,
      aspectRatio,
      captions: enableCaptions
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }
    
    onVideoSubmit({ 
      type: 'file', 
      source: selectedFile,
      query: userQuery,
      aspectRatio,
      captions: enableCaptions
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please drop a valid video file');
        return;
      }
      setSelectedFile(file);
      setInputType('file');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded-md ${inputType === 'url' ? 'bg-vidsmith-accent text-white' : 'bg-vidsmith-muted text-gray-300'}`}
          onClick={() => setInputType('url')}
        >
          <Link2 size={18} className="mr-2" />
          URL
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-md ${inputType === 'file' ? 'bg-vidsmith-accent text-white' : 'bg-vidsmith-muted text-gray-300'}`}
          onClick={() => setInputType('file')}
        >
          <Upload size={18} className="mr-2" />
          Upload
        </button>
      </div>

      <div className="glass-panel p-6 w-full">
        {/* User query input field - common for both input types */}
        <div className="space-y-2 mb-6">
          <label htmlFor="user-query" className="block text-sm text-gray-300">
            What clips would you like to generate? (optional)
          </label>
          <Textarea
            id="user-query"
            placeholder="E.g., 'Extract the most exciting moments' or 'Create clips showing product demos'"
            className="glass-input w-full min-h-[80px] text-white bg-vidsmith-muted/30 border-vidsmith-border"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-3">
            Aspect Ratio
          </label>
          <div className="flex space-x-4">
            <div 
              className={`cursor-pointer relative ${aspectRatio === 'square' ? 'border-vidsmith-accent' : 'border-vidsmith-border'} border-2 p-2 rounded-md flex flex-col items-center transition-all`}
              onClick={() => setAspectRatio('square')}
            >
              <div className="w-16 h-16 bg-vidsmith-muted mb-2"></div>
              <span className="text-xs text-gray-300">Square (1:1)</span>
            </div>
            <div 
              className={`cursor-pointer relative ${aspectRatio === 'youtube' ? 'border-vidsmith-accent' : 'border-vidsmith-border'} border-2 p-2 rounded-md flex flex-col items-center transition-all`}
              onClick={() => setAspectRatio('youtube')}
            >
              <div className="w-20 h-[45px] bg-vidsmith-muted mb-2"></div>
              <span className="text-xs text-gray-300">Landscape (16:9)</span>
            </div>
            <div 
              className={`cursor-pointer relative ${aspectRatio === 'reel' ? 'border-vidsmith-accent' : 'border-vidsmith-border'} border-2 p-2 rounded-md flex flex-col items-center transition-all`}
              onClick={() => setAspectRatio('reel')}
            >
              <div className="w-9 h-16 bg-vidsmith-muted mb-2"></div>
              <span className="text-xs text-gray-300">Portrait (9:16)</span>
            </div>
          </div>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center gap-2">
            <Captions size={16} className="text-gray-300" />
            <label className="text-sm text-gray-300">
              Generate Captions
            </label>
          </div>
          <Switch
            checked={enableCaptions}
            onCheckedChange={setEnableCaptions}
            disabled={isProcessing}
          />
        </div>

        {inputType === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="video-url" className="block text-sm text-gray-300">
                Video URL
              </label>
              <input
                id="video-url"
                type="url"
                placeholder="https://example.com/video.mp4"
                className="glass-input w-full"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={isProcessing}
            >
              <PlayCircle size={18} className="mr-2" />
              {isProcessing ? 'Processing...' : 'Generate Clips'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-vidsmith-accent bg-vidsmith-accent/10' : 'border-vidsmith-border'
              } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300 mb-1">
                {selectedFile ? selectedFile.name : 'Drag and drop your video here'}
              </p>
              <p className="text-xs text-gray-400">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'or click to select a file'}
              </p>
            </div>
            <button
              className="btn-primary w-full flex items-center justify-center"
              onClick={handleFileSubmit}
              disabled={!selectedFile || isProcessing}
            >
              <PlayCircle size={18} className="mr-2" />
              {isProcessing ? 'Processing...' : 'Generate Clips'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInput;
