import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Activity, 
  Search, 
  ArrowRight, 
  BarChart3,
  ShieldCheck,
  Server,
  AlertTriangle,
  Clock,
  RefreshCw,
  MessageCircle,
  Database,
  Settings
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
import { 
  useGetDashboardStatsQuery, 
  useTriggerSystemJobMutation 
} from './adminApiSlice';

// --- Framer Motion Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Integration ---
  const { data: dashboardData, isLoading: isApiLoading, refetch } = useGetDashboardStatsQuery();
  const [triggerJob, { isLoading: isTriggering }] = useTriggerSystemJobMutation();

  // Enforce 1.2s loader
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Data Computation ---
  // The backend returns { landlords: [...] }. We calculate the global aggregates dynamically.
  const landlordsList = dashboardData?.landlords || [];
  
  const globalStats = {
    totalLandlords: landlordsList.length,
    totalHouses: landlordsList.reduce((acc, ll) => acc + (ll.total_houses || 0), 0),
    totalTenants: landlordsList.reduce((acc, ll) => acc + (ll.total_tenants || 0), 0),
    activeTrials: landlordsList.filter(ll => ll.trial_is_active || (ll.processing_fee === 0)).length
  };

  const filteredLandlords = landlordsList.filter(ll => 
    (ll.first_name && ll.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ll.last_name && ll.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ll.phone_number && ll.phone_number.includes(searchQuery))
  );

  // --- Action Handlers ---
  const handleForceTrialSync = async () => {
    try {
      await triggerJob('verify_trials').unwrap();
      // Optionally refetch the dashboard to see if any trials expired
      refetch();
    } catch (err) {
      console.error("Failed to trigger Celery trial sync job", err);
    }
  };

  const isScreenLoading = isApiLoading || isArtificialLoading;

  if (isScreenLoading) {
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
            <LayoutDashboard className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Aggregating Global Metrics
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#200497]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8 relative z-10">

        {/* --- Section 1: Hero & Global Welcome --- */}
        <section className="border-b border-white/10 pb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs tracking-wider text-white/80 font-light uppercase">System Status: Operational</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Platform Overview
            </h1>
            <p className="text-sm text-white/60 font-light max-w-2xl">
              Monitor total registered landlords, active houses, and tenant occupancy. Navigate directly to individual settings to execute manual overrides or view ledger activities.
            </p>
          </motion.div>
        </section>

        {/* --- Section 2: Core Aggregate Metrics --- */}
        <section>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Total</span>
              </div>
              <h3 className="text-3xl font-light mb-1">{globalStats.totalLandlords}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Registered Landlords</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#B95F7B]/20 flex items-center justify-center border border-[#B95F7B]/30">
                  <Building2 className="w-5 h-5 text-[#B95F7B]" />
                </div>
                <span className="text-xs font-medium text-[#B95F7B] bg-[#B95F7B]/10 px-2 py-1 rounded">Active</span>
              </div>
              <h3 className="text-3xl font-light mb-1">{globalStats.totalHouses}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Platform Houses</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">Occupied</span>
              </div>
              <h3 className="text-3xl font-light mb-1">{globalStats.totalTenants}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Active Tenants</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Promo</span>
              </div>
              <h3 className="text-3xl font-light mb-1">{globalStats.activeTrials}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Active Free Trials</p>
            </motion.div>
          </motion.div>
        </section>

        {/* --- Section 3: Search & Filter Controls --- */}
        <section className="pt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <h2 className="text-xl font-light">Landlord Directory</h2>
            <div className="w-full sm:w-96 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#B95F7B] transition-colors font-light text-sm" 
              />
            </div>
          </motion.div>
        </section>

        {/* --- Section 4: Master Data Table --- */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-white/50 font-medium">
                  <tr>
                    <th className="p-5 font-medium">Landlord Name</th>
                    <th className="p-5 font-medium">Contact</th>
                    <th className="p-5 font-medium text-center">Houses</th>
                    <th className="p-5 font-medium text-center">Tenants</th>
                    <th className="p-5 font-medium text-center">Processing Fee</th>
                    <th className="p-5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-white/80">
                  {filteredLandlords.map((ll) => {
                    const feePercentage = ll.processing_fee !== undefined ? `${ll.processing_fee}%` : '4.0%';
                    const isTrialActive = ll.processing_fee === 0 || ll.trial_is_active;

                    return (
                      <tr key={ll.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-5 font-medium text-white">{ll.first_name} {ll.last_name}</td>
                        <td className="p-5 text-white/60">{ll.phone_number || ll.email}</td>
                        <td className="p-5 text-center">
                          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">{ll.total_houses || 0}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">{ll.total_tenants || 0}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs ${isTrialActive ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/10 text-white/70'}`}>
                            {feePercentage}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <Link to={`/admin/landlords`} className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">
                            Manage <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLandlords.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-white/40 font-light">No landlords matched your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* --- Section 5: Platform Health & API Status --- */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-light mb-4 flex items-center"><Server className="w-5 h-5 text-[#200497] mr-2" /> API & Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                <span className="text-sm font-light text-white/70">M-Pesa Daraja C2B</span>
                <span className="flex items-center text-xs text-green-400"><span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span> Online</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                <span className="text-sm font-light text-white/70">Africa's Talking SMS</span>
                <span className="flex items-center text-xs text-green-400"><span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span> Online</span>
              </div>
              <button className="w-full mt-2 py-3 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-sm font-light transition-all flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2" /> Ping APIs
              </button>
            </div>
          </section>

          {/* --- Section 6: Recent Audit Logs --- */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-light mb-4 flex items-center"><ShieldCheck className="w-5 h-5 text-blue-400 mr-2" /> Recent Master Audits</h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm font-light text-white/70 items-start">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>Admin modified commission fee for <span className="text-white">Enterprise Ltd</span> to 2.5%.</p>
              </div>
              <div className="flex gap-3 text-sm font-light text-white/70 items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p>Failed C2B callback handled. Manual Daraja query executed for <span className="text-white">SGH1234567</span>.</p>
              </div>
              <div className="flex gap-3 text-sm font-light text-white/70 items-start">
                <Clock className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <p>Celery task <span className="font-mono text-xs">sync_invoices</span> completed successfully.</p>
              </div>
            </div>
          </section>

          {/* --- Section 7: Revenue & Projection Metrics --- */}
          <section className="bg-gradient-to-tr from-[#200497]/30 to-[#0F0246] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <BarChart3 className="w-10 h-10 text-[#B95F7B] mb-3" />
            <h3 className="text-lg font-light mb-2">Commission Revenue</h3>
            <p className="text-sm text-white/60 font-light mb-4 max-w-xs">
              View comprehensive financial projections based on standard deductions and active free trial volume.
            </p>
            <Link to="/admin/ledger" className="px-6 py-2.5 bg-[#B95F7B] text-white rounded-full text-sm font-light hover:bg-[#a04e67] transition-colors shadow-lg">
              View Master Ledger
            </Link>
          </section>

          {/* --- Section 8: Quick Automation Actions --- */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-light mb-4 flex items-center"><Database className="w-5 h-5 text-purple-400 mr-2" /> Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleForceTrialSync}
                disabled={isTriggering}
                className="p-4 bg-black/20 border border-white/5 rounded-xl hover:border-purple-400/50 hover:bg-purple-500/10 transition-colors text-left flex flex-col items-start group disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-white/40 mb-2 transition-colors ${isTriggering ? 'animate-spin text-purple-400' : 'group-hover:text-purple-400'}`} />
                <span className="text-sm font-medium text-white/80">Force Trial Sync</span>
                <span className="text-xs text-white/40 font-light mt-1">Run cron job manually</span>
              </button>
              <Link to="/admin/settings" className="p-4 bg-black/20 border border-white/5 rounded-xl hover:border-[#B95F7B]/50 hover:bg-[#B95F7B]/10 transition-colors text-left flex flex-col items-start group">
                <Settings className="w-5 h-5 text-white/40 mb-2 group-hover:text-[#B95F7B] transition-colors" />
                <span className="text-sm font-medium text-white/80">Global Settings</span>
                <span className="text-xs text-white/40 font-light mt-1">Adjust defaults</span>
              </Link>
            </div>
          </section>
        </div>

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
          Dev Support Channel
        </span>
      </a>

    </div>
  );
}