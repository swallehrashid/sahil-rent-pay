import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Smartphone,
  Database,
  Users,
  FileText,
  Server,
  Wallet,
  Lock
} from 'lucide-react';

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

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Component-level loader (1.2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request to authApiSlice.forgotPassword
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-20 h-20 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 border-t-2 border-[#B95F7B] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-[#200497] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <KeyRound className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Verifying Identity
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Global Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#200497]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#B95F7B]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Section 1: Hero Section (Password Recovery Form) --- */}
      <section className="relative pt-24 pb-16 px-6 z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-3">Account Recovery</h1>
            <p className="text-sm text-white/60 font-light leading-relaxed">
              If you have lost access, enter your registered email below. We utilize advanced security to ensure platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords , while allowing tenants to create passwordless tenant portals via smart tokenized links for faster user onboarding. 
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(32,4,151,0.2)]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered Email Address" 
                    className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light" 
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(185,95,123,0.5)] disabled:opacity-70 disabled:hover:translate-y-0 group"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Send Recovery Link
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Recovery Email Sent</h3>
                <p className="text-sm text-white/60 font-light mb-6">
                  If an account exists for {email}, a password reset link has been dispatched securely.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="text-sm text-[#B95F7B] hover:text-white transition-colors font-light">
                  Try another email
                </button>
              </motion.div>
            )}

            <div className="mt-8 text-center border-t border-white/10 pt-6 flex flex-col space-y-3">
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors font-light">
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Security & Infrastructure Context - 8 Section SEO Rule Satisfaction */}
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* --- Section 2: M-Pesa Integration & Real-Time Payment Routing --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#200497]/50 transition-all duration-300 group">
            <Smartphone className="w-8 h-8 text-[#B95F7B] mb-4" />
            <h3 className="text-xl font-light mb-3">M-Pesa Integration & Routing</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Our secure backend helps automatically link M-Pesa Paybill payments to house numbers in Kenya. We provide the best property management software with automated M-Pesa Daraja API reconciliation  which effectively dictates how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment. Furthermore, we show you the best way for Kenyan landlords to verify an M-Pesa transaction status instantly.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-white border border-[#B95F7B] rounded-full hover:bg-[#B95F7B] transition-all duration-300">
              Verify M-Pesa Setup
            </Link>
          </motion.div>
        </section>

        {/* --- Section 3: M-Pesa Fallbacks & Automations --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300">
            <Wallet className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-light mb-3">M-Pesa Fallbacks & Automations</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Landlords can seamlessly automate rent collection via Safaricom C2B Paybill directly to their bank account. If you are wondering what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment , our portal allows you to track manual M-Pesa transaction codes for missing rent payments. This ensures the rental system splits M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-white border border-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300">
              Automate Payments
            </Link>
          </motion.div>
        </section>

        {/* --- Section 4: Multi-Property Ledger Architecture --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300">
            <Database className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-light mb-3">Ledger Architecture</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Learn how to track tenant rent arrears and balances accurately without using Excel spreadsheets. We engineered the best accounting software for landlords in Kenya using a line-item ledger system. This structure demonstrates exactly how a property management ledger handles tenant overpayments, credits, or advance rent payments , ensuring a professional rental statement displays previous balances versus current month dues clearly.
            </p>
            <Link to="/about" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-[#0F0246] bg-green-400 rounded-full hover:bg-green-300 transition-all duration-300">
              View Ledger Demo
            </Link>
          </motion.div>
        </section>

        {/* --- Section 5: Arrears Management & Error Correction --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#B95F7B]/50 transition-all duration-300">
            <ShieldCheck className="w-8 h-8 text-[#B95F7B] mb-4" />
            <h3 className="text-xl font-light mb-3">Arrears & Error Correction</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Our system allows landlords to calculate the total lifetime rent paid by an individual tenant automatically. It is the best way to generate monthly cash flow, arrears, and collected revenue statements for rental units. You can manage tenant security deposits held and refunds cleanly in landlord accounting , utilizing a property management system that features master ledger controls for admin error correction.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-white border border-[#B95F7B] rounded-full hover:bg-[#B95F7B]/20 transition-all duration-300">
              Manage Arrears
            </Link>
          </motion.div>
        </section>

        {/* --- Section 6: Caretaker Operations & RBAC --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#200497]/50 transition-all duration-300">
            <Users className="w-8 h-8 text-[#200497] mb-4" />
            <h3 className="text-xl font-light mb-3">Caretaker Operations & RBAC</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Discover how to give your caretaker access to input water bills without exposing your total rental profits. We offer the best property management app in Kenya with restricted dashboard permissions for caretakers. This effectively prevents caretakers or property managers from altering financial records or deleting tenants , while maintaining a system to log a tamper-proof audit trail of everything a caretaker or property manager does.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-white bg-[#200497] rounded-full hover:bg-indigo-800 transition-all duration-300">
              Delegate Access
            </Link>
          </motion.div>
        </section>

        {/* --- Section 7: Automated Invoicing & Tenant Communications --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300">
            <FileText className="w-8 h-8 text-white/80 mb-4" />
            <h3 className="text-xl font-light mb-3">Automated Invoicing</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Send automated rent invoices to tenants via SMS exactly on the 1st of every month  using the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking. The platform can auto-generate downloadable PDF rent receipts and email them automatically to tenants , and automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-[#0F0246] bg-white rounded-full hover:bg-gray-200 transition-all duration-300">
              Setup SMS Invoices
            </Link>
          </motion.div>
        </section>

        {/* --- Section 8: Platform Governance & Tech Stack --- */}
        <section className="relative z-10 pb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-[#200497]/30 to-[#B95F7B]/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <Server className="w-8 h-8 text-white mb-4" />
              <h3 className="text-2xl font-light mb-3">Platform Governance & Scale</h3>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                See how we configure a global promotional free trial with 0% transaction fees for a property software platform. Built on the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL , we design an immutable, append-only financial ledger for high-integrity real estate applications. Experience how we build a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling.
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/contact" className="inline-flex items-center px-8 py-4 font-light text-white bg-transparent border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 whitespace-nowrap">
                Partner With Us <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </section>

      </div>

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