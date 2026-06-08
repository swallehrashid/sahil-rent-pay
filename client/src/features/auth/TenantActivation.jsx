import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Smartphone,
  FileText,
  Wallet,
  CheckCircle2,
  Database,
  Users,
  LayoutDashboard,
  Server
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

export default function TenantActivation() {
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  
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
      alert("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    // Simulate RTK Query mutation (authApiSlice.activateTenant)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsActivated(true);
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
            <ShieldCheck className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Validating Smart Token
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

      {/* --- Section 1: Hero / Activation Form --- */}
      <section className="relative pt-24 pb-16 px-6 z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs tracking-wider text-white/80 font-light uppercase">Tenant Onboarding</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight mb-3">Activate Account</h1>
            <p className="text-sm text-white/60 font-light leading-relaxed">
              Welcome to the best portal for tenants to view granular rent breakdowns and download statements directly on their phones. By clicking the tokenized smart portal link embedded in your SMS, you have initiated our secure process to create passwordless tenant portals via smart tokenized links for faster user onboarding. Once activated, our system will seamlessly send automated rent invoices to tenants via SMS exactly on the 1st of every month.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(32,4,151,0.2)] relative overflow-hidden">
            {!isActivated ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                  </div>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Secure Password" 
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
                    placeholder="Confirm Password" 
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
                      Activate Account
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 relative z-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Portal Activated</h3>
                <p className="text-sm text-white/60 font-light mb-6">
                  Your credentials have been securely stored. You may now access your property dashboard.
                </p>
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 text-sm font-light text-[#0F0246] bg-white rounded-full hover:bg-gray-200 transition-colors">
                  Proceed to Login
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* --- The 8-Section Rule Implementation --- */}
      <div className="max-w-6xl mx-auto px-6 space-y-12">

        {/* --- Section 2: Detailed Rent Breakdown --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#200497]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <FileText className="w-12 h-12 text-[#200497] shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Transparent Rent Breakdowns</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                Within your dashboard, we track tenant rent arrears and balances accurately without using Excel spreadsheets. You will always know how a professional rental statement displays previous balances versus current month dues. We also clarify how a property management ledger handles tenant overpayments, credits, or advance rent payments natively. Furthermore, our platform is designed to automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill so everything is in one place.
              </p>
              <Link to="/contact" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
                View Sample Statement <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 3: M-Pesa Payments & Claims --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">M-Pesa Payment Security</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                To guarantee your funds, the platform automatically links M-Pesa Paybill payments to house numbers in Kenya. This strict verification process is how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment. As a tenant, it is the best way for Kenyan landlords to verify an M-Pesa transaction status instantly on your behalf. Additionally, we provide tools to track manual M-Pesa transaction codes for missing rent payments in a property portal should you ever need to claim a transaction.
              </p>
              <Link to="/contact" className="inline-flex items-center text-green-400 hover:text-white transition-colors text-sm font-light">
                Learn About M-Pesa Safety <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <Wallet className="w-12 h-12 text-green-400 shrink-0 order-1 md:order-2" />
          </motion.div>
        </section>

        {/* --- Section 4: Automated Receipts & Comms --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <Smartphone className="w-12 h-12 text-blue-400 shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Instant Digital Receipts</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                You will love using a property app that sends instant SMS receipts to tenants when they pay via M-Pesa. Behind the scenes, the system will auto-generate downloadable PDF rent receipts and email them automatically to tenants. We strictly format a highly professional sample template for a monthly rent invoice message sent to Kenyan tenants via SMS. When upgrades occur, management can quickly send a mass notification SMS to all active tenants when transitioning to a new payment system.
              </p>
              <Link to="/contact" className="inline-flex items-center text-blue-400 hover:text-white transition-colors text-sm font-light">
                Preview Notification Settings <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 5: Security & Ledger Integrity --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#B95F7B]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Financial Ledger Integrity</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                Your portal runs on an immutable, append-only financial ledger for high-integrity real estate applications. Built using the best accounting software for landlords in Kenya using a line-item ledger system, your records are secure. This includes transparent mechanisms to manage tenant security deposits held and refunds cleanly in landlord accounting, and safely calculate the total lifetime rent paid by an individual tenant automatically for your own historical records.
              </p>
              <Link to="/about" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
                Read Security Policy <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <Database className="w-12 h-12 text-[#B95F7B] shrink-0 order-1 md:order-2" />
          </motion.div>
        </section>

        {/* --- Section 6: Caretaker Interaction Limits --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <Users className="w-12 h-12 text-yellow-400 shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Secure Operations</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                Your privacy is paramount. We architecturally prevent caretakers or property managers from altering financial records or deleting tenants. Landlords can safely give caretaker access to input water bills without exposing total rental profits. Every action creates a tamper-proof audit trail of everything a caretaker or property manager does, supported by a digital system for caretakers to log utility meter readings (water/electricity) on mobile securely.
              </p>
              <Link to="/contact" className="inline-flex items-center text-yellow-400 hover:text-white transition-colors text-sm font-light">
                Explore Role Limits <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 7: Mobile Responsiveness & UI --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#200497]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Premium Mobile Experience</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                Your tenant portal is a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling. We carefully designed a premium glassmorphism user interface with fluid entry reveals for real estate dashboards. This clean interface is powered by the best property management software with automated M-Pesa Daraja API reconciliation, perfectly engineered to handle what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment so you never face a confusing UI error.
              </p>
              <Link to="/contact" className="inline-flex items-center text-[#200497] bg-white px-5 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-light">
                Test Mobile Interface
              </Link>
            </div>
            <LayoutDashboard className="w-12 h-12 text-[#200497] shrink-0 order-1 md:order-2" />
          </motion.div>
        </section>

        {/* --- Section 8: Platform Scale & Reliability --- */}
        <section className="relative z-10 pb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-[#200497]/20 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
            <Server className="w-10 h-10 text-white/80 mb-4" />
            <h3 className="text-2xl font-light mb-3">Enterprise Reliability</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-8 max-w-3xl">
              Underneath your portal runs the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL. Our system guarantees that real estate technology startups automate secure B2C payouts from a working account to Kenyan landlords flawlessly. The engine can easily split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically, utilizing the same data to generate monthly cash flow, arrears, and collected revenue statements for rental units.
            </p>
            <Link to="/login" className="inline-flex items-center px-8 py-3 text-sm font-light text-[#0F0246] bg-white border border-white/20 rounded-full hover:bg-gray-200 hover:scale-[1.02] transition-all duration-300">
              Access Tenant Portal <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
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
          Setup Assistance
        </span>
      </a>

    </div>
  );
}