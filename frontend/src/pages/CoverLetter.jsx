import React from 'react';
import { useStore } from '../store/useStore';
import { FileEdit, Check, Copy, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoverLetter() {
  const { currentResume, generateCoverLetter, coverLetter, coverLetterLoading } = useStore();
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDesc, setJobDesc] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!currentResume || !jobTitle.trim()) return;
    await generateCoverLetter(currentResume.id, jobTitle, jobDesc);
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!currentResume) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto font-sans">
      <div>
        <h2 className="text-xl font-bold">Cover Letter Generator</h2>
        <p className="text-xs text-textSecondary">Draft role-specific matching cover letters based on your active resume credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form parameters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest block">Specifications</h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer"
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
                  placeholder="Paste details to align accomplishments..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl p-3 text-xs text-textPrimary outline-none transition-all placeholder:text-textSecondary/40 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={coverLetterLoading || !jobTitle.trim()}
                className="w-full py-3 bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-accentPrimary/25 disabled:opacity-50"
              >
                {coverLetterLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Writing Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate Letter</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Generated Letter Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bgSurface border border-borderSubtle p-6 rounded-2xl flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-4 mb-4 shrink-0">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileEdit size={16} className="text-accentViolet" />
                <span>Generated Cover Letter</span>
              </h3>
              {coverLetter && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-white px-3 py-1.5 rounded-lg border border-borderSubtle hover:bg-bgSurfaceHover transition-all"
                >
                  {copied ? <Check size={14} className="text-brandSuccess" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {coverLetterLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center space-y-4 py-20"
                  >
                    <Loader2 className="animate-spin text-accentPrimary" size={28} />
                    <p className="text-xs text-textSecondary">AI is drafting cover letter content...</p>
                  </motion.div>
                ) : coverLetter ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-bgPrimary border border-borderSubtle/60 p-6 rounded-xl overflow-y-auto font-sans text-xs text-textSecondary leading-relaxed whitespace-pre-wrap text-left h-96"
                  >
                    {coverLetter.content}
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-textSecondary/60 italic text-center py-20"
                  >
                    Specify job title parameters to generate tailored documents.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
