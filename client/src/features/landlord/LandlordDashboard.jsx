import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  MessageCircle,
  Receipt,
  PieChart,
  Clock,
  CheckCircle2,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
// Note: Ensure the path matches your project structure (e.g., './landlordApiSlice')
import { 
  useGetCurrentMonthReportsQuery, 
  useGetPropertiesQuery,
  useGetTenantBalancesQuery
} from './landlordApiSlice';

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

export default function LandlordDashboard() {
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Integration ---
  const { data: reportsData, isLoading: isReportsLoading } = useGetCurrentMonthReportsQuery();
  const { data: propertiesData, isLoading: isPropertiesLoading } = useGetPropertiesQuery();
  const { data: balancesData, isLoading: isBalancesLoading } = useGetTenantBalancesQuery();

  // Enforce 1.2s loader constraint for the luxurious entry feel
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Fallback / Simulated Data ---
  // If backend is unlinked during development, provide safe fallbacks based on schema
  const currentMonth = reportsData || {
    billing_period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    expected_revenue: 1250000.00,
    collected_revenue: 980000.00,
    total_arrears: 270000.00
  };

  const properties = propertiesData?.properties || [
    { id: 1, name: "Sunset Heights", location: "Westlands", houses: Array(45).fill({}) },
    { id: 2, name: "Lavington Views", location: "Lavington", houses: Array(12).fill({}) }
  ];

  const defaultersCount = balancesData?.defaulters_count || 4;

  // Derived Metrics
  const totalProperties = properties.length;
  const totalHouses = properties.reduce((acc, prop) => acc + (prop.houses?.length || 0), 0);
  const collectionRate = currentMonth.expected_revenue > 0 
    ? Math.round((currentMonth.collected_revenue / currentMonth.expected_revenue) * 100) 
    : 0;

  // Simulated Free Trial Status (Usually derived from User Auth Context or Profile API)
  // For User Story 6.1 (Free Trial Visibility & Countdown)
  const trialStatus = {
    isActive: true,
    daysRemaining: 14
  };

  const formatKsh = (amount) => `KES ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isScreenLoading = isReportsLoading || isPropertiesLoading || isBalancesLoading || isArtificialLoading;

  if (isScreenLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-24 h-24 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Premium Architectural/Financial Loader */}
            <div className="absolute inset-0 border-t-4 border-[#200497] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-[#B95F7B] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 border-b-4 border-indigo-400/50 rounded-full animate-pulse"></div>
            <Building2 className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Compiling Financial Models
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere - Deep Luxury Navy with Glassmorphism Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#200497]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">

        {/* --- Story 6.1: Free Trial Visibility & Countdown --- */}
        <AnimatePresence>
          {trialStatus.isActive && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#200497]/40 to-[#0F0246] border border-indigo-400/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between shadow-[0_0_30px_rgba(32,4,151,0.3)] backdrop-blur-xl"
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 border border-indigo-400/50 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white tracking-wide">Premium Trial Active</h3>
                  <p className="text-sm text-indigo-200/80 font-light">Current M-Pesa collections are incurring a <strong className="text-white font-medium">0% processing fee</strong>.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 px-5 py-2.5 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span className="text-xl font-light text-white">{trialStatus.daysRemaining}</span>
                <span className="text-xs uppercase tracking-widest text-indigo-200">Days Left</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Header Section --- */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">Portfolio Overview</h1>
            <p className="text-sm text-white/60 font-light flex items-center">
              Financial aggregates for <span className="text-[#B95F7B] font-medium ml-1.5">{currentMonth.billing_period}</span>
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
            <Link to="/landlord/properties" className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-light hover:bg-white/20 transition-all flex items-center">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Property
            </Link>
            <Link to="/landlord/reports" className="px-5 py-2.5 bg-[#200497] text-white rounded-xl text-sm font-light hover:bg-[#3213b3] transition-all flex items-center shadow-lg shadow-[#200497]/30">
              <PieChart className="w-4 h-4 mr-2" /> Full Report
            </Link>
          </motion.div>
        </section>

        {/* --- Story 4.2: Current Month Reports (Financial Aggregates) --- */}
        <section>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Expected Revenue */}
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:border-indigo-400/30 transition-colors duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-xs font-light text-white/50 uppercase tracking-widest">Expected</span>
              </div>
              <h3 className="text-3xl font-light text-white mb-2">{formatKsh(currentMonth.expected_revenue)}</h3>
              <p className="text-sm text-white/50 font-light">Total billed invoices for {currentMonth.billing_period}</p>
            </motion.div>

            {/* Collected Revenue */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 shadow-xl hover:border-green-400/40 transition-colors duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  {collectionRate}% Collected
                </div>
              </div>
              <h3 className="text-3xl font-light text-white mb-2">{formatKsh(currentMonth.collected_revenue)}</h3>
              <p className="text-sm text-green-400/60 font-light flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Reconciled via M-Pesa Daraja
              </p>
            </motion.div>

            {/* Total Arrears */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#B95F7B]/10 to-transparent backdrop-blur-xl border border-[#B95F7B]/20 rounded-3xl p-8 shadow-xl hover:border-[#B95F7B]/40 transition-colors duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-[#B95F7B]/20 rounded-xl border border-[#B95F7B]/30 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-6 h-6 text-[#B95F7B]" />
                </div>
                {defaultersCount > 0 && (
                  <span className="text-xs font-medium text-[#B95F7B] bg-[#B95F7B]/10 px-2 py-1 rounded border border-[#B95F7B]/20">
                    {defaultersCount} Defaulters
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-light text-white mb-2">{formatKsh(currentMonth.total_arrears)}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#B95F7B]/60 font-light">Outstanding balances</p>
                <Link to="/landlord/ledger" className="text-xs uppercase tracking-widest text-[#B95F7B] hover:text-white transition-colors flex items-center">
                  Chase <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* --- Operational Links & Portfolio Snapshot --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions Panel */}
          <motion.div variants={fadeInUp} className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-light mb-4 px-2">Operational Hub</h3>
            
            <Link to="/landlord/properties" className="flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#200497]/30 flex items-center justify-center mr-4 group-hover:bg-[#200497]/50 transition-colors">
                <Building2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium">Manage Properties</h4>
                <p className="text-xs text-white/50 font-light mt-0.5">Edit houses & unique prefixes</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/landlord/tenants" className="flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-green-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 group-hover:bg-green-500/20 transition-colors">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium">Tenant Directory</h4>
                <p className="text-xs text-white/50 font-light mt-0.5">Onboard, assign & archive</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/landlord/billing" className="flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#B95F7B]/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#B95F7B]/10 flex items-center justify-center mr-4 group-hover:bg-[#B95F7B]/20 transition-colors">
                <Receipt className="w-5 h-5 text-[#B95F7B]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium">Billing & Fines</h4>
                <p className="text-xs text-white/50 font-light mt-0.5">Ad-hoc charges & late penalties</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#B95F7B] group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>

          {/* Portfolio Snapshot (Properties List) */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light">Your Properties</h3>
              <div className="flex gap-4">
                <div className="text-center">
                  <span className="block text-xl font-medium text-white">{totalProperties}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Locations</span>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <span className="block text-xl font-medium text-white">{totalHouses}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Total Units</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
              {properties.length > 0 ? properties.map((prop, idx) => (
                <div key={prop.id || idx} className="p-5 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center hover:border-indigo-400/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#200497]/40 to-[#0F0246] flex items-center justify-center border border-white/5">
                      <Building2 className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white group-hover:text-indigo-200 transition-colors">{prop.name}</h4>
                      <p className="text-xs text-white/50 font-light mt-0.5">{prop.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-white">{prop.houses?.length || 0}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Units</span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl">
                  <Building2 className="w-10 h-10 text-white/20 mb-3" />
                  <p className="text-sm font-light text-white/60 mb-4">No properties constructed yet.</p>
                  <Link to="/landlord/properties" className="text-xs uppercase tracking-widest text-indigo-400 hover:text-white transition-colors border border-indigo-500/30 px-4 py-2 rounded-lg">
                    Build First Property
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/landlord/properties" className="mt-6 text-sm font-light text-center text-white/50 hover:text-white transition-colors flex items-center justify-center group">
              View complete property matrix <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
          Landlord Support
        </span>
      </a>

    </div>
  );
}