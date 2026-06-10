import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Building, MapPin, Home, MessageCircle, X, 
  Loader2, DollarSign, Hash 
} from 'lucide-react';
import { 
  useGetPropertiesQuery, 
  useCreatePropertyMutation, 
  useAddHouseMutation 
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
    transition: { staggerChildren: 0.15 }
  }
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

export default function PropertyManagement() {
  // --- Local State ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [houseModalData, setHouseModalData] = useState({ isOpen: false, propertyId: null });
  
  const [propertyForm, setPropertyForm] = useState({ name: '', location: '', description: '' });
  const [houseForm, setHouseForm] = useState({ house_number: '', base_rent: '' });

  // --- RTK Query Hooks ---
  const { data, isLoading: isFetchingProperties } = useGetPropertiesQuery();
  const [createProperty, { isLoading: isCreatingProperty }] = useCreatePropertyMutation();
  const [addHouse, { isLoading: isAddingHouse }] = useAddHouseMutation();

  const properties = data?.properties || [];

  // --- Initial 1.2s Premium Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await createProperty(propertyForm).unwrap();
      setIsPropertyModalOpen(false);
      setPropertyForm({ name: '', location: '', description: '' });
    } catch (error) {
      console.error("Failed to create property:", error);
    }
  };

  const handleAddHouse = async (e) => {
    e.preventDefault();
    try {
      await addHouse({ 
        propertyId: houseModalData.propertyId, 
        houseData: { 
          house_number: houseForm.house_number, 
          base_rent: parseFloat(houseForm.base_rent) 
        } 
      }).unwrap();
      setHouseModalData({ isOpen: false, propertyId: null });
      setHouseForm({ house_number: '', base_rent: '' });
    } catch (error) {
      console.error("Failed to add house:", error);
    }
  };

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0246] text-white">
        <motion.div 
          className="relative w-24 h-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="absolute inset-0 border-t-2 border-r-2 border-[#B95F7B] rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-b-2 border-l-2 border-[#200497] rounded-full animate-pulse delay-150"></div>
          <Building className="absolute inset-0 m-auto w-8 h-8 text-white/80" />
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
          <h1 className="text-3xl md:text-4xl font-normal mb-2">Property Portfolio</h1>
          <p className="text-white/60">Manage your estates and housing units systematically.</p>
        </div>
        <button 
          onClick={() => setIsPropertyModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#B95F7B] text-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/50 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </button>
      </motion.div>

      {/* Properties Grid */}
      {isFetchingProperties ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#B95F7B]" />
        </div>
      ) : properties.length === 0 ? (
        <motion.div 
          variants={fadeInUp} initial="hidden" animate="visible"
          className="w-full flex flex-col items-center justify-center p-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl"
        >
          <Building className="w-16 h-16 text-white/30 mb-4" />
          <h3 className="text-xl font-normal mb-2">No Properties Found</h3>
          <p className="text-white/50 text-center max-w-md">You haven't added any properties to your portfolio yet. Click the button above to get started.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {properties.map((property) => (
            <motion.div 
              key={property.id} 
              variants={fadeInUp}
              className="group bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-[#200497]/50"
            >
              {/* Card Header & Image */}
              <div className="relative h-48 w-full overflow-hidden bg-[#200497]/20">
                <img 
                  src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80`} 
                  alt="Property" 
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0246] to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                  <h2 className="text-2xl font-normal text-white mb-1">{property.name}</h2>
                  <div className="flex items-center text-white/70 text-sm gap-2">
                    <MapPin className="w-4 h-4 text-[#B95F7B]" />
                    {property.location}
                  </div>
                </div>
              </div>

              {/* Card Body - Houses List */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-normal flex items-center gap-2">
                    <Home className="w-5 h-5 text-white/50" />
                    Housing Units
                  </h3>
                  <button 
                    onClick={() => setHouseModalData({ isOpen: true, propertyId: property.id })}
                    className="text-sm px-4 py-2 bg-white/10 hover:bg-[#200497]/80 text-white rounded-lg transition-colors border border-white/10"
                  >
                    + Add House
                  </button>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-black/20">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-sm">
                        <th className="p-4 font-normal">House No.</th>
                        <th className="p-4 font-normal">Base Rent</th>
                        <th className="p-4 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.houses && property.houses.length > 0 ? (
                        property.houses.map((house) => (
                          <tr key={house.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">{house.house_number}</td>
                            <td className="p-4 text-white/80">Ksh {house.base_rent.toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs border ${house.status === 'Vacant' ? 'bg-white/10 border-white/20 text-white/80' : 'bg-[#200497]/30 border-[#200497]/50 text-[#200497] brightness-150'}`}>
                                {house.status || 'Vacant'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-4 text-center text-white/40 italic">No units registered yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* --- Modals --- */}
      <AnimatePresence>
        {/* Create Property Modal */}
        {isPropertyModalOpen && (
          <motion.div 
            variants={modalOverlay} initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0246]/80 backdrop-blur-sm"
          >
            <motion.div 
              variants={modalContent}
              className="bg-[#0F0246] border border-white/20 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden relative"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-normal">Register New Property</h2>
                <button onClick={() => setIsPropertyModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateProperty} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Property Name</label>
                  <input 
                    required type="text" placeholder="e.g., Sunrise Apartments"
                    value={propertyForm.name} onChange={(e) => setPropertyForm({...propertyForm, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-lg px-4 py-3 outline-none transition-all placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input 
                      required type="text" placeholder="e.g., Kileleshwa, Nairobi"
                      value={propertyForm.location} onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-lg pl-12 pr-4 py-3 outline-none transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Description (Optional)</label>
                  <textarea 
                    rows="3" placeholder="Brief details about the property..."
                    value={propertyForm.description} onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-lg px-4 py-3 outline-none transition-all resize-none placeholder:text-white/30"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsPropertyModalOpen(false)} className="px-5 py-2.5 rounded-lg text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
                  <button disabled={isCreatingProperty} type="submit" className="px-5 py-2.5 bg-[#B95F7B] text-white rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-50 flex items-center gap-2">
                    {isCreatingProperty ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add House Modal */}
        {houseModalData.isOpen && (
          <motion.div 
            variants={modalOverlay} initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0246]/80 backdrop-blur-sm"
          >
            <motion.div 
              variants={modalContent}
              className="bg-[#0F0246] border border-white/20 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-normal">Add Housing Unit</h2>
                <button onClick={() => setHouseModalData({ isOpen: false, propertyId: null })} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddHouse} className="p-6 space-y-5">
                <div className="bg-[#200497]/20 border border-[#200497]/30 p-4 rounded-xl mb-2">
                  <p className="text-sm text-white/80">
                    The system will automatically generate a unique prefix based on your initials to ensure M-Pesa tracking integrity.
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">House Number (Suffix)</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input 
                      required type="text" placeholder="e.g., 001, A1, B-Ground"
                      value={houseForm.house_number} onChange={(e) => setHouseForm({...houseForm, house_number: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-lg pl-12 pr-4 py-3 outline-none transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Base Monthly Rent (Ksh)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input 
                      required type="number" min="0" step="0.01" placeholder="e.g., 25000"
                      value={houseForm.base_rent} onChange={(e) => setHouseForm({...houseForm, base_rent: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-lg pl-12 pr-4 py-3 outline-none transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setHouseModalData({ isOpen: false, propertyId: null })} className="px-5 py-2.5 rounded-lg text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
                  <button disabled={isAddingHouse} type="submit" className="px-5 py-2.5 bg-[#B95F7B] text-white rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-50 flex items-center gap-2">
                    {isAddingHouse ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Unit'}
                  </button>
                </div>
              </form>
            </motion.div>
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