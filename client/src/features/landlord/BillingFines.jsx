import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  AlertCircle, 
  Wallet, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  MessageCircle, 
  Settings2,
  RefreshCw,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Gavel
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
// (Ensure the path is correct relative to your actual file structure)
import { 
  useGetChargeTypesQuery,
  useCreateChargeTypeMutation,
  useGetPropertiesQuery,
  useGetTenantBalancesQuery,
  useAddPendingChargeMutation,
  useTriggerFinesMutation
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

export default function BillingFines() {
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Integration ---
  const { data: chargeTypesData, isLoading: isLoadingCharges } = useGetChargeTypesQuery();
  const { data: propertiesData, isLoading: isLoadingProps } = useGetPropertiesQuery();
  const { data: balancesData, isLoading: isLoadingBalances } = useGetTenantBalancesQuery();

  const [createChargeType, { isLoading: isCreatingCharge }] = useCreateChargeTypeMutation();
  const [addPendingCharge, { isLoading: isAddingCharge }] = useAddPendingChargeMutation();
  const [triggerFines, { isLoading: isTriggeringFines }] = useTriggerFinesMutation();

  // --- Local Form State ---
  // 1. Charge Types
  const [newChargeName, setNewChargeName] = useState('');
  
  // 2. Ad-Hoc Charges
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedChargeTypeId, setSelectedChargeTypeId] = useState('');
  const [adhocAmount, setAdhocAmount] = useState('');
  const [adhocNotes, setAdhocNotes] = useState('');
  
  // 3. Late Fines
  const [fineAmount, setFineAmount] = useState('');
  const [fineDescription, setFineDescription] = useState('Late Payment Penalty');
  const [selectedDefaulterIds, setSelectedDefaulterIds] = useState([]);
  
  // UI Messages
  const [successMessage, setSuccessMessage] = useState('');

  // Enforce 1.2s loader constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Data Parsing ---
  const chargeTypes = chargeTypesData?.charge_types || [];
  const defaulters = balancesData?.defaulters || [];
  
  // Flatten properties to extract active tenants for the ad-hoc charge dropdown
  const activeTenants = [];
  if (propertiesData?.properties) {
    propertiesData.properties.forEach(property => {
      property.houses?.forEach(house => {
        if (house.status === 'Occupied' && house.tenant) {
          activeTenants.push({
            id: house.tenant.id,
            name: `${house.tenant.first_name || house.tenant.name} ${house.tenant.last_name || ''}`.trim(),
            house_number: house.house_number,
            property_name: property.name
          });
        }
      });
    });
  }

  // --- Handlers ---
  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleCreateChargeType = async (e) => {
    e.preventDefault();
    if (!newChargeName.trim()) return;
    try {
      await createChargeType({ name: newChargeName }).unwrap();
      setNewChargeName('');
      handleShowSuccess('Custom charge type successfully created.');
    } catch (err) {
      console.error('Failed to create charge type', err);
    }
  };

  const handleAddAdhocCharge = async (e) => {
    e.preventDefault();
    if (!selectedTenantId || !selectedChargeTypeId || !adhocAmount) return;
    try {
      await addPendingCharge({
        tenant_id: selectedTenantId,
        charge_type_id: selectedChargeTypeId,
        amount: parseFloat(adhocAmount),
        notes: adhocNotes
      }).unwrap();
      
      setSelectedTenantId('');
      setSelectedChargeTypeId('');
      setAdhocAmount('');
      setAdhocNotes('');
      handleShowSuccess('Pending charge successfully queued for next invoice.');
    } catch (err) {
      console.error('Failed to add ad-hoc charge', err);
    }
  };

  const handleToggleDefaulter = (id) => {
    setSelectedDefaulterIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleToggleAllDefaulters = () => {
    if (selectedDefaulterIds.length === defaulters.length) {
      setSelectedDefaulterIds([]);
    } else {
      setSelectedDefaulterIds(defaulters.map(d => d.tenant_id));
    }
  };

  const handleTriggerFines = async (e) => {
    e.preventDefault();
    if (selectedDefaulterIds.length === 0 || !fineAmount) return;
    try {
      await triggerFines({
        tenant_ids: selectedDefaulterIds,
        amount: parseFloat(fineAmount),
        description: fineDescription
      }).unwrap();
      
      setSelectedDefaulterIds([]);
      setFineAmount('');
      setFineDescription('Late Payment Penalty');
      handleShowSuccess(`Fines applied and SMS notifications triggered for ${selectedDefaulterIds.length} tenants.`);
    } catch (err) {
      console.error('Failed to trigger fines', err);
    }
  };

  const formatKsh = (amount) => `KES ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isScreenLoading = isLoadingCharges || isLoadingProps || isLoadingBalances || isArtificialLoading;

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
            <div className="absolute inset-0 border-t-4 border-[#200497] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-[#B95F7B] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <Receipt className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Initializing Billing Engines
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere - Third Color (#200497) for management, Secondary (#B95F7B) strictly for arrears */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">

        {/* --- Header Section --- */}
        <section className="border-b border-white/10 pb-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-[#200497]/20 border border-[#200497]/30 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <Settings2 className="w-4 h-4 text-indigo-300" />
              <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Financial Operations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Billing & Fines Automation
            </h1>
            <p className="text-sm text-white/60 font-light max-w-3xl leading-relaxed">
              Define standard charge categories, queue ad-hoc utility bills before month-end, and dynamically execute late payment penalties. Charges inputted here are automatically captured by the end-of-month cron jobs.
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
          {/* COLUMN 1 & 2: CHARGE CONFIG & AD-HOC QUEUE */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* --- Manage Custom Charge Types --- */}
            <motion.section variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#200497] to-indigo-500" />
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#200497]/30 flex items-center justify-center border border-[#200497]/50 mr-4">
                  <FileText className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-xl font-light">Custom Charge Types</h2>
                  <p className="text-xs text-white/50 font-light">Define reusable billing categories (e.g., Wi-Fi, Water)</p>
                </div>
              </div>

              <form onSubmit={handleCreateChargeType} className="flex gap-4 mb-6">
                <input 
                  type="text" 
                  required
                  placeholder="New charge category name..." 
                  value={newChargeName}
                  onChange={(e) => setNewChargeName(e.target.value)}
                  className="flex-1 bg-black/20 border border-white/10 px-4 py-3 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-light text-sm" 
                />
                <button 
                  type="submit" 
                  disabled={isCreatingCharge || !newChargeName.trim()}
                  className="px-6 py-3 bg-[#200497] text-white rounded-xl text-sm font-light hover:bg-[#3213b3] transition-all flex items-center disabled:opacity-50"
                >
                  {isCreatingCharge ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />} Add
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {chargeTypes.map((charge) => (
                  <span key={charge.id} className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-light bg-white/5 border border-white/10 text-white/80">
                    <Receipt className="w-3 h-3 mr-2 text-indigo-400" /> {charge.name}
                  </span>
                ))}
                {chargeTypes.length === 0 && (
                  <span className="text-sm font-light text-white/40">No custom charge types defined yet.</span>
                )}
              </div>
            </motion.section>

            {/* --- Add Specific Pending Charge --- */}
            <motion.section variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mr-4">
                  <Wallet className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-xl font-light">Queue Ad-Hoc Charge</h2>
                  <p className="text-xs text-white/50 font-light">Appends to the tenant's upcoming 1st-of-month invoice.</p>
                </div>
              </div>

              <form onSubmit={handleAddAdhocCharge} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <Users className="w-3 h-3 mr-2" /> Target Tenant
                    </label>
                    <select
                      required
                      value={selectedTenantId}
                      onChange={(e) => setSelectedTenantId(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 px-4 py-3.5 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-light text-sm appearance-none"
                    >
                      <option value="" disabled className="bg-[#0F0246]">Select active tenant...</option>
                      {activeTenants.map((t) => (
                        <option key={t.id} value={t.id} className="bg-[#0F0246] py-2">
                          {t.house_number} - {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <FileText className="w-3 h-3 mr-2" /> Charge Type
                    </label>
                    <select
                      required
                      value={selectedChargeTypeId}
                      onChange={(e) => setSelectedChargeTypeId(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 px-4 py-3.5 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-light text-sm appearance-none"
                    >
                      <option value="" disabled className="bg-[#0F0246]">Select category...</option>
                      {chargeTypes.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0F0246] py-2">{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <CreditCard className="w-3 h-3 mr-2" /> Amount (KES)
                    </label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={adhocAmount} onChange={(e) => setAdhocAmount(e.target.value)}
                      placeholder="e.g. 1500" 
                      className="w-full bg-white/5 border-b border-white/20 px-4 py-3.5 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all font-light text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 flex items-center">
                      <Receipt className="w-3 h-3 mr-2" /> Description / Notes
                    </label>
                    <input 
                      type="text"
                      value={adhocNotes} onChange={(e) => setAdhocNotes(e.target.value)}
                      placeholder="e.g. Meter Reading #4412" 
                      className="w-full bg-white/5 border-b border-white/20 px-4 py-3.5 text-white placeholder-white/20 rounded-t-xl focus:outline-none focus:border-indigo-500 transition-all font-light text-sm" 
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isAddingCharge || !selectedTenantId || !selectedChargeTypeId || !adhocAmount}
                    className="relative flex items-center justify-center px-8 py-3.5 font-light text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:hover:translate-y-0 group w-full sm:w-auto"
                  >
                    {isAddingCharge ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Queue Charge <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </form>
            </motion.section>
          </div>

          {/* ========================================== */}
          {/* COLUMN 3: LATE FINES (Strictly Secondary Color Theme) */}
          {/* ========================================== */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#B95F7B]/10 to-[#0F0246]/80 backdrop-blur-xl border border-[#B95F7B]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(185,95,123,0.15)] flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B95F7B]/20 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#B95F7B]/20 flex items-center justify-center border border-[#B95F7B]/40 mr-4">
                  <AlertTriangle className="w-6 h-6 text-[#B95F7B]" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-white">Trigger Fines</h2>
                  <p className="text-xs text-[#B95F7B]/70 font-light mt-0.5">Penalize defaulting accounts</p>
                </div>
              </div>

              <div className="bg-black/30 border border-[#B95F7B]/20 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-light text-white/80">Eligible Defaulters</span>
                  <span className="text-xs font-medium bg-[#B95F7B]/20 text-[#B95F7B] px-2 py-1 rounded">
                    {defaulters.length} Found
                  </span>
                </div>
                
                {/* Defaulters List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {defaulters.length > 0 ? defaulters.map((tenant) => (
                    <label key={tenant.tenant_id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDefaulterIds.includes(tenant.tenant_id)}
                          onChange={() => handleToggleDefaulter(tenant.tenant_id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#B95F7B] focus:ring-[#B95F7B] bg-transparent accent-[#B95F7B]"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white/90">{tenant.house_number}</p>
                          <p className="text-[10px] text-white/50 truncate w-24">{tenant.name}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#B95F7B]">
                        Owes {formatKsh(tenant.amount_owed)}
                      </span>
                    </label>
                  )) : (
                    <div className="text-center py-6 text-white/40 text-sm font-light flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 mb-2 text-green-400/50" />
                      No active arrears found.
                    </div>
                  )}
                </div>

                {defaulters.length > 0 && (
                  <button onClick={handleToggleAllDefaulters} className="mt-3 text-xs text-[#B95F7B] hover:text-white transition-colors uppercase tracking-widest font-medium w-full text-center">
                    {selectedDefaulterIds.length === defaulters.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              <form onSubmit={handleTriggerFines} className="space-y-4 mt-auto">
                <div>
                  <label className="block text-[10px] text-[#B95F7B]/70 uppercase tracking-widest mb-1.5">Penalty Amount (KES)</label>
                  <input 
                    type="number" required min="1" step="0.01"
                    value={fineAmount} onChange={(e) => setFineAmount(e.target.value)}
                    placeholder="e.g. 500" 
                    className="w-full bg-white/5 border border-[#B95F7B]/30 px-4 py-3 text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-[#B95F7B] transition-colors font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#B95F7B]/70 uppercase tracking-widest mb-1.5">Description</label>
                  <input 
                    type="text" required
                    value={fineDescription} onChange={(e) => setFineDescription(e.target.value)}
                    className="w-full bg-white/5 border border-[#B95F7B]/30 px-4 py-3 text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-[#B95F7B] transition-colors font-light text-sm" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isTriggeringFines || selectedDefaulterIds.length === 0 || !fineAmount}
                  className="w-full relative flex items-center justify-center px-6 py-4 font-medium text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(185,95,123,0.5)] disabled:opacity-50 disabled:hover:translate-y-0 group mt-2"
                >
                  {isTriggeringFines ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>
                    <Gavel className="w-4 h-4 mr-2" />
                    Execute Fine ({selectedDefaulterIds.length})
                  </>}
                </button>
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
          Billing Support
        </span>
      </a>

    </div>
  );
}