import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Database, 
  Settings, 
  LogOut,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export default function AdminNavbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Component-level loader (1.2 seconds) tailored for System Admin initialization
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect for dynamic glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // In production, dispatch Redux logout action here
    navigate('/login');
  };

  const navLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Landlords', path: '/admin/landlords', icon: Users },
    { name: 'Master Ledger', path: '/admin/ledger', icon: Database },
    { name: 'Global Settings', path: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-20 h-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Admin Terminal/Bootup Animation */}
            <motion.div 
              className="absolute inset-0 border-2 border-dashed border-[#200497] rounded-lg"
              animate={{ rotate: 90, scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <Terminal className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-white/80 font-light tracking-widest uppercase text-sm mb-1">
              System Admin
            </p>
            <p className="text-[#200497] font-mono text-xs tracking-wider">
              Authenticating Master Access...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0F0246]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-[#200497]/10'
            : 'bg-[#0F0246] border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo & Branding */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#200497] to-[#0F0246] flex items-center justify-center border border-[#200497]/50 shadow-lg group-hover:shadow-[#200497]/50 transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-lg font-semibold tracking-wide leading-none">Sahil <span className="font-light">Admin</span></span>
                  <span className="text-[#B95F7B] text-[10px] tracking-widest uppercase font-medium mt-0.5">Master Control</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm tracking-wide font-light transition-all duration-300 overflow-hidden group ${
                      isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#B95F7B]' : ''}`} />
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="adminNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B95F7B]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="h-6 w-px bg-white/10 mx-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/60 hover:text-red-400 text-sm tracking-wide font-light transition-colors duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Terminate Session
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/80 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown (Framer Motion) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-[#0F0246]/95 backdrop-blur-2xl"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base tracking-wide font-light transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#200497]/20 text-white border border-[#200497]/30' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? 'text-[#B95F7B]' : ''}`} />
                      {link.name}
                    </Link>
                  );
                })}
                
                <div className="pt-6 pb-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-400/10 border border-red-400/20 text-base tracking-wide font-light transition-all duration-300 hover:bg-red-400/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Terminate Session
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-20 w-full bg-transparent"></div>
    </>
  );
}