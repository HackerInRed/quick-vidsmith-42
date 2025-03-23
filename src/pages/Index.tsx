
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import { Scissors, Wand2, Zap, Clock, Share2, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const Index = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8 animate-fade-up">
            <div className="inline-block px-3 py-1 rounded-full bg-vidsmith-accent/10 text-vidsmith-accent text-xs font-medium tracking-wider mb-4">
              AI-POWERED VIDEO CREATION
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Transform Long Videos into <span className="text-vidsmith-accent">Short Clips</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Upload any video or paste a URL and our AI will generate engaging clips optimized for social media.
            </p>
            
            <Link to="/upload" className="inline-block">
              <Button 
                size="lg" 
                className="group bg-vidsmith-accent hover:bg-vidsmith-accent-light text-white text-lg font-medium px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-glow animate-pulse"
              >
                Get Started 
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-vidsmith-darker/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our advanced AI analyzes your videos to find the most engaging moments and transform them into shareable clips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Scissors}
              title="AI-Powered Editing"
              description="Our AI identifies the most engaging parts of your video and turns them into perfect clips."
            />
            <FeatureCard 
              icon={Wand2}
              title="Smart Caption Generation"
              description="Automatically generate captions for your videos to increase engagement and accessibility."
            />
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast Processing"
              description="Get your clips in seconds, not hours. Our processing engine is optimized for speed."
            />
            <FeatureCard 
              icon={Clock}
              title="Save Hours of Editing"
              description="What would take hours in traditional editing software takes just minutes with VidSmith."
            />
            <FeatureCard 
              icon={Share2}
              title="Export Anywhere"
              description="Download your clips or share them directly to social media platforms."
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Customizable Output"
              description="Adjust settings to match the requirements of different social media platforms."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Creating short-form content has never been easier. Just three simple steps to transform your videos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-vidsmith-darker rounded-full flex items-center justify-center text-vidsmith-accent font-bold text-xl mx-auto mb-4 border border-vidsmith-border">
                1
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Upload Your Video</h3>
              <p className="text-gray-400 text-sm">
                Drag and drop a video file or paste a URL from YouTube, Vimeo, or other platforms.
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-vidsmith-accent">
                  <path d="M17 7L26 16L17 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 7L15 16L6 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-12 h-12 bg-vidsmith-darker rounded-full flex items-center justify-center text-vidsmith-accent font-bold text-xl mx-auto mb-4 border border-vidsmith-border">
                2
              </div>
              <h3 className="text-lg font-medium text-white mb-2">AI Processing</h3>
              <p className="text-gray-400 text-sm">
                Our AI analyzes your content to identify the most engaging segments to create clips from.
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-vidsmith-accent">
                  <path d="M17 7L26 16L17 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 7L15 16L6 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-12 h-12 bg-vidsmith-darker rounded-full flex items-center justify-center text-vidsmith-accent font-bold text-xl mx-auto mb-4 border border-vidsmith-border">
                3
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Download & Share</h3>
              <p className="text-gray-400 text-sm">
                Download your optimized clips or publish them directly to your social media accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="glass-panel p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Videos?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start creating engaging short-form content from your long videos today.
            </p>
            <Link to="/upload">
              <Button 
                size="lg" 
                className="group bg-vidsmith-accent hover:bg-vidsmith-accent-light text-white text-lg font-medium px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
