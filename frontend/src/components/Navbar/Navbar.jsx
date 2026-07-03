import React from 'react';
import { useStore } from '../../store/useStore';
import { FileText, RefreshCw, Upload, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { currentResume, reportLoading } = useStore();

  return (
    <header className="bg-bgSurface/40 backdrop-blur-md border-b border-borderSubtle px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Title page descriptor */}
        <h1 className="text-lg font-semibold text-textPrimary tracking-tight">
          Control Panel
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {currentResume ? (
          <div className="flex items-center gap-3 bg-bgSurface/90 border border-borderSubtle px-3.5 py-1.5 rounded-xl">
            <FileText size={16} className="text-accentPrimary" />
            <div className="text-left leading-none">
              <span className="text-[11px] text-textSecondary block">Active Resume</span>
              <span className="text-xs font-semibold text-textPrimary max-w-[150px] truncate block">
                {currentResume.filename}
              </span>
            </div>
            {currentResume.status === 'Processing' || currentResume.status === 'Pending' ? (
              <span className="flex items-center gap-1.5 text-brandWarning bg-brandWarning/10 text-[10px] px-2 py-0.5 rounded font-medium ml-2 animate-pulse">
                <RefreshCw size={10} className="animate-spin" />
                Parsing
              </span>
            ) : currentResume.status === 'Failed' ? (
              <span className="flex items-center gap-1.5 text-brandDanger bg-brandDanger/10 text-[10px] px-2 py-0.5 rounded font-medium ml-2">
                <ShieldAlert size={10} />
                Failed
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-brandSuccess ml-2" title="Analysis Complete" />
            )}
          </div>
        ) : (
          <Link 
            to="/upload"
            className="flex items-center gap-2 text-xs font-medium text-textSecondary hover:text-white bg-bgSurfaceHover hover:bg-borderSubtle px-3 py-1.5 rounded-xl border border-borderSubtle transition-all"
          >
            <Upload size={14} />
            <span>Select a resume context</span>
          </Link>
        )}
      </div>
    </header>
  );
}
