
import React from 'react';
import { motion } from 'framer-motion';

export const UploadHero = () => {
  return (
    <section className="w-full py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            AI <span className="text-vidsmith-accent">Video Editor</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
};
