import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  Smartphone,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  FileEdit,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
// Ensure the path matches your project structure
import { 
  useGetPropertiesQuery,
  useGetTenantBalancesQuery,
  useVerifyManualPaymentMutation,
  useAddManualAdjustmentMutation
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
    transition: { staggerChildren: 0.1 }
  }
};

export default function PaymentsLedger() {
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  // UI Toggles
  const [activeTab, setActiveTab] = useState('defaulters'); // 'defaulters' | 'advanced'
  const [ledgerSearch, setLedgerSearch] = useState('');

  // --- RTK Query Integration ---
  const { data: propertiesData, isLoading: isLoadingProps } = useGetPropertiesQuery();
  const { data: balancesData, isLoading: isLoadingBalances } = useGetTenantBalancesQuery();
  
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyManualPaymentMutation();
  const [addAdjustment, { isLoading: isAdjusting }] = useAddManualAdjustmentMutation();

  // Form State: Manual M-Pesa Verification
  const [receiptNumber, setReceiptNumber] = useState('');
  const [verifyTenantId, setVerifyTenantId] = useState('');

  // Form State: Manual Adjustments
  const [adjType, setAdjType] = useState('Deposit Held');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjDesc, setAdjDesc] = useState('');
  const [adjTenantId, setAdjTenantId] = useState('');

  // Enforce 1.2s loader constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Data Parsing ---
  const defaulters = balancesData?.defaulters || [];
  const advancePayments = balancesData?.advance_payments || [];

  // Flatten properties to extract active tenants for the dropdowns
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

  // Filter ledgers based on search
  const filteredDefaulters = defaulters.filter(t => 
    t.name?.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
    t.house_number?.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const filteredAdvances = advancePayments.filter(t => 
    t.name?.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
    t.house_number?.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  // --- Action Handlers ---
  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    if (!receiptNumber || !verifyTenantId) return;
    try {
      await verifyPayment({
        receipt_number: receiptNumber.trim().toUpperCase(),
        tenant_id: verifyTenantId
      }).unwrap();
      
      setReceiptNumber('');
      setVerifyTenantId('');
      handleShowSuccess(`Receipt ${receiptNumber.toUpperCase()} verified and applied to ledger.`);
    } catch (err) {
      console.error('Verification failed', err);
      // In a real app, you might want to set an error state here to show a toast
    }
  };

  const handleManualAdjustment = async (e) => {
    e.preventDefault();
    if (!adjAmount || !adjDesc) return;
    try {
      await addAdjustment({
        transaction_type: adjType,
        amount: parseFloat(adjAmount),
        description: adjDesc,
        tenant_id: adjTenantId || undefined // Send undefined if targeting master landlord ledger instead of specific tenant
      }).unwrap();
      
      setAdjAmount('');
      setAdjDesc('');
      setAdjTenantId('');
      handleShowSuccess(`Manual adjustment (${adjType}) successfully recorded.`);
    } catch (err) {
      console.error('Adjustment failed', err);
    }
  };

  const formatKsh = (amount) => `KES ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isScreenLoading = isLoadingProps || isLoadingBalances || isArtificialLoading;

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
            <div className="absolute inset-2 border-r-4 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <Wallet className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Syncing Master Ledger
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">

        {/* --- Header Section --- */}
        <section className="border-b border-white/10 pb-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-[#200497]/20 border border-[#200497]/30 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Financial Control Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Payments & Ledger
            </h1>
            <p className="text-sm text-white/60 font-light max-w-3xl leading-relaxed">
              Track outstanding balances, manage advanced payments, securely verify delayed M-Pesa transactions via Daraja, and execute manual adjustments (e.g., deposits) directly onto the master ledger.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================== */}
          {/* COLUMN 1: MANUAL ACTIONS (Verify & Adjust) */}
          {/* ========================================== */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* 1. M-Pesa Fallback Verification */}
            <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-[#200497]" />
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30 mr-4">
                  <Smartphone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-light">Verify Payment</h2>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Daraja Fallback Sync</p>
                </div>
              </div>

              <form onSubmit={handleVerifyPayment} className="space-y-5">
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">M-Pesa Receipt Code</label>
                  <input 
                    type="text" required
                    placeholder="e.g. SGH1234567" 
                    value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-green-400 transition-colors font-mono text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Target Tenant</label>
                  <select
                    required
                    value={verifyTenantId} onChange={(e) => setVerifyTenantId(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white rounded-xl focus:outline-none focus:border-green-400 transition-colors font-light text-sm appearance-none"
                  >
                    <option value="" disabled className="bg-[#0F0246]">Select tenant to credit...</option>
                    {activeTenants.map(t => (
                      <option key={t.id} value={t.id} className="bg-[#0F0246]">{t.house_number} - {t.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying || !receiptNumber || !verifyTenantId}
                  className="w-full flex items-center justify-center px-4 py-3 font-medium text-white transition-all duration-300 bg-green-500/20 border border-green-500/50 rounded-xl hover:bg-green-500/30 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 group"
                >
                  {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin text-green-400" /> : <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Verify & Apply
                  </>}
                </button>
              </form>
            </motion.section>

            {/* 2. Manual Statement Adjustments */}
            <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#200497]" />
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 mr-4">
                  <FileEdit className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-light">Ledger Adjustments</h2>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Deposits & Refunds</p>
                </div>
              </div>

              <form onSubmit={handleManualAdjustment} className="space-y-5">
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Action Type</label>
                  <select
                    value={adjType} onChange={(e) => setAdjType(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white rounded-xl focus:outline-none focus:border-blue-400 transition-colors font-light text-sm appearance-none"
                  >
                    <option value="Deposit Held" className="bg-[#0F0246]">Deposit Held (+ Addition)</option>
                    <option value="Deposit Refunded" className="bg-[#0F0246]">Deposit Refunded (- Subtraction)</option>
                    <option value="Manual Credit" className="bg-[#0F0246]">Manual Credit (+ Addition)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Tenant (Optional)</label>
                  <select
                    value={adjTenantId} onChange={(e) => setAdjTenantId(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white rounded-xl focus:outline-none focus:border-blue-400 transition-colors font-light text-sm appearance-none"
                  >
                    <option value="" className="bg-[#0F0246]">None (Apply to Master Ledger Only)</option>
                    {activeTenants.map(t => (
                      <option key={t.id} value={t.id} className="bg-[#0F0246]">{t.house_number} - {t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Amount</label>
                    <input 
                      type="number" required min="1" step="0.01"
                      placeholder="0.00" 
                      value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition-colors font-light text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Description</label>
                    <input 
                      type="text" required
                      placeholder="Reason..." 
                      value={adjDesc} onChange={(e) => setAdjDesc(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 px-4 py-3 text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition-colors font-light text-sm" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isAdjusting || !adjAmount || !adjDesc}
                  className="w-full flex items-center justify-center px-4 py-3 font-medium text-white transition-all duration-300 bg-blue-500/20 border border-blue-500/50 rounded-xl hover:bg-blue-500/30 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 group"
                >
                  {isAdjusting ? <RefreshCw className="w-5 h-5 animate-spin text-blue-400" /> : <>
                    <FileEdit className="w-4 h-4 mr-2 text-blue-400" /> Post Adjustment
                  </>}
                </button>
              </form>
            </motion.section>

          </div>

          {/* ========================================== */}
          {/* COLUMN 2 & 3: TENANT BALANCES LEDGER */}
          {/* ========================================== */}
          <div className="lg:col-span-2">
            <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full min-h-[600px]">
              
              {/* Ledger Header & Tabs */}
              <div className="bg-[#0F0246]/80 border-b border-white/10 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-light">Ledger Directory</h2>
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-white/40" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search tenant or house..." 
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-2 text-white placeholder-white/40 rounded-lg focus:outline-none focus:border-[#200497] transition-colors font-light text-sm" 
                    />
                  </div>
                </div>

                {/* Custom Tab Switcher */}
                <div className="flex p-1 bg-black/30 rounded-xl w-full max-w-md mx-auto sm:mx-0">
                  <button 
                    onClick={() => setActiveTab('defaulters')}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-300 ${activeTab === 'defaulters' ? 'bg-[#B95F7B] text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" /> Defaulters ({defaulters.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('advanced')}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-300 ${activeTab === 'advanced' ? 'bg-green-500 text-[#0F0246] font-medium shadow-lg' : 'text-white/50 hover:text-white'}`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" /> Advanced ({advancePayments.length})
                  </button>
                </div>
              </div>

              {/* Data Table Area */}
              <div className="p-6 flex-1 overflow-x-auto no-scrollbar">
                
                <AnimatePresence mode="wait">
                  {activeTab === 'defaulters' && (
                    <motion.div
                      key="defaulters"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="w-full text-left min-w-[500px]">
                        <thead className="text-[10px] uppercase tracking-widest text-[#B95F7B] border-b border-white/10">
                          <tr>
                            <th className="pb-3 font-medium">Tenant / House</th>
                            <th className="pb-3 font-medium text-right">Amount Owed</th>
                            <th className="pb-3 font-medium text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-light text-white/80">
                          {filteredDefaulters.map(t => (
                            <tr key={t.tenant_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4">
                                <span className="block font-medium text-white">{t.name}</span>
                                <span className="text-xs text-white/50 font-mono mt-0.5">{t.house_number}</span>
                              </td>
                              <td className="py-4 text-right">
                                <span className="inline-block bg-[#B95F7B]/10 text-[#B95F7B] px-3 py-1 rounded-lg border border-[#B95F7B]/20 font-medium">
                                  {formatKsh(t.amount_owed)}
                                </span>
                              </td>
                              <td className="py-4 text-center">
                                <a 
                                  href={`https://wa.me/${t.phone_number?.replace('+', '')}?text=Hello ${t.name?.split(' ')[0]}, this is a reminder from management regarding your outstanding balance of ${formatKsh(t.amount_owed)}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#B95F7B] hover:text-white transition-colors text-xs uppercase tracking-widest"
                                >
                                  Remind <ArrowRight className="w-3 h-3 ml-1" />
                                </a>
                              </td>
                            </tr>
                          ))}
                          {filteredDefaulters.length === 0 && (
                            <tr>
                              <td colSpan="3" className="py-12 text-center text-white/40">
                                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400/50" />
                                No active arrears found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  )}

                  {activeTab === 'advanced' && (
                    <motion.div
                      key="advanced"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="w-full text-left min-w-[500px]">
                        <thead className="text-[10px] uppercase tracking-widest text-green-400 border-b border-white/10">
                          <tr>
                            <th className="pb-3 font-medium">Tenant / House</th>
                            <th className="pb-3 font-medium text-right">Credit Balance</th>
                            <th className="pb-3 font-medium text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-light text-white/80">
                          {filteredAdvances.map(t => (
                            <tr key={t.tenant_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4">
                                <span className="block font-medium text-white">{t.name}</span>
                                <span className="text-xs text-white/50 font-mono mt-0.5">{t.house_number}</span>
                              </td>
                              <td className="py-4 text-right">
                                <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-lg border border-green-500/20 font-medium">
                                  {formatKsh(t.advance_balance)}
                                </span>
                              </td>
                              <td className="py-4 text-center">
                                <span className="text-xs text-white/40 flex items-center justify-center">
                                  <CreditCard className="w-3 h-3 mr-1" /> Auto-rolls to next invoice
                                </span>
                              </td>
                            </tr>
                          ))}
                          {filteredAdvances.length === 0 && (
                            <tr>
                              <td colSpan="3" className="py-12 text-center text-white/40">
                                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-white/20" />
                                No advanced payments recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.section>
          </div>

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
          Ledger Support
        </span>
      </a>

    </div>
  );
}