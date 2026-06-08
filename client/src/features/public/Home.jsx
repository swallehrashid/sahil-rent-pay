import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Wallet, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Lock,
  MessageCircle
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('landlord');

  useEffect(() => {
    // 1.2 second component-level loader
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Loader Component ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 border-t-2 border-r-2 border-[#B95F7B] rounded-full animate-spin flex items-center justify-center relative"
          >
            <div className="w-10 h-10 border-b-2 border-l-2 border-[#200497] rounded-full animate-spin absolute" style={{ animationDirection: 'reverse' }} />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Initializing Ledger
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white">
      {/* Global Background Glow Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#200497]/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* --- Section 1: Hero Section (The Premium Entry) --- */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex flex-col space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-max backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#B95F7B] animate-pulse" />
              <span className="text-xs tracking-wider text-white/80 font-light uppercase">The Ultimate Real Estate Tech</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              Automate Rent. <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B95F7B] to-white">Scale Effortlessly.</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed max-w-xl">
              Welcome to the best property management software with automated M-Pesa Daraja API reconciliation built right in. Discover how to automatically link M-Pesa Paybill payments to house numbers in Kenya, allowing you to seamlessly automate rent collection via Safaricom C2B Paybill directly to your bank account while tracking multi-property revenue on a single unified dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40">
                Start 30-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="group inline-flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 border border-white/20 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 hover:-translate-y-1">
                <PlayCircle className="w-4 h-4 mr-2 text-white/70 group-hover:text-white" />
                Watch Demo
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* 3D Glass Mockup Effect */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-[#200497]/30 rounded-2xl p-6 relative z-10 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <span className="text-xs text-white/50 tracking-widest uppercase">Live Ledger</span>
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-white/5 rounded-xl border border-white/5 flex items-center px-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 font-medium">Rent Paid - JKM-A-001</p>
                    <p className="text-xs text-white/50">Via M-Pesa • Just now</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-semibold">+ KES 25,000</p>
                  </div>
                </div>
                <div className="h-20 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 opacity-70">
                  <div className="w-10 h-10 rounded-full bg-[#B95F7B]/20 flex items-center justify-center mr-4">
                    <Wallet className="w-5 h-5 text-[#B95F7B]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 font-medium">Pending Water Bill</p>
                    <p className="text-xs text-white/50">Auto-billing in 2 days</p>
                  </div>
                </div>
              </div>
              {/* Internal Image representation of dashboard */}
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Dashboard Abstract" className="w-full h-32 object-cover rounded-xl mt-6 opacity-40 mix-blend-overlay" />
            </div>
            
            {/* Background Floating Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B95F7B]/20 rounded-full blur-[40px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#200497]/30 rounded-full blur-[50px] animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Trusted By: Social Proof Bar --- */}
      <section className="relative py-12 px-6 max-w-7xl mx-auto z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-8 px-6 text-center"
        >
          <p className="text-sm text-white/50 tracking-widest uppercase mb-8 font-light">Trusted infrastructure partners</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70">
            {/* Simulating Partner Logos */}
            <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300">
              <ShieldCheck className="w-8 h-8 text-[#B95F7B]" />
              <span className="font-semibold text-lg tracking-wide">SecurePay</span>
            </div>
            <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300">
              <Building2 className="w-8 h-8 text-[#200497]" />
              <span className="font-semibold text-lg tracking-wide">Nairobi Estates</span>
            </div>
            <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300">
              <Smartphone className="w-8 h-8 text-green-400" />
              <span className="font-semibold text-lg tracking-wide">M-Integration</span>
            </div>
            <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <span className="font-semibold text-lg tracking-wide">LedgerSync</span>
            </div>
          </div>
          <div className="mt-10 text-sm text-white/60 font-light max-w-4xl mx-auto leading-relaxed">
            Built for total reliability. We understand exactly what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment—our system captures and secures it. Learn how to track manual M-Pesa transaction codes for missing rent payments effortlessly, providing the best way for Kenyan landlords to verify an M-Pesa transaction status instantly. Plus, our network relies on how our rental system splits M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically.
          </div>
          <div className="mt-6">
            <Link to="/about" className="text-[#B95F7B] hover:text-white transition-colors duration-300 text-sm tracking-wide inline-flex items-center">
              Discover our architecture <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 3: Core Architecture: Features Grid --- */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Precision Financial Engine</h2>
          <p className="text-white/60 font-light max-w-2xl mx-auto">
            Ditch the manual work. If you're wondering how to track tenant rent arrears and balances accurately without using Excel spreadsheets, we provide the best accounting software for landlords in Kenya using a strict line-item ledger system.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-[#200497]/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#200497]/20 flex items-center justify-center mb-6 border border-[#200497]/30 group-hover:bg-[#200497]/40 transition-colors">
              <Wallet className="w-7 h-7 text-[#B95F7B]" />
            </div>
            <h3 className="text-xl font-medium mb-3 tracking-wide">Advance & Credit Parsing</h3>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-6">
              See exactly how a property management ledger should handle tenant overpayments, credits, or advance rent payments natively, rolling them over automatically.
            </p>
            <Link to="/contact" className="text-sm text-white/80 hover:text-[#B95F7B] transition-colors flex items-center">
              Ask about ledgers <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-[#B95F7B]/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#B95F7B]/10 flex items-center justify-center mb-6 border border-[#B95F7B]/20 group-hover:bg-[#B95F7B]/20 transition-colors">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-medium mb-3 tracking-wide">Granular Invoicing</h3>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-6">
              Discover how a professional rental statement displays previous balances versus current month dues seamlessly, avoiding single-number confusion.
            </p>
            <Link to="/register" className="text-sm text-white/80 hover:text-[#B95F7B] transition-colors flex items-center">
              Generate a statement <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-[#200497]/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#200497]/20 flex items-center justify-center mb-6 border border-[#200497]/30 group-hover:bg-[#200497]/40 transition-colors">
              <ShieldCheck className="w-7 h-7 text-[#B95F7B]" />
            </div>
            <h3 className="text-xl font-medium mb-3 tracking-wide">Immutable History</h3>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-6">
              Every single M-Pesa transaction is matched and verified. Zero room for spreadsheet errors or deleted rows. Total transparency for your portfolio.
            </p>
            <Link to="/contact" className="text-sm text-white/80 hover:text-[#B95F7B] transition-colors flex items-center">
              Explore security <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Section 4: How It Works: The Workflow Journey --- */}
      <section className="relative py-24 bg-[#0F0246]/50 border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">The Billing Journey</h2>
            <p className="text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
              The workflow is brilliantly simple. Learn how to send automated rent invoices to tenants via SMS exactly on the 1st of every month using the best bulk SMS gateway for rental management systems in Kenya, integrated directly into our core.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative">
            {/* Connecting Dashed Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-white/20 -translate-y-1/2 z-0" />
            
            {[
              { title: "Auto-Billing", icon: MessageSquare, desc: "System generates ledgers." },
              { title: "Tenant SMS", icon: Smartphone, desc: "Instant mobile alerts dispatched." },
              { title: "M-Pesa C2B", icon: Wallet, desc: "Funds hit the Safaricom Paybill." },
              { title: "Auto-Receipt", icon: CheckCircle2, desc: "PDFs sent & ledgers updated." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center mb-10 md:mb-0 group"
              >
                <div className="w-20 h-20 rounded-full bg-[#0F0246] border border-[#B95F7B]/50 flex items-center justify-center mb-4 shadow-lg shadow-[#B95F7B]/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-[#B95F7B]/10 group-hover:border-[#B95F7B]">
                  <step.icon className="w-8 h-8 text-white group-hover:text-[#B95F7B] transition-colors" />
                </div>
                <h4 className="font-medium tracking-wide text-center">{step.title}</h4>
                <p className="text-xs text-white/50 text-center font-light mt-2 max-w-[150px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center text-sm text-white/60 font-light max-w-4xl mx-auto leading-relaxed">
            Once paid, experience the ultimate property app that sends instant SMS receipts to tenants when they pay via M-Pesa, while simultaneously auto-generating downloadable PDF rent receipts and emailing them automatically to tenants.
            <div className="mt-8">
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 font-light text-white transition-all duration-300 border border-[#B95F7B] rounded-full hover:bg-[#B95F7B] hover:shadow-lg">
                Automate Your Billing Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 5: Multi-Portal Preview: Role-Based Views --- */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Isolated Access Control</h2>
          <p className="text-white/60 font-light max-w-2xl mx-auto">
            Security and delegation made easy. Figure out how to give your caretaker access to input water bills without exposing your total rental profits using the best property management app in Kenya with restricted dashboard permissions for caretakers.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 no-scrollbar">
            {['landlord', 'caretaker', 'tenant'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`flex-1 min-w-[120px] py-4 text-sm tracking-wide font-medium capitalize transition-all duration-300 ${
                  activeTab === role 
                    ? 'text-[#B95F7B] bg-white/5 border-b-2 border-[#B95F7B]' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {role} Portal
              </button>
            ))}
          </div>
          
          {/* Display Area */}
          <div className="p-8 md:p-12 min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center"
              >
                {activeTab === 'landlord' && (
                  <div className="space-y-6">
                    <Lock className="w-12 h-12 text-[#200497] mx-auto opacity-80" />
                    <h3 className="text-2xl font-light">Master Financial Control</h3>
                    <p className="text-white/60 max-w-xl mx-auto font-light">
                      Rest easy knowing exactly how to prevent caretakers or property managers from altering financial records or deleting tenants, all backed by a system that logs a tamper-proof audit trail of everything a caretaker or property manager does.
                    </p>
                  </div>
                )}
                {activeTab === 'caretaker' && (
                  <div className="space-y-6">
                    <Users className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
                    <h3 className="text-2xl font-light">Operations Restricted View</h3>
                    <p className="text-white/60 max-w-xl mx-auto font-light">
                      Input utility meter readings, view vacant houses, and follow up on localized balances without ever seeing the master banking settlement dashboards.
                    </p>
                  </div>
                )}
                {activeTab === 'tenant' && (
                  <div className="space-y-6">
                    <Smartphone className="w-12 h-12 text-[#B95F7B] mx-auto opacity-80" />
                    <h3 className="text-2xl font-light">Self-Service Transparency</h3>
                    <p className="text-white/60 max-w-xl mx-auto font-light">
                      Tenants can view exact invoice breakdowns, download historical PDF receipts, and claim missing M-Pesa payments instantly through their smart portal.
                    </p>
                  </div>
                )}
                <div className="mt-8">
                  <Link to="/contact" className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-sm font-light">
                    Request portal demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- Section 6: Testimonials: Client Voices --- */}
      <section className="relative py-24 bg-gradient-to-t from-[#0F0246] to-[#200497]/10 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Built for Kenyan Scale</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h4V8h-4zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h4V8h-4z"/></svg>
              </div>
              <p className="text-white/80 font-light leading-relaxed tracking-wide mb-6 relative z-10">
                "I finally know how to calculate the total lifetime rent paid by an individual tenant automatically. This is hands down the best way to generate monthly cash flow, arrears, and collected revenue statements for rental units. It has saved me dozens of hours."
              </p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" alt="Landlord" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                <div className="ml-4">
                  <p className="text-sm font-medium tracking-wide">David K.</p>
                  <p className="text-xs text-white/50 font-light">Portfolio Owner, Kileleshwa</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h4V8h-4zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h4V8h-4z"/></svg>
              </div>
              <p className="text-white/80 font-light leading-relaxed tracking-wide mb-6 relative z-10">
                "It’s brilliant. Discovering how to manage tenant security deposits held and refunds cleanly in landlord accounting was a game changer. Plus, seeing how easy it is for a landlord to filter and identify rent defaulters automatically on the 5th of the month takes the stress out of collections."
              </p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Property Manager" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                <div className="ml-4">
                  <p className="text-sm font-medium tracking-wide">Sarah M.</p>
                  <p className="text-xs text-white/50 font-light">Property Manager, Ruaka</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/about" className="inline-flex items-center px-6 py-3 font-light text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:-translate-y-1">
              Read More Success Stories
            </Link>
          </div>
        </div>
      </section>

      {/* --- Section 7: Global Promotion: Free Trial Banner --- */}
      <section className="relative py-20 px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto rounded-2xl p-10 md:p-16 backdrop-blur-xl bg-gradient-to-r from-[#200497]/40 to-[#B95F7B]/20 border border-white/20 shadow-2xl relative overflow-hidden"
        >
          {/* Inner Glow Overlay */}
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Start for Free Today</h2>
              <p className="text-white/80 font-light leading-relaxed max-w-xl text-sm">
                Experience how we configure a global promotional free trial with 0% transaction fees for our property software platform. Under the hood, you'll see how our system automates free trial expirations and default fee reversions daily using robust background jobs.
              </p>
              <p className="text-white/60 font-light mt-4 text-xs max-w-xl">
                Plus, invite your renters using a tokenized smart portal link, learning exactly how it works for tenant account activation to create passwordless tenant portals via smart tokenized links for faster user onboarding.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/register" className="relative inline-flex items-center justify-center px-10 py-5 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(185,95,123,0.5)]">
                Claim 0% Fee Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- Section 8: Final Conversion: Bottom CTA --- */}
      <section className="relative py-32 px-6 z-10 flex items-center justify-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-4xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative"
        >
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#B95F7B] to-transparent opacity-50" />
          
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Ready to scale?</h2>
          <p className="text-white/60 font-light text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            It's time to learn how to set up an automated M-Pesa rent payment routing system for an apartment block in Nairobi. Experience a platform that shows how a system can assign a unique house number prefix based on a landlord's initials automatically, and discover how a property owner can securely manage rental operations across multiple towns in Kenya remotely. 
          </p>
          <p className="text-[#B95F7B]/80 font-medium text-sm tracking-widest uppercase mb-12">
            See firsthand how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payments forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="w-full sm:w-auto px-10 py-4 font-light text-[#0F0246] bg-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20">
              Create Landlord Account
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-4 font-light text-white bg-transparent border border-white/30 rounded-full transition-all duration-300 hover:bg-white/10">
              Contact Enterprise Sales
            </Link>
          </div>
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
          Chat with an Expert
        </span>
      </a>

    </div>
  );
}