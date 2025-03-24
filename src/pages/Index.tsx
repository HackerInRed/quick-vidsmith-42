
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import { Brain, Edit, Code } from 'lucide-react';

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
      
      {/* Features Section */}
      <section className="py-16 bg-vidsmith-darker text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="AI-Powered Analysis"
              description="Our advanced AI understands your videos and identifies the most engaging moments automatically."
            />
            <FeatureCard 
              icon={Edit}
              title="Smart Editing"
              description="Create perfectly sized clips for any platform - YouTube, Instagram, TikTok, and more."
            />
            <FeatureCard 
              icon={Code}
              title="Caption Generation"
              description="Automatically add captions to your videos to increase engagement and accessibility."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] h-full w-1 bg-vidsmith-muted"></div>
              
              {/* Steps */}
              <div className="space-y-12">
                <TimelineItem 
                  step="1"
                  title="Upload Your Video"
                  description="Upload any video file. Our system accepts most video formats."
                  isLeft={true}
                />
                <TimelineItem 
                  step="2"
                  title="Customize Options"
                  description="Choose your preferred aspect ratio, add captions, and tell us what kind of moments to extract."
                  isLeft={false}
                />
                <TimelineItem 
                  step="3"
                  title="AI Processing"
                  description="Our AI analyzes your video, transcribes the content, and identifies the most relevant segments."
                  isLeft={true}
                />
                <TimelineItem 
                  step="4"
                  title="Download & Share"
                  description="Get your perfectly edited clips ready to share on any platform."
                  isLeft={false}
                />
              </div>
            </div>
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

interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, title, description, isLeft }) => {
  return (
    <div className="relative flex md:justify-between items-start">
      <div className={`w-full md:w-[45%] ${isLeft ? 'md:text-right md:mr-8' : 'md:ml-8 md:order-1'}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </motion.div>
      </div>
      
      <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-vidsmith-accent text-white flex items-center justify-center font-bold z-10">
          {step}
        </div>
      </div>
    </div>
  );
};

export default Index;
