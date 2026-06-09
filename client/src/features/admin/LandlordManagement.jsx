import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Settings2, 
  UserCheck, 
  Building, 
  Users, 
  Percent, 
  Clock, 
  ToggleRight, 
  ToggleLeft,
  Save,
  MessageCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

// --- Import RTK Query Hooks ---
// (Ensure the path is correct relative to your actual file structure)
import { 
  useGetLandlordsQuery, 
  useUpdateLandlordFeeMutation, 
  useUpdateLandlordTrialMutation,
  useImpersonateLandlordMutation
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

export default function LandlordManagement() {
  const navigate = useNavigate();
  
  // --- RTK Query Integration ---
  const { data: landlords = [], isLoading: isApiLoading } = useGetLandlordsQuery();
  const [updateFee, { isLoading: isUpdatingFee }] = useUpdateLandlordFeeMutation();
  const [updateTrial, { isLoading: isUpdatingTrial }] = useUpdateLandlordTrialMutation();
  const [impersonateLandlord, { isLoading: isImpersonating }] = useImpersonateLandlordMutation();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFeeId, setEditingFeeId] = useState(null);
  const [newFee, setNewFee] = useState('');
  
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // Minimum 1.2s component loader
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Network Actions ---
  const handleToggleTrial = async (id, currentTrialStatus) => {
    try {
      const isNowActive = !currentTrialStatus;
      await updateTrial({ 
        landlordId: id, 
        is_active: isNowActive, 
        trial_days: isNowActive ? 30 : 0 // Assign 30 days if activating, 0 if deactivating
      }).unwrap();
    } catch (err) {
      console.error("Failed to toggle trial", err);
    }
  };

  const handleSaveFee = async (id) => {
    try {
      const parsedFee = parseFloat(newFee);
      if (!isNaN(parsedFee)) {
        await updateFee({ landlordId: id, fee_percentage: parsedFee }).unwrap();
      }
      setEditingFeeId(null);
    } catch (err) {
      console.error("Failed to update processing fee", err);
    }
  };

  const handleImpersonate = async (id) => {
    try {
      // The backend should return a temporary impersonation JWT
      const response = await impersonateLandlord(id).unwrap();
      
      // Store the temporary token (assuming the response contains { token: '...' })
      // localStorage.setItem('sahil_access_token', response.token);
      
      // Redirect Admin to the Landlord Operational Portal
      // navigate('/landlord');
      console.log("Impersonation successful. JWT received. Redirecting to landlord dashboard...", response);
    } catch (err) {
      console.error("Failed to execute account impersonation", err);
    }
  };

  // Safe filtering based on expected backend schema mapping
  const filteredLandlords = landlords.filter(ll => 
    (ll.name && ll.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (ll.email && ll.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ll.phone && ll.phone.includes(searchQuery))
  );

  const isScreenLoading = isApiLoading || isArtificialLoading;

  if (isScreenLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div 
            className="relative w-24 h-24 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 border-4 border-[#200497] rounded-xl border-t-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 border-4 border-[#B95F7B] rounded-full border-l-transparent border-r-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <Settings2 className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Decrypting Master Records
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

        {/* --- Header & Search Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">Landlord Management</h1>
            <p className="text-sm text-white/60 font-light max-w-xl">
              Execute manual per-landlord trial overrides, adjust dynamic commission structures, and initiate secure impersonation sessions for troubleshooting.
            </p>
          </div>
          <div className="w-full md:w-80 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#B95F7B] focus:bg-white/10 transition-all duration-300 font-light text-sm shadow-xl backdrop-blur-md" 
            />
          </div>
        </div>

        {/* --- Landlord Grid/List --- */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {filteredLandlords.map((landlord) => (
            <motion.div 
              key={landlord.id} 
              variants={fadeInUp}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#200497]/50 transition-colors duration-500 shadow-lg flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center group"
            >
              
              {/* Identity & Basic Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#200497] to-[#B95F7B] flex items-center justify-center shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl font-medium tracking-wider">{landlord.name ? landlord.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-light truncate pr-4">{landlord.name || 'Unnamed Landlord'}</h3>
                  <p className="text-xs text-white/50 font-light truncate mb-2">{landlord.email || 'No email provided'} • {landlord.phone}</p>
                  
                  <div className="flex gap-4">
                    <span className="inline-flex items-center text-xs font-light text-white/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Building className="w-3 h-3 mr-1.5 text-blue-400" /> {landlord.houses || 0} Houses
                    </span>
                    <span className="inline-flex items-center text-xs font-light text-white/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Users className="w-3 h-3 mr-1.5 text-green-400" /> {landlord.tenants || 0} Tenants
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto shrink-0 border-t border-white/5 pt-4 xl:border-t-0 xl:pt-0">
                
                {/* 1. Dynamic Commission Fee */}
                <div className="bg-[#0F0246]/50 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center">
                    <Percent className="w-3 h-3 mr-1" /> Processing Fee
                  </span>
                  
                  {editingFeeId === landlord.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        step="0.1" 
                        autoFocus
                        defaultValue={landlord.fee || 0}
                        onChange={(e) => setNewFee(e.target.value)}
                        className="w-16 bg-white/10 border border-[#B95F7B] rounded px-2 py-1 text-sm text-white focus:outline-none"
                      />
                      <button 
                        onClick={() => handleSaveFee(landlord.id)} 
                        disabled={isUpdatingFee}
                        className="text-[#B95F7B] hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isUpdatingFee && editingFeeId === landlord.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group/edit">
                      <span className={`text-lg font-medium ${landlord.fee === 0 ? 'text-green-400' : 'text-white'}`}>
                        {(landlord.fee || 0).toFixed(1)}%
                      </span>
                      <button 
                        onClick={() => { setEditingFeeId(landlord.id); setNewFee(landlord.fee || 0); }}
                        className="opacity-0 group-hover/edit:opacity-100 text-white/50 hover:text-white transition-all text-xs underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Manual Trial Override */}
                <div className="bg-[#0F0246]/50 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Free Trial Status
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${landlord.trialActive ? 'text-green-400' : 'text-white/40'}`}>
                        {landlord.trialActive ? 'Active' : 'Inactive'}
                      </span>
                      {landlord.trialActive && (
                        <span className="text-[10px] text-green-400/70">{landlord.trialDays || 0} days left</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleToggleTrial(landlord.id, landlord.trialActive)} 
                      disabled={isUpdatingTrial}
                      className="focus:outline-none transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {landlord.trialActive ? (
                        <ToggleRight className="w-8 h-8 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-white/30" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Account Impersonation */}
                <div className="flex items-center justify-center sm:justify-end">
                  <button 
                    onClick={() => handleImpersonate(landlord.id)}
                    disabled={isImpersonating}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-[#200497]/20 border border-[#200497]/50 text-[#a594f9] rounded-xl hover:bg-[#200497]/40 hover:text-white transition-all duration-300 text-sm font-light group/btn disabled:opacity-50"
                  >
                    {isImpersonating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    )}
                    Impersonate
                  </button>
                </div>

              </div>
            </motion.div>
          ))}

          {filteredLandlords.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <UserCheck className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-light text-white/60 mb-2">No landlords found</h3>
              <p className="text-sm text-white/40">Adjust your search query or verify your database connection.</p>
            </div>
          )}
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
          Admin Support Sync
        </span>
      </a>

    </div>
  );
}