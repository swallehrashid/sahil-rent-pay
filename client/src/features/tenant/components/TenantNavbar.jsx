import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  History, 
  FileSearch, 
  User, 
  LogOut, 
  Menu, 
  X, 
  MessageCircle, 
  Key
} from 'lucide-react';

// --- Framer Motion Variants ---
const navContainerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: '100vh',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    transition: { duration: 0.3, ease: 'easeInOut' } 
  }
};

const linkHoverVariants = {
  hover: { scale: 1.05, y: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

export default function TenantNavbar() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // --- Initial 1.2s Premium Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Navigation Links Mapping ---
  const navLinks = [
    { name: 'Dashboard', path: '/tenant', icon: Home },
    { name: 'Payment History', path: '/tenant/history', icon: History },
    { name: 'Claim Payment', path: '/tenant/claim', icon: FileSearch },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="w-full h-20 bg-[#0F0246] flex items-center justify-center border-b border-white/5">
        <motion.div 
          className="flex items-center gap-3 text-white/80"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Key className="w-6 h-6 text-[#B95F7B]" />
          </motion.div>
          <span className="font-light tracking-widest text-sm uppercase">Authenticating Vault...</span>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <>
      <motion.nav 
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 w-full bg-[#0F0246]/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-[#0F0246]/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center flex-shrink-0 cursor-pointer">
              <Link to="/tenant" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#200497] to-[#B95F7B] flex items-center justify-center shadow-lg shadow-[#200497]/30 transition-transform duration-500 group-hover:rotate-12">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-normal tracking-wider text-lg leading-tight">SAHIL</span>
                  <span className="text-[#B95F7B] font-light text-xs tracking-[0.2em] leading-tight">RENT PAY</span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link key={link.name} to={link.path}>
                    <motion.div 
                      variants={linkHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="relative py-2 flex items-center gap-2 group"
                    >
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-[#B95F7B]' : 'text-white/50 group-hover:text-white'}`} />
                      <span className={`text-sm font-light tracking-wide transition-colors duration-300 ${isActive ? 'text-white font-normal' : 'text-white/60 group-hover:text-white'}`}>
                        {link.name}
                      </span>
                      
                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeNavLine"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B95F7B] rounded-full shadow-[0_0_8px_#B95F7B]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right: User Profile & Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/profile">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
                    alt="User Avatar" 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-light">Profile</span>
                </motion.button>
              </Link>
              
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-[#B95F7B]/10 text-[#B95F7B] border border-[#B95F7B]/20 hover:bg-[#B95F7B] hover:text-white hover:shadow-[0_0_15px_rgba(185,95,123,0.4)] transition-all duration-300"
                  title="Secure Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/70 hover:text-white p-2 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* --- Mobile Menu Overlay (Glassmorphism) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#0F0246]/95 backdrop-blur-2xl border-t border-white/10 md:hidden overflow-hidden pt-24"
          >
            <div className="px-6 py-4 flex flex-col space-y-6">
              {/* Profile Card Mobile */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#B95F7B]"
                />
                <div>
                  <p className="text-white font-medium">Tenant User</p>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[#B95F7B] text-sm font-light flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" /> Manage Profile
                  </Link>
                </div>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#B95F7B]/20 border border-[#B95F7B]/30 text-white' 
                          : 'bg-transparent border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#B95F7B]' : 'text-white/40'}`} />
                      <span className="font-light tracking-wide text-lg">{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Button Mobile */}
              <div className="pt-8 mt-auto border-t border-white/10">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-light tracking-wide">Secure Logout</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Floating WhatsApp Support Icon (Global Requirement) --- */}
      <a 
        href="https://wa.me/254700000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
      </a>
    </>
  );
}