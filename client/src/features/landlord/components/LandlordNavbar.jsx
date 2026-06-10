import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Home, 
  Users, 
  Receipt, 
  BookOpen, 
  PieChart, 
  UserPlus,
  LogOut,
  Building2,
  Wallet
} from 'lucide-react';

export default function LandlordNavbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Component-level loader (1.2 seconds) tailored for Landlord authentication
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect for dynamic glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // In production, dispatch Redux logout action to clear JWT
    navigate('/login');
  };

  // Comprehensive Landlord routing map based on architecture
  const navLinks = [
    { name: 'Dashboard', path: '/landlord', icon: LayoutDashboard },
    { name: 'Properties', path: '/landlord/properties', icon: Home },
    { name: 'Tenants', path: '/landlord/tenants', icon: Users },
    { name: 'Billing & Fines', path: '/landlord/billing', icon: Receipt },
    { name: 'Ledger', path: '/landlord/ledger', icon: Wallet },
    { name: 'Reports', path: '/landlord/reports', icon: PieChart },
    { name: 'Caretakers', path: '/landlord/caretakers', icon: UserPlus },
  ];

  // Component-Level Loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-20 h-20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Landlord Bootup Animation */}
            <motion.div 
              className="absolute inset-0 border-2 border-t-[#200497] border-b-[#B95F7B] border-l-transparent border-r-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-white/80 font-light tracking-widest uppercase text-sm mb-1">
              Property Management
            </p>
            <p className="text-[#200497] font-mono text-xs tracking-wider">
              Loading Portfolio...
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
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo & Branding */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/landlord" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#200497] to-[#0F0246] flex items-center justify-center border border-[#200497]/50 shadow-lg group-hover:shadow-[#200497]/50 transition-all duration-300">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-lg font-semibold tracking-wide leading-none">Sahil <span className="font-light">Manager</span></span>
                  <span className="text-[#B95F7B] text-[10px] tracking-widest uppercase font-medium mt-0.5">Landlord Portal</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm tracking-wide font-light transition-all duration-300 overflow-hidden group ${
                      isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#B95F7B]' : ''}`} />
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="landlordNavIndicator"
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
            <div className="hidden xl:flex items-center space-x-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#200497]/20 border border-[#200497]/50 rounded-full mr-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs font-medium text-white/80 tracking-widest uppercase">Admin Verified</span>
              </div>
              <div className="h-6 w-px bg-white/10 mx-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/60 hover:text-[#B95F7B] text-sm tracking-wide font-light transition-colors duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Sign Out
              </button>
            </div>

            {/* Mobile/Tablet Menu Toggle */}
            <div className="xl:hidden flex items-center">
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
              className="xl:hidden overflow-hidden border-t border-white/10 bg-[#0F0246]/95 backdrop-blur-2xl"
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
                
                <div className="pt-6 pb-2 border-t border-white/10 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[#B95F7B] bg-[#B95F7B]/10 border border-[#B95F7B]/20 text-base tracking-wide font-light transition-all duration-300 hover:bg-[#B95F7B]/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out Securely
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