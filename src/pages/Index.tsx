
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-vidsmith-darker to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Your Videos with AI
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create compelling, engaging video content in seconds. 
              Our AI analyzes your footage and extracts the perfect moments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-vidsmith-accent-light transition-colors">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-vidsmith-accent/10 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your videos?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who use our AI to create engaging video content faster than ever.
          </p>
          <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-vidsmith-accent-light transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
