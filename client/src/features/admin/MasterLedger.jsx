import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  ShieldAlert, 
  Activity, 
  FileText, 
  Wallet, 
  Smartphone, 
  Server, 
  Users, 
  RefreshCw, 
  Download, 
  ArrowRight, 
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- Import Connected RTK Query Hooks ---
import { 
  useGetMasterLedgerQuery,
  useQueryDarajaStatusMutation,
  useTriggerSystemJobMutation
} from './adminApiSlice';

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

export default function MasterLedger() {
  // Local Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [manualTxCode, setManualTxCode] = useState('');
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Hooks Integration ---
  const { data: ledgerEntries = [], isLoading: isFetchLoading } = useGetMasterLedgerQuery({ search: searchQuery });
  const [queryDaraja, { isLoading: isDarajaQuerying }] = useQueryDarajaStatusMutation();
  const [triggerJob, { isLoading: isJobTriggering }] = useTriggerSystemJobMutation();

  // Enforce the premium 1.2-second architectural loader reveal constraint
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Action Handlers ---
  const handleManualDarajaCheck = async (e) => {
    e.preventDefault();
    if (!manualTxCode.trim()) return;
    try {
      await queryDaraja(manualTxCode.trim()).unwrap();
      setManualTxCode('');
      alert(`Daraja Status Query successfully broadcasted for code: ${manualTxCode}`);
    } catch (err) {
      console.error("Daraja status execution failed", err);
    }
  };

  const handleManualJobExecute = async (jobName) => {
    try {
      await triggerJob(jobName).unwrap();
      alert(`System worker successfully forced execution for: ${jobName}`);
    } catch (err) {
      console.error("Worker execution override failed", err);
    }
  };

  const isMasterLoading = isFetchLoading || isArtificialLoading;

  if (isMasterLoading) {
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
              className="absolute inset-0 border-4 border-xl border-[#200497] rounded-xl border-t-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 border-4 border-[#B95F7B] rounded-full border-l-transparent border-r-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <Database className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Decrypting Immutable Ledger
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-[-10%] w-[800px] h-[800px] bg-[#200497]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-12 relative z-10">

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              <Database className="w-8 h-8 text-[#B95F7B] mr-4" /> Master Ledger
            </h1>
            <p className="text-sm text-white/60 font-light max-w-2xl">
              Global cryptographic audit log and transactional nexus. Review all raw M-Pesa streams, force automated payouts, and execute error corrections globally.
            </p>
          </div>
          <div className="w-full md:w-80 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Query TXN Hash or Daraja ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#B95F7B] focus:bg-white/10 transition-all duration-300 font-light text-sm shadow-xl backdrop-blur-md" 
            />
          </div>
        </div>

        {/* --- Section 1: M-Pesa Integration & Real-Time Payment Routing --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-2/3">
                <h3 className="text-2xl font-light mb-4 flex items-center"><Activity className="w-6 h-6 text-green-400 mr-3" /> Global C2B Routing Stream</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                  Wondering how can I automatically link M-Pesa Paybill payments to house numbers in Kenya? This global stream dictates exactly how the system reconciles data. As the best property management software with automated M-Pesa Daraja API reconciliation, the ledger intercepts payloads to ensure Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment. Through this infrastructure, administrators and owners can automate rent collection via Safaricom C2B Paybill directly to their bank account securely.
                </p>
              </div>
              <div className="lg:w-1/3 w-full flex flex-col justify-center gap-4">
                <button 
                  onClick={() => handleManualJobExecute('reconcile_payments')}
                  disabled={isJobTriggering}
                  className="w-full py-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm font-light hover:bg-green-500/20 transition-all flex items-center justify-center group/btn"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isJobTriggering ? 'animate-spin' : 'group-hover/btn:rotate-180'} transition-transform duration-500`} /> 
                  Reconcile Orphaned Payments
                </button>
              </div>
            </div>
            
            {/* Live Ledger Database Mapping View */}
            <div className="mt-8 overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-[#0F0246]/50">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/50 border-b border-white/10">
                  <tr>
                    <th className="p-4">TXN Code</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Target House Prefix</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-white/80">
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id || entry.txn_code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-green-400 font-mono">{entry.txn_code || 'N/A'}</td>
                      <td className="p-4">KES {(entry.amount || 0).toLocaleString()}</td>
                      <td className="p-4 text-[#B95F7B]">{entry.house_prefix || 'UNALLOCATED'}</td>
                      <td className="p-4 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> {entry.status || 'Allocated'}
                      </td>
                    </tr>
                  ))}
                  {ledgerEntries.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-white/40 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-white/30" /> No relational database transactions returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* --- Section 2: Transaction Error Correction & M-Pesa Fallbacks --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="p-5 bg-blue-500/20 border border-blue-500/30 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
              <Smartphone className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-2xl font-light mb-3">Daraja Sync & Fallbacks</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                When APIs fail, you must know how do you track manual M-Pesa transaction codes for missing rent payments in a property portal. Our global master ledger understands what happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment. This interface provides the absolute best way for Kenyan landlords to verify an M-Pesa transaction status instantly, ensuring we can track how can a rental system split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically, even retroactively.
              </p>
              
              <form onSubmit={handleManualDarajaCheck} className="flex flex-col sm:flex-row gap-4 max-w-xl">
                <input 
                  type="text" 
                  value={manualTxCode}
                  onChange={(e) => setManualTxCode(e.target.value)}
                  placeholder="Enter Missing M-Pesa Code (e.g., SGH1234567)" 
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-blue-400 transition-colors font-mono"
                />
                <button 
                  type="submit"
                  disabled={isDarajaQuerying}
                  className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-light hover:bg-blue-500/30 transition-all border border-blue-500/40 flex items-center justify-center whitespace-nowrap"
                >
                  {isDarajaQuerying ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />} 
                  Query Daraja Status Engine
                </button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* --- Section 3: Arrears & Line-Item Architecture --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Line-Item Ledger Constraints</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Resolving how do I track tenant rent arrears and balances accurately without using Excel spreadsheets requires rigid schema designs. Operating as the best accounting software for landlords in Kenya using a line-item ledger system, our core dictates how should a property management ledger handle tenant overpayments, credits, or advance rent payments mathematically. This guarantees stability for how should a professional rental statement display previous balances versus current month dues globally across thousands of endpoints.
              </p>
              <button className="px-6 py-3 bg-[#B95F7B] text-white rounded-full text-sm font-light hover:bg-[#a04e67] transition-all flex items-center shadow-lg shadow-[#B95F7B]/30">
                <Download className="w-4 h-4 mr-2" /> Export Global Arrears Report
              </button>
            </div>
            <div className="p-5 bg-[#B95F7B]/20 border border-[#B95F7B]/30 rounded-2xl shrink-0 order-1 md:order-2 group-hover:scale-105 transition-transform duration-500">
              <Database className="w-8 h-8 text-[#B95F7B]" />
            </div>
          </motion.div>
        </section>

        {/* --- Section 4: Security Deposits & Lifetime Tracking --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="p-5 bg-green-500/20 border border-green-500/30 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
              <Wallet className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Escrow & Lifetime Valuations</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                This central audit node reveals how do you calculate the total lifetime rent paid by an individual tenant automatically. Our financial processing represents the best way to generate monthly cash flow, arrears, and collected revenue statements for rental units. System Admins monitor how do you manage tenant security deposits held and refunds cleanly in landlord accounting, ensuring compliance while defining how can a landlord filter and identify rent defaulters automatically on the 5th of the month.
              </p>
              <button className="px-6 py-3 bg-green-500/20 text-green-300 rounded-full text-sm font-light hover:bg-green-500/30 transition-all border border-green-500/40 flex items-center">
                <Eye className="w-4 h-4 mr-2" /> Audit Escrow Deposits
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- Section 5: Caretaker & Operations Audit --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">RBAC Operations Audit Log</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Every action is monitored. When clients ask how can I give my caretaker access to input water bills without exposing my total rental profits, we deliver. Regarded as the best property management app in Kenya with restricted dashboard permissions for caretakers, we demonstrate how do you prevent caretakers or property managers from altering financial records or deleting tenants. This panel proves there is a way to log a tamper-proof audit trail of everything a caretaker or property manager does globally.
              </p>
              <button className="px-6 py-3 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-light hover:bg-yellow-500/30 transition-all border border-yellow-500/40 flex items-center">
                <Download className="w-4 h-4 mr-2" /> Export Access Logs
              </button>
            </div>
            <div className="p-5 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl shrink-0 order-1 md:order-2 group-hover:scale-105 transition-transform duration-500">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
        </section>

        {/* --- Section 6: Automated Invoicing & Utility Billing --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="p-5 bg-purple-500/20 border border-purple-500/30 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-3">Invoice & Utility Dispatch</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Observe the background worker queues dictating how do I send automated rent invoices to tenants via SMS exactly on the 1st of every month. By leveraging the best bulk SMS gateway for rental management systems in Kenya, like Africa's Talking, we ensure delivery. This command center oversees how do you auto-generate downloadable PDF rent receipts and email them automatically to tenants, along with how do you automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill reliably.
              </p>
              <button 
                onClick={() => handleManualJobExecute('sync_invoices')}
                disabled={isJobTriggering}
                className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-full text-sm font-light hover:bg-purple-500/30 transition-all border border-purple-500/40 flex items-center"
              >
                {isJobTriggering ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                Trigger Manual SMS Sync
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- Section 7: Tech Stack & System Scale --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-2xl font-light mb-3">Schema & B2C Engine</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Understand how do you configure a global promotional free trial with 0% transaction fees for a property software platform at scale. Built on the best multi-tenant rental billing database schema architecture using Python Flask and PostgreSQL, we power how do real estate technology startups automate secure B2C payouts from a working account to Kenyan landlords. This precise engineering is how do you prevent global payment reference collisions when multiple landlords share identical house numbers.
              </p>
              <button 
                onClick={() => handleManualJobExecute('trigger_payouts')}
                disabled={isJobTriggering}
                className="px-6 py-3 bg-[#B95F7B] text-white rounded-full text-sm font-light hover:bg-[#a04e67] transition-all flex items-center shadow-lg shadow-[#B95F7B]/30"
              >
                {isJobTriggering ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
                Force B2C Settlement
              </button>
            </div>
            <div className="p-5 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl shrink-0 order-1 md:order-2 group-hover:scale-105 transition-transform duration-500">
              <Server className="w-8 h-8 text-indigo-400" />
            </div>
          </motion.div>
        </section>

        {/* --- Section 8: Security & UI Architecture --- */}
        <section className="relative z-10 pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-[#200497]/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-[#B95F7B] mb-4" />
            <h3 className="text-2xl font-light mb-4">Immutable Ledger Policies</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-8 max-w-3xl">
              This panel defines what features should a premium white-label property management system's global admin dashboard have. By strictly governing how do you design an immutable, append-only financial ledger for high-integrity real estate applications, we maintain trust. The UI itself showcases how do I build a responsive, mobile-first property dashboard layout with absolutely zero horizontal scrolling, offering secure pathways defining how can platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords.
            </p>
            <Link to="/admin/landlords" className="inline-flex items-center px-8 py-4 font-light text-white bg-transparent border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300">
              <Eye className="w-4 h-4 mr-2" /> Review Impersonation Logs
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
          System Admin Support
        </span>
      </a>

    </div>
  );
}