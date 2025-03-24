
import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

export const UploadHero = () => {
  return (
    <section className="py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Video size={32} className="text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">
          Upload Your Video
        </h1>
      </motion.div>
    </section>
  );
};
