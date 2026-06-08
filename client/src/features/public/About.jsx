import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Wallet, 
  Smartphone, 
  ArrowRight, 
  Database,
  Lock,
  MessageCircle,
  Users,
  Code,
  Server,
  FileText,
  LineChart
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

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  // Component-level loader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Architectural Blueprint Rendering Animation */}
          <div className="relative w-24 h-24">
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100%", opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute left-0 bottom-0 w-6 bg-white/20 border border-[#B95F7B] backdrop-blur-md"
            />
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "60%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="absolute left-8 bottom-0 w-6 bg-[#200497]/50 border border-white/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "80%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              className="absolute left-16 bottom-0 w-6 bg-[#B95F7B]/50 border border-white/20 backdrop-blur-md"
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Constructing Architecture
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-20">
      {/* Global Background Glow Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#200497]/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* --- Section 1: Hero Section (The Mission) --- */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto z-10 text-center">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="flex flex-col items-center space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#B95F7B] animate-pulse" />
            <span className="text-xs tracking-wider text-white/80 font-light uppercase">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight max-w-5xl">
            Digitizing the Kenyan <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B95F7B] to-white">Real Estate Ecosystem.</span>
          </h1>
          <p className="text-lg text-white/70 font-light leading-relaxed max-w-3xl">
            At Sahil Rent Pay Solutions, we provide the best accounting software for landlords in Kenya using a line-item ledger system. Whether you need to set up an automated M-Pesa rent payment routing system for an apartment block in Nairobi, or want to automate rent collection via Safaricom C2B Paybill directly to your bank account, we are the definitive infrastructure. This is the ultimate software allowing Kenyan landlords to track multi-property revenue on a single unified dashboard.
          </p>
          <div className="pt-8">
            <Link to="/register" className="group relative inline-flex items-center justify-center px-10 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-full hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/50">
              Automate Your Portfolio Today
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 2: The Problem: Market Friction --- */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">The market is riddled with friction.</h2>
            <p className="text-white/60 font-light leading-relaxed">
              Property owners constantly ask how to track tenant rent arrears and balances accurately without using Excel spreadsheets. They also struggle with how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment.
            </p>
            <p className="text-white/60 font-light leading-relaxed">
              But what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment? We engineered the best way for Kenyan landlords to verify an M-Pesa transaction status instantly to resolve these exact, costly frustrations.
            </p>
            <div className="pt-4">
              <Link to="/contact" className="inline-flex items-center px-6 py-3 font-light text-[#B95F7B] bg-white/5 border border-[#B95F7B]/30 rounded-full transition-all duration-300 hover:bg-[#B95F7B]/10 hover:-translate-y-1 hover:shadow-lg">
                Solve M-Pesa Reconciliation Issues
              </Link>
            </div>
          </motion.div>
          
          <div className="lg:col-span-7 relative h-[400px]">
            {/* Overlapping Glass Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: -20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 w-[80%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-4">
                <FileText className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-white/80">Corrupted Spreadsheet.xlsx</span>
              </div>
              <div className="space-y-3 opacity-50 blur-[2px]">
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                <div className="h-4 bg-white/10 rounded w-4/6"></div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30, y: 30 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-10 left-0 w-[70%] bg-white/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-6 shadow-2xl z-20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Unverified Payment</p>
                  <p className="text-xs text-white/50">M-Pesa timeout detected</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Our Architectural Solution --- */}
      <section className="relative py-24 px-6 z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Our Architectural Solution</h2>
            <p className="text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
              When enterprise developers ask how to design an immutable, append-only financial ledger for high-integrity real estate applications, or what the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL looks like, they look to Sahil Rent Pay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#200497]/20 flex items-center justify-center border border-[#200497]/30">
                <Database className="w-8 h-8 text-[#200497]" />
              </div>
              <h3 className="text-xl font-medium tracking-wide">Data Isolation</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                We successfully built logic to prevent global payment reference collisions when multiple landlords share identical house numbers in our PostgreSQL schema.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B95F7B]/20 flex items-center justify-center border border-[#B95F7B]/30">
                <Users className="w-8 h-8 text-[#B95F7B]" />
              </div>
              <h3 className="text-xl font-medium tracking-wide">Impersonation Logs</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Our tools allow administrators to securely impersonate a landlord's operational view for troubleshooting without passwords, all while logging strict audit events.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium tracking-wide">Ledger Integrity</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Append-only mechanics ensure that no transaction is ever deleted, protecting your revenue reports from unauthorized or accidental modification.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/about" className="inline-flex items-center justify-center px-8 py-3 font-light text-white transition-all duration-300 border border-white/20 rounded-full hover:bg-white/10 hover:-translate-y-1">
              Explore the Tech Stack
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- Section 4: The Timeline: System Evolution --- */}
      <section className="relative py-24 px-6 max-w-4xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">System Evolution</h2>
        </div>

        <div className="relative border-l border-white/10 md:border-l-0">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2"></div>
          
          {[
            { year: "Phase 1", title: "Automated Dispatch", desc: "We started by building the engine to send automated rent invoices to tenants via SMS exactly on the 1st of every month." },
            { year: "Phase 2", title: "Digital Receipts", desc: "We advanced the system to auto-generate downloadable PDF rent receipts and email them automatically to tenants seamlessly." },
            { year: "Phase 3", title: "Dynamic Fine Triggers", desc: "To streamline enforcement, we engineered logic to automatically apply a late payment fine to a tenant's profile and trigger an immediate SMS invoice." },
            { year: "Phase 4", title: "Utility Aggregation", desc: "Finally, we scaled the architecture to automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill securely." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
              className={`relative flex flex-col md:flex-row items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="md:w-1/2" />
              <div className="absolute left-[-5px] md:left-1/2 w-3 h-3 bg-[#B95F7B] rounded-full md:-translate-x-1/2 shadow-[0_0_10px_#B95F7B]" />
              <div className={`md:w-1/2 pl-8 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xs text-[#B95F7B] tracking-widest font-medium uppercase block mb-2">{item.year}</span>
                  <h4 className="text-xl font-light mb-2">{item.title}</h4>
                  <p className="text-sm text-white/60 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/register" className="inline-flex items-center px-8 py-3 font-light text-white transition-all duration-300 bg-[#200497] rounded-full hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#200497]/50">
            Get the Latest Features
          </Link>
        </div>
      </section>

      {/* --- Section 5: Who We Serve: Target Audiences --- */}
      <section className="relative py-24 bg-gradient-to-t from-[#0F0246] to-[#200497]/10 border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Who We Serve</h2>
            <p className="text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
              From large-scale developers to individual landlords, many ask: how can I give my caretaker access to input water bills without exposing my total rental profits?
            </p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 justify-center items-stretch"
          >
            <motion.div variants={fadeInUp} className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-2xl hover:border-[#B95F7B]/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <Building2 className="w-10 h-10 text-[#B95F7B] mb-6" />
              <h3 className="text-xl font-medium tracking-wide mb-4">Agencies & Managers</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                We are the best property management app in Kenya with restricted dashboard permissions for caretakers, allowing you to securely manage rental operations across multiple towns in Kenya remotely.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-2xl hover:border-[#200497]/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <Lock className="w-10 h-10 text-[#200497] mb-6" />
              <h3 className="text-xl font-medium tracking-wide mb-4">Individual Landlords</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Maintain absolute control. Implement systems to prevent caretakers or property managers from altering financial records or deleting tenants without authorization.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-2xl hover:border-white/30 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <LineChart className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-medium tracking-wide mb-4">Developers</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Automate your entire portfolio's cash flow, keeping massive estates perfectly reconciled via instant C2B Daraja webhooks and robust multi-property analytics.
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-16 text-center">
            <Link to="/contact" className="inline-flex items-center px-8 py-3 font-light text-white transition-all duration-300 border border-[#B95F7B] rounded-full hover:bg-[#B95F7B] hover:-translate-y-1 hover:shadow-lg">
              Find Your Custom Plan
            </Link>
          </div>
        </div>
      </section>

      {/* --- Section 6: Technology & Security Standard --- */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">Enterprise Security</h2>
            <p className="text-white/60 font-light leading-relaxed">
              We obsessed over how to design a premium glassmorphism user interface with fluid entry reveals for real estate dashboards while maintaining a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling.
            </p>
            <p className="text-white/60 font-light leading-relaxed">
              Beneath the beautiful UI, security is absolute. The platform utilizes master ledger controls for admin error correction and automatically logs a tamper-proof audit trail of everything a caretaker or property manager does.
            </p>
            <div className="pt-6">
              <Link to="/contact" className="inline-flex items-center px-6 py-3 font-light text-white transition-all duration-300 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 hover:-translate-y-1">
                Read the Security Whitepaper
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Code, name: "React + JSX" },
                { icon: Server, name: "Python Flask" },
                { icon: Database, name: "PostgreSQL" },
                { icon: Lock, name: "JWT Auth" },
                { icon: ShieldCheck, name: "Alembic Migrations" },
                { icon: Smartphone, name: "Tailwind CSS" }
              ].map((tech, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-white/10 hover:border-[#B95F7B]/50 transition-all duration-300"
                >
                  <tech.icon className="w-8 h-8 text-white/70 mb-3" />
                  <span className="text-xs text-center font-light text-white/80">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 7: Engineering Leadership --- */}
      <section className="relative py-24 px-6 z-10 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Engineering Leadership</h2>
          <p className="text-white/60 font-light max-w-3xl mx-auto leading-relaxed mb-16">
            We are the architects behind the best property management software with automated M-Pesa Daraja API reconciliation. We solved how a rental system splits M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically, integrating the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking, deeply into our core.
          </p>

          <div className="flex justify-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="max-w-sm w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#200497]/50 transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600" alt="Lead Architect" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0246] to-transparent"></div>
              </div>
              <div className="p-8 -mt-10 relative z-10">
                <h3 className="text-2xl font-light tracking-wide mb-1">Lead Architect</h3>
                <p className="text-sm text-[#B95F7B] font-medium mb-4">System Operations & Scale</p>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                  Driving the architecture that demonstrates how real estate technology startups automate secure B2C payouts from a working account to Kenyan landlords flawlessly.
                </p>
                <Link to="/contact" className="text-sm text-white hover:text-[#B95F7B] transition-colors inline-flex items-center">
                  Meet the Architect <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Section 8: Career & Partnership CTA --- */}
      <section className="relative py-12 px-6 max-w-6xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-light tracking-wide mb-2">Connect & Build With Us</h3>
            <p className="text-sm text-white/70 font-light leading-relaxed">
              See how we configure a global promotional free trial with 0% transaction fees for a property software platform, utilizing cron jobs to automate free trial expirations and default fee reversions daily. Partner with us to deploy features that automatically assign a unique house number prefix based on a landlord's initials, and create passwordless tenant portals via smart tokenized links for faster user onboarding.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end shrink-0">
            <Link to="/contact" className="px-8 py-4 font-light text-[#0F0246] bg-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 whitespace-nowrap">
              Partner with Sahil Rent Pay
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
          Talk to an Expert
        </span>
      </a>

    </div>
  );
}