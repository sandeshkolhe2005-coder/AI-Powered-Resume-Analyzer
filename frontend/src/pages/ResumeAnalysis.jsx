import React from 'react';
import { useStore } from '../store/useStore';
import { 
  FileText, 
  Check, 
  Copy, 
  Sparkles, 
  CornerDownRight, 
  FileEdit,
  Grid,
  ListFilter,
  Loader2,
  BookmarkCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeAnalysis() {
  const { currentResume, activeReport, reportLoading, rewriteBullet, bulletSuggestions, bulletLoading } = useStore();
  const [activeTab, setActiveTab] = React.useState('score'); // score, parsed, optimizer
  const [bulletText, setBulletText] = React.useState('');
  const [jobText, setJobText] = React.useState('');
  const [copiedIdx, setCopiedIdx] = React.useState(null);

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!bulletText.trim()) return;
    await rewriteBullet(bulletText, jobText);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  if (!currentResume) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-bold">Deep Resume Audit</h2>
        <p className="text-xs text-textSecondary">Granular breakdown and suggestions for {currentResume.filename}</p>
      </div>

      {/* Tabs selector */}
      <div className="flex gap-1.5 bg-bgSurface border border-borderSubtle p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('score')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'score' ? 'bg-borderSubtle text-accentPrimary' : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          Detailed Feedback
        </button>
        <button
          onClick={() => setActiveTab('parsed')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'parsed' ? 'bg-borderSubtle text-accentPrimary' : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          Extracted Resume Content
        </button>
        <button
          onClick={() => setActiveTab('optimizer')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'optimizer' ? 'bg-borderSubtle text-accentPrimary' : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          Bullet Point Tailor
        </button>
      </div>

      {/* Report view */}
      {activeTab === 'score' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <BookmarkCheck size={18} className="text-accentPrimary" />
                <span>ATS Report Details</span>
              </h3>
              
              {reportLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-accentPrimary" /></div>
              ) : activeReport ? (
                <div className="text-sm text-textSecondary leading-relaxed space-y-4">
                  {activeReport.detailed_feedback.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h4 key={idx} className="text-base font-bold text-textPrimary pt-4">{line.replace('###', '')}</h4>;
                    }
                    if (line.startsWith('####')) {
                      return <h5 key={idx} className="text-xs font-bold text-accentPrimary uppercase tracking-wider pt-2 block">{line.replace('####', '')}</h5>;
                    }
                    if (line.startsWith('-') || (line.length > 0 && line.match(/^\d+\./))) {
                      return (
                        <div key={idx} className="flex gap-2.5 pl-2 py-0.5">
                          <CornerDownRight size={14} className="text-accentViolet shrink-0 mt-1" />
                          <span>{line.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      );
                    }
                    return line.trim() ? <p key={idx}>{line}</p> : null;
                  })}
                </div>
              ) : (
                <p className="text-xs text-textSecondary italic">No active audit details found.</p>
              )}
            </div>
          </div>

          {/* Quick Metrics sidebar */}
          <div className="space-y-6">
            <div className="bg-bgSurface border border-borderSubtle p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest block">Scoring Summary</h3>
              {activeReport && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                    <span className="text-xs text-textSecondary font-medium">ATS Rating</span>
                    <span className="text-lg font-bold font-mono text-brandSuccess">{activeReport.overall_score}%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                    <span className="text-xs text-textSecondary font-medium">Skills Coverage</span>
                    <span className="text-xs font-bold font-mono text-textPrimary">
                      {activeReport.keyword_score >= 80 ? 'Optimal' : 'Needs Keywords'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                    <span className="text-xs text-textSecondary font-medium">Format Compliance</span>
                    <span className="text-xs font-bold font-mono text-textPrimary">
                      {activeReport.formatting_score >= 85 ? 'Standard' : 'Needs Updates'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-textSecondary font-medium">Grammar & Impact</span>
                    <span className="text-xs font-bold font-mono text-textPrimary">
                      {activeReport.grammar_score >= 80 ? 'Action-focused' : 'Weak Verbs'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extracted text view */}
      {activeTab === 'parsed' && (
        <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText size={18} className="text-accentViolet" />
              <span>Parsed Text Repository</span>
            </h3>
            <button
              onClick={() => handleCopy(currentResume.parsed_text || '', 999)}
              className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-white px-3 py-1.5 rounded-lg border border-borderSubtle hover:bg-bgSurfaceHover transition-all"
            >
              {copiedIdx === 999 ? <Check size={14} className="text-brandSuccess" /> : <Copy size={14} />}
              <span>{copiedIdx === 999 ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>
          <div className="bg-bgPrimary p-4 rounded-xl border border-borderSubtle/60 h-96 overflow-y-auto font-mono text-xs text-textSecondary leading-relaxed whitespace-pre-wrap">
            {currentResume.parsed_text || "Resume parser text extraction details are empty or still processing."}
          </div>
        </div>
      )}

      {/* Bullet Point Tailor view */}
      {activeTab === 'optimizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Main Rewrite Input and Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-6">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Sparkles size={18} className="text-accentPrimary" />
                <span>AI Bullet Point Optimizer</span>
              </h3>
              
              <form onSubmit={handleRewrite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Your Resume Bullet Point</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Responsible for code writing and assisted the manager with daily tasks."
                    value={bulletText}
                    onChange={(e) => setBulletText(e.target.value)}
                    className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl p-3.5 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Target Job Description (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Paste job details to inject target keywords and technologies..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl p-3.5 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bulletLoading || !bulletText.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-accentPrimary/20 disabled:opacity-50"
                >
                  {bulletLoading ? <Loader2 className="animate-spin" size={16} /> : <FileEdit size={16} />}
                  <span>Optimize Phrasing</span>
                </button>
              </form>
            </div>

            {/* Suggestions layout */}
            {bulletSuggestions.length > 0 && (
              <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-semibold">AI Recommended Alternatives</h3>
                <div className="space-y-3">
                  {bulletSuggestions.map((sug, idx) => (
                    <div key={idx} className="bg-bgPrimary border border-borderSubtle/60 p-4 rounded-xl flex items-start justify-between gap-4">
                      <div className="flex gap-2 min-w-0">
                        <span className="text-xs font-bold text-accentPrimary shrink-0 mt-0.5">#{idx + 1}</span>
                        <p className="text-xs text-textSecondary leading-relaxed">{sug}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(sug, idx)}
                        className="text-textSecondary hover:text-white shrink-0 p-1.5 bg-bgSurface border border-borderSubtle rounded-lg hover:bg-borderSubtle transition-all"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === idx ? <Check size={14} className="text-brandSuccess" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick info panel */}
          <div className="space-y-6">
            <div className="bg-bgSurface border border-borderSubtle p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest block">Rewrite Guide</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Top ATS filters search for performance metrics and active results.
              </p>
              <div className="text-[11px] text-textSecondary space-y-2 pt-2 border-t border-borderSubtle">
                <p>
                  <strong className="text-textPrimary block">Bad:</strong>
                  "Helped create React frontend UI."
                </p>
                <p>
                  <strong className="text-textPrimary block">Good (AI Optimization):</strong>
                  "Architected responsive React interfaces using atomic design principles, boosting customer engagement times by 20%."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
