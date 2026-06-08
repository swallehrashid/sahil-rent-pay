import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Wallet, 
  Database, 
  Smartphone, 
  Users, 
  Server,
  FileText,
  LayoutDashboard
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

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Component-level custom loader (1.2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate API verification based on token presence
      if (token) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-24 h-24 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 border-4 border-[#B95F7B] rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-4 border-t-[#200497] border-r-transparent border-b-[#B95F7B] border-l-transparent rounded-full animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Verifying Cryptographic Token
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

      {/* --- Section 1: Hero & Verification Status --- */}
      <section className="relative pt-32 pb-16 px-6 z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-2xl text-center">
          
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-[0_0_50px_rgba(32,4,151,0.3)]">
            {verificationStatus === 'success' ? (
              <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-4xl font-light tracking-tight mb-4">Email Verified Successfully</h1>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
                  Your landlord account is active. You are now utilizing the best property management software with automated M-Pesa Daraja API reconciliation. If you ever wondered how to set up an automated M-Pesa rent payment routing system for an apartment block in Nairobi, or how can I automatically link M-Pesa Paybill payments to house numbers in Kenya, your new dashboard handles it natively. From today, you can automate rent collection via Safaricom C2B Paybill directly to your bank account without manual intervention.
                </p>
                <Link to="/login" className="inline-flex items-center justify-center px-10 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(185,95,123,0.4)]">
                  Proceed to Login <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-4xl font-light tracking-tight mb-4">Verification Failed</h1>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
                  The verification token is invalid or has expired. Please request a new verification link from your registration email.
                </p>
                <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 font-light text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:-translate-y-1">
                  Return to Registration <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* --- Section 2: Ledger Architecture --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-[#200497]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <Database className="w-12 h-12 text-[#200497] shrink-0 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Mastering the Line-Item Ledger</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Now that you are verified, explore the best accounting software for landlords in Kenya using a line-item ledger system. This framework solves the widespread issue of how do I track tenant rent arrears and balances accurately without using Excel spreadsheets. Our system explicitly defines how should a property management ledger handle tenant overpayments, credits, or advance rent payments natively. You will see firsthand how should a professional rental statement display previous balances versus current month dues.
              </p>
              <Link to="/about" className="inline-flex items-center text-sm font-light text-white border border-[#200497] bg-[#200497]/10 px-6 py-2.5 rounded-full hover:bg-[#200497]/30 transition-colors">
                Explore Ledger Architecture
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 3: Automated Invoicing --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-[#B95F7B]/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Seamless Tenant Communications</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Communication runs on autopilot. We have integrated the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking. Once logged in, you will learn how do I send automated rent invoices to tenants via SMS exactly on the 1st of every month without manual clicks. The infrastructure knows how do you auto-generate downloadable PDF rent receipts and email them automatically to tenants seamlessly. Wondering what your tenants receive? We provide what is a sample template for a professional monthly rent invoice message sent to Kenyan tenants via SMS within the settings panel.
              </p>
              <Link to="/contact" className="inline-flex items-center text-sm font-light text-white border border-[#B95F7B] bg-[#B95F7B]/10 px-6 py-2.5 rounded-full hover:bg-[#B95F7B]/30 transition-colors">
                View SMS Templates
              </Link>
            </div>
            <FileText className="w-12 h-12 text-[#B95F7B] shrink-0 order-1 md:order-2 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        </section>

        {/* --- Section 4: Platform Governance & Scale --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-blue-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <Server className="w-12 h-12 text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Enterprise Governance</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Welcome to enterprise-grade infrastructure. Sahil Rent Pay operates on what is considered the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL. Our system outlines exactly what features a premium white-label property management system's global admin dashboard should have. For example, our operations team understands how do you configure a global promotional free trial with 0% transaction fees for a property software platform, and exactly how can a system automate free trial expirations and default fee reversions daily using Celery Beat cron jobs.
              </p>
              <Link to="/about" className="inline-flex items-center text-sm font-light text-white border border-blue-400 bg-blue-500/10 px-6 py-2.5 rounded-full hover:bg-blue-500/30 transition-colors">
                Read Governance Docs
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 5: Caretaker Operations & RBAC --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-green-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Secure Delegation & RBAC</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Delegate safely using the best property management app in Kenya with restricted dashboard permissions for caretakers. This platform definitively answers the question: how can I give my caretaker access to input water bills without exposing my total rental profits? We have implemented strict protocols dictating how do you prevent caretakers or property managers from altering financial records or deleting tenants. Additionally, there is a way to log a tamper-proof audit trail of everything a caretaker or property manager does.
              </p>
              <Link to="/register" className="inline-flex items-center text-sm font-light text-[#0F0246] bg-green-400 px-6 py-2.5 rounded-full hover:bg-green-300 transition-colors">
                Provision a Caretaker
              </Link>
            </div>
            <Users className="w-12 h-12 text-green-400 shrink-0 order-1 md:order-2 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        </section>

        {/* --- Section 6: M-Pesa Fallbacks & Status Verification --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-yellow-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <Wallet className="w-12 h-12 text-yellow-400 shrink-0 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Failsafe Payment Verification</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Never lose a payment due to network errors. If you ever wonder what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment, our fallback UI explains how do you track manual M-Pesa transaction codes for missing rent payments in a property portal securely. It provides the best way for Kenyan landlords to verify an M-Pesa transaction status instantly. This ensures stability while demonstrating how can a rental system split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically.
              </p>
              <Link to="/contact" className="inline-flex items-center text-sm font-light text-yellow-400 border border-yellow-400 bg-yellow-400/10 px-6 py-2.5 rounded-full hover:bg-yellow-400/30 transition-colors">
                Test Transaction Sync
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- Section 7: Tenant Portals & Activation --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-indigo-400/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Frictionless Tenant Onboarding</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                We provide the best portal for tenants to view granular rent breakdowns and download statements on their phones. When adding new renters, you will see what is a tokenized smart portal link, and how does it work for tenant account activation. Our onboarding flow illustrates how do you create passwordless tenant portals via smart tokenized links for faster user onboarding. Once set up, it becomes effortless to learn how can a landlord send a mass notification SMS to all active tenants when transitioning to a new payment system.
              </p>
              <Link to="/login" className="inline-flex items-center text-sm font-light text-white border border-indigo-400 bg-indigo-500/10 px-6 py-2.5 rounded-full hover:bg-indigo-500/30 transition-colors">
                Preview Tenant Portal
              </Link>
            </div>
            <Smartphone className="w-12 h-12 text-indigo-400 shrink-0 order-1 md:order-2 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        </section>

        {/* --- Section 8: UI/UX Architecture & Security --- */}
        <section className="relative z-10 pb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
            <LayoutDashboard className="w-12 h-12 text-[#B95F7B] mb-4" />
            <h3 className="text-2xl font-light mb-3">Premium Interface & Security</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-8 max-w-3xl">
              Experience the platform that teaches developers how do you design a premium glassmorphism user interface with fluid entry reveals for real estate dashboards. The layout perfectly answers how do I build a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling. Beneath the beautiful exterior, we resolved how do you design an immutable, append-only financial ledger for high-integrity real estate applications. This allows us to securely manage how can platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords.
            </p>
            <Link to="/login" className="inline-flex items-center px-10 py-4 text-sm font-light text-white bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40 transition-all duration-300">
              Access the Interface <ArrowRight className="w-4 h-4 ml-2" />
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
          Verification Support
        </span>
      </a>

    </div>
  );
}