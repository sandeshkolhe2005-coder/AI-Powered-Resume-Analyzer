import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Interview() {
  const { currentResume, generateInterviewQuestions, interviewQuestions, interviewQuestionsLoading } = useStore();
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDesc, setJobDesc] = React.useState('');
  const [expandedIdx, setExpandedIdx] = React.useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!currentResume || !jobTitle.trim()) return;
    await generateInterviewQuestions(currentResume.id, jobTitle, jobDesc);
  };

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  if (!currentResume) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto font-sans">
      <div>
        <h2 className="text-xl font-bold">AI Interview Preparation Assistant</h2>
        <p className="text-xs text-textSecondary">Generate custom technical and behavioral interview questions mapped to target roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specifications panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest block">Specifications</h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Java Architect"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl py-3 px-4 text-xs text-textPrimary outline-none transition-all placeholder:text-textSecondary/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Job Description Details (Optional)</label>
                <textarea
                  rows={6}
                  placeholder="Paste details to match technology categories..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl p-3 text-xs text-textPrimary outline-none transition-all placeholder:text-textSecondary/40 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={interviewQuestionsLoading || !jobTitle.trim()}
                className="w-full py-3 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-accentPrimary/25 disabled:opacity-50"
              >
                {interviewQuestionsLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Analyzing Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate Prep Kit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Questions Display Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl min-h-[400px] flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              {interviewQuestionsLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4 py-20 text-center"
                >
                  <Loader2 className="animate-spin text-accentPrimary" size={28} />
                  <p className="text-xs text-textSecondary">AI is mapping experience history to interview patterns...</p>
                </motion.div>
              ) : interviewQuestions.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 w-full"
                >
                  <h3 className="text-sm font-semibold mb-2">Practice Questions</h3>
                  
                  {interviewQuestions.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-bgPrimary border border-borderSubtle/60 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-bgSurfaceHover/30 transition-all"
                      >
                        <div className="flex gap-3 min-w-0">
                          <HelpCircle size={18} className="text-accentPrimary shrink-0 mt-0.5" />
                          <div className="leading-tight space-y-1">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              item.type === 'technical' ? 'text-accentViolet border-accentViolet/20 bg-accentViolet/5' : 'text-brandSuccess border-brandSuccess/20 bg-brandSuccess/5'
                            }`}>
                              {item.type}
                            </span>
                            <p className="text-xs font-semibold text-textPrimary leading-relaxed pt-1">{item.question}</p>
                          </div>
                        </div>
                        {expandedIdx === idx ? <ChevronUp size={16} className="text-textSecondary shrink-0 mt-1" /> : <ChevronDown size={16} className="text-textSecondary shrink-0 mt-1" />}
                      </button>

                      {expandedIdx === idx && (
                        <div className="p-4 border-t border-borderSubtle bg-bgSurface/20 text-xs text-textSecondary leading-relaxed space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-textPrimary">
                            <CheckCircle size={12} className="text-brandSuccess" />
                            <span>Response Strategy Tips:</span>
                          </div>
                          <p>{item.suggestion}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-textSecondary/60 italic text-center py-20"
                >
                  Configure job titles and details on the left to review practice questions.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
