import React from 'react';
import { useStore } from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Award, 
  FileCheck, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Search,
  RefreshCw,
  FolderOpen,
  Terminal,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Custom CountUp Hook
function CountUp({ value }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1200; // ms
    const intervalTime = 16;
    const steps = duration / intervalTime;
    const increment = end / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

export default function Dashboard() {
  const { currentResume, activeReport, resumes, selectResume, reportLoading } = useStore();
  const [trendData, setTrendData] = React.useState([]);
  const [kpis, setKpis] = React.useState({ total_resumes: 0, avg_job_match: 0, latest_ats_score: 0 });
  const [loadingTrends, setLoadingTrends] = React.useState(false);

  React.useEffect(() => {
    const fetchTrends = async () => {
      setLoadingTrends(true);
      try {
        const res = await api.get('/analysis/trends');
        setTrendData(res.data.trends || []);
        setKpis(res.data.kpis || { total_resumes: 0, avg_job_match: 0, latest_ats_score: 0 });
      } catch (err) {
        console.error("Failed to load trends data", err);
      } finally {
        setLoadingTrends(false);
      }
    };
    fetchTrends();
  }, [resumes, activeReport]);

  const progressBarColor = (score) => {
    if (score >= 80) return 'bg-brandSuccess shadow-[0_0_10px_rgba(52,211,153,0.3)]';
    if (score >= 50) return 'bg-brandWarning shadow-[0_0_10px_rgba(251,191,36,0.3)]';
    return 'bg-brandDanger shadow-[0_0_10px_rgba(248,113,113,0.3)]';
  };

  // Entrance variants for parent grid and item cards
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  // If no resumes exist, show welcome upload page
  if (resumes.length === 0) {
    return (
      <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 z-10 relative">
        <div className="w-16 h-16 rounded-2xl bg-bgSurface border border-borderSubtle flex items-center justify-center text-accentPrimary shadow-xl animate-pulse">
          <FolderOpen size={32} />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold tracking-tight">No resumes in database</h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Upload your first professional resume in PDF or DOCX format to unlock active scoring, job matching, and AI recommendations.
          </p>
        </div>
        <Link 
          to="/upload" 
          className="px-5 py-2.5 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-accentPrimary/20"
        >
          <Plus size={16} />
          <span>Upload Resume</span>
        </Link>
      </div>
    );
  }

  // If resumes exist but none is set active, guide user to select one
  if (!currentResume) {
    return (
      <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 z-10 relative">
        <div className="w-16 h-16 rounded-2xl bg-bgSurface border border-borderSubtle flex items-center justify-center text-accentViolet shadow-xl">
          <Search size={32} />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Select Active Resume</h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Please choose a resume context from the list below to explore the scoring dashboard, keywords coverage, and career tools.
          </p>
        </div>
        <div className="w-full max-w-sm bg-bgSurface border border-borderSubtle rounded-2xl p-4 divide-y divide-borderSubtle shadow-xl">
          {resumes.map((res) => (
            <button
              key={res.id}
              onClick={() => selectResume(res)}
              className="w-full text-left py-3 px-2 flex items-center justify-between text-sm font-medium hover:text-accentPrimary text-textSecondary transition-all"
            >
              <span>{res.filename}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-bgPrimary border border-borderSubtle/80">
                {res.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto z-10 relative"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-accentViolet animate-pulse" />
            <span className="text-[10px] font-mono text-accentPrimary tracking-widest uppercase">[ TELEMETRY_ACTIVE: CONNECTED ]</span>
          </div>
          <h2 className="text-2xl font-bold font-urbanist text-white tracking-tight">Control Room Dashboard</h2>
          <p className="text-xs text-textSecondary">Real-time statistics for {currentResume.filename}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link 
            to="/upload" 
            className="px-4 py-2.5 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:opacity-95 shadow-lg shadow-accentPrimary/20 transition-all active:scale-95"
          >
            <Plus size={14} />
            <span>New Upload</span>
          </Link>
        </div>
      </div>

      {/* Top row of KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI: Overall ATS Score */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.015, boxShadow: "0 0 25px rgba(91, 140, 255, 0.08)" }}
          className="bg-[#13151b]/80 border-t-2 border-t-accentPrimary/60 border border-borderSubtle p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all duration-300"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-mono text-textSecondary uppercase tracking-widest">
              <span>[ KPI_SCORE_01 ]</span>
            </div>
            <span className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider block">ATS Compliance Score</span>
            <h3 className="text-4xl font-bold font-mono tracking-tight text-accentPrimary drop-shadow-[0_0_8px_rgba(91,140,255,0.3)]">
              {reportLoading ? (
                <span className="text-base text-textSecondary animate-pulse">Scanning...</span>
              ) : activeReport ? (
                <><CountUp value={activeReport.overall_score} />%</>
              ) : (
                '0%'
              )}
            </h3>
            <span className="text-[9px] font-mono text-textSecondary/50">THRESHOLD_MIN &ge; 80%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-[0_0_15px_rgba(91,140,255,0.1)]">
            <Award size={22} />
          </div>
        </motion.div>

        {/* KPI: Total Resumes */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.015, boxShadow: "0 0 25px rgba(124, 92, 255, 0.08)" }}
          className="bg-[#13151b]/80 border-t-2 border-t-accentViolet/60 border border-borderSubtle p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all duration-300"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-mono text-textSecondary uppercase tracking-widest">
              <span>[ KPI_SCORE_02 ]</span>
            </div>
            <span className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider block">Resumes Profiling</span>
            <h3 className="text-4xl font-bold font-mono tracking-tight text-accentViolet drop-shadow-[0_0_8px_rgba(124,92,255,0.3)]">
              {kpis.total_resumes}
            </h3>
            <span className="text-[9px] font-mono text-textSecondary/50">DB_INDEX_REVISIONS</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accentViolet/10 border border-accentViolet/20 flex items-center justify-center text-accentViolet shadow-[0_0_15px_rgba(124,92,255,0.1)]">
            <FileCheck size={22} />
          </div>
        </motion.div>

        {/* KPI: Average Job Match */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.015, boxShadow: "0 0 25px rgba(52, 211, 153, 0.08)" }}
          className="bg-[#13151b]/80 border-t-2 border-t-brandSuccess/60 border border-borderSubtle p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all duration-300"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-mono text-textSecondary uppercase tracking-widest">
              <span>[ KPI_SCORE_03 ]</span>
            </div>
            <span className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider block">Avg Job Compatibility</span>
            <h3 className="text-4xl font-bold font-mono tracking-tight text-brandSuccess drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              {kpis.avg_job_match}%
            </h3>
            <span className="text-[9px] font-mono text-textSecondary/50">VECTOR_MATCH_DISTANCE</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brandSuccess/10 border border-brandSuccess/20 flex items-center justify-center text-brandSuccess shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <TrendingUp size={22} />
          </div>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Score breakdown or loading */}
        <div className="lg:col-span-2 space-y-6">
          {reportLoading ? (
            <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-6 h-[400px] flex flex-col justify-center items-center">
              <RefreshCw className="animate-spin text-accentPrimary" size={32} />
              <p className="text-sm text-textSecondary">AI is parsing and profiling resume datasets...</p>
            </div>
          ) : activeReport ? (
            <motion.div 
              variants={cardVariants}
              className="bg-[#13151b]/80 border border-borderSubtle p-6 rounded-2xl space-y-6 backdrop-blur-md"
            >
              <div className="flex justify-between items-center border-b border-borderSubtle/60 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight font-urbanist">ATS Parameters Breakdown</h3>
                <span className="text-[9px] font-mono text-textSecondary/60">[ COMPILE_HEURISTICS_OK ]</span>
              </div>
              
              <div className="space-y-5 font-sans">
                {/* Keywords Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-textSecondary">Skills & Keyword Density</span>
                    <span className={activeReport.keyword_score >= 80 ? 'text-brandSuccess' : 'text-brandWarning'}>
                      {activeReport.keyword_score}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden p-[1px] border border-borderSubtle/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeReport.keyword_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressBarColor(activeReport.keyword_score)}`}
                    />
                  </div>
                </div>

                {/* Formatting Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-textSecondary">Formatting & Contact Validation</span>
                    <span className={activeReport.formatting_score >= 80 ? 'text-brandSuccess' : 'text-brandWarning'}>
                      {activeReport.formatting_score}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden p-[1px] border border-borderSubtle/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeReport.formatting_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressBarColor(activeReport.formatting_score)}`}
                    />
                  </div>
                </div>

                {/* Grammar Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-textSecondary">Grammar & Impact Phrasing</span>
                    <span className={activeReport.grammar_score >= 80 ? 'text-brandSuccess' : 'text-brandWarning'}>
                      {activeReport.grammar_score}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden p-[1px] border border-borderSubtle/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeReport.grammar_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressBarColor(activeReport.grammar_score)}`}
                    />
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-textSecondary">Experience Depth & Timeline</span>
                    <span className={activeReport.experience_score >= 80 ? 'text-brandSuccess' : 'text-brandWarning'}>
                      {activeReport.experience_score}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden p-[1px] border border-borderSubtle/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeReport.experience_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressBarColor(activeReport.experience_score)}`}
                    />
                  </div>
                </div>

                {/* Projects Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-textSecondary">Projects & Accomplishments</span>
                    <span className={activeReport.projects_score >= 80 ? 'text-brandSuccess' : 'text-brandWarning'}>
                      {activeReport.projects_score}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden p-[1px] border border-borderSubtle/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeReport.projects_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressBarColor(activeReport.projects_score)}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl flex flex-col justify-center items-center h-[300px] text-center space-y-4">
              <AlertCircle size={28} className="text-brandWarning animate-bounce" />
              <p className="text-sm text-textSecondary">Active resume is pending analysis scan</p>
              <button 
                onClick={() => selectResume(currentResume)}
                className="px-4 py-2 bg-borderSubtle hover:bg-bgSurfaceHover text-xs font-medium rounded-xl border border-borderSubtle cursor-pointer transition-all active:scale-95"
              >
                Trigger Scan
              </button>
            </div>
          )}

          {/* Area Chart: Score trends */}
          <motion.div 
            variants={cardVariants}
            className="bg-[#13151b]/80 border border-borderSubtle p-6 rounded-2xl space-y-6 backdrop-blur-md"
          >
            <div className="flex justify-between items-center border-b border-borderSubtle/60 pb-3">
              <h3 className="text-base font-bold text-white font-urbanist tracking-tight">ATS Score Progression Trend</h3>
              <span className="text-[9px] font-mono text-textSecondary/60">[ METRIC_HISTORY: PLOTTED ]</span>
            </div>
            <div className="h-64 w-full">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B8CFF" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1D23', borderColor: '#2A2E37', borderRadius: '12px' }}
                      labelStyle={{ color: '#9CA3AF', fontSize: '10px' }}
                      itemStyle={{ color: '#F5F6F8', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="overall_score" name="ATS Score" stroke="#5B8CFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-textSecondary text-xs font-mono">
                  // UPLOAD MULTIPLE REVISIONS TO VIEW PROGRESSION TRENDS.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right 1 Column: Suggestions & Missing skills */}
        <div className="space-y-6">
          {/* Missing Skills Box */}
          <motion.div 
            variants={cardVariants}
            className="bg-[#13151b]/80 border border-borderSubtle p-5 rounded-2xl space-y-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3 text-brandWarning">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <h3 className="text-sm font-bold text-white font-urbanist tracking-tight">Identified Skills Gaps</h3>
              </div>
              <span className="text-[9px] font-mono text-brandWarning/70">[ GAPS_DETECTED ]</span>
            </div>
            <p className="text-[11px] text-textSecondary">Recommended keywords missing from your active resume:</p>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {activeReport && activeReport.missing_skills?.length > 0 ? (
                activeReport.missing_skills.map((skill, idx) => (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    key={idx} 
                    className="text-xs px-2.5 py-1 font-semibold rounded-lg bg-brandDanger/10 border border-brandDanger/20 text-brandDanger capitalize cursor-default"
                  >
                    + {skill}
                  </motion.span>
                ))
              ) : (
                <span className="text-xs text-textSecondary/60 italic font-mono">// NO MISSING SKILLS DETECTED.</span>
              )}
            </div>
          </motion.div>

          {/* AI Suggestions Box */}
          <motion.div 
            variants={cardVariants}
            className="bg-[#13151b]/80 border border-borderSubtle p-5 rounded-2xl space-y-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3 text-accentPrimary">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accentViolet" />
                <h3 className="text-sm font-bold text-white font-urbanist tracking-tight">AI Advisory Action Items</h3>
              </div>
              <span className="text-[9px] font-mono text-accentViolet/75">[ ADVISORY_RUN ]</span>
            </div>
            <div className="space-y-4 divide-y divide-borderSubtle/60">
              {activeReport && activeReport.suggestions?.length > 0 ? (
                activeReport.suggestions.map((suggestion, idx) => (
                  <div key={idx} className={`text-xs text-textSecondary leading-relaxed ${idx > 0 ? 'pt-4' : ''}`}>
                    <span className="font-semibold text-white block mb-1 font-mono text-[10px]">STEP_0{idx + 1}:</span>
                    {suggestion}
                  </div>
                ))
              ) : (
                <p className="text-xs text-textSecondary/60 italic font-mono">// NO CUSTOM ADVICE GENERATED YET.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
