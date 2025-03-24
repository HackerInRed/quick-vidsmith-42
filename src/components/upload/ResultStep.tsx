
import React, { useState } from 'react';
import { Download, Share2, Youtube, Instagram, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ResultStepProps {
  videoUrl: string;
  onProcessAnother: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ videoUrl, onProcessAnother }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'edited-video.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Video downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download video');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareToYoutube = () => {
    // This would usually connect to YouTube API
    toast.success('Coming soon: Direct upload to YouTube');
    window.open('https://studio.youtube.com/channel/upload', '_blank');
  };

  const handleShareToInstagram = () => {
    // This would usually connect to Instagram API
    toast.success('Coming soon: Direct upload to Instagram');
    window.open('https://www.instagram.com/', '_blank');
  };

  const handleShareToReels = () => {
    // This would usually connect to Instagram Reels API
    toast.success('Coming soon: Direct upload to Instagram Reels');
    window.open('https://www.instagram.com/reels/create/', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Processing Complete!</h2>
        <p className="text-gray-400">Your edited video is ready. Preview it below and download it.</p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg overflow-hidden bg-black border border-gray-800 shadow-xl"
      >
        <video
          className="w-full h-auto" 
          controls
          playsInline
          src={videoUrl}
          controlsList="nodownload"
        >
          Your browser doesn't support video playback. 
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">Download the video</a> instead.
        </video>
      </motion.div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white mt-4">Share Your Creation</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary py-3 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download size={18} />
                Download
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareToYoutube}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Youtube size={18} />
            YouTube
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareToInstagram}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Instagram size={18} />
            Instagram
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareToReels}
            className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium px-4 py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Instagram size={18} />
            Reels
          </motion.button>
        </div>
        
        <div className="pt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onProcessAnother}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Process Another Video
          </motion.button>
        </div>
      </div>
    </div>
  );
};
