import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Smartphone, 
  Server, 
  Wallet, 
  CheckCircle2, 
  MessageCircle,
  Users,
  BarChart3,
  Building,
  FileText
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

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Component-level loader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate authentication delay for UI demonstration
    setTimeout(() => {
      setIsSubmitting(false);
      // In production, dispatch RTK Query login mutation here
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-20 h-20 flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-t-2 border-[#B95F7B] rounded-full opacity-70"></div>
            <div className="absolute inset-2 border-r-2 border-[#200497] rounded-full opacity-80"></div>
            <Lock className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Securing Connection
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-20">
      {/* Global Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#200497]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#B95F7B]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Section 1: Secure Authentication Gateway (The Form) --- */}
      <section className="relative pt-24 pb-16 px-6 z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-3">Welcome Back</h1>
            <p className="text-sm text-white/60 font-light leading-relaxed">
              Access the best property management software with automated M-Pesa Daraja API reconciliation. Seamlessly track multi-property revenue on a single unified dashboard, automate rent collection via Safaricom C2B Paybill directly to your bank account, and experience passwordless tenant portals via smart tokenized links for faster user onboarding.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(32,4,151,0.2)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light" 
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secure Password" 
                  className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light" 
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              <div className="flex items-center justify-between text-xs font-light px-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#B95F7B] focus:ring-[#B95F7B]/50" />
                  <span className="text-white/60 group-hover:text-white transition-colors">Remember device</span>
                </label>
                <Link to="/forgot-password" className="text-[#B95F7B] hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Secure Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-xs text-white/50 font-light mb-3">Property owner without an account?</p>
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-light text-white border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300">
                Register Landlord Account
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Security & Infrastructure Context - Deepening the Brand Trust */}
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        
        {/* --- Section 2: Role-Based Access Verification (RBAC Info) --- */}
        <section className="relative pt-12 z-10 border-t border-white/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#200497]/50 transition-colors duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 p-4 bg-[#200497]/20 rounded-2xl border border-[#200497]/30">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-light mb-3">Strict Role-Based Access</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                  Our architecture guarantees absolute data isolation. Learn how to give caretaker access to input water bills without exposing total rental profits. We provide the best property management app in Kenya with restricted dashboard permissions for caretakers, engineered to prevent caretakers or property managers from altering financial records. The system logs a tamper-proof audit trail of everything a caretaker or property manager does, and can intelligently assign a unique house number prefix based on a landlord's initials automatically.
                </p>
                <Link to="/about" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
                  View Access Control Matrix <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Section 3: M-Pesa Reconciliation Engine Status --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300">
              <Smartphone className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-medium mb-3">Real-Time Routing</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Discover the most reliable property app that sends instant SMS receipts to tenants when they pay via M-Pesa. We show landlords exactly how to set up an automated M-Pesa rent payment routing system and smoothly split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically, allowing you to instantly verify an M-Pesa transaction status.
              </p>
              <button className="px-5 py-2 text-sm font-light text-white bg-green-500/20 border border-green-500/30 rounded-full hover:bg-green-500/30 transition-colors">
                Check Daraja Uptime
              </button>
            </div>

            {/* --- Section 4: Ledger Integrity & Security --- */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300">
              <Database className="w-8 h-8 text-[#B95F7B] mb-4" />
              <h3 className="text-xl font-medium mb-3">Ledger Integrity</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Our infrastructure revolves around an immutable, append-only financial ledger for high-integrity real estate applications. Do you know what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment? Our fallback mechanisms show you how to track manual M-Pesa transaction codes for missing rent payments in a property portal securely.
              </p>
              <button className="px-5 py-2 text-sm font-light text-white bg-[#B95F7B]/20 border border-[#B95F7B]/30 rounded-full hover:bg-[#B95F7B]/30 transition-colors">
                Read Security Whitepaper
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- Section 5: Tenant Support & Missing Payments --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-light mb-4 flex items-center">
              <ShieldCheck className="w-6 h-6 text-[#200497] mr-3" />
              Tenant Assurance
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6 max-w-3xl">
              We provide the best portal for tenants to view granular rent breakdowns and download statements on their phones. Our secure architecture is exactly how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment. Through our transparent ledgers, it's effortless to track tenant rent arrears and balances accurately without using Excel spreadsheets.
            </p>
            <Link to="/contact" className="inline-flex items-center px-6 py-3 text-sm font-light text-white border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300">
              Claim Missing M-Pesa Payment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </section>

        {/* --- Section 6: Automated Billing & Invoicing --- */}
        <section className="relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-[#B95F7B]/40 transition-colors">
              <FileText className="w-6 h-6 text-white/70 mb-4 group-hover:text-[#B95F7B] transition-colors" />
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                We utilize the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking, to send automated rent invoices to tenants via SMS exactly on the 1st of every month.
              </p>
              <button className="text-xs text-[#B95F7B] uppercase tracking-widest font-medium hover:text-white transition-colors">Setup Automated Billing</button>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-blue-400/40 transition-colors">
              <Building className="w-6 h-6 text-white/70 mb-4 group-hover:text-blue-400 transition-colors" />
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                The engine can automatically apply a late payment fine to a tenant's profile and trigger an immediate SMS invoice, while managing to auto-generate downloadable PDF rent receipts and email them automatically to tenants.
              </p>
              <button className="text-xs text-blue-400 uppercase tracking-widest font-medium hover:text-white transition-colors">Explore Fine Logic</button>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-green-400/40 transition-colors">
              <Wallet className="w-6 h-6 text-white/70 mb-4 group-hover:text-green-400 transition-colors" />
              <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                A true accounting solution must know how a property management ledger handles tenant overpayments, credits, or advance rent payments, ensuring a professional rental statement displays previous balances versus current month dues.
              </p>
              <button className="text-xs text-green-400 uppercase tracking-widest font-medium hover:text-white transition-colors">View Ledger Tools</button>
            </motion.div>
          </motion.div>
        </section>

        {/* --- Section 7: Platform Governance & Scale --- */}
        <section className="relative z-10 border-t border-white/5 pt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 gap-8 shadow-2xl">
            <div className="flex-1">
              <h3 className="text-xl font-light mb-2 text-white">Enterprise & Governance</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                See how we configure a global promotional free trial with 0% transaction fees for a property software platform, utilizing Celery Beat cron jobs to automate free trial expirations and default fee reversions daily. Additionally, our master ledger controls for admin error correction ensure platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords.
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/contact" className="px-6 py-3 text-sm font-light text-[#0F0246] bg-white rounded-full hover:scale-105 transition-transform duration-300 shadow-xl flex items-center">
                Contact Enterprise Support <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 8: Tech Architecture & Development --- */}
        <section className="relative z-10 pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-4xl mx-auto">
            <Server className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-light tracking-tight mb-4">Built for Scale</h3>
            <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
              Underneath the hood lies the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL. We solved complex logic to prevent global payment reference collisions when multiple landlords share identical house numbers. On the frontend, we obsessed over how to design a premium glassmorphism user interface with fluid entry reveals for real estate dashboards, resulting in a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling.
            </p>
            <Link to="/about" className="text-[#B95F7B] hover:text-white transition-colors text-sm tracking-wide inline-flex items-center">
              Review Architecture <ArrowRight className="w-4 h-4 ml-2" />
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
          Login Support
        </span>
      </a>

    </div>
  );
}