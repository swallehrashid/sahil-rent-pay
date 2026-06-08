import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Routing data for clean mapping and future scalability
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="relative bg-[#0F0246] pt-16 pb-8 border-t border-white/10 overflow-hidden">
      {/* Subtle background glow for luxurious depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#200497]/20 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Identity Section */}
          <div className="space-y-6">
            <Link to="/" className="text-white text-2xl font-light tracking-wide flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B95F7B] to-[#200497] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm tracking-tighter">SR</span>
              </div>
              <span className="font-semibold">Sahil</span> Rent Pay
            </Link>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Elevating property management in Kenya. Secure, automated, and seamlessly integrated with M-Pesa.
            </p>
          </div>

          {/* Quick Links with Hover Reveals */}
          <div>
            <h3 className="text-white font-light tracking-wide mb-6 uppercase text-sm">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-white/70 hover:text-[#B95F7B] transition-colors duration-300 text-sm font-light flex items-center group"
                  >
                    {/* Animated horizontal dash on hover */}
                    <span className="w-2 h-px bg-[#B95F7B] mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-light tracking-wide mb-6 uppercase text-sm">Legal</h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-white/70 hover:text-[#B95F7B] transition-colors duration-300 text-sm font-light inline-block hover:-translate-y-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (Glassmorphic Card Treatment) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-[#200497]/50 transition-colors duration-300">
            <h3 className="text-white font-light tracking-wide mb-6 uppercase text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm font-light text-white/70">
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-[#B95F7B] mt-0.5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href="mailto:support@sahilrent.com" className="hover:text-white transition-colors duration-300">support@sahilrent.com</a>
              </li>
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-[#B95F7B] mt-0.5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-[#B95F7B] mt-0.5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs font-light tracking-wide">
            &copy; {new Date().getFullYear()} Sahil Rent Pay Solutions. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-white/50 hover:text-[#B95F7B] text-sm font-light transition-all duration-300 hover:-translate-y-1"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;