
import React from 'react';
import { Download, Upload, Youtube, Instagram, Share2 } from 'lucide-react';
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ResultStepProps {
  videoUrl: string;
  onProcessAnother: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ videoUrl, onProcessAnother }) => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `CreAItive_video_${new Date().getTime()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareToYoutube = () => {
    // This would typically involve OAuth and YouTube API
    toast.info("YouTube sharing feature will be available soon!");
    
    // In a real implementation, you would:
    // 1. Authenticate with YouTube
    // 2. Open YouTube Studio in a new window
    // 3. Use the YouTube API to initiate an upload
    window.open('https://studio.youtube.com', '_blank');
  };

  const handleShareToInstagram = (type: 'post' | 'reel') => {
    // Instagram doesn't have a direct upload API for web
    toast.info(`Instagram ${type} sharing will be available in our mobile app soon!`);
    
    // Typically for Instagram, users need to download first then upload manually
    // In a real implementation, you might:
    // 1. Offer to download the video optimized for Instagram
    // 2. Or provide a link to open Instagram
    window.open('https://instagram.com', '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Video Ready!</h2>
          <p className="text-gray-400">Your AI-generated video is ready to download and share</p>
        </motion.div>
      </div>
      
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black border border-vidsmith-border">
        <video 
          src={videoUrl}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          preload="metadata"
          onError={(e) => {
            // Fallback for unsupported formats
            const videoElement = e.currentTarget;
            videoElement.innerHTML = `
              <source src="${videoUrl}" type="video/mp4">
              <source src="${videoUrl}" type="video/webm">
              <source src="${videoUrl}" type="video/quicktime">
              Your browser doesn't support this video format.
            `;
          }}
        />
      </div>
      
      {/* Main actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-vidsmith-accent hover:bg-vidsmith-accent/90 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download Video
        </Button>
        
        <Button 
          onClick={onProcessAnother}
          variant="outline"
          className="border-vidsmith-border text-white hover:bg-vidsmith-muted/30 py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Process Another Video
        </Button>
      </div>
      
      {/* Social sharing section */}
      <div className="mt-8 pt-6 border-t border-vidsmith-border">
        <h3 className="text-center text-lg font-medium text-white mb-4">Share Your Video</h3>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Button 
            variant="outline" 
            className="bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/30 text-white"
            onClick={handleShareToYoutube}
          >
            <Youtube size={18} className="mr-2" />
            Upload to YouTube
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border-[#E1306C]/30 text-white"
            onClick={() => handleShareToInstagram('post')}
          >
            <Instagram size={18} className="mr-2" />
            Post to Instagram
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCAF45]/10 hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#FCAF45]/20 border-[#E1306C]/30 text-white"
            onClick={() => handleShareToInstagram('reel')}
          >
            <Share2 size={18} className="mr-2" />
            Share as Instagram Reel
          </Button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Remember to save your video. Processing a new video will discard this result.</p>
      </div>
    </div>
  );
};
