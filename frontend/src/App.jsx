import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobMatcher from './pages/JobMatcher';
import AIChat from './pages/AIChat';
import CoverLetter from './pages/CoverLetter';
import Interview from './pages/Interview';
import Solutions from './pages/Solutions';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';

// Protected Route Guard
function ProtectedLayout() {
  const { isAuthenticated, checkAuth, fetchResumes } = useStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated, fetchResumes]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bgPrimary text-textPrimary font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Public Route Guard (Redirect authenticated users away from auth pages)
function PublicLayout() {
  const { isAuthenticated, checkAuth } = useStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Brand Info */}
        <Route path="/" element={<Home />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Guest Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated Dashboard Panel */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/analysis" element={<ResumeAnalysis />} />
          <Route path="/matcher" element={<JobMatcher />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/interview" element={<Interview />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
