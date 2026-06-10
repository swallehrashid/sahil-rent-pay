import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, Wallet, Receipt, Download, Smartphone, 
  MessageCircle, AlertCircle, CheckCircle2, 
  Loader2, FileSearch, ArrowRight, MapPin
} from 'lucide-react';
import { 
  useGetTenantDashboardQuery, 
  useDownloadInvoiceMutation 
} from '../../features/tenant/tenantApiSlice'; // Adjust path if needed

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

const cardHover = {
  rest: { scale: 1, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 20px 40px -10px rgba(185, 95, 123, 0.2)",
    borderColor: "rgba(185, 95, 123, 0.4)",
    transition: { duration: 0.3 } 
  }
};

export default function TenantDashboard() {
  // --- Local State ---
  const [initialLoading, setInitialLoading] = useState(true);

  // --- RTK Query Hooks ---
  const { data, isLoading: isFetchingDashboard } = useGetTenantDashboardQuery();
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();

  // --- Mock Data Fallback (For UI Presentation if API is pending) ---
  const dashboardData = data || {
    tenantName: 'Aisha Hassan',
    property: 'Sunrise Apartments',
    location: 'Kileleshwa, Nairobi',
    unit: 'JKM-A-001',
    totalOutstanding: 18000,
    walletBalance: 2500, // Example of an advance payment
    dueDate: '2026-06-05',
    invoice: {
      id: 105,
      month: 'June 2026',
      status: 'Unpaid',
      lineItems: [
        { id: 1, category: 'Previous Arrears (Water)', amount: 2000 },
        { id: 2, category: 'Base Rent', amount: 15000 },
        { id: 3, category: 'Wi-Fi', amount: 1000 },
      ]
    },
    mpesa: {
      paybill: '4081234', // Mock Paybill
      accountNumber: 'JKM-A-001'
    }
  };

  // --- Initial 1.2s Premium Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const blob = await downloadInvoice(invoiceId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download invoice PDF:", error);
      // Optional: Add toast notification here
    }
  };

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0246] text-white">
        <motion.div 
          className="relative w-24 h-24 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Animated Scanner/Document */}
          <motion.div 
            className="absolute inset-0 border-2 border-[#B95F7B] rounded-xl"
            animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute inset-2 border-2 border-[#200497] rounded-xl"
            animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <Receipt className="w-8 h-8 text-white/80 z-10" />
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="relative w-full min-h-screen text-white font-light tracking-wide bg-gradient-to-br from-[#0F0246] via-[#0a0130] to-[#0F0246] overflow-x-hidden p-4 md:p-8 lg:p-12">
      
      {/* Header Section */}
      <motion.div 
        variants={fadeInUp} 
        initial="hidden" 
        animate="visible"
        className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-10 gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-normal mb-2">
            Welcome back, <span className="text-[#B95F7B]">{dashboardData.tenantName.split(' ')[0]}</span>
          </h1>
          <p className="text-white/60 flex items-center gap-2">
            <Home className="w-4 h-4" /> 
            {dashboardData.property} — Unit {dashboardData.unit}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white/50 text-sm">Today's Date</p>
          <p className="text-lg font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </motion.div>

      {/* Top Stats Grid */}
      <motion.div 
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
      >
        {/* Outstanding Balance Card */}
        <motion.div 
          variants={fadeInUp} whileHover="hover" initial="rest" animate="rest"
          className={`relative overflow-hidden bg-white/5 backdrop-blur-md border rounded-2xl p-6 ${dashboardData.totalOutstanding > 0 ? 'border-red-500/30' : 'border-green-500/30'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <Receipt className={`w-6 h-6 ${dashboardData.totalOutstanding > 0 ? 'text-red-400' : 'text-green-400'}`} />
            </div>
            <span className={`px-3 py-1 text-xs rounded-full border ${dashboardData.totalOutstanding > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {dashboardData.totalOutstanding > 0 ? 'Action Required' : 'All Clear'}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-1">Total Outstanding Due</p>
          <h2 className="text-3xl font-medium text-white mb-2">
            Ksh {dashboardData.totalOutstanding.toLocaleString()}
          </h2>
          {dashboardData.totalOutstanding > 0 && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Due by {new Date(dashboardData.dueDate).toLocaleDateString()}
            </p>
          )}
        </motion.div>

        {/* Advance Wallet Card */}
        <motion.div 
          variants={fadeInUp} whileHover="hover" initial="rest" animate="rest"
          className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#200497]/20 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-[#200497]/30 rounded-xl border border-[#200497]/50">
              <Wallet className="w-6 h-6 text-[#8c74ff]" />
            </div>
          </div>
          <p className="text-white/50 text-sm mb-1 relative z-10">Advance Wallet Balance</p>
          <h2 className="text-3xl font-medium text-white mb-2 relative z-10">
            Ksh {dashboardData.walletBalance.toLocaleString()}
          </h2>
          <p className="text-xs text-white/40 relative z-10">
            Automatically applies to your next invoice.
          </p>
        </motion.div>

        {/* Property Info Card */}
        <motion.div 
          variants={fadeInUp} whileHover="hover" initial="rest" animate="rest"
          className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-0 group hidden lg:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" 
            alt="Property Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0246] via-[#0F0246]/80 to-transparent"></div>
          <div className="relative z-10 p-6 h-full flex flex-col justify-end">
            <h3 className="text-lg font-medium text-white mb-1">{dashboardData.property}</h3>
            <p className="text-sm text-white/60 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#B95F7B]" /> {dashboardData.location}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#B95F7B]/20 border border-[#B95F7B]/30 rounded-lg w-max">
              <Home className="w-4 h-4 text-[#B95F7B]" />
              <span className="text-sm text-white font-medium">Unit: {dashboardData.unit}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Split */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left: Current Invoice Breakdown */}
        <motion.div 
          variants={fadeInUp} initial="hidden" animate="visible"
          className="w-full xl:w-2/3 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0130]/50">
            <div>
              <h2 className="text-2xl font-normal text-white flex items-center gap-3">
                <FileSearch className="w-6 h-6 text-[#B95F7B]" />
                {dashboardData.invoice.month} Statement
              </h2>
              <p className="text-white/50 text-sm mt-1">Invoice #{dashboardData.invoice.id}</p>
            </div>
            <button 
              onClick={() => handleDownloadInvoice(dashboardData.invoice.id)}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#200497]/40 border border-[#200497] text-white rounded-xl transition-all duration-300 hover:bg-[#200497]/60 hover:shadow-lg hover:shadow-[#200497]/30 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="text-sm">Download PDF</span>
            </button>
          </div>

          <div className="p-6 md:p-8 flex-grow">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex justify-between items-center text-sm text-white/40 uppercase tracking-wider pb-2 border-b border-white/10">
                <span>Description</span>
                <span>Amount</span>
              </div>
              
              {/* Line Items */}
              {dashboardData.invoice.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-white/5 hover:bg-white/5 transition-colors px-2 rounded-lg">
                  <span className="text-white/80">{item.category}</span>
                  <span className="text-white font-medium">Ksh {item.amount.toLocaleString()}</span>
                </div>
              ))}

              {/* Wallet Deduction (if any) */}
              {dashboardData.walletBalance > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-white/5 px-2 rounded-lg bg-green-500/5">
                  <span className="text-green-400/80">Advance Wallet Applied</span>
                  <span className="text-green-400 font-medium">- Ksh {dashboardData.walletBalance.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Total Row */}
            <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
              <span className="text-xl text-white/60">Total Due</span>
              <span className="text-3xl font-medium text-[#B95F7B]">
                Ksh {dashboardData.totalOutstanding.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Payment Instructions & Actions */}
        <motion.div 
          variants={fadeInUp} initial="hidden" animate="visible"
          className="w-full xl:w-1/3 flex flex-col gap-6"
        >
          {/* M-Pesa Instruction Card */}
          <div className="bg-gradient-to-br from-[#43B02A]/20 to-[#0F0246] border border-[#43B02A]/30 backdrop-blur-md shadow-2xl rounded-3xl p-6 relative overflow-hidden group">
            {/* Safaricom Green decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#43B02A]/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#43B02A] flex items-center justify-center shadow-lg shadow-[#43B02A]/40">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-medium text-white">Pay via M-Pesa</h3>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm mb-1">1. Go to M-Pesa &gt; Lipa na M-Pesa</p>
                <p className="text-white/50 text-sm">2. Select <span className="text-white font-medium">Paybill</span></p>
              </div>
              
              <div className="bg-black/20 rounded-xl p-4 border border-[#43B02A]/30 group-hover:border-[#43B02A]/60 transition-colors">
                <p className="text-[#43B02A] text-sm mb-1 uppercase tracking-wider font-medium">Business Number</p>
                <p className="text-3xl tracking-widest font-mono text-white">{dashboardData.mpesa.paybill}</p>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <p className="text-[#B95F7B] text-sm mb-1 uppercase tracking-wider font-medium">Account Number</p>
                <p className="text-xl tracking-wider font-mono text-white">{dashboardData.mpesa.accountNumber}</p>
                <p className="text-white/40 text-xs mt-2 italic">* Use your exact unit number as the account.</p>
              </div>
              
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm">4. Enter Amount: <span className="text-white font-medium">Ksh {dashboardData.totalOutstanding.toLocaleString()}</span></p>
                <p className="text-white/50 text-sm">5. Enter PIN and confirm.</p>
              </div>
            </div>
          </div>

          {/* Claim Missing Payment Link Card */}
          <Link to="/tenant/claim" className="block">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div>
                <h3 className="text-white font-medium text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#B95F7B]" />
                  Paid but not reflecting?
                </h3>
                <p className="text-white/50 text-sm mt-1">Claim a missing M-Pesa payment here.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#B95F7B] transition-colors">
                <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          </Link>

        </motion.div>
      </div>

      {/* Floating WhatsApp Support Icon */}
      <a 
        href="https://wa.me/254700000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}