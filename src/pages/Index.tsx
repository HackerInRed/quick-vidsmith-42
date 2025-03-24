
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import { Brain, Edit, MessageSquare, Upload, PlayCircle, Download, Video } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-montserrat"
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
              <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-purple-600 transition-colors">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-montserrat">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Advanced AI tools to transform your video creation process</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard 
                icon={Brain}
                title="AI-Powered Analysis"
                description="Our advanced AI understands your videos and identifies the most engaging moments automatically."
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard 
                icon={Edit}
                title="Smart Editing"
                description="Create perfectly sized clips for any platform - YouTube, Instagram, TikTok, and more."
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard 
                icon={MessageSquare}
                title="Caption Generation"
                description="Automatically add captions to your videos to increase engagement and accessibility."
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-montserrat">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Four simple steps to transform your videos</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative py-8">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-900"></div>
              
              {/* Steps */}
              <div className="space-y-24">
                <WorkflowStep 
                  icon={Upload}
                  step="1"
                  title="Upload Your Video"
                  description="Upload any video file. Our system accepts most video formats."
                  isLeft={true}
                />
                <WorkflowStep 
                  icon={Edit}
                  step="2"
                  title="Customize Options"
                  description="Choose your preferred aspect ratio, add captions, and tell us what kind of moments to extract."
                  isLeft={false}
                />
                <WorkflowStep 
                  icon={Brain}
                  step="3"
                  title="AI Processing"
                  description="Our AI analyzes your video, transcribes the content, and identifies the most relevant segments."
                  isLeft={true}
                />
                <WorkflowStep 
                  icon={Download}
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
      <section className="py-16 bg-purple-900/20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-montserrat">Ready to transform your videos?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who use our AI to create engaging video content faster than ever.
          </p>
          <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-purple-600 transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </Layout>
  );
};

interface WorkflowStepProps {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
  isLeft: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ icon: Icon, step, title, description, isLeft }) => {
  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-start">
      <div className={`order-2 md:order-none w-full md:w-[45%] ${isLeft ? 'md:text-right md:pr-16' : 'md:pl-16 md:order-last'}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
        >
          <div className={`flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
              <Icon size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </motion.div>
      </div>
      
      <div className="order-1 md:order-none absolute md:relative md:flex md:items-center md:justify-center left-6 md:left-auto md:mx-4 h-full md:h-auto md:my-auto">
        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold z-10">
          {step}
        </div>
      </div>
    </div>
  );
};

export default Index;
