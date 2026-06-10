import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Users, Edit, Archive, Mail, X, 
  Loader2, Phone, MessageCircle, Home, Calendar, ShieldCheck 
} from 'lucide-react';
import { 
  useGetPropertiesQuery, 
  useRegisterTenantMutation, 
  useUpdateTenantMutation, 
  useArchiveTenantMutation, 
  useNotifySystemSetupMutation 
} from '../../features/landlord/landlordApiSlice';

// --- Framer Motion Variants [cite: 30, 31, 32, 33, 34, 35] ---
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

export default function TenantManagement() {
  // --- Local State ---
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Modal toggles
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({ isOpen: false, tenant: null });
  const [archiveModalData, setArchiveModalData] = useState({ isOpen: false, tenantId: null });

  // Form states
  const [tenantForm, setTenantForm] = useState({
    first_name: '', last_name: '', email: '', phone_number: '', 
    id_number: '', move_in_date: '', deposit_amount: '', house_id: ''
  });
  const [editForm, setEditForm] = useState({
    email: '', phone_number: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [archiveDate, setArchiveDate] = useState('');

  // --- RTK Query Hooks [cite: 573, 578] ---
  const { data, isLoading: isFetchingData } = useGetPropertiesQuery();
  const [registerTenant, { isLoading: isRegistering }] = useRegisterTenantMutation();
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();
  const [archiveTenant, { isLoading: isArchiving }] = useArchiveTenantMutation();
  const [notifySystemSetup, { isLoading: isNotifying }] = useNotifySystemSetupMutation();

  // --- Data Processing ---
  // Extract vacant houses and active tenants from the properties payload [cite: 414, 418, 424]
  const properties = data?.properties || [];
  const vacantHouses = [];
  const activeTenants = [];

  properties.forEach(property => {
    property.houses?.forEach(house => {
      if (house.status === 'Vacant') {
        vacantHouses.push({ ...house, propertyName: property.name });
      } else if (house.tenant && !house.tenant.is_archived) {
        activeTenants.push({ ...house.tenant, house_number: house.house_number, propertyName: property.name });
      }
    });
  });

  // --- Premium Component-Level Loader ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers [cite: 412, 416, 420, 426] ---
  const handleRegisterTenant = async (e) => {
    e.preventDefault();
    try {
      await registerTenant({
        ...tenantForm,
        deposit_amount: parseFloat(tenantForm.deposit_amount),
        house_id: parseInt(tenantForm.house_id)
      }).unwrap();
      setIsAddModalOpen(false);
      setTenantForm({
        first_name: '', last_name: '', email: '', phone_number: '', 
        id_number: '', move_in_date: '', deposit_amount: '', house_id: ''
      });
    } catch (error) {
      console.error("Failed to register tenant:", error);
    }
  };

  const openEditModal = (tenant) => {
    setEditForm({
      email: tenant.email || '',
      phone_number: tenant.phone_number || '',
      emergency_contact_name: tenant.emergency_contact_name || '',
      emergency_contact_phone: tenant.emergency_contact_phone || ''
    });
    setEditModalData({ isOpen: true, tenant });
  };

  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    try {
      await updateTenant({ 
        tenantId: editModalData.tenant.id, 
        updateData: editForm 
      }).unwrap();
      setEditModalData({ isOpen: false, tenant: null });
    } catch (error) {
      console.error("Failed to update tenant:", error);
    }
  };

  const handleArchiveTenant = async (e) => {
    e.preventDefault();
    try {
      await archiveTenant({ 
        tenantId: archiveModalData.tenantId, 
        moveOutDate: archiveDate 
      }).unwrap();
      setArchiveModalData({ isOpen: false, tenantId: null });
      setArchiveDate('');
    } catch (error) {
      console.error("Failed to archive tenant:", error);
    }
  };

  const handleNotifySetup = async () => {
    if (window.confirm("Are you sure you want to send a mass SMS to all active tenants?")) {
      try {
        await notifySystemSetup().unwrap();
        alert("Notification dispatched successfully.");
      } catch (error) {
        console.error("Failed to dispatch notifications:", error);
      }
    }
  };

  // --- Render Loader ---
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0246] text-white">
        <motion.div 
          className="relative w-28 h-28 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute inset-0 border-2 border-[#B95F7B] rounded-2xl rotate-45"
            animate={{ rotate: 225, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute inset-2 border-2 border-[#200497] rounded-2xl rotate-45"
            animate={{ rotate: -135, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <Users className="w-8 h-8 text-white/80 z-10" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen text-white font-light tracking-wide bg-gradient-to-br from-[#0F0246] via-[#0a0130] to-[#0F0246] overflow-x-hidden p-4 md:p-8 lg:p-12">
      
      {/* Header Section [cite: 43, 44, 45] */}
      <motion.div 
        variants={fadeInUp} 
        initial="hidden" 
        animate="visible"
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full mb-10 gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-normal mb-2">Tenant Management</h1>
          <p className="text-white/60">Onboard new renters, manage profiles, and track occupancy.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleNotifySetup}
            disabled={isNotifying || activeTenants.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#200497]/40 border border-[#200497] text-white rounded-xl transition-all duration-300 hover:bg-[#200497]/60 disabled:opacity-50"
          >
            {isNotifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            Notify Setup (SMS)
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#B95F7B] text-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/50"
          >
            <UserPlus className="w-5 h-5" />
            Register Tenant
          </button>
        </div>
      </motion.div>

      {/* Active Tenants List [cite: 17, 21, 48] */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-normal flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B95F7B]" />
              Active Tenants ({activeTenants.length})
            </h2>
          </div>
          
          {isFetchingData ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#B95F7B]" />
            </div>
          ) : activeTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Users className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-white/50 text-center">No active tenants found. Register a new tenant to populate this list.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-white/60 text-sm">
                    <th className="p-5 font-normal">Tenant Name</th>
                    <th className="p-5 font-normal">Contact Info</th>
                    <th className="p-5 font-normal">Property & Unit</th>
                    <th className="p-5 font-normal">Move-In Date</th>
                    <th className="p-5 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                  {activeTenants.map((tenant) => (
                    <motion.tr 
                      key={tenant.id} 
                      variants={fadeInUp}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#200497] to-[#B95F7B] flex items-center justify-center text-sm font-medium shadow-inner">
                            {tenant.first_name[0]}{tenant.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">{tenant.first_name} {tenant.last_name}</p>
                            <p className="text-xs text-white/40">ID: {tenant.id_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-white/80 text-sm">{tenant.phone_number}</p>
                        <p className="text-white/50 text-xs">{tenant.email}</p>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#200497]/30 border border-[#200497]/50 rounded-full text-sm text-white/90">
                          <Home className="w-3.5 h-3.5 text-[#B95F7B]" />
                          {tenant.propertyName} - {tenant.house_number}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-white/70">
                        {new Date(tenant.move_in_date).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(tenant)}
                            className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                            title="Edit Tenant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setArchiveModalData({ isOpen: true, tenantId: tenant.id })}
                            className="p-2 text-white/50 hover:text-[#B95F7B] bg-white/5 hover:bg-[#B95F7B]/20 rounded-lg transition-all"
                            title="Vacate/Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- Modals --- */}
      <AnimatePresence>
        
        {/* Register Tenant Modal [cite: 413, 414] */}
        {isAddModalOpen && (
          <motion.div 
            variants={modalOverlay} initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0246]/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              variants={modalContent}
              className="bg-[#0F0246] border border-white/20 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden relative my-8"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-normal flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#B95F7B]" />
                  Register New Tenant
                </h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleRegisterTenant} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">First Name</label>
                    <input required type="text" value={tenantForm.first_name} onChange={(e) => setTenantForm({...tenantForm, first_name: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="e.g., Joseph" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Last Name</label>
                    <input required type="text" value={tenantForm.last_name} onChange={(e) => setTenantForm({...tenantForm, last_name: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="e.g., Kamau" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                      <input required type="tel" value={tenantForm.phone_number} onChange={(e) => setTenantForm({...tenantForm, phone_number: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="+2547..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Email Address</label>
                    <input required type="email" value={tenantForm.email} onChange={(e) => setTenantForm({...tenantForm, email: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="tenant@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">ID/Passport Number</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                      <input required type="text" value={tenantForm.id_number} onChange={(e) => setTenantForm({...tenantForm, id_number: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="National ID" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Move-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                      <input required type="date" value={tenantForm.move_in_date} onChange={(e) => setTenantForm({...tenantForm, move_in_date: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 outline-none transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Assign to Vacant House</label>
                    <select required value={tenantForm.house_id} onChange={(e) => setTenantForm({...tenantForm, house_id: e.target.value})} className="w-full bg-[#0F0246] border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all appearance-none">
                      <option value="" disabled>Select a vacant unit...</option>
                      {vacantHouses.map(house => (
                        <option key={house.id} value={house.id}>
                          {house.propertyName} - {house.house_number} (Ksh {house.base_rent.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Initial Deposit Held (Ksh)</label>
                    <input required type="number" min="0" step="0.01" value={tenantForm.deposit_amount} onChange={(e) => setTenantForm({...tenantForm, deposit_amount: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-white/30" placeholder="e.g., 25000" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
                  <button disabled={isRegistering} type="submit" className="px-6 py-2.5 bg-[#B95F7B] text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-50 flex items-center gap-2">
                    {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Tenant'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Tenant Modal [cite: 418, 419] */}
        {editModalData.isOpen && (
          <motion.div 
            variants={modalOverlay} initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0246]/80 backdrop-blur-sm"
          >
            <motion.div 
              variants={modalContent}
              className="bg-[#0F0246] border border-white/20 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-normal">Edit Tenant Details</h2>
                <button onClick={() => setEditModalData({ isOpen: false, tenant: null })} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateTenant} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email Address</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                  <input type="tel" value={editForm.phone_number} onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all" />
                </div>
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Emergency Contact</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Contact Name" value={editForm.emergency_contact_name} onChange={(e) => setEditForm({...editForm, emergency_contact_name: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all" />
                    <input type="tel" placeholder="Contact Phone" value={editForm.emergency_contact_phone} onChange={(e) => setEditForm({...editForm, emergency_contact_phone: e.target.value})} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl px-4 py-3 outline-none transition-all" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-white/10">
                  <button type="button" onClick={() => setEditModalData({ isOpen: false, tenant: null })} className="px-5 py-2.5 rounded-xl text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
                  <button disabled={isUpdating} type="submit" className="px-5 py-2.5 bg-[#B95F7B] text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-50 flex items-center gap-2">
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Archive/Vacate Tenant Modal [cite: 422, 423, 424, 425] */}
        {archiveModalData.isOpen && (
          <motion.div 
            variants={modalOverlay} initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0246]/80 backdrop-blur-sm"
          >
            <motion.div 
              variants={modalContent}
              className="bg-[#0F0246] border border-white/20 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6 border-b border-[#B95F7B]/30 bg-[#B95F7B]/10">
                <h2 className="text-xl font-normal text-[#B95F7B] flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Vacate & Archive Tenant
                </h2>
              </div>
              <form onSubmit={handleArchiveTenant} className="p-6 space-y-5">
                <p className="text-white/70 text-sm">
                  Archiving a tenant will immediately mark their unit as "Vacant", removing them from the automated monthly billing cycle while preserving their financial ledger history.
                </p>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Official Move-Out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                    <input required type="date" value={archiveDate} onChange={(e) => setArchiveDate(e.target.value)} className="w-full bg-white/5 border border-white/20 focus:border-[#B95F7B] focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 outline-none transition-all [color-scheme:dark]" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setArchiveModalData({ isOpen: false, tenantId: null })} className="px-5 py-2.5 rounded-xl text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
                  <button disabled={isArchiving} type="submit" className="px-5 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/40 disabled:opacity-50 flex items-center gap-2">
                    {isArchiving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Archive'}
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