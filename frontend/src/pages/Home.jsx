import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Custom CountUp Hook
function useCountUp(target, duration = 2000, delay = 1200) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = target;
    const startTime = setTimeout(() => {
      const animStart = performance.now();
      const update = (now) => {
        const elapsed = now - animStart;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic: f(t) = 1 - (1 - t)^3
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeProgress * end));
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    }, delay);
    return () => clearTimeout(startTime);
  }, [target, duration, delay]);
  return count;
}

// Typewriter Heading Component
function TypewriterHeading({ text, speed = 35, delay = 400, onComplete }) {
  const [index, setIndex] = React.useState(0);
  const onCompleteRef = React.useRef(onComplete);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    setIndex(0);
    let interval;
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            if (onCompleteRef.current) onCompleteRef.current();
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  const displayedText = text.slice(0, index);
  const isFinished = index >= text.length;

  return (
    <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold leading-tight sm:leading-[60px] tracking-[-1.5px] font-urbanist relative text-left">
      {displayedText.split('').map((char, idx) => {
        // Color first 65 characters white, rest vibrant purple
        const isFirstPart = idx < 65;
        return (
          <span 
            key={idx} 
            className="transition-colors duration-200"
            style={{ color: isFirstPart ? '#ffffff' : '#A068FF' }}
          >
            {char}
          </span>
        );
      })}
      {!isFinished && (
        <span className="inline-block w-[3px] h-[36px] sm:h-[48px] bg-[#A068FF] ml-1 animate-pulse align-middle" />
      )}
    </h2>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [typingComplete, setTypingComplete] = React.useState(false);
  const count = useCountUp(20, 2000, 1200);

  const headerNav = [
    { name: "Solutions", to: "/solutions" },
    { name: "Blog", to: "/blog" },
    { name: "Pricing", to: "/pricing" }
  ];

  const partnerLogos = [
    "https://polo-pecan-73837341.figma.site/_assets/v11/1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/3eac03c183db2ae080d910159211c14843398b61.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/17705a4c0023a0e5a99154dfb10582adbbf4260b.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/0e5f442b09dc5c248e3e60d40a65505fb1887228.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/63f99030ceb459e3c9ab9e429cfa2353491d3816.svg",
  ];

  // Repeat logos 4 times for a seamless loop ticker
  const tickerLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];

  // Concentric avatar definitions
  const avatars = [
    {
      orbit: 1,
      angle: 270,
      radius: 177,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/aa51718fb3af3637e6d666b6543fc27a175fada6.png",
      glow: "shadow-[0_0_15px_rgba(160,104,255,0.4)]",
      shape: "rounded-[20px]",
      size: 58,
      delay: 0.6
    },
    {
      orbit: 2,
      angle: 60,
      radius: 251,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png",
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.4)]",
      shape: "rounded-full",
      size: 58,
      delay: 0.8
    },
    {
      orbit: 2,
      angle: 180,
      radius: 251,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/dc01064c7093dcc32674876ee3cf5e41c4a485c6.png",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      shape: "rounded-full",
      size: 78,
      delay: 1.0
    },
    {
      orbit: 2,
      angle: 300,
      radius: 251,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/d5470a58b02388336141575048720f19a50de832.png",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      shape: "rounded-[20px]",
      size: 58,
      delay: 1.2
    },
    {
      orbit: 3,
      angle: 130,
      radius: 325,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      shape: "rounded-full",
      size: 88,
      delay: 1.5
    },
    {
      orbit: 4,
      angle: 30,
      radius: 399,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/c76d8a0b99676de31c014344bfaf75bad090758d.png",
      glow: "shadow-[0_0_15px_rgba(160,104,255,0.4)]",
      shape: "rounded-full",
      size: 58,
      delay: 1.7
    },
    {
      orbit: 4,
      angle: 95,
      radius: 399,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
      shape: "rounded-[24px]",
      size: 88,
      delay: 1.9
    },
    {
      orbit: 4,
      angle: 220,
      radius: 399,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/9ae171d8895199349755c43fbff00e122221a027.png",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      shape: "rounded-[24px]",
      size: 88,
      delay: 2.1
    },
    {
      orbit: 4,
      angle: 320,
      radius: 399,
      src: "https://polo-pecan-73837341.figma.site/_assets/v11/926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png",
      glow: "shadow-[0_0_15px_rgba(160,104,255,0.4)]",
      shape: "rounded-full",
      size: 58,
      delay: 2.3
    }
  ];

  return (
    <div 
      className="min-h-screen text-textPrimary flex flex-col justify-between overflow-x-hidden relative font-sans"
      style={{
        background: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_111401_56af5012-2263-45d3-849a-8688084d7c2a.png&w=1280&q=85') center center / cover no-repeat`
      }}
    >
      {/* 1. Header (Fade Down entrance animation) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1920px] mx-auto px-6 lg:px-16 py-6 flex items-center justify-between z-10 shrink-0"
      >
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg shadow-accentPrimary/25 text-sm">
              R
            </div>
            <span className="font-bold text-textPrimary text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary to-accentViolet font-sans">
              ATS ANALYZER
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {headerNav.map((item) => (
              <Link 
                key={item.name} 
                to={item.to} 
                className="text-white text-[15px] font-medium nav-underline nav-underline-white hover:text-white/80 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-white text-[15px] font-medium nav-underline nav-underline-white transition-colors"
          >
            Log In
          </Link>
          <div className="btn-border-wrap">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-[#000000] text-white text-[15px] font-medium rounded-[50px] btn-hover-fill outline-none relative cursor-pointer"
            >
              Join Now
            </button>
          </div>
        </div>
      </motion.header>

      {/* 2. Hero Center Viewport Layout */}
      <div className="max-w-[1920px] mx-auto w-full px-6 lg:px-16 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 py-10 z-10">
        
        {/* Left Side: Typewriter + CTAs (Fade Up entrance) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 max-w-[620px] space-y-6 shrink-0 z-20"
        >
          <TypewriterHeading 
            text="Unlock Top Resume Scoring Talent You Thought Was Out of Reach -- Now Just One Click Away!"
            speed={35}
            delay={400}
            onComplete={() => setTypingComplete(true)}
          />

          {/* Start scan button triggered after typing completes */}
          <div className="min-h-[64px] flex flex-col justify-start">
            <AnimatePresence>
              {typingComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col space-y-4"
                >
                  <div className="btn-border-wrap w-fit">
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-3.5 bg-[#060218] text-white font-semibold text-base rounded-[50px] btn-hover-fill-right flex items-center gap-2.5 outline-none relative cursor-pointer"
                    >
                      <span>Start Scanning</span>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                        <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Floating pointer badge (David) appearing shortly after */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex items-center gap-2 ml-[180px] sm:ml-[260px] mt-2 select-none pointer-events-none"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M4 3L11.5 21L14.5 13.5L22 10.5L4 3Z" fill="#7C5CFF" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    <span className="bg-[#7C5CFF] text-white text-[14px] font-semibold py-1.5 px-4 rounded-[20px] shadow-lg shadow-accentViolet/30">
                      David - Resume Scanned
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Concentric Orbits (Scale In entrance) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex justify-center items-center select-none"
        >
          {/* Orbits Container (720x720 scaled relatively at mobile breakpoints) */}
          <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[720px] lg:h-[720px] relative scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform">
            
            {/* Orbit 4 (Outermost: spins counterclockwise 60s) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[797px] h-[797px] rounded-full border border-dashed border-accentViolet/20 animate-spin-counter-60 pointer-events-none">
              {avatars.filter(a => a.orbit === 4).map((av, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${av.angle}deg) translate(399px) rotate(-${av.angle}deg)`
                  }}
                >
                  <motion.img
                    initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: av.delay }}
                    src={av.src}
                    alt="Orbit Avatar"
                    className={`${av.shape} ${av.glow} object-cover`}
                    style={{ width: `${av.size}px`, height: `${av.size}px` }}
                  />
                </div>
              ))}
            </div>

            {/* Orbit 3 (Spins clockwise 50s) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[649px] h-[649px] rounded-full border border-dashed border-accentViolet/20 animate-spin-clockwise-50 pointer-events-none">
              {avatars.filter(a => a.orbit === 3).map((av, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${av.angle}deg) translate(325px) rotate(-${av.angle}deg)`
                  }}
                >
                  <motion.img
                    initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: av.delay }}
                    src={av.src}
                    alt="Orbit Avatar"
                    className={`${av.shape} ${av.glow} object-cover`}
                    style={{ width: `${av.size}px`, height: `${av.size}px` }}
                  />
                </div>
              ))}
            </div>

            {/* Orbit 2 (Spins clockwise 40s) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[501px] h-[501px] rounded-full border border-dashed border-accentViolet/20 animate-spin-clockwise-40 pointer-events-none">
              {avatars.filter(a => a.orbit === 2).map((av, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${av.angle}deg) translate(251px) rotate(-${av.angle}deg)`
                  }}
                >
                  <motion.img
                    initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: av.delay }}
                    src={av.src}
                    alt="Orbit Avatar"
                    className={`${av.shape} ${av.glow} object-cover`}
                    style={{ width: `${av.size}px`, height: `${av.size}px` }}
                  />
                </div>
              ))}
            </div>

            {/* Orbit 1 (Innermost: spins counterclockwise 30s) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[353px] h-[353px] rounded-full border border-dashed border-accentViolet/25 animate-spin-counter-30 pointer-events-none">
              {avatars.filter(a => a.orbit === 1).map((av, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${av.angle}deg) translate(177px) rotate(-${av.angle}deg)`
                  }}
                >
                  <motion.img
                    initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: av.delay }}
                    src={av.src}
                    alt="Orbit Avatar"
                    className={`${av.shape} ${av.glow} object-cover`}
                    style={{ width: `${av.size}px`, height: `${av.size}px` }}
                  />
                </div>
              ))}
            </div>

            {/* Center counter-rotating core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-bgPrimary/95 border-2 border-accentViolet/30 rounded-full flex flex-col items-center justify-center shadow-2xl text-center leading-none z-30">
              <span className="text-[44px] font-bold font-urbanist text-white tracking-tight leading-none mb-1">
                {count}k+
              </span>
              <span className="text-[11px] font-semibold text-textSecondary uppercase tracking-widest leading-none font-urbanist">
                Scans Done
              </span>
            </div>
            
          </div>
        </motion.div>
      </div>

      {/* 3. Logo Ticker Strip (Fade Up entrance) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-[#03010b]/60 border-t border-borderSubtle/60 py-6 z-10 overflow-hidden relative shrink-0"
        style={{
          maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, rgba(0, 0, 0, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, rgba(0, 0, 0, 0) 100%)'
        }}
      >
        <div className="flex w-max animate-ticker gap-16 items-center">
          {tickerLogos.map((logoUrl, index) => (
            <img 
              key={index} 
              src={logoUrl} 
              alt="Partner Logo" 
              className="w-[137px] h-10 object-contain brightness-0 invert opacity-60 hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
