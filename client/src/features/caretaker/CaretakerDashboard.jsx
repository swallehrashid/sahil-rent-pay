import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Search, 
  Droplets, 
  WalletCards, 
  MapPin, 
  Phone, 
  Home, 
  AlertCircle,
  MessageCircle,
  ClipboardList
} from 'lucide-react';

// --- Import RTK Query Hooks ---
// (Ensure the path is correct relative to your actual file structure)
import { useGetCaretakerDashboardQuery } from './caretakerApiSlice';

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

export default function CaretakerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom artificial delay to guarantee the premium 1.2s minimum loader reveal
  const [isArtificialLoading, setIsArtificialLoading] = useState(true);

  // --- RTK Query Integration ---
  const { data: dashboardData, isLoading: isApiLoading } = useGetCaretakerDashboardQuery();

  // Enforce 1.2s loader
  useEffect(() => {
    const timer = setTimeout(() => setIsArtificialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Fallback / Simulated Data for UI Presentation ---
  const data = dashboardData || {
    total_active_tenants: 42,
    total_vacant_houses: 3,
    properties: [
      {
        id: 1,
        name: "Sunset Heights",
        location: "Westlands, Nairobi",
        houses: [
          { id: 101, house_number: "SGH-A-001", status: "Occupied", tenant: { name: "John Doe", phone_number: "+254711000000" } },
          { id: 102, house_number: "SGH-A-002", status: "Vacant", tenant: null },
          { id: 103, house_number: "SGH-A-003", status: "Occupied", tenant: { name: "Jane Smith", phone_number: "+254722000000" } },
        ]
      },
      {
        id: 2,
        name: "Lavington Views",
        location: "Lavington, Nairobi",
        houses: [
          { id: 201, house_number: "LAV-B-001", status: "Occupied", tenant: { name: "Michael Johnson", phone_number: "+254733000000" } },
          { id: 202, house_number: "LAV-B-002", status: "Occupied", tenant: { name: "Sarah Wanjiku", phone_number: "+254744000000" } },
        ]
      }
    ]
  };

  const filteredProperties = data.properties.map(property => {
    return {
      ...property,
      houses: property.houses.filter(house => 
        house.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (house.tenant && house.tenant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (house.tenant && house.tenant.phone_number.includes(searchQuery))
      )
    };
  }).filter(property => property.houses.length > 0 || property.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const isScreenLoading = isApiLoading || isArtificialLoading;

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
            <ClipboardList className="w-6 h-6 text-white absolute" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Loading Operations Desk
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Background Atmosphere - Leaning into Primary and Third colors for operational focus */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#200497]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8 relative z-10">

        {/* --- Section 1: Welcome & Quick Metrics --- */}
        <section className="border-b border-white/10 pb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs tracking-wider text-indigo-200 font-light uppercase">Daily Operations Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 flex items-center">
              Field Operations Desk
            </h1>
            <p className="text-sm text-white/60 font-light max-w-2xl">
              Manage your assigned properties, log utility meter readings, and monitor tenant occupancy. Financial aggregates are restricted by your employer.
            </p>
          </motion.div>
        </section>

        {/* --- Section 2: Core Operational Metrics & Actions --- */}
        <section>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric: Active Tenants */}
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-3xl font-light mb-1">{data.total_active_tenants}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Active Tenants</p>
            </motion.div>

            {/* Metric: Vacant Houses */}
            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#B95F7B]/20 flex items-center justify-center border border-[#B95F7B]/30">
                  <Home className="w-5 h-5 text-[#B95F7B]" />
                </div>
                {data.total_vacant_houses > 0 && (
                  <span className="text-[10px] uppercase tracking-widest text-[#B95F7B] border border-[#B95F7B]/30 bg-[#B95F7B]/10 px-2 py-1 rounded-md">Action Required</span>
                )}
              </div>
              <h3 className="text-3xl font-light mb-1">{data.total_vacant_houses}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest">Vacant Units</p>
            </motion.div>

            {/* Action: Log Utilities */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <Link to="/caretaker/utilities" className="bg-gradient-to-tr from-[#200497]/40 to-[#0F0246] backdrop-blur-xl border border-[#200497]/50 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:-translate-y-1 hover:shadow-[#200497]/30 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[#200497]/50 flex items-center justify-center border border-indigo-400/30 mb-4 group-hover:scale-110 transition-transform">
                    <Droplets className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light mb-1 text-indigo-100">Log Utilities</h4>
                    <p className="text-xs text-indigo-300/70 font-light">Input mid-month water/electricity readings.</p>
                  </div>
                </Link>

                <Link to="/caretaker/balances" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:-translate-y-1 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform">
                    <WalletCards className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light mb-1 text-white">Tenant Balances</h4>
                    <p className="text-xs text-white/50 font-light">Follow up on outstanding rent collections.</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* --- Section 3: Search & Filter --- */}
        <section className="pt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <h2 className="text-xl font-light text-indigo-100">Assigned Properties</h2>
            <div className="w-full sm:w-96 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search house, tenant, or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-light text-sm" 
              />
            </div>
          </motion.div>
        </section>

        {/* --- Section 4: Property & House Listings --- */}
        <section>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            {filteredProperties.map((property) => (
              <motion.div key={property.id} variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Property Header */}
                <div className="bg-black/20 border-b border-white/5 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#200497] to-[#0F0246] flex items-center justify-center border border-[#200497]/50 shadow-lg">
                      <Building2 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium tracking-wide text-white">{property.name}</h3>
                      <p className="text-xs text-white/50 font-light flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {property.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-light text-white/50 border border-white/10 bg-white/5 px-3 py-1.5 rounded-lg">
                    {property.houses.length} Units Managed
                  </div>
                </div>

                {/* House Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {property.houses.map((house) => (
                    <div 
                      key={house.id} 
                      className="bg-[#0F0246]/50 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white/5 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-lg font-mono text-indigo-200">{house.house_number}</span>
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
                          house.status === 'Occupied' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-[#B95F7B]/10 text-[#B95F7B] border-[#B95F7B]/20'
                        }`}>
                          {house.status}
                        </span>
                      </div>

                      {house.status === 'Occupied' && house.tenant ? (
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center text-sm font-light text-white/80">
                            <Users className="w-4 h-4 mr-2 text-white/40" />
                            {house.tenant.name}
                          </div>
                          <div className="flex items-center text-sm font-light text-white/80">
                            <Phone className="w-4 h-4 mr-2 text-white/40" />
                            {house.tenant.phone_number}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm font-light text-white/40 mt-auto py-2">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Ready for onboarding
                        </div>
                      )}

                      {/* Utility Quick Action */}
                      {house.status === 'Occupied' && (
                         <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                            <Link to={`/caretaker/utilities?house=${house.id}`} className="flex-1 text-center py-2 text-xs font-medium uppercase tracking-widest text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors">
                              Log Meter
                            </Link>
                         </div>
                      )}
                    </div>
                  ))}
                  
                  {property.houses.length === 0 && (
                     <div className="col-span-full py-8 text-center text-white/40 font-light text-sm">
                       No units match your search criteria in this property.
                     </div>
                  )}
                </div>

              </motion.div>
            ))}

            {filteredProperties.length === 0 && (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-light text-white/60 mb-2">No Properties Found</h3>
                <p className="text-sm text-white/40">Adjust your search or contact the Landlord for assignment.</p>
              </div>
            )}
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
          Operations Support
        </span>
      </a>

    </div>
  );
}