import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle,
  ShieldCheck,
  Wallet
} from 'lucide-react';

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

export default function LandlordRegistration() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Form State mapped to backend schema requirements
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
  });

  // Component-level loader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      // In production, dispatch RTK Query registerLandlord mutation here
      // On success, navigate to the email verification page
      navigate('/verify-email');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0246]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            {/* Architectural layout shift animation */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-6 bg-[#B95F7B]/50 border border-white/20 backdrop-blur-md rounded"
            />
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="absolute top-8 left-0 h-6 bg-[#200497]/50 border border-white/20 backdrop-blur-md rounded"
            />
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              className="absolute top-16 left-0 h-6 bg-white/20 border border-white/20 backdrop-blur-md rounded"
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 font-light tracking-widest uppercase text-sm"
          >
            Provisioning Workspace
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F0246] overflow-x-hidden font-sans text-white pb-24">
      {/* Global Background Glow Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B95F7B]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#200497]/20 rounded-full blur-[120px] pointer-events-none" />

      <section className="relative pt-24 px-6 max-w-7xl mx-auto z-10 flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Column: Value Proposition & CRO Copy */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="lg:w-5/12 lg:sticky lg:top-32 space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#B95F7B]/30 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#B95F7B] animate-pulse" />
            <span className="text-xs tracking-wider text-white/80 font-light uppercase">0% Fee Promotional Trial Active</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
            Automate Your <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B95F7B] to-white">Property Portfolio.</span>
          </h1>
          
          <p className="text-sm text-white/60 font-light leading-relaxed">
            Ditch the messy Excel spreadsheets and stop worrying about unverified M-Pesa receipts. Register your landlord account today to experience seamless, automated rent collection via Safaricom C2B Paybill directly to your bank account.
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#200497]/30 flex items-center justify-center shrink-0 border border-[#200497]/50">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white tracking-wide mb-1">Unique Global Prefixes</h4>
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Our system automatically extracts your initials to generate a unique house prefix (e.g., JKM-A-001) preventing any payment collision across the network.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#B95F7B]/20 flex items-center justify-center shrink-0 border border-[#B95F7B]/30">
                <Wallet className="w-5 h-5 text-[#B95F7B]" />
              </div>
              <div>
                <h4 className="font-medium text-white tracking-wide mb-1">Automated Bank Payouts</h4>
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Provide your settlement bank details below. We utilize advanced B2B APIs to automatically route verified tenant funds directly to your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-white tracking-wide mb-1">Immutable Master Ledger</h4>
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Gain instant clarity on arrears, overpayments, and individual tenant lifetimes with our line-item accounting architecture.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Registration Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-7/12 w-full"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(32,4,151,0.2)]">
            <div className="mb-8 border-b border-white/10 pb-6">
              <h2 className="text-2xl font-light tracking-wide mb-2">Create Landlord Profile</h2>
              <p className="text-xs text-white/50 font-light">All fields are securely encrypted and required for financial compliance.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium tracking-widest uppercase text-[#B95F7B]">1. Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                      placeholder="First Name" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                      placeholder="Last Name" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="Email Address" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                      placeholder="Phone (+254...)" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium tracking-widest uppercase text-[#B95F7B]">2. Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="password" name="password" required value={formData.password} onChange={handleChange}
                      placeholder="Create Password" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                      placeholder="Confirm Password" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                </div>
              </div>

              {/* Settlement Banking Details */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium tracking-widest uppercase text-[#B95F7B]">3. Settlement Banking</h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">Required for Payouts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="text" name="accountName" required value={formData.accountName} onChange={handleChange}
                      placeholder="Registered Account Name (e.g., John Doe Properties)" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="text" name="bankName" required value={formData.bankName} onChange={handleChange}
                      placeholder="Bank Name (e.g., Equity Bank)" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-white/40 group-focus-within:text-[#B95F7B] transition-colors" />
                    </div>
                    <input 
                      type="text" name="accountNumber" required value={formData.accountNumber} onChange={handleChange}
                      placeholder="Account Number" 
                      className="w-full bg-white/5 border-b border-white/20 pl-12 pr-4 py-4 text-white placeholder-white/40 rounded-t-xl focus:outline-none focus:border-[#B95F7B] transition-all duration-300 font-light text-sm" 
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B95F7B] transition-all duration-300 group-focus-within:w-full"></span>
                  </div>
                </div>
              </div>

              {/* Terms & Submit */}
              <div className="pt-4 space-y-6">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 rounded border-white/20 bg-white/5 text-[#B95F7B] focus:ring-[#B95F7B]/50" />
                  <span className="text-xs text-white/60 group-hover:text-white transition-colors leading-relaxed">
                    I agree to the Sahil Rent Pay Solutions Terms of Service and Privacy Policy. I confirm that the banking details provided are accurate for automated settlement routing.
                  </span>
                </label>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center px-8 py-4 font-light text-white transition-all duration-300 bg-[#B95F7B] rounded-xl hover:bg-[#a04e67] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#B95F7B]/40 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Create Landlord Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-white/60 font-light">
                Already manage properties with us?{' '}
                <Link to="/login" className="text-[#B95F7B] hover:text-white transition-colors font-medium ml-1">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- Floating WhatsApp CTA --- */}
      <a 
        href="https://wa.me/254700000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500/90 backdrop-blur-md rounded-full shadow-2xl hover:-translate-y-2 hover:bg-green-400 transition-all duration-300 border border-green-400/50 group"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Onboarding Help
        </span>
      </a>

    </div>
  );
}