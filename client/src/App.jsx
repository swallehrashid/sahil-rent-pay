import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Global Layout Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

function App() { 
  return (
    // The Router wraps the entire application to enable URL navigation
    <Router>
      {/* Global Layout Wrapper: 
        Forces the app to be at least the height of the screen (min-h-screen).
        Uses flex-col so the main content expands (flex-grow) to push the footer down.
        Sets the global deep luxury navy background.
      */}
      <div className="flex flex-col min-h-screen bg-[#0F0246] font-sans text-white overflow-x-hidden">
        
        <Navbar />

        {/* Main Content Area:
          This is where the React Router injects the specific page components.
          It flex-grows to take up all available space between Navbar and Footer.
        */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Authentication Routes */}
            <Route path="/register" element={<LandlordRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/activate" element={<TenantActivation />} />

            {/* --- FUTURE ROUTES PLACEHOLDER --- */}
            {/* As we generate Landlord, Admin, and Tenant dashboards, 
                we will import them at the top and add their <Route> tags here. 
                Protected routes will eventually be wrapped in <ProtectedRoute>. */}
            
            {/* Fallback 404 Route to prevent WSOD on bad URLs */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <h2 className="text-4xl md:text-5xl font-light tracking-widest text-white/50 mb-4">404</h2>
                <p className="text-lg text-white/70 font-light mb-8">This page is currently under construction.</p>
                <a href="/" className="px-8 py-3 bg-[#B95F7B] text-white rounded-full hover:bg-[#a04e67] transition-colors duration-300">
                  Return Home
                </a>
              </div>
            } />
          </Routes>
        </main>

        <Footer /> 
        
      </div>
    </Router>
  );
}

export default App;