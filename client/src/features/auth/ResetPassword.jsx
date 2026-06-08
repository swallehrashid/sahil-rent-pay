import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Database,
  Smartphone,
  Wallet,
  Users,
  FileText,
  Server,
  Activity
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

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Component-level loader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please ensure both fields are identical.");
      return;
    }
    setIsSubmitting(true);
    // Simulate RTK Query mutation delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/login');
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
            Authenticating Token
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

      {/* --- Section 1: Hero / Reset Form & Token Auth --- */}
      <section className="relative pt-24 pb-16 px-6 z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-3">Set New Password</h1>
            <p className="text-sm text-white/60 font-light leading-relaxed">
              While you secure your credentials, you might wonder what a tokenized smart portal link is, and how it works for tenant account activation. We use this exact technology to create passwordless tenant portals via smart tokenized links for faster user onboarding. Behind the scenes, our support team knows how platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords. Enjoy the process as we show you how to design a premium glassmorphism user interface with fluid entry reveals for real estate dashboards.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(32,4,151,0.2)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                </div>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Secure Password" 
                  className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light" 
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                </div>
                <input 
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password" 
                  className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light" 
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              <button 
                type="submit" disabled={isSubmitting || !token}
                className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(185,95,123,0.5)] disabled:opacity-70 disabled:hover:translate-y-0 group"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Confirm & Login
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* --- Section 2: Ledger Integrity --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10 border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-[#200497]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <Database className="w-12 h-12 text-[#200497] shrink-0" />
          <div className="flex-1">
            <h3 className="text-2xl font-light mb-3">Immutable Financial Security</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              Protecting your data requires the best accounting software for landlords in Kenya using a line-item ledger system. This resolves how to track tenant rent arrears and balances accurately without using Excel spreadsheets. Furthermore, you will learn how to design an immutable, append-only financial ledger for high-integrity real estate applications. Is there a property management system that features master ledger controls for admin error correction? Yes, our platform ensures every reset and ledger entry is strictly audited.
            </p>
            <Link to="/about" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
              Explore Master Ledgers <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 3: M-Pesa Integration & Routing --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-green-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-2xl font-light mb-3">Automated M-Pesa Routing</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              Once inside, you will discover how to automatically link M-Pesa Paybill payments to house numbers in Kenya. As the best property management software with automated M-Pesa Daraja API reconciliation, you can automate rent collection via Safaricom C2B Paybill directly to your bank account. Experience exactly how a rental system can split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically.
            </p>
            <Link to="/contact" className="inline-flex items-center text-green-400 hover:text-white transition-colors text-sm font-light">
              Secure Your Paybill <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <Activity className="w-12 h-12 text-green-400 shrink-0 order-1 md:order-2" />
        </motion.div>
      </section>

      {/* --- Section 4: Managing Fraud & Verification --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-red-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <ShieldCheck className="w-12 h-12 text-red-400 shrink-0" />
          <div className="flex-1">
            <h3 className="text-2xl font-light mb-3">Fraud Prevention</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              We provide the framework for how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment. Discover the best way for Kenyan landlords to verify an M-Pesa transaction status instantly. If you are ever unsure what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment, our interface shows you how to track manual M-Pesa transaction codes for missing rent payments in a property portal.
            </p>
            <Link to="/contact" className="inline-flex items-center text-red-400 hover:text-white transition-colors text-sm font-light">
              Verify Transactions Now <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 5: Caretaker Restrictions --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-blue-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-2xl font-light mb-3">Role-Based Operations</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              Learn how to give your caretaker access to input water bills without exposing your total rental profits. We know how to prevent caretakers or property managers from altering financial records or deleting tenants. Is there a way to log a tamper-proof audit trail of everything a caretaker or property manager does? Yes, our backend solves this, showing you how to build a restricted portal that returns a 403 error if a caretaker tries to access landlord financial URLs.
            </p>
            <Link to="/register" className="inline-flex items-center text-blue-400 hover:text-white transition-colors text-sm font-light">
              Manage Caretaker Permissions <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <Users className="w-12 h-12 text-blue-400 shrink-0 order-1 md:order-2" />
        </motion.div>
      </section>

      {/* --- Section 6: Billing Automation & Adjustments --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-[#B95F7B]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <Wallet className="w-12 h-12 text-[#B95F7B] shrink-0" />
          <div className="flex-1">
            <h3 className="text-2xl font-light mb-3">Billing & Deposit Management</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              We define how a property management ledger should handle tenant overpayments, credits, or advance rent payments. See how a professional rental statement should display previous balances versus current month dues. Discover how to manage tenant security deposits held and refunds cleanly in landlord accounting, and how to automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill securely.
            </p>
            <Link to="/register" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
              Automate Your Billing <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 7: Invoicing & Communications --- */}
      <section className="relative pt-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-yellow-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-2xl font-light mb-3">Tenant Communications</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              Find out how to send automated rent invoices to tenants via SMS exactly on the 1st of every month. We integrate the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking. Watch how you can auto-generate downloadable PDF rent receipts and email them automatically to tenants, and learn how a landlord can send a mass notification SMS to all active tenants when transitioning to a new payment system.
            </p>
            <Link to="/contact" className="inline-flex items-center text-yellow-400 hover:text-white transition-colors text-sm font-light">
              Setup SMS Invoices <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <FileText className="w-12 h-12 text-yellow-400 shrink-0 order-1 md:order-2" />
        </motion.div>
      </section>

      {/* --- Section 8: Scalability & Tech Stack --- */}
      <section className="relative pt-12 pb-16 px-6 max-w-6xl mx-auto z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-[#200497]/20 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
          <Server className="w-10 h-10 text-white/80 mb-4" />
          <h3 className="text-2xl font-light mb-3">Architectural Scalability</h3>
          <p className="text-sm text-white/60 font-light leading-relaxed mb-8 max-w-3xl">
            We operate the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL. Our systems dictate how real estate technology startups automate secure B2C payouts from a working account to Kenyan landlords. Discover how we prevent global payment reference collisions when multiple landlords share identical house numbers, and how to build a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling.
          </p>
          <Link to="/about" className="inline-flex items-center px-8 py-3 text-sm font-light text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:scale-[1.02] transition-all duration-300">
            View Architecture Docs <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
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