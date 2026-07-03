import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, AlertTriangle, Loader2, Check } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function Register() {
  const { register, verifyCode, resendCode, authLoading, authError } = useStore();
  const [success, setSuccess] = React.useState(false);
  const [showVerification, setShowVerification] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState('');
  const [verificationSuccess, setVerificationSuccess] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [infoMessage, setInfoMessage] = React.useState('');
  const navigate = useNavigate();

  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data) => {
    setRegisteredEmail(data.email);
    const ok = await register(data.email, data.password);
    if (ok) {
      setShowVerification(true);
    }
  };

  const onVerifySubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeError('Verification code must be exactly 6 digits');
      return;
    }
    setCodeError('');
    const ok = await verifyCode(registeredEmail, code);
    if (ok) {
      setVerificationSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const onResendClick = async () => {
    setInfoMessage('');
    const ok = await resendCode(registeredEmail);
    if (ok) {
      setInfoMessage('Verification code resent successfully! Check your console/logs.');
      setTimeout(() => setInfoMessage(''), 4500);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentPrimary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentViolet/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-bgSurface border border-borderSubtle rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg">
                V
              </div>
              <span className="font-bold text-textPrimary tracking-wide">Email Verification</span>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary">Verify Your Email</h2>
            <p className="text-xs text-textSecondary leading-relaxed">
              We've generated a 6-digit verification code for <span className="font-semibold text-textPrimary">{registeredEmail}</span>. Please enter it below.
            </p>
          </div>

          {/* Success Banner */}
          {verificationSuccess && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-brandSuccess/10 border border-brandSuccess/30 rounded-xl flex items-center gap-3 text-brandSuccess text-xs"
            >
              <Check className="shrink-0" size={16} />
              <p className="font-semibold">Email verified successfully! Redirecting to login...</p>
            </motion.div>
          )}

          {/* Info Banner */}
          {infoMessage && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-accentPrimary/10 border border-accentPrimary/30 rounded-xl flex items-center gap-3 text-accentPrimary text-xs"
            >
              <Check className="shrink-0" size={16} />
              <p className="font-semibold">{infoMessage}</p>
            </motion.div>
          )}

          {/* Global/Code Error Banner */}
          {(authError || codeError) && !verificationSuccess && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-brandDanger/10 border border-brandDanger/30 rounded-xl flex items-start gap-3 text-brandDanger text-xs"
            >
              <AlertTriangle className="shrink-0" size={16} />
              <p className="leading-relaxed font-semibold">{authError || codeError}</p>
            </motion.div>
          )}

          <form onSubmit={onVerifySubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block text-center">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-bgPrimary border border-borderSubtle focus:border-accentPrimary rounded-xl py-4 text-center text-2xl font-bold tracking-[0.75em] text-textPrimary outline-none transition-all placeholder:text-textSecondary/20 placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={authLoading || verificationSuccess}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-sm transition-all shadow-md shadow-accentPrimary/25 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Confirm & Verify</span>
              )}
            </motion.button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-6">
            <button 
              type="button" 
              onClick={onResendClick} 
              disabled={authLoading || verificationSuccess}
              className="text-xs text-accentPrimary hover:underline font-semibold disabled:opacity-50 disabled:pointer-events-none"
            >
              Resend verification code
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowVerification(false);
                setCode('');
              }} 
              disabled={authLoading || verificationSuccess}
              className="text-xs text-textSecondary hover:underline font-medium"
            >
              Back to Sign Up
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentPrimary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentViolet/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-bgSurface border border-borderSubtle rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg">
              R
            </div>
            <span className="font-bold text-textPrimary tracking-wide">AI Resume Analyzer</span>
          </Link>
          <h2 className="text-2xl font-bold text-textPrimary">Create Account</h2>
          <p className="text-xs text-textSecondary">Initialize your career profiling environment</p>
        </div>

        {/* Success Banner */}
        {success && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-4 bg-brandSuccess/10 border border-brandSuccess/30 rounded-xl flex items-center gap-3 text-brandSuccess text-xs"
          >
            <Check className="shrink-0" size={16} />
            <p className="font-semibold">Registration successful! Redirecting to login...</p>
          </motion.div>
        )}

        {/* Global Error Banner */}
        {authError && !success && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-4 bg-brandDanger/10 border border-brandDanger/30 rounded-xl flex items-start gap-3 text-brandDanger text-xs"
          >
            <AlertTriangle className="shrink-0" size={16} />
            <p className="leading-relaxed font-semibold">{authError}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
              <input
                type="email"
                placeholder="developer@example.com"
                {...registerField('email')}
                className={`w-full bg-bgPrimary border ${
                  errors.email ? 'border-brandDanger' : 'border-borderSubtle focus:border-accentPrimary'
                } rounded-xl py-3 pl-11 pr-4 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40`}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] font-semibold text-brandDanger block pl-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                {...registerField('password')}
                className={`w-full bg-bgPrimary border ${
                  errors.password ? 'border-brandDanger' : 'border-borderSubtle focus:border-accentPrimary'
                } rounded-xl py-3 pl-11 pr-4 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40`}
              />
            </div>
            {errors.password && (
              <span className="text-[10px] font-semibold text-brandDanger block pl-1">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                {...registerField('confirmPassword')}
                className={`w-full bg-bgPrimary border ${
                  errors.confirmPassword ? 'border-brandDanger' : 'border-borderSubtle focus:border-accentPrimary'
                } rounded-xl py-3 pl-11 pr-4 text-sm text-textPrimary outline-none transition-all placeholder:text-textSecondary/40`}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] font-semibold text-brandDanger block pl-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={authLoading || success}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accentPrimary to-accentViolet text-white font-semibold text-sm transition-all shadow-md shadow-accentPrimary/25 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Registering Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-textSecondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accentPrimary hover:underline font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
