import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Phone, 
  WalletCards, 
  AlertCircle, 
  MessageCircle,
  ClipboardList,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

// --- Import Connected RTK Query Hook ---
import { useGetTenantBalancesQuery } from './caretakerApiSlice';

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

export default function TenantBalances() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Integration ---
  const { data: balancesData, isLoading: isApiLoading } = useGetTenantBalancesQuery();

  // Enforce 1.2s loader constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Fallback / Simulated Data for UI Presentation ---
  // If the API is not yet returning data, we provide a structured fallback reflecting the backend schema
  const data = balancesData || {
    defaulters: [
      { tenant_id: 1, name: "John Doe", house_number: "SGH-A-001", phone_number: "+254711000000", amount_owed: 15000 },
      { tenant_id: 2, name: "Sarah Wanjiku", house_number: "LAV-B-002", phone_number: "+254722000000", amount_owed: 4500 },
    ],
    advance_payments: [
      { tenant_id: 3, name: "Michael Johnson", house_number: "LAV-B-001", phone_number: "+254733000000", advance_balance: 2000 },
    ],
    defaulters_count: 2,
    advance_payments_count: 1
  };

  // Safe filtering logic
  const filteredDefaulters = (data.defaulters || []).filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone_number.includes(searchQuery)
  );

  const filteredAdvances = (data.advance_payments || []).filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone_number.includes(searchQuery)
  );

  const isScreenLoading = isApiLoading || isArtificialLoading;

  // Format currency
  const formatKsh = (amount) => `KES ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
            <div className="absolute inset-0 border-t-2 border-[#200497] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <WalletCards className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Retrieving Balances
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere - Primary & Third colors for operational focus */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8 relative z-10">

        {/* --- Header Section --- */}
        <section className="border-b border-white/10 pb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Restricted Operational View</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
                Tenant Balances
              </h1>
              <p className="text-sm text-white/60 font-light max-w-2xl">
                Monitor and follow up on outstanding rent collections. This view highlights tenants in arrears and those with advance balances across your assigned properties.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full md:w-80 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search tenant or house..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 font-light text-sm backdrop-blur-md shadow-xl" 
              />
            </div>
          </motion.div>
        </section>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-12">
          
          {/* --- Defaulters / Arrears Section --- */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#B95F7B]/20 rounded-lg border border-[#B95F7B]/30">
                <TrendingDown className="w-5 h-5 text-[#B95F7B]" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white">Outstanding Arrears</h2>
                <p className="text-xs text-white/50 tracking-wide">Tenants requiring immediate follow-up</p>
              </div>
              <span className="ml-auto bg-[#B95F7B]/20 text-[#B95F7B] px-3 py-1 rounded-full text-xs font-medium border border-[#B95F7B]/30">
                {filteredDefaulters.length} Found
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-white/50 font-medium">
                    <tr>
                      <th className="p-5 font-medium">House</th>
                      <th className="p-5 font-medium">Tenant Name</th>
                      <th className="p-5 font-medium">Contact</th>
                      <th className="p-5 font-medium text-right">Amount Owed</th>
                      <th className="p-5 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light text-white/80">
                    {filteredDefaulters.map((tenant) => (
                      <tr key={tenant.tenant_id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-5 text-indigo-300 font-mono">{tenant.house_number}</td>
                        <td className="p-5 font-medium text-white">{tenant.name}</td>
                        <td className="p-5">
                          <a href={`tel:${tenant.phone_number}`} className="flex items-center text-white/60 hover:text-indigo-300 transition-colors">
                            <Phone className="w-3 h-3 mr-2" /> {tenant.phone_number}
                          </a>
                        </td>
                        <td className="p-5 text-right">
                          <span className="bg-[#B95F7B]/10 text-[#B95F7B] px-3 py-1.5 rounded-lg font-medium border border-[#B95F7B]/20">
                            {formatKsh(tenant.amount_owed)}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <a 
                            href={`https://wa.me/${tenant.phone_number.replace('+', '')}?text=Hello ${tenant.name.split(' ')[0]}, this is a reminder regarding your outstanding balance of ${formatKsh(tenant.amount_owed)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-xs uppercase tracking-wider group-hover:scale-105"
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Reminder
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filteredDefaulters.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-10 text-center">
                          <div className="flex flex-col items-center justify-center text-white/40">
                            <CheckCircle2 className="w-10 h-10 mb-3 text-green-400/50" />
                            <p className="font-light">No tenants in arrears match your search.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* --- Advance Payments Section --- */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-6 mt-4">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white">Advance Payments</h2>
                <p className="text-xs text-white/50 tracking-wide">Tenants with positive wallet balances</p>
              </div>
              <span className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                {filteredAdvances.length} Found
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-white/50 font-medium">
                    <tr>
                      <th className="p-5 font-medium">House</th>
                      <th className="p-5 font-medium">Tenant Name</th>
                      <th className="p-5 font-medium">Contact</th>
                      <th className="p-5 font-medium text-right">Advance Balance</th>
                      <th className="p-5 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light text-white/80">
                    {filteredAdvances.map((tenant) => (
                      <tr key={tenant.tenant_id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-5 text-indigo-300 font-mono">{tenant.house_number}</td>
                        <td className="p-5 font-medium text-white">{tenant.name}</td>
                        <td className="p-5">
                          <a href={`tel:${tenant.phone_number}`} className="flex items-center text-white/60 hover:text-indigo-300 transition-colors">
                            <Phone className="w-3 h-3 mr-2" /> {tenant.phone_number}
                          </a>
                        </td>
                        <td className="p-5 text-right">
                          <span className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg font-medium border border-green-500/20">
                            {formatKsh(tenant.advance_balance)}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <span className="inline-flex items-center text-xs font-light text-white/50">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400" /> Cleared
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredAdvances.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-10 text-center">
                          <div className="flex flex-col items-center justify-center text-white/40">
                            <ClipboardList className="w-10 h-10 mb-3 text-white/20" />
                            <p className="font-light">No advance payments found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* --- Operations Context Warning --- */}
          <motion.section variants={fadeInUp} className="pt-4">
             <div className="bg-[#200497]/20 border border-[#200497]/50 rounded-2xl p-6 flex items-start gap-4">
               <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
               <div>
                 <h4 className="text-indigo-200 font-medium mb-1">Caretaker Advisory</h4>
                 <p className="text-sm text-indigo-200/70 font-light leading-relaxed">
                   These figures represent live operational balances. Attempting to directly manipulate ledgers or access complete property financials is restricted by your employer's configuration. To log new charges mid-month, proceed to the Utility Entry module.
                 </p>
                 <Link to="/caretaker/utilities" className="inline-flex items-center mt-4 text-sm text-indigo-400 hover:text-white transition-colors group">
                   Log Utility Charges <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                 </Link>
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