
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import { 
  Brain, 
  Edit, 
  Video, 
  Sparkles, 
  CloudComputing, 
  Zap,
  Upload,
  Settings,
  PenTool,
  Download,
  Clock,
  Share2
} from 'lucide-react';

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
              Transform Your <span className="text-vidsmith-accent">Videos</span> with AI
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
      
      {/* Features Section - Redesigned */}
      <section className="py-20 bg-gradient-to-b from-vidsmith-darker to-vidsmith-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <div className="w-20 h-1 bg-vidsmith-accent mx-auto mb-6 rounded"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our cutting-edge AI technology transforms your raw footage into professionally edited videos
              optimized for any platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="AI-Powered Analysis"
              description="Our advanced AI understands your videos and identifies the most engaging moments automatically."
              delay={0.1}
            />
            <FeatureCard 
              icon={Edit}
              title="Smart Editing"
              description="Create perfectly sized clips for any platform - YouTube, Instagram, TikTok, and more."
              delay={0.2}
            />
            <FeatureCard 
              icon={Sparkles}
              title="Caption Generation"
              description="Automatically add captions to your videos to increase engagement and accessibility."
              delay={0.3}
            />
            <FeatureCard 
              icon={CloudComputing}
              title="Cloud Processing"
              description="All processing happens in the cloud - no need for powerful hardware or complex software."
              delay={0.4}
            />
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast"
              description="Get your edited videos in minutes instead of spending hours on manual editing."
              delay={0.5}
            />
            <FeatureCard 
              icon={Video}
              title="Multiple Formats"
              description="Export your videos in different aspect ratios optimized for any platform or device."
              delay={0.6}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works - Redesigned */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-vidsmith-accent mx-auto mb-6 rounded"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A simple four-step process to transform your raw footage into engaging, platform-optimized content.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop timeline (hidden on mobile) */}
            <div className="hidden md:block relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-vidsmith-accent/80 via-vidsmith-accent/40 to-vidsmith-accent/10"></div>
              
              <div className="space-y-24">
                <WorkflowStep 
                  step="1"
                  icon={Upload}
                  title="Upload Your Video"
                  description="Upload any video file. Our system accepts most video formats and processes them in the cloud."
                  isLeft={true}
                />
                <WorkflowStep 
                  step="2"
                  icon={Settings}
                  title="Customize Options"
                  description="Choose your preferred aspect ratio, add captions, and tell us what kind of moments to extract."
                  isLeft={false}
                />
                <WorkflowStep 
                  step="3"
                  icon={PenTool}
                  title="AI Processing"
                  description="Our AI analyzes your video, transcribes the content, and identifies the most relevant segments automatically."
                  isLeft={true}
                />
                <WorkflowStep 
                  step="4"
                  icon={Share2}
                  title="Download & Share"
                  description="Get your perfectly edited clips ready to share on any platform - YouTube, Instagram, TikTok, and more."
                  isLeft={false}
                />
              </div>
            </div>
            
            {/* Mobile timeline (shown only on mobile) */}
            <div className="md:hidden space-y-10">
              <MobileWorkflowStep
                step="1"
                icon={Upload}
                title="Upload Your Video"
                description="Upload any video file. Our system accepts most video formats."
              />
              <MobileWorkflowStep
                step="2"
                icon={Settings}
                title="Customize Options"
                description="Choose your preferred aspect ratio, add captions, and tell us what kind of moments to extract."
              />
              <MobileWorkflowStep
                step="3"
                icon={PenTool}
                title="AI Processing"
                description="Our AI analyzes your video, transcribes the content, and identifies the most relevant segments."
              />
              <MobileWorkflowStep
                step="4"
                icon={Share2}
                title="Download & Share"
                description="Get your perfectly edited clips ready to share on any platform."
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-vidsmith-darker text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel max-w-4xl mx-auto p-10 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your videos?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of content creators who use our AI to create engaging video content faster than ever.
            </p>
            <Link 
              to="/upload" 
              className="btn-primary text-lg px-8 py-4 inline-block hover:bg-vidsmith-accent-light transition-colors rounded-xl"
            >
              Get Started Now
            </Link>
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-vidsmith-accent" />
                <span>Save hours of editing time</span>
              </div>
              <div className="flex items-center">
                <Download size={18} className="mr-2 text-vidsmith-accent" />
                <span>Unlimited downloads</span>
              </div>
              <div className="flex items-center">
                <Video size={18} className="mr-2 text-vidsmith-accent" />
                <span>Multiple aspect ratios</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

interface WorkflowStepProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isLeft: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, icon: Icon, title, description, isLeft }) => {
  return (
    <div className="relative flex justify-between items-start">
      <div className={`w-5/12 ${isLeft ? 'text-right' : 'order-2'}`}>
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
      
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-14 h-14 rounded-full bg-vidsmith-accent/20 border-2 border-vidsmith-accent text-white flex items-center justify-center z-10"
        >
          <Icon size={24} />
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-vidsmith-accent text-white flex items-center justify-center font-bold z-20">
            {step}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MobileWorkflowStepProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const MobileWorkflowStep: React.FC<MobileWorkflowStepProps> = ({ step, icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex"
    >
      <div className="mr-4 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-vidsmith-accent/20 border-2 border-vidsmith-accent text-white flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-vidsmith-accent text-white flex items-center justify-center text-xs font-bold">
            {step}
          </div>
        </div>
        {/* Connector line */}
        <div className="w-0.5 h-full bg-vidsmith-accent/30 mt-2"></div>
      </div>
      <div className="glass-panel p-4 rounded-lg w-full">
        <div className="flex items-center mb-2">
          <Icon size={18} className="text-vidsmith-accent mr-2" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default Index;
