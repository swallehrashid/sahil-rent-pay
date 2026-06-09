import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ToggleRight, 
  ToggleLeft, 
  Percent, 
  Activity, 
  Database, 
  ShieldAlert, 
  Webhook, 
  MessageSquare,
  Save,
  MessageCircle,
  RefreshCw,
  Server,
  KeyRound,
  FileCheck2,
  Clock
} from 'lucide-react';

// --- Import RTK Query Hooks ---
// (Ensure the path is correct relative to your actual file structure)
import { 
  useGetGlobalSettingsQuery, 
  useUpdateGlobalSettingsMutation,
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

export default function GlobalSettings() {
  // --- RTK Query Integration ---
  const { data: settingsData, isLoading: isFetchingSettings } = useGetGlobalSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateGlobalSettingsMutation();
  const [triggerJob, { isLoading: isTriggering }] = useTriggerSystemJobMutation();

  // Local Form State
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [defaultFee, setDefaultFee] = useState(4.0);
  const [trialDuration, setTrialDuration] = useState(30);
  
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // Hydrate local state when RTK Query fetches data
  useEffect(() => {
    if (settingsData) {
      setIsPromoActive(settingsData.is_promo_active ?? true);
      setDefaultFee(settingsData.default_fee ?? 4.0);
      setTrialDuration(settingsData.trial_duration_days ?? 30);
    }
  }, [settingsData]);

  // Minimum 1.2s component loader
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Submission Handlers ---
  const handleSaveGlobal = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        is_promo_active: isPromoActive,
        default_fee: parseFloat(defaultFee),
        trial_duration_days: parseInt(trialDuration, 10)
      }).unwrap();
      // Optionally trigger a success toast here
    } catch (error) {
      console.error("Failed to update global settings", error);
    }
  };

  const handleTriggerCeleryJob = async (jobName) => {
    try {
      await triggerJob(jobName).unwrap();
    } catch (error) {
      console.error(`Failed to trigger job: ${jobName}`, error);
    }
  };

  const isScreenLoading = isFetchingSettings || isArtificialLoading;

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
              className="absolute inset-0 border-4 border-[#B95F7B] rounded-full border-t-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 border-4 border-[#200497] rounded-full border-l-transparent border-r-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <Settings className="w-8 h-8 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Mounting Global State
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#200497]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-[#B95F7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-12">

        {/* --- Section 1: Hero & Master Configuration --- */}
        <section className="relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B95F7B] to-[#200497]" />
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-light tracking-tight mb-4 flex items-center">
                  <Server className="w-8 h-8 text-[#B95F7B] mr-4" />
                  Global Parameters
                </h1>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  Understanding what features should a premium white-label property management system's global admin dashboard have begins here. You have absolute authority over how you configure a global promotional free trial with 0% transaction fees for a property software platform. This interface defines how can a system automate free trial expirations and default fee reversions daily using Celery Beat cron jobs, while ensuring strict security protocols dictate how can platform administrators securely impersonate a landlord's operational view for troubleshooting without passwords.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <button 
                  onClick={handleSaveGlobal} 
                  disabled={isUpdating} 
                  className="w-full inline-flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40 group disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Sync Parameters</>}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Section 2: Promotional Master Switch --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-[#200497]/50 transition-colors duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light flex items-center"><Activity className="w-5 h-5 text-[#200497] mr-2" /> Acquisition Mode</h3>
                <button onClick={() => setIsPromoActive(!isPromoActive)} className="focus:outline-none transition-transform hover:scale-105">
                  {isPromoActive ? <ToggleRight className="w-12 h-12 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" /> : <ToggleLeft className="w-12 h-12 text-white/30" />}
                </button>
              </div>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                To solve how can I automatically link M-Pesa Paybill payments to house numbers in Kenya, we must onboard users. This module proves we are the best property management software with automated M-Pesa Daraja API reconciliation. By activating the free trial, you demonstrate how Kenyan landlords stop tenants from using fake M-Pesa messages to claim rent payment at zero risk, proving they can automate rent collection via Safaricom C2B Paybill directly to my bank account safely.
              </p>
              <button onClick={handleSaveGlobal} disabled={isUpdating} className="w-full mt-auto py-3 border border-[#200497] bg-[#200497]/10 text-[#a594f9] rounded-lg text-sm font-light hover:bg-[#200497]/30 transition-colors">
                Apply Global Promo Override
              </button>
            </div>
          </motion.section>

          {/* --- Section 3: Default Fee Parameters --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-[#B95F7B]/50 transition-colors duration-500">
              <h3 className="text-xl font-light mb-6 flex items-center"><Percent className="w-5 h-5 text-[#B95F7B] mr-2" /> Base Commission Logic</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                When troubleshooting how do you track manual M-Pesa transaction codes for missing rent payments in a property portal, fees matter. What happens if an M-Pesa Daraja callback fails or times out during a tenant rent payment? We isolate the principal from our cut. This structure represents the best way for Kenyan landlords to verify an M-Pesa transaction status instantly, controlling exactly how can a rental system split M-Pesa Paybill transactions into platform commission fees and landlord payouts automatically.
              </p>
              <div className="flex gap-4 items-end mb-6">
                <div className="flex-1">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Standard Fee (%)</label>
                  <input type="number" step="0.1" value={defaultFee} onChange={(e) => setDefaultFee(e.target.value)} className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#B95F7B] transition-colors rounded-t" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Trial Duration (Days)</label>
                  <input type="number" value={trialDuration} onChange={(e) => setTrialDuration(e.target.value)} className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#B95F7B] transition-colors rounded-t" />
                </div>
              </div>
              <button onClick={handleSaveGlobal} disabled={isUpdating} className="w-full mt-auto py-3 bg-[#B95F7B]/10 border border-[#B95F7B]/30 text-[#B95F7B] rounded-lg text-sm font-light hover:bg-[#B95F7B]/20 transition-colors">
                Update Commission Rate
              </button>
            </div>
          </motion.section>

          {/* --- Section 4: Cron Job & Automation Health --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-green-400/30 transition-colors duration-500">
              <h3 className="text-xl font-light mb-6 flex items-center"><Clock className="w-5 h-5 text-green-400 mr-2" /> Background Jobs</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                Is there a property app that sends instant SMS receipts to tenants when they pay via M-Pesa? Yes, powered by Celery workers. We dictate how to set up an automated M-Pesa rent payment routing system for an apartment block in Nairobi here. Scheduled jobs determine how do I track tenant rent arrears and balances accurately without using Excel spreadsheets, securing our position as the best accounting software for landlords in Kenya using a line-item ledger system.
              </p>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-xs text-green-400/80 mb-6 h-24 overflow-y-auto">
                {`> celery beat v5.3.6 is running...\n> [OK] sync_invoices at 00:00\n> [OK] verify_trials at 00:15\n> Waiting for next task...`}
              </div>
              <button 
                onClick={() => handleTriggerCeleryJob('sync_invoices')}
                disabled={isTriggering}
                className="w-full mt-auto py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm font-light hover:bg-green-500/20 transition-colors flex items-center justify-center"
              >
                {isTriggering ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                Run Manual Celery Sync
              </button>
            </div>
          </motion.section>

          {/* --- Section 5: Ledger Architecture Policies --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-blue-400/30 transition-colors duration-500">
              <h3 className="text-xl font-light mb-6 flex items-center"><Database className="w-5 h-5 text-blue-400 mr-2" /> Global Ledger Config</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                These constraints dictate how should a property management ledger handle tenant overpayments, credits, or advance rent payments globally. This determines how should a professional rental statement display previous balances versus current month dues. We provide the tools detailing how to calculate the total lifetime rent paid by an individual tenant automatically, while providing strict rules on how to manage tenant security deposits held and refunds cleanly in landlord accounting.
              </p>
              <Link to="/admin/ledger" className="w-full mt-auto py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-light hover:bg-blue-500/20 transition-colors text-center inline-block">
                Sync Ledger Global Policies
              </Link>
            </div>
          </motion.section>

          {/* --- Section 6: RBAC & Tenant Operations --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-yellow-400/30 transition-colors duration-500">
              <h3 className="text-xl font-light mb-6 flex items-center"><KeyRound className="w-5 h-5 text-yellow-400 mr-2" /> Operations & RBAC</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                What is the best way to generate monthly cash flow, arrears, and collected revenue statements for rental units? Reliable access control. Establish how can a landlord filter and identify rent defaulters automatically on the 5th of the month. Define permissions for how can I give my caretaker access to input water bills without exposing my total rental profits. This secures our title as the best property management app in Kenya with restricted dashboard permissions for caretakers.
              </p>
              <Link to="/admin/landlords" className="w-full mt-auto py-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-light hover:bg-yellow-500/20 transition-colors text-center inline-block">
                Update Caretaker RBAC Rules
              </Link>
            </div>
          </motion.section>

          {/* --- Section 7: Security Audit Logs --- */}
          <motion.section variants={fadeInUp} className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-red-400/30 transition-colors duration-500">
              <h3 className="text-xl font-light mb-6 flex items-center"><ShieldAlert className="w-5 h-5 text-red-400 mr-2" /> Security Enforcements</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                We rigidly enforce how do you prevent caretakers or property managers from altering financial records or deleting tenants. Is there a way to log a tamper-proof audit trail of everything a caretaker or property manager does? Absolutely. Our logs capture exactly what happens when a system returns a 403 error if a caretaker tries to access landlord financial URLs, while also auditing how do you automate recurring utility billing (garbage, Wi-Fi, water readings) on a tenant's monthly bill.
              </p>
              <Link to="/admin/ledger" className="w-full mt-auto py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-light hover:bg-red-500/20 transition-colors text-center inline-block">
                View Immutable Audit Log
              </Link>
            </div>
          </motion.section>
        </motion.div>

        {/* --- Section 8: Webhook & Communication Routing --- */}
        <section className="relative z-10 pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-r from-white/5 to-[#200497]/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-light mb-4 flex items-center"><Webhook className="w-6 h-6 text-white mr-3" /> Communication Gateways</h3>
              <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
                Understand exactly what is a tokenized smart portal link, and how does it work for tenant account activation globally. This endpoint dictates how do you create passwordless tenant portals via smart tokenized links for faster user onboarding. Set the throttle limits for how can a landlord send a mass notification SMS to all active tenants when transitioning to a new payment system. This governs what is a sample template for a professional monthly rent invoice message sent to Kenyan tenants via SMS across the entire network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full text-sm font-light hover:bg-white/20 transition-colors flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 mr-2" /> Configure Africa's Talking
                </button>
                <button className="px-6 py-3 bg-[#B95F7B] text-white rounded-full text-sm font-light hover:bg-[#a04e67] transition-colors flex items-center justify-center shadow-lg">
                  <FileCheck2 className="w-4 h-4 mr-2" /> Save Global Routing Config
                </button>
              </div>
            </div>
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
          Admin Support Line
        </span>
      </a>

    </div>
  );
}