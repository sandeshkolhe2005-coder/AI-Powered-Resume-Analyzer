import React from 'react';
import { useStore } from '../store/useStore';
import { Target, AlertTriangle, CheckCircle, ListPlus, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobMatcher() {
  const { currentResume, matchJob, currentJobMatch, jobMatchLoading } = useStore();
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!currentResume || !jobTitle.trim() || !jobDescription.trim()) return;
    await matchJob(currentResume.id, jobTitle, jobDescription);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-brandSuccess border-brandSuccess/20 bg-brandSuccess/5';
    if (score >= 50) return 'text-brandWarning border-brandWarning/20 bg-brandWarning/5';
    return 'text-brandDanger border-brandDanger/20 bg-brandDanger/5';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'Optimal Alignment';
    if (score >= 50) return 'Moderate Fit';
    return 'Weak Fit';
  };

  if (!currentResume) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto font-sans">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">Semantic Job Description Matcher</h2>
        <p className="text-xs text-textSecondary">Analyze resume keywords compliance against specific role requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Form (Left Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Target size={16} className="text-accentPrimary" />
              <span>Target Role Details</span>
            </h3>

            <form onSubmit={handleMatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl py-3 px-4 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Job Description</label>
                <textarea
                  rows={8}
                  placeholder="Paste the target job description details here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl p-3.5 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={jobMatchLoading || !jobTitle.trim() || !jobDescription.trim()}
                className="px-5 py-3 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-accentPrimary/20 disabled:opacity-50"
              >
                {jobMatchLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Analyzing Alignment...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Run Match Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output */}
          <AnimatePresence>
            {currentJobMatch && !jobMatchLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
                  <div>
                    <h3 className="text-base font-semibold">{currentJobMatch.job_title} Compatibility</h3>
                    <p className="text-xs text-textSecondary">Calculated using vector matching and keyword coverage</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border uppercase tracking-wider ${getScoreColor(currentJobMatch.match_score)}`}>
                    {getScoreBadge(currentJobMatch.match_score)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matching skills */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-brandSuccess uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle size={14} />
                      <span>Matching Keywords ({currentJobMatch.matching_skills?.length || 0})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJobMatch.matching_skills?.length > 0 ? (
                        currentJobMatch.matching_skills.map((skill, idx) => (
                          <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brandSuccess/10 border border-brandSuccess/20 text-brandSuccess capitalize">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-textSecondary/60 italic">No skills overlap identified.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-brandDanger uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>Missing Target Skills ({currentJobMatch.missing_skills?.length || 0})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJobMatch.missing_skills?.length > 0 ? (
                        currentJobMatch.missing_skills.map((skill, idx) => (
                          <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brandDanger/10 border border-brandDanger/20 text-brandDanger capitalize">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-textSecondary/60 italic">All target skills are covered.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Improvements suggestions list */}
                <div className="pt-4 border-t border-borderSubtle space-y-3">
                  <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                    <ListPlus size={14} />
                    <span>Role Optimization Recommendations</span>
                  </h4>
                  <div className="space-y-2">
                    {currentJobMatch.improvements?.map((imp, idx) => (
                      <p key={idx} className="text-xs text-textSecondary leading-relaxed flex items-start gap-2">
                        <span className="text-accentPrimary font-bold shrink-0 mt-0.5">•</span>
                        <span>{imp}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info card (Right column) */}
        <div className="space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest block font-mono">Compatibility scoring</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Our semantic matching algorithm checks the underlying technology family and vocabulary density:
            </p>
            <div className="space-y-3 text-[11px] text-textSecondary pt-3 border-t border-borderSubtle">
              <p>
                <strong className="text-textPrimary block mb-0.5">Semantic Similarities (40%)</strong>
                Uses neural embeddings to find matches between concepts, synonyms, and engineering systems.
              </p>
              <p>
                <strong className="text-textPrimary block mb-0.5">Keyword Intersections (60%)</strong>
                Scans for physical word occurrences to pass ATS token filters (important for search query screens).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
