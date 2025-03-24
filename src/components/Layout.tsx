
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 backdrop-blur-sm bg-black/70 sticky top-0 z-10">
        <div className={`mx-auto px-4 py-4 flex items-center justify-between ${fullWidth ? 'w-full' : 'container'}`}>
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition-colors">How It Works</button>
              </>
            ) : (
              <>
                <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
                <Link to="/#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
              </>
            )}
            <Link to="/upload" className="btn-primary">Get Started</Link>
          </nav>
          <button className="block md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CreAItive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
