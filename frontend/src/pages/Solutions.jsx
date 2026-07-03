import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Target, Zap, FileText, BarChart3, ArrowLeft, Terminal } from 'lucide-react';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Solutions() {
  const navigate = useNavigate();

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

  const solutions = [
    {
      id: "ENGINE_01: HEURISTICS",
      icon: Shield,
      title: "ATS Parser Compliance Scans",
      desc: "Deep rule-based parser mapping document margins, contact information structures, standard heading hierarchies, and font-weight densities to pass corporate filters.",
      metric: "99.4% Scan Accuracy",
      glow: "group-hover:shadow-[0_0_30px_rgba(91,140,255,0.15)] group-hover:border-accentPrimary/40",
      iconStyle: "text-accentPrimary bg-accentPrimary/10 border-accentPrimary/20"
    },
    {
      id: "ENGINE_02: EMBEDDING",
      icon: Target,
      title: "Semantic Vector Alignment",
      desc: "Uses Qdrant vector-similarity calculations to map resume accomplishments to job descriptions, scoring concepts and synonyms instead of raw keywords.",
      metric: "Cosine Distance Matching",
      glow: "group-hover:shadow-[0_0_30px_rgba(124,92,255,0.2)] group-hover:border-accentViolet/40",
      iconStyle: "text-accentViolet bg-accentViolet/10 border-accentViolet/20"
    },
    {
      id: "ENGINE_03: OPTIMIZER",
      icon: Sparkles,
      title: "AI Accomplishment Optimizer",
      desc: "Gemini-powered optimizer designed to rewrite passive bullet points into action-driven statements containing measurable business impacts and indicators.",
      metric: "Gemini 1.5 Flash Model",
      glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] group-hover:border-brandSuccess/40",
      iconStyle: "text-brandSuccess bg-brandSuccess/10 border-brandSuccess/20"
    },
    {
      id: "ENGINE_04: GENERATOR",
      icon: FileText,
      title: "Personalized Cover Letters",
      desc: "Generates tailored cover letters mapped to candidate history and target roles, utilizing context variables to maximize visual interest.",
      metric: "Dynamic Context Injector",
      glow: "group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] group-hover:border-brandWarning/40",
      iconStyle: "text-brandWarning bg-brandWarning/10 border-brandWarning/20"
    },
    {
      id: "ENGINE_05: COCH_BOT",
      icon: Zap,
      title: "Dynamic Interview Prep Kits",
      desc: "Custom role-based technical and behavioral questions derived from profile gaps, including response templates and answer suggestions.",
      metric: "STAR Framework Outlines",
      glow: "group-hover:shadow-[0_0_30px_rgba(248,113,113,0.15)] group-hover:border-brandDanger/40",
      iconStyle: "text-brandDanger bg-brandDanger/10 border-brandDanger/20"
    },
    {
      id: "ENGINE_06: ANALYTICS",
      icon: BarChart3,
      title: "Score Progression Charts",
      desc: "Tracks and renders historical score records across uploads, highlighting formatting and keyword compliance changes over time.",
      metric: "Recharts Area Modeling",
      glow: "group-hover:shadow-[0_0_30px_rgba(91,140,255,0.15)] group-hover:border-accentPrimary/40",
      iconStyle: "text-accentPrimary bg-accentPrimary/10 border-accentPrimary/20"
    }
  ];

  return (
    <div className="min-h-screen text-textPrimary flex flex-col justify-between overflow-x-hidden relative font-sans bg-black">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 flex flex-col items-center justify-center space-y-16 z-10">
        
        {/* Futuristic Section Banner */}
        <div className="text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#0c0d12]/80 border border-borderSubtle/60 px-4 py-2 rounded-full text-xs font-semibold text-accentPrimary tracking-widest font-mono uppercase shadow-lg shadow-accentPrimary/5">
            <Terminal size={12} className="text-accentViolet" />
            <span>[ SYSTEM_INTELLIGENCE: RESOLUTION_CORE ]</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-urbanist text-white leading-tight">
            Cognitive Optimization{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary to-accentViolet">
              Engines
            </span>
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Our multi-agent system scores, embeds, rewrites, and matches candidate resume assets against modern corporate tracking filters in milliseconds.
          </p>
        </div>

        {/* Dynamic Solutions Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                variants={cardVariants}
                key={idx}
                className="group relative bg-[#13151b]/80 border border-borderSubtle rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 backdrop-blur-md"
              >
                {/* Glowing element inside card borders */}
                <div className={`absolute inset-0 rounded-2xl border border-transparent transition-all duration-300 pointer-events-none ${sol.glow}`} />

                <div className="space-y-5">
                  {/* Service Identifier Header */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-textSecondary/50 font-bold uppercase tracking-wider">
                    <span>{sol.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accentViolet/60 group-hover:bg-accentPrimary group-hover:scale-125 transition-all" />
                  </div>

                  {/* Icon Block */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${sol.iconStyle} group-hover:scale-105`}>
                    <Icon size={22} />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-accentPrimary transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-textSecondary leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer Metric info */}
                <div className="pt-4 mt-4 border-t border-borderSubtle/60 flex items-center justify-between text-[10px] font-mono text-textSecondary/60 font-semibold uppercase">
                  <span>METRIC_CAP:</span>
                  <span className="text-white bg-bgPrimary border border-borderSubtle/80 px-2.5 py-0.5 rounded-md font-bold">
                    {sol.metric}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Register Actions wrap */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <div className="btn-border-wrap">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-[#000000] text-white font-semibold text-sm rounded-[50px] btn-hover-fill relative outline-none cursor-pointer"
            >
              Initialize Scanner Engine
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderSubtle py-6 bg-[#060218]/80 text-center text-textSecondary text-xs z-10">
        &copy; {new Date().getFullYear()} AI Resume Analyzer. Production-Grade Portfolio Systems.
      </footer>
    </div>
  );
}
