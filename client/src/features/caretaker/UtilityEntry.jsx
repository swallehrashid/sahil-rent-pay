import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Zap, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle,
  Gauge,
  User,
  Hash,
  FileText,
  CreditCard,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
// (Ensure the path is correct relative to your actual file structure)
import { 
  useGetCaretakerDashboardQuery, 
  useAddUtilityChargeMutation 
} from './caretakerApiSlice';

// --- Framer Motion Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Simulated standard charge types since caretakers don't have access to the global billing config URL
const STANDARD_CHARGE_TYPES = [
  { id: 1, name: 'Water Usage', icon: Droplets, color: 'text-blue-400' },
  { id: 2, name: 'Electricity (Postpaid)', icon: Zap, color: 'text-yellow-400' },
  { id: 3, name: 'Garbage Collection', icon: FileText, color: 'text-green-400' },
  { id: 4, name: 'Service / Maintenance', icon: Gauge, color: 'text-indigo-400' }
];

export default function UtilityEntry() {
  const [searchParams] = useSearchParams();
  const preSelectedHouseId = searchParams.get("house"); // Allow direct navigation from dashboard

  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedChargeTypeId, setSelectedChargeTypeId] = useState(1);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // --- RTK Query Integration ---
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetCaretakerDashboardQuery();
  const [addUtilityCharge, { isLoading: isSubmitting }] = useAddUtilityChargeMutation();

  // Enforce 1.2s loader constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Parse active tenants from the dashboard data
  const activeTenants = [];
  if (dashboardData?.properties) {
    dashboardData.properties.forEach(property => {
      property.houses.forEach(house => {
        if (house.status === 'Occupied' && house.tenant) {
          activeTenants.push({
            tenant_id: house.tenant.id,
            house_id: house.id,
            name: house.tenant.name,
            house_number: house.house_number,
            property_name: property.name
          });
        }
      });
    });
  }

  // Pre-select tenant if routed from a specific house
  useEffect(() => {
    if (preSelectedHouseId && activeTenants.length > 0 && !selectedTenantId) {
      const match = activeTenants.find(t => t.house_id.toString() === preSelectedHouseId);
      if (match) setSelectedTenantId(match.tenant_id);
    }
  }, [preSelectedHouseId, activeTenants, selectedTenantId]);

  // Filter tenants for the dropdown search
  const filteredTenants = activeTenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.house_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTenantId || !amount) return;

    try {
      await addUtilityCharge({
        tenant_id: selectedTenantId,
        charge_type_id: selectedChargeTypeId,
        amount: parseFloat(amount),
        notes: notes
      }).unwrap();
      
      setSuccessMessage('Utility charge successfully queued for next invoice.');
      
      // Reset form fields
      setAmount('');
      setNotes('');
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err) {
      console.error('Failed to log utility charge', err);
    }
  };

  const isScreenLoading = isDashboardLoading || isArtificialLoading;

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
            {/* Meter Reading Animation */}
            <div className="absolute inset-0 border-t-4 border-[#200497] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <Gauge className="w-8 h-8 text-indigo-300 absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Initializing Meter Logs
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8 relative z-10">

        {/* --- Header Section --- */}
        <section className="border-b border-white/10 pb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Operational Action</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Utility Entry Log
            </h1>
            <p className="text-sm text-white/60 font-light max-w-2xl">
              Input mid-month meter readings for water or electricity. These entries are automatically queued as pending charges on the tenant's upcoming automated invoice.
            </p>
          </motion.div>
        </section>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Form Section --- */}
          <motion.section variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-[#200497]" />
              
              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center text-green-400"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-3" />
                    <span className="text-sm font-light">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Tenant Selection */}
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                    <User className="w-3 h-3 mr-2" /> Target Tenant & House
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <select
                      required
                      value={selectedTenantId}
                      onChange={(e) => setSelectedTenantId(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-4 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm appearance-none"
                    >
                      <option value="" disabled className="bg-[#0F0246]">Select an active tenant...</option>
                      {activeTenants.map((t) => (
                        <option key={t.tenant_id} value={t.tenant_id} className="bg-[#0F0246] py-2">
                          {t.house_number} - {t.name} ({t.property_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  {activeTenants.length === 0 && (
                    <p className="text-xs text-red-400 mt-2 font-light flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" /> No active tenants found assigned to your employer.
                    </p>
                  )}
                </div>

                {/* 2. Utility Type */}
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Utility / Charge Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STANDARD_CHARGE_TYPES.map((type) => {
                      const isSelected = selectedChargeTypeId === type.id;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedChargeTypeId(type.id)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center ${
                            isSelected 
                              ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                              : 'bg-black/20 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <type.icon className={`w-5 h-5 mr-3 ${isSelected ? type.color : 'text-white/40'}`} />
                          <span className={`text-sm font-light ${isSelected ? 'text-white' : 'text-white/60'}`}>
                            {type.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Amount & Notes Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <CreditCard className="w-3 h-3 mr-2" /> Amount (KES)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-white/40 font-light text-sm">KES</span>
                      </div>
                      <input 
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00" 
                        className="w-full bg-white/5 border-b border-white/20 pl-14 pr-4 py-4 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light" 
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-focus-within:w-full"></span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <Hash className="w-3 h-3 mr-2" /> Meter Reading / Notes
                    </label>
                    <div className="relative group">
                      <input 
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Current Reading: 14502" 
                        className="w-full bg-white/5 border-b border-white/20 px-4 py-4 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-focus-within:w-full"></span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/5">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !selectedTenantId || !amount}
                    className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none group"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Gauge className="w-5 h-5 mr-2" />
                        Queue Utility Charge
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.section>

          {/* --- Context / Information Panel --- */}
          <motion.section variants={fadeInUp} className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#200497]/30 to-[#0F0246]/80 backdrop-blur-xl border border-[#200497]/50 rounded-3xl p-8 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mb-6">
                <AlertCircle className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-light mb-4">Operations Guidelines</h3>
              <div className="space-y-4 text-sm font-light text-white/60 leading-relaxed flex-1">
                <p>
                  As a caretaker, you are authorized to log pending utility charges for active tenants. 
                </p>
                <p>
                  <strong className="text-white">What happens next?</strong> Once submitted, this record is securely stored in the pending queue. When the backend chron job executes on the 1st of the month, these charges will automatically be appended to the tenant's primary invoice.
                </p>
                <p>
                  Ensure your meter readings are accurate. Any disputes regarding utility readings must be directed to your employer (the landlord) who holds master ledger override permissions.
                </p>
              </div>

              <div className="mt-8 p-4 bg-black/20 border border-white/5 rounded-xl">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">System Status</p>
                <div className="flex items-center text-sm font-light text-green-400">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> RTK Mutation Queue Active
                </div>
              </div>
            </div>
          </motion.section>

        </motion.div>
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
          Operations Support
        </span>
      </a>

    </div>
  );
}