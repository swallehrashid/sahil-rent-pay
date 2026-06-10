import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileSearch, Search, AlertCircle, CheckCircle2, 
  Smartphone, Server, ArrowLeft, Loader2, ArrowRight, MessageCircle, ShieldCheck
} from 'lucide-react';
import { useClaimMissingPaymentMutation } from '../../features/tenant/tenantApiSlice';

// --- Framer Motion Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const statusVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function ClaimPayment() {
  // --- Local State ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [claimStatus, setClaimStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  // --- RTK Query Hooks ---
  const [claimMissingPayment, { isLoading: isSubmitting }] = useClaimMissingPaymentMutation();

  // --- Initial 1.2s Premium Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleInputChange = (e) => {
    // M-Pesa codes are typically alphanumeric and uppercase
    setReceiptNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
    if (claimStatus !== 'idle') {
      setClaimStatus('idle');
      setStatusMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (receiptNumber.length < 8) {
      setClaimStatus('error');
      setStatusMessage('Please enter a valid M-Pesa receipt code.');
      return;
    }

    try {
      // API call to the Flask backend which queries Daraja
      await claimMissingPayment({ receipt_number: receiptNumber }).unwrap();
      
      setClaimStatus('success');
      setStatusMessage(`Receipt ${receiptNumber} successfully verified and applied to your ledger.`);
      setReceiptNumber('');
    } catch (err) {
      setClaimStatus('error');
      // Render fallback error message or extract from API response
      setStatusMessage(err?.data?.message || 'Transaction not found or already claimed. Please verify the code.');
    }
  };

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0246] text-white">
        <motion.div 
          className="relative w-32 h-32 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Radar/Searching Animation */}
          <motion.div 
            className="absolute inset-0 border border-[#B95F7B] rounded-full"
            animate={{ scale: [1, 2], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 border border-[#200497] rounded-full"
            animate={{ scale: [1, 2], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />
          <div className="absolute inset-0 m-auto w-16 h-16 bg-[#200497]/20 rounded-full flex items-center justify-center backdrop-blur-md border border-[#200497]/50">
            <Search className="w-8 h-8 text-[#B95F7B]" />
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="relative w-full min-h-screen text-white font-light tracking-wide bg-gradient-to-br from-[#0F0246] via-[#0a0130] to-[#0F0246] overflow-x-hidden p-4 md:p-8 lg:p-12">
      
      {/* Navigation Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <Link to="/tenant" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium uppercase tracking-wider">Back to Dashboard</span>
        </Link>
      </motion.div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:items-center">
        
        {/* Left Column: Context & Instructions */}
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="w-full lg:w-1/2 flex flex-col"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-[#B95F7B]/20 rounded-2xl mb-6 border border-[#B95F7B]/30 shadow-lg shadow-[#B95F7B]/20">
              <FileSearch className="w-8 h-8 text-[#B95F7B]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-normal mb-4 leading-tight text-white">
              Claim Missing <span className="text-[#B95F7B]">Payment</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md leading-relaxed">
              Did you pay via M-Pesa but your dashboard hasn't updated? Sometimes carrier networks delay. Enter your receipt code to instantly fetch and verify the transaction.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">How it works</h3>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Smartphone className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">1. Find your Receipt</h4>
                <p className="text-sm text-white/50">Locate the exact 10-character alphanumeric code in your Safaricom SMS (e.g., SGH1234567).</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Server className="w-4 h-4 text-[#200497] brightness-150" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">2. Secure Verification</h4>
                <p className="text-sm text-white/50">Our system securely queries the Daraja API to confirm the funds reached your property's account.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <ShieldCheck className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">3. Instant Ledger Update</h4>
                <p className="text-sm text-white/50">Once verified, your account balance is instantly credited and a PDF receipt is generated.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Claim Form */}
        <motion.div 
          variants={fadeInUp} initial="hidden" animate="visible"
          className="w-full lg:w-1/2 relative"
        >
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#200497]/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden">
            <h2 className="text-2xl font-normal text-white mb-8">Enter M-Pesa Code</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <label htmlFor="receipt" className="block text-sm text-white/60 mb-2">M-Pesa Transaction ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors duration-300 ${receiptNumber.length > 0 ? 'text-[#B95F7B]' : 'text-white/30 group-focus-within:text-[#B95F7B]'}`} />
                  </div>
                  <input
                    id="receipt"
                    type="text"
                    required
                    value={receiptNumber}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="e.g. SGH1234567"
                    className="w-full bg-[#0F0246]/50 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white font-mono text-lg tracking-widest rounded-xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-white/20 disabled:opacity-50"
                  />
                  
                  {/* Visual length indicator */}
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className={`text-xs font-mono ${receiptNumber.length === 10 ? 'text-green-400' : 'text-white/30'}`}>
                      {receiptNumber.length}/10
                    </span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {claimStatus !== 'idle' && (
                  <motion.div
                    key={claimStatus}
                    variants={statusVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      claimStatus === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {claimStatus === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm leading-relaxed">{statusMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting || receiptNumber.length === 0}
                className="group relative w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent text-base font-medium rounded-xl text-white bg-[#B95F7B] hover:bg-[#a04e67] focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#B95F7B]/40 overflow-hidden mt-4"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying with Daraja...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Payment</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Support Icon */}
      <a 
        href="https://wa.me/254700000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
      </a>
    </div>
  );
}