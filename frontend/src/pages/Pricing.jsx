import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, Terminal, ArrowLeft } from 'lucide-react';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Pricing() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const tiers = [
    {
      id: "TIER_01: SCOUT",
      name: "Scout Profile",
      price: "$0",
      period: "FOREVER",
      desc: "For candidates analyzing document structure, heading standard links, and layout formats.",
      features: [
        "1 active resume scan profile",
        "Heuristic ATS compliance checklist",
        "Standard parsed text extraction log",
        "Basic missing keywords list",
        "Local offline mock advice support"
      ],
      cta: "INITIATE_FREE_LICENSE",
      popular: false,
      accent: "border-borderSubtle bg-[#13151b]/80",
      btnStyle: "bg-bgPrimary text-white border border-borderSubtle hover:bg-bgSurfaceHover hover:border-accentPrimary/40"
    },
    {
      id: "TIER_02: ANALYST",
      name: "Pro Analyst",
      price: "$19",
      period: "PER MONTH",
      desc: "For job seekers needing Qdrant vector job matches and custom bullet points rewrites.",
      features: [
        "Unlimited resume uploads & revisions",
        "Qdrant vector-similarity calculations",
        "Job description match optimization",
        "Gemini AI bullet accomplishments optimizer",
        "Tailored cover letter drafts output",
        "Interview prep kits response templates"
      ],
      cta: "UPGRADE_TO_PRO_INTELLIGENCE",
      popular: true,
      accent: "border-accentPrimary bg-[#161922]/90 shadow-[0_0_35px_rgba(91,140,255,0.06)]",
      btnStyle: "bg-gradient-to-r from-accentPrimary to-accentViolet text-white shadow-lg shadow-accentPrimary/20 hover:opacity-95"
    },
    {
      id: "TIER_03: ELITE",
      name: "Elite Recruitment",
      price: "$49",
      period: "PER MONTH",
      desc: "For enterprise recruiters and executive placement groups matching candidate lists.",
      features: [
        "Everything in Pro Analyst package",
        "Priority background processing queue",
        "1-on-1 career coach AI simulation",
        "Recruiter dashboard export panels",
        "Standard formatting exporter download",
        "Beta pipeline features evaluation access"
      ],
      cta: "ACTIVATE_ELITE_SYSTEM",
      popular: false,
      accent: "border-borderSubtle bg-[#13151b]/80",
      btnStyle: "bg-bgPrimary text-white border border-borderSubtle hover:bg-bgSurfaceHover hover:border-accentPrimary/40"
    }
  ];

  return (
    <div className="min-h-screen text-textPrimary flex flex-col justify-between overflow-x-hidden relative font-sans bg-bgPrimary">
      {/* Background HLS Video */}
      <BackgroundVideo />

      {/* 3D Perspective Scrolling Landscape Grid */}
      <div className="perspective-container">
        <div className="grid-3d" />
      </div>

      {/* Floating 3D Holographic Gyroscope */}
      <div className="absolute top-[8%] right-[8%] hidden lg:block pointer-events-none">
        <div className="rings-3d-container">
          <div className="ring-3d-element ring-3d-1" />
          <div className="ring-3d-element ring-3d-2" />
          <div className="ring-3d-element ring-3d-3" />
        </div>
      </div>

      {/* Dynamic Animated Background Glows */}
      <motion.div 
        animate={{ 
          x: [0, 80, -40, 0], 
          y: [0, 120, 60, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 22, 
          ease: "easeInOut" 
        }}
        className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-accentPrimary/5 rounded-full blur-[130px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 60, 0], 
          y: [0, -80, 110, 0],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 26, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-accentViolet/5 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Header */}
      <header className="w-full max-w-[1920px] mx-auto px-6 lg:px-16 py-6 flex items-center justify-between z-10 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg shadow-accentPrimary/20">
            R
          </div>
          <span className="font-bold text-textPrimary tracking-wide text-lg">AI Resume Analyzer</span>
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs text-textSecondary hover:text-white px-4 py-2 rounded-xl border border-borderSubtle bg-[#0c0d12]/60 hover:bg-bgSurfaceHover transition-all shadow-md"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 flex flex-col space-y-16 z-10">
        
        {/* Banner Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0c0d12]/80 border border-borderSubtle/60 px-4 py-2 rounded-full text-xs font-semibold text-brandSuccess tracking-widest font-mono uppercase shadow-lg">
            <Terminal size={12} className="text-brandSuccess" />
            <span>[ SYSTEM_LICENSE: BILLING_CONFIG ]</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-urbanist text-white leading-tight">
            Transparent Pricing{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary to-accentViolet">
              Tiers
            </span>
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Review licensing profiles to scan document assets, run similarity match queries, and generate interview packages.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch"
        >
          {tiers.map((tier, idx) => (
            <motion.div
              variants={cardVariants}
              key={idx}
              className={`border rounded-3xl p-8 flex flex-col justify-between relative backdrop-blur-md hover:translate-y-[-4px] transition-all duration-300 ${tier.accent}`}
            >
              {tier.popular && (
                <span className="absolute top-4 right-4 bg-accentPrimary/10 border border-accentPrimary/25 text-accentPrimary text-[9px] font-mono font-bold uppercase tracking-widest py-1 px-3 rounded-md flex items-center gap-1.5 animate-pulse">
                  <Sparkles size={11} className="text-accentViolet" />
                  RECOMMENDED
                </span>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-textSecondary/50 font-bold uppercase tracking-wider">
                    {tier.id}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{tier.name}</h3>
                  <p className="text-xs text-textSecondary leading-relaxed">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1.5 leading-none pt-2">
                  <span className="text-5xl font-bold text-white font-urbanist tracking-tight leading-none">{tier.price}</span>
                  <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest font-semibold">/ {tier.period}</span>
                </div>

                <ul className="space-y-4 pt-6 border-t border-borderSubtle/60">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-xs text-textSecondary leading-relaxed">
                      <Check size={14} className="text-brandSuccess shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {tier.popular ? (
                  /* Double glow wrapped button for popular tier */
                  <div className="btn-border-wrap w-full text-center">
                    <button
                      onClick={() => window.location.href = '/register'}
                      className="w-full py-4 bg-[#000000] text-white font-mono font-bold text-xs rounded-[50px] btn-hover-fill outline-none relative cursor-pointer"
                    >
                      {tier.cta}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/register"
                    className={`w-full py-3.5 rounded-xl font-mono font-bold text-[11px] flex items-center justify-center transition-all active:scale-97 ${tier.btnStyle}`}
                  >
                    {tier.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderSubtle py-6 bg-[#060218]/80 text-center text-textSecondary text-xs z-10">
        &copy; {new Date().getFullYear()} AI Resume Analyzer. Production-Grade Portfolio Systems.
      </footer>
    </div>
  );
}
