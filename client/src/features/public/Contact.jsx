import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight, MessageCircle, ChevronDown, Calendar, Share2, MessageSquare, Globe, ShieldAlert, Send, Building } from 'lucide-react';

// --- Framer Motion Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    // Component-level loader (1.2 seconds)
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-20 h-20 flex flex-wrap gap-2 justify-center items-center">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, borderRadius: "100%" }}
                animate={{ scale: [0, 1, 0.5, 1], borderRadius: ["100%", "20%", "100%"] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                className={`w-8 h-8 backdrop-blur-md border border-white/20 ${i % 2 === 0 ? 'bg-[#B95F7B]' : 'bg-[#200497]'}`}
              />
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Establishing Secure Connection
          </motion.p>
        </div>
      </div>
    );
  }

  const faqs = [
    {
      q: "How are overpayments handled?",
      a: "A property management ledger handles tenant overpayments, credits, or advance rent payments by securely holding them in a tenant wallet and automatically rolling them over to settle the next month's generated invoice."
    },
    {
      q: "How do you handle security deposits?",
      a: "We manage tenant security deposits held and refunds cleanly in landlord accounting by utilizing distinct manual ledger adjustments. These act independently from active rent invoices, ensuring your cash flow statements remain perfectly accurate."
    },
    {
      q: "Can I automate defaulter tracking?",
      a: "Absolutely. A landlord can filter and identify rent defaulters automatically on the 5th of the month, or any other date, using our specialized arrears tracking widget to trigger immediate action."
    },
    {
      q: "What happens when a tenant leaves?",
      a: "You can soft-delete or archive vacating tenants while completely retaining their historical payment records. This excludes them from active billing cycles but keeps your master ledger intact for audits."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-20">
      {/* Global Background Glow Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#B95F7B]/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#200497]/20 rounded-full blur-[150px] pointer-events-none" />

      {/* --- Section 1: Hero Section (Get In Touch) --- */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto z-10 text-center backdrop-blur-xl">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest uppercase mb-6">
            Get In <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B95F7B] to-white">Touch</span>
          </h1>
          <p className="text-lg text-white/70 font-light leading-relaxed mb-8">
            Whether you need to set up an automated M-Pesa rent payment routing system for an apartment block in Nairobi, or want to deploy the best property management software with automated M-Pesa Daraja API reconciliation, our team is ready. Discover how a property owner can securely manage rental operations across multiple towns in Kenya remotely. We provide software that allows Kenyan landlords to track multi-property revenue on a single unified dashboard.
          </p>
          <div className="flex justify-center">
            <Link to="#sales-form" className="group inline-flex items-center px-8 py-3 font-light text-white border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300">
              Drop us a message <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 2: Direct Contact Matrix --- */}
      <section className="relative py-12 px-6 max-w-7xl mx-auto z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.a href="tel:+254700000000" variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:scale-[1.02] hover:border-[#B95F7B]/50 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-[#B95F7B]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-[#B95F7B]" />
            </div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">Phone Support</h3>
            <p className="text-sm text-white/60 font-light mb-4">
              Need to know what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment? Call us for immediate technical assistance.
            </p>
            <span className="text-white font-medium group-hover:text-[#B95F7B] transition-colors">+254 700 000 000</span>
          </motion.a>

          <motion.a href="mailto:sales@sahilrent.com" variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:scale-[1.02] hover:border-[#200497]/50 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-[#200497]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">Email Sales</h3>
            <p className="text-sm text-white/60 font-light mb-4">
              Learn the best way for Kenyan landlords to verify an M-Pesa transaction status instantly, and how to track manual M-Pesa transaction codes for missing rent payments in a property portal.
            </p>
            <span className="text-white font-medium group-hover:text-blue-400 transition-colors">sales@sahilrent.com</span>
          </motion.a>

          <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:scale-[1.02] hover:border-white/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">Headquarters</h3>
            <p className="text-sm text-white/60 font-light mb-4">
              Visit us to see a live demo of the property app that sends instant SMS receipts to tenants when they pay via M-Pesa.
            </p>
            <Link to="#map" className="text-white font-medium hover:text-[#B95F7B] transition-colors inline-flex items-center">
              View Map <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Section 3: Sales & Demo Form --- */}
      <section id="sales-form" className="relative py-20 px-6 max-w-4xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light tracking-tight mb-4">Automate Your Portfolio</h2>
            <p className="text-white/60 font-light text-sm max-w-2xl mx-auto leading-relaxed">
              Ready to automatically link M-Pesa Paybill payments to house numbers in Kenya? Our experts will help you automate rent collection via Safaricom C2B Paybill directly to your bank account. Experience how our rental system can split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically, allowing you to send automated rent invoices to tenants via SMS exactly on the 1st of every month.
            </p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input type="text" placeholder="Full Name" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white placeholder-white/40 rounded-t-lg focus:outline-none focus:border-[#B95F7B] transition-colors" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>
              <div className="relative group">
                <input type="email" placeholder="Email Address" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white placeholder-white/40 rounded-t-lg focus:outline-none focus:border-[#B95F7B] transition-colors" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>
            </div>
            <div className="relative group">
              <input type="tel" placeholder="Phone Number (e.g., +254...)" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white placeholder-white/40 rounded-t-lg focus:outline-none focus:border-[#B95F7B] transition-colors" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
            </div>
            <div className="relative group">
              <textarea rows="4" placeholder="How many units do you manage?" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white placeholder-white/40 rounded-t-lg focus:outline-none focus:border-[#B95F7B] transition-colors resize-none"></textarea>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
            </div>
            <button type="button" className="w-full inline-flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40 group">
              Submit Request <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* --- Section 4: Tenant Support Routing --- */}
      <section className="relative py-12 px-6 max-w-4xl mx-auto z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-[#200497]/30 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 p-4 bg-blue-500/20 rounded-full border border-blue-400/50">
            <ShieldAlert className="w-10 h-10 text-blue-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-light tracking-wide mb-2">Are you a tenant?</h3>
            <p className="text-sm text-white/70 font-light leading-relaxed mb-4">
              We provide the best portal for tenants to view granular rent breakdowns and download statements on their phones. Did you know we create passwordless tenant portals via smart tokenized links for faster user onboarding? This secure system helps Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payments, allowing property managers to track tenant rent arrears and balances accurately without using Excel spreadsheets.
            </p>
            <Link to="/login" className="inline-flex items-center px-6 py-2.5 font-light text-sm text-[#0F0246] bg-white rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
              Go to Tenant Portal
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 5: Office Location Map --- */}
      <section id="map" className="relative py-20 px-6 max-w-6xl mx-auto z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light tracking-tight mb-4">Operational Base</h2>
          <p className="text-white/60 font-light text-sm max-w-2xl mx-auto leading-relaxed">
            Visit our engineers to see how real estate technology startups automate secure B2C payouts from a working account to Kenyan landlords. We can discuss why we chose the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking, to securely send a mass notification SMS to all active tenants when transitioning to a new payment system. Discover exactly what features a premium white-label property management system's global admin dashboard should have.
          </p>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl">
          <div className="w-full h-[400px] rounded-3xl overflow-hidden relative">
            {/* Placeholder for iframe map to maintain styling constraints */}
            <div className="absolute inset-0 bg-[#0F0246] flex flex-col items-center justify-center border border-white/5">
              <Building className="w-12 h-12 text-[#B95F7B] mb-4 opacity-50" />
              <p className="text-white/60 font-light tracking-widest uppercase text-sm">Nairobi, Kenya</p>
              <div className="mt-6">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-2 font-light text-sm text-white border border-[#B95F7B] rounded-full hover:bg-[#B95F7B] transition-colors">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- Section 6: Quick FAQ Accordion --- */}
      <section className="relative py-20 px-6 max-w-4xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'bg-white/10 border-[#B95F7B]/50' : ''}`}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between focus:outline-none"
              >
                <span className="text-lg font-light tracking-wide text-left">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#B95F7B] transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-6 text-sm text-white/60 font-light leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
            <Link to="/about" className="text-[#B95F7B] hover:text-white transition-colors duration-300 text-sm font-light inline-flex items-center">
              Read all FAQs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </section>

      {/* --- Section 7: Live Calendar Booking --- */}
      <section className="relative py-20 px-6 max-w-4xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#200497]/10 backdrop-blur-xl border border-[#200497]/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <Calendar className="w-12 h-12 text-[#B95F7B] mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-light tracking-tight mb-4">Book a Screen-Share Demo</h2>
          <p className="text-white/60 font-light text-sm max-w-2xl mx-auto leading-relaxed mb-8">
            Experience the best accounting software for landlords in Kenya using a line-item ledger system. See exactly how a professional rental statement should display previous balances versus current month dues. We will show you how to configure a global promotional free trial with 0% transaction fees for a property software platform, and demonstrate how platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords.
          </p>
          
          {/* Faux Calendar Embed UI */}
          <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-white/80 font-medium mb-4">Select an available slot:</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="py-2 border border-white/20 rounded-lg text-sm text-white/50 cursor-not-allowed">Today - Full</div>
              <div className="py-2 bg-[#B95F7B] rounded-lg text-sm text-white cursor-pointer hover:bg-[#a04e67] transition-colors shadow-lg">Tomorrow - 10:00 AM</div>
            </div>
            <button className="w-full inline-flex items-center justify-center px-6 py-3 font-light text-[#0F0246] bg-white rounded-full hover:scale-[1.02] transition-transform duration-300 shadow-xl">
              Confirm Demo Booking
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- Section 8: Social & Community Links --- */}
      <section className="relative py-16 border-t border-white/10 z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/60 font-light text-sm leading-relaxed mb-8">
            Follow our engineering blog where we discuss the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL. Learn our methodologies on how to design an immutable, append-only financial ledger for high-integrity real estate applications. We regularly share tips on how to build a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling, and how we design a premium glassmorphism user interface with fluid entry reveals for real estate dashboards.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:scale-110 hover:bg-[#200497]/40 hover:border-[#200497] transition-all duration-300">
              <Share2 className="w-6 h-6 text-white/80" />
            </a>
            <a href="#" className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:scale-110 hover:bg-blue-400/40 hover:border-blue-400 transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-white/80" />
            </a>
            <a href="#" className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:scale-110 hover:bg-white/20 hover:border-white transition-all duration-300">
              <Globe className="w-6 h-6 text-white/80" />
            </a>
          </div>
          
          <div className="mt-12">
            <Link to="/" className="inline-flex items-center px-8 py-3 font-light text-white text-sm tracking-widest uppercase border border-white/20 rounded-full hover:bg-white/5 transition-colors duration-300">
              Return to Home
            </Link>
          </div>
        </div>
      </section>

      {/* --- Floating WhatsApp CTA --- */}
      <a 
        href="https://wa.me/254700000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500/90 backdrop-blur-md rounded-full shadow-2xl hover:-translate-y-2 hover:bg-green-400 transition-all duration-300 border border-green-400/50 group"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Support via WhatsApp
        </span>
      </a>

    </div>
  );
}