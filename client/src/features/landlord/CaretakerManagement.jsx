import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  ShieldCheck, 
  ToggleRight, 
  ToggleLeft,
  Mail,
  Phone,
  Lock,
  MessageCircle,
  HardHat,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Eye,
  Settings2
} from 'lucide-react';

// --- Import Connected RTK Query Hook ---
// (Ensure the path is correct relative to your actual file structure)
import { useProvisionCaretakerMutation } from './landlordApiSlice';

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

export default function CaretakerManagement() {
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // --- RTK Query Integration ---
  const [provisionCaretaker, { isLoading: isProvisioning }] = useProvisionCaretakerMutation();

  // --- Form State ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [permissions, setPermissions] = useState({
    view_balances: true,
    input_utility_charges: true,
    manage_houses: false,
    manage_tenants: false
  });

  // --- Mocked Caretakers List ---
  // Since getCaretakers isn't explicitly in the slice, we mock the list for visual completeness
  const [activeCaretakers] = useState([
    {
      id: 1,
      name: "Michael Omondi",
      email: "michael.o@sahilops.com",
      phone: "+254 711 223344",
      status: "Active",
      permissions: { view_balances: true, input_utility_charges: true }
    }
  ]);

  // Enforce 1.2s loader constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProvisionSubmit = async (e) => {
    e.preventDefault();
    try {
      await provisionCaretaker({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        permissions: permissions
      }).unwrap();

      setSuccessMessage(`Caretaker ${formData.firstName} successfully provisioned.`);
      
      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
      setPermissions({ view_balances: true, input_utility_charges: true, manage_houses: false, manage_tenants: false });
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to provision caretaker', err);
    }
  };

  if (isArtificialLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-24 h-24 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 border-t-4 border-[#200497] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-[#B95F7B] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <HardHat className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Configuring RBAC Protocols
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere - Third Color (#200497) for management focus */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">

        {/* --- Header Section --- */}
        <section className="border-b border-white/10 pb-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-[#200497]/20 border border-[#200497]/30 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Role-Based Access Control</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Caretaker Management
            </h1>
            <p className="text-sm text-white/60 font-light max-w-3xl leading-relaxed">
              Provision operations accounts for your field staff. Delegate daily tasks like utility meter readings and tenant balance follow-ups while strictly protecting your master financial settings and profit metrics.
            </p>
          </motion.div>
        </section>

        {/* Global Success Notification */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center text-green-400 shadow-xl"
            >
              <CheckCircle2 className="w-5 h-5 mr-3" />
              <span className="text-sm font-light">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================== */}
          {/* COLUMN 1: ACTIVE CARETAKERS LIST */}
          {/* ========================================== */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
              <h2 className="text-xl font-light mb-6 flex items-center">
                <Briefcase className="w-5 h-5 text-indigo-400 mr-3" /> Assigned Staff
              </h2>
              
              <div className="space-y-4 flex-1">
                {activeCaretakers.map((staff) => (
                  <div key={staff.id} className="p-5 bg-black/20 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <div>
                        <h4 className="text-base font-medium text-white">{staff.name}</h4>
                        <p className="text-xs text-white/50 font-light mt-0.5">{staff.phone}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                        {staff.status}
                      </span>
                    </div>
                    <div className="pl-2 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                      {staff.permissions.view_balances && (
                        <span className="text-[10px] px-2 py-1 rounded bg-[#200497]/30 text-indigo-200 border border-[#200497]/50">Balances</span>
                      )}
                      {staff.permissions.input_utility_charges && (
                        <span className="text-[10px] px-2 py-1 rounded bg-[#200497]/30 text-indigo-200 border border-[#200497]/50">Utilities</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-start gap-3 p-4 bg-[#B95F7B]/10 border border-[#B95F7B]/20 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-[#B95F7B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#B95F7B]/80 font-light leading-relaxed">
                    Caretakers are strictly blocked from viewing your master ledger, aggregated profits, or running dynamic late fines.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ========================================== */}
          {/* COLUMN 2 & 3: PROVISIONING FORM */}
          {/* ========================================== */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#200497] to-indigo-500" />
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#200497]/20 flex items-center justify-center border border-[#200497]/40 mr-4">
                  <UserPlus className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white">Provision New Caretaker</h2>
                  <p className="text-sm text-white/50 font-light mt-1">Create an account and assign granular permissions.</p>
                </div>
              </div>

              <form onSubmit={handleProvisionSubmit} className="space-y-8">
                
                {/* 1. Personal Details */}
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Identity & Access</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">First Name</label>
                      <div className="absolute bottom-0 left-0 pl-4 pb-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input 
                        type="text" required name="firstName"
                        value={formData.firstName} onChange={handleInputChange}
                        className="w-full bg-black/20 border-b border-white/20 pl-11 pr-4 py-3 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Last Name</label>
                      <input 
                        type="text" required name="lastName"
                        value={formData.lastName} onChange={handleInputChange}
                        className="w-full bg-black/20 border-b border-white/20 px-4 py-3 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Email Address</label>
                      <div className="absolute bottom-0 left-0 pl-4 pb-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input 
                        type="email" required name="email"
                        value={formData.email} onChange={handleInputChange}
                        className="w-full bg-black/20 border-b border-white/20 pl-11 pr-4 py-3 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <div className="absolute bottom-0 left-0 pl-4 pb-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input 
                        type="tel" required name="phone"
                        value={formData.phone} onChange={handleInputChange}
                        placeholder="+254..."
                        className="w-full bg-black/20 border-b border-white/20 pl-11 pr-4 py-3 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                    </div>
                    <div className="relative group sm:col-span-2">
                      <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Initial Password</label>
                      <div className="absolute bottom-0 left-0 pl-4 pb-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input 
                        type="password" required name="password" minLength={6}
                        value={formData.password} onChange={handleInputChange}
                        className="w-full bg-black/20 border-b border-white/20 pl-11 pr-4 py-3 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Granular Permissions */}
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Operational Permissions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Permission: View Balances */}
                    <div className="bg-[#0F0246]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">View Tenant Balances</span>
                        <span className="text-[10px] text-white/40 mt-1">Allows caretaker to see arrears</span>
                      </div>
                      <button type="button" onClick={() => handleTogglePermission('view_balances')} className="focus:outline-none transition-transform hover:scale-105">
                        {permissions.view_balances ? <ToggleRight className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                      </button>
                    </div>

                    {/* Permission: Input Utilities */}
                    <div className="bg-[#0F0246]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Input Utility Charges</span>
                        <span className="text-[10px] text-white/40 mt-1">Log mid-month meter readings</span>
                      </div>
                      <button type="button" onClick={() => handleTogglePermission('input_utility_charges')} className="focus:outline-none transition-transform hover:scale-105">
                        {permissions.input_utility_charges ? <ToggleRight className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                      </button>
                    </div>

                    {/* Permission: Manage Houses */}
                    <div className="bg-[#0F0246]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Manage Houses</span>
                        <span className="text-[10px] text-white/40 mt-1">Add/Edit physical units</span>
                      </div>
                      <button type="button" onClick={() => handleTogglePermission('manage_houses')} className="focus:outline-none transition-transform hover:scale-105">
                        {permissions.manage_houses ? <ToggleRight className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                      </button>
                    </div>

                    {/* Permission: Manage Tenants */}
                    <div className="bg-[#0F0246]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Manage Tenants</span>
                        <span className="text-[10px] text-white/40 mt-1">Onboard and archive tenants</span>
                      </div>
                      <button type="button" onClick={() => handleTogglePermission('manage_tenants')} className="focus:outline-none transition-transform hover:scale-105">
                        {permissions.manage_tenants ? <ToggleRight className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                      </button>
                    </div>

                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="submit" 
                    disabled={isProvisioning || !formData.firstName || !formData.email || !formData.password}
                    className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#200497] rounded-xl hover:bg-[#3213b3] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#200497]/40 disabled:opacity-50 disabled:hover:translate-y-0 group"
                  >
                    {isProvisioning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>
                      <Settings2 className="w-5 h-5 mr-2" />
                      Provision Operations Account
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

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
          Management Support
        </span>
      </a>

    </div>
  );
}