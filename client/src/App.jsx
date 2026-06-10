import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// --- Global Layout Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNavbar from './features/admin/components/AdminNavbar';
import CaretakerNavbar from './features/caretaker/components/CaretakerNavbar';

// --- Public Pages ---
import Home from './features/public/Home';
import About from './features/public/About';
import Contact from './features/public/Contact';

// --- Authentication Pages ---
import LandlordRegistration from './features/auth/LandlordRegistration';
import Login from './features/auth/Login';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import VerifyEmail from './features/auth/VerifyEmail';
import TenantActivation from './features/auth/TenantActivation';

// --- System Admin Pages ---
import AdminDashboard from './features/admin/AdminDashboard';
import LandlordManagement from './features/admin/LandlordManagement';
import MasterLedger from './features/admin/MasterLedger';
import GlobalSettings from './features/admin/GlobalSettings';

// --- Caretaker Operations Pages ---
import CaretakerDashboard from './features/caretaker/CaretakerDashboard';
import TenantBalances from './features/caretaker/TenantBalances';
import UtilityEntry from './features/caretaker/UtilityEntry';

// --- Auth Guards ---
// import ProtectedRoute from './components/ProtectedRoute'; 
// (Uncomment ProtectedRoute once you build it to secure the layouts)

// ==========================================
// LAYOUT WRAPPERS (React Router v6)
// ==========================================

// 1. Public Layout (Has Marketing Navbar & Footer)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Injects Home, Login, Contact, etc., here */}
      </main>
      <Footer />
    </>
  );
};

// 2. Admin Layout (Has Admin Navbar, NO Footer)
const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="flex-grow bg-[#0F0246]">
        <Outlet /> {/* Injects Dashboard, Ledger, Settings, etc., here */}
      </main>
    </>
  );
};

// 3. Caretaker Layout (Has Caretaker Restricted Navbar, NO Footer)
const CaretakerLayout = () => {
  return (
    <>
      <CaretakerNavbar />
      <main className="flex-grow bg-[#0F0246]">
        <Outlet /> {/* Injects CaretakerDashboard, TenantBalances, UtilityEntry here */}
      </main>
    </>
  );
};


// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() { 
  return (
    <Router>
      {/* Global CSS Reset & Base Background */}
      <div className="flex flex-col min-h-screen bg-[#0F0246] font-sans text-white overflow-x-hidden">
        
        <Routes>
          
          {/* -------------------------------------- */}
          {/* PUBLIC & AUTH ROUTES (Using Public Layout) */}
          {/* -------------------------------------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/register" element={<LandlordRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/activate" element={<TenantActivation />} />
          </Route>

          {/* -------------------------------------- */}
          {/* ADMIN PORTAL ROUTES (Using Admin Layout) */}
          {/* -------------------------------------- */}
          {/* Wrap this in <ProtectedRoute allowedRoles={['admin']}> when ready */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="landlords" element={<LandlordManagement />} />
            <Route path="ledger" element={<MasterLedger />} />
            <Route path="settings" element={<GlobalSettings />} />
          </Route>

          {/* -------------------------------------- */}
          {/* CARETAKER PORTAL ROUTES (Using Caretaker Layout) */}
          {/* -------------------------------------- */}
          {/* Wrap this in <ProtectedRoute allowedRoles={['caretaker']}> when ready */}
          <Route path="/caretaker" element={<CaretakerLayout />}>
            <Route index element={<CaretakerDashboard />} />
            <Route path="balances" element={<TenantBalances />} />
            <Route path="utilities" element={<UtilityEntry />} />
          </Route>

          {/* -------------------------------------- */}
          {/* FALLBACK 404 ROUTE */}
          {/* -------------------------------------- */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#0F0246]">
              <h2 className="text-4xl md:text-5xl font-light tracking-widest text-white/50 mb-4">404</h2>
              <p className="text-lg text-white/70 font-light mb-8">This pathway does not exist.</p>
              <a href="/" className="px-8 py-3 bg-[#B95F7B] text-white rounded-full hover:bg-[#a04e67] transition-colors duration-300">
                Return to Surface
              </a>
            </div>
          } />

        </Routes>
        
      </div>
    </Router>
  );
}

export default App;