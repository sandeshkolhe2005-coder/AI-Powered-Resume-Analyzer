import React from 'react';
import { useStore } from '../store/useStore';
import { UploadCloud, File, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadResume() {
  const { uploadResume, uploading, uploadError } = useStore();
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    
    // Check extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    const data = await uploadResume(file);
    if (data) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 p-6 flex items-center justify-center min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-bgSurface border border-borderSubtle rounded-2xl p-8 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-textPrimary">Upload Resume Dossier</h2>
          <p className="text-xs text-textSecondary">Upload your PDF or DOCX file to run scoring evaluations</p>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-4 bg-brandDanger/10 border border-brandDanger/30 rounded-xl flex items-start gap-3 text-brandDanger text-xs">
            <AlertTriangle className="shrink-0" size={16} />
            <p className="font-semibold">{uploadError}</p>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all relative ${
            dragActive ? 'dropzone-active border-accentPrimary' : 'border-borderSubtle bg-bgPrimary/20'
          }`}
        >
          <input
            type="file"
            id="file-upload-input"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            disabled={uploading}
          />
          
          <div className="space-y-4 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
              uploading ? 'bg-accentPrimary/10 border-accentPrimary/20 text-accentPrimary animate-pulse' : 'bg-bgSurface border-borderSubtle text-textSecondary'
            }`}>
              {uploading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-semibold text-textPrimary">
                {uploading ? 'Parsing File Content...' : 'Drag & drop file here'}
              </p>
              <p className="text-xs text-textSecondary">
                {uploading ? 'Building Qdrant index and running heuristic scoring...' : 'or click to browse local files'}
              </p>
            </div>
            
            <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary/60 px-2.5 py-1 bg-bgPrimary border border-borderSubtle rounded-md">
              PDF, DOCX up to 10MB
            </span>
          </div>
        </div>

        {/* Selected File Card / Progress State */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-bgPrimary border border-borderSubtle p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-bgSurface border border-borderSubtle flex items-center justify-center text-accentPrimary">
                  <File size={18} />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-semibold text-textPrimary truncate max-w-[280px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-textSecondary">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {uploading && (
                  <span className="text-[10px] text-accentPrimary font-semibold flex items-center gap-1.5 animate-pulse bg-accentPrimary/10 border border-accentPrimary/20 px-2 py-0.5 rounded">
                    <Loader2 size={10} className="animate-spin" />
                    Parsing
                  </span>
                )}
                {success && (
                  <span className="text-[10px] text-brandSuccess font-semibold flex items-center gap-1 bg-brandSuccess/10 border border-brandSuccess/20 px-2 py-0.5 rounded">
                    <Check size={10} />
                    Done
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
