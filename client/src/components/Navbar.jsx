import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for dynamic glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F0246]/80 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white text-2xl font-light tracking-wide flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B95F7B] to-[#200497] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm tracking-tighter">SR</span>
              </div>
              <span className="font-semibold">Sahil</span> Rent Pay
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm tracking-wide font-light relative group"
              >
                {link.name}
                {/* Sleek animated underline effect */}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white text-sm tracking-wide font-light hover:text-[#B95F7B] transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#B95F7B] text-white text-sm px-6 py-2.5 rounded-full tracking-wide font-light transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/50"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#B95F7B] focus:outline-none transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay (Glassmorphism) */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-[#0F0246]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex flex-col px-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white text-lg font-light tracking-wide hover:text-[#B95F7B] transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-full bg-white/10 my-2"></div>
          <Link
            to="/login"
            className="text-white text-lg font-light tracking-wide hover:text-[#B95F7B] transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#B95F7B] text-white text-center text-lg px-6 py-3 rounded-xl tracking-wide font-light transition-all duration-300 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;