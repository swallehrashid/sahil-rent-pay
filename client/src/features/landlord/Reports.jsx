import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Calendar, DollarSign, 
  Users, Search, Loader2, MessageCircle, 
  BarChart3, FileBox, ShieldCheck
} from 'lucide-react';
import { 
  useGetHistoricalReportsQuery,
  useGetPropertiesQuery 
} from '../../features/landlord/landlordApiSlice';

// --- Framer Motion Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const tabVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function Reports() {
  // --- Local State ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('historical'); // 'historical' | 'tenant'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // --- RTK Query Hooks ---
  const { data: historicalData, isLoading: isFetchingReports } = useGetHistoricalReportsQuery(selectedYear);
  const { data: propertiesData, isLoading: isFetchingProperties } = useGetPropertiesQuery();

  // --- Data Processing ---
  const properties = propertiesData?.properties || [];
  const allTenants = [];
  
  // Extract all tenants (active and archived) for the invoice history dropdown
  properties.forEach(property => {
    property.houses?.forEach(house => {
      if (house.tenant) {
        allTenants.push({
          ...house.tenant,
          house_number: house.house_number,
          propertyName: property.name
        });
      }
    });
  });

  // Filter tenants based on search query
  const filteredTenants = allTenants.filter(t => 
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.house_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTenant = allTenants.find(t => t.id === parseInt(selectedTenantId));

  // Mocking reports data fallback if API is empty for UI demonstration of premium look
  const reports = historicalData?.reports || [
    { month: 'April', year: 2026, collections: 450000, deductions: 18000, net: 432000, status: 'Closed' },
    { month: 'March', year: 2026, collections: 445000, deductions: 17800, net: 427200, status: 'Closed' },
    { month: 'February', year: 2026, collections: 440000, deductions: 17600, net: 422400, status: 'Closed' },
  ];

  const mockTenantInvoices = [
    { id: 101, date: '2026-05-01', amount: 25600, status: 'Paid', type: 'Monthly Rent' },
    { id: 102, date: '2026-04-01', amount: 25000, status: 'Paid', type: 'Monthly Rent' },
    { id: 103, date: '2026-03-01', amount: 25000, status: 'Paid', type: 'Monthly Rent' },
    { id: 104, date: '2026-02-15', amount: 500, status: 'Paid', type: 'Late Fine' },
  ];

  // --- Premium Component-Level Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleDownloadReport = (month) => {
    // Simulated PDF download trigger
    console.log(`Downloading report for ${month} ${selectedYear}`);
  };

  const handleDownloadInvoice = (invoiceId) => {
    // Simulated PDF invoice download trigger
    console.log(`Downloading invoice #${invoiceId}`);
  };

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0246] text-white overflow-hidden">
        <motion.div 
          className="relative w-24 h-32 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Document Outline */}
          <motion.div 
            className="absolute inset-0 border-2 border-[#200497] rounded-lg shadow-[0_0_30px_rgba(32,4,151,0.5)]"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Scanning Line */}
          <motion.div 
            className="absolute left-0 right-0 h-1 bg-[#B95F7B] shadow-[0_0_15px_#B95F7B]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <BarChart3 className="w-8 h-8 text-white/50 z-10 mt-4" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen text-white font-light tracking-wide bg-gradient-to-br from-[#0F0246] via-[#0a0130] to-[#0F0246] overflow-x-hidden p-4 md:p-8 lg:p-12">
      
      {/* Header Section */}
      <motion.div 
        variants={fadeInUp} 
        initial="hidden" 
        animate="visible"
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full mb-10 gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-normal mb-2">Financial Reports</h1>
          <p className="text-white/60">Access historical statements, cash flow records, and tenant invoices.</p>
        </div>
        
        {/* Premium Tab Navigation */}
        <div className="flex bg-[#200497]/20 p-1.5 rounded-xl border border-[#200497]/30 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'historical' 
                ? 'bg-[#B95F7B] text-white shadow-lg shadow-[#B95F7B]/40' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            Master Statements
          </button>
          <button
            onClick={() => setActiveTab('tenant')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'tenant' 
                ? 'bg-[#B95F7B] text-white shadow-lg shadow-[#B95F7B]/40' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Tenant Invoices
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        
        {/* ========================================== */}
        {/* TAB 1: HISTORICAL MASTER STATEMENTS          */}
        {/* ========================================== */}
        {activeTab === 'historical' && (
          <motion.div 
            key="historical"
            variants={tabVariant} initial="hidden" animate="visible" exit="exit"
            className="w-full space-y-6"
          >
            {/* Controls */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#B95F7B]" />
                <span className="text-white/80 font-medium">Select Financial Year:</span>
              </div>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#0F0246] border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-6 py-2 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Reports Grid */}
            {isFetchingReports ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#B95F7B]" />
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <FileBox className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/50">No reports generated for the selected year.</p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reports.map((report, idx) => (
                  <motion.div 
                    key={idx} variants={fadeInUp}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-[#200497]/50 relative"
                  >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B95F7B]/10 rounded-full blur-3xl group-hover:bg-[#B95F7B]/20 transition-all duration-500"></div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-normal text-white">{report.month}</h3>
                          <p className="text-white/40 text-sm">{report.year}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {report.status}
                        </span>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-white/50 text-sm">Total Collected</span>
                          <span className="text-white font-medium">Ksh {report.collections.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-white/50 text-sm">Platform Fees</span>
                          <span className="text-red-400/80 font-medium">- Ksh {report.deductions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 font-medium">Net Payout</span>
                          <span className="text-[#B95F7B] font-medium text-lg">Ksh {report.net.toLocaleString()}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDownloadReport(report.month)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#200497]/30 text-white rounded-xl transition-all duration-300 hover:bg-[#200497]/60 group-hover:border-[#200497] border border-transparent"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF Statement
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 2: TENANT INVOICE HISTORY                */}
        {/* ========================================== */}
        {activeTab === 'tenant' && (
          <motion.div 
            key="tenant"
            variants={tabVariant} initial="hidden" animate="visible" exit="exit"
            className="w-full flex flex-col xl:flex-row gap-8"
          >
            {/* Sidebar: Tenant Selection */}
            <div className="w-full xl:w-1/3 space-y-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full min-h-[500px]">
                <h3 className="text-lg font-normal mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#B95F7B]" />
                  Find Tenant
                </h3>
                
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder="Search by name or house..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F0246]/50 border border-white/10 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-white/30"
                  />
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {isFetchingProperties ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-[#B95F7B]" />
                    </div>
                  ) : filteredTenants.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-4">No tenants match your search.</p>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <button
                        key={tenant.id}
                        onClick={() => setSelectedTenantId(tenant.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                          selectedTenantId === tenant.id 
                            ? 'bg-[#200497]/40 border-[#200497] shadow-lg' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-white text-sm">{tenant.first_name} {tenant.last_name}</p>
                          <p className="text-xs text-white/50 mt-1">{tenant.propertyName} - {tenant.house_number}</p>
                        </div>
                        {tenant.is_archived && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-white/60 rounded-md">
                            Archived
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Main Content: Invoice List */}
            <div className="w-full xl:w-2/3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden h-full">
                {!selectedTenantId ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8">
                    <FileText className="w-16 h-16 text-white/10 mb-4" />
                    <h3 className="text-xl font-normal text-white/80 mb-2">Select a Tenant</h3>
                    <p className="text-white/40">Choose a tenant from the list to view and download their historical monthly invoices and fine receipts.</p>
                  </div>
                ) : (
                  <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0F0246]/50">
                      <div>
                        <h2 className="text-xl font-normal text-white">Invoice History</h2>
                        <p className="text-white/50 text-sm mt-1">
                          Showing records for <span className="text-[#B95F7B] font-medium">{selectedTenant?.first_name} {selectedTenant?.last_name}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                          {selectedTenant?.propertyName} | Unit {selectedTenant?.house_number}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-grow">
                      <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-white/10 text-white/50 text-sm">
                              <th className="p-4 font-normal">Date</th>
                              <th className="p-4 font-normal">Type</th>
                              <th className="p-4 font-normal">Amount</th>
                              <th className="p-4 font-normal">Status</th>
                              <th className="p-4 font-normal text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockTenantInvoices.map((inv) => (
                              <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-white/80">{new Date(inv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                <td className="p-4 text-white/70">{inv.type}</td>
                                <td className="p-4 font-medium text-white">Ksh {inv.amount.toLocaleString()}</td>
                                <td className="p-4">
                                  <span className="px-3 py-1 rounded-full text-xs border bg-green-500/10 border-green-500/20 text-green-400">
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button 
                                    onClick={() => handleDownloadInvoice(inv.id)}
                                    className="p-2 text-white/50 hover:text-[#B95F7B] bg-white/5 hover:bg-[#B95F7B]/10 rounded-lg transition-all"
                                    title="Download PDF"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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