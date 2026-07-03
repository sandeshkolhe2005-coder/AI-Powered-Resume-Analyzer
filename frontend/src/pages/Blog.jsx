import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ArrowRight, Terminal } from 'lucide-react';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Blog() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const posts = [
    {
      id: "ARTICLE_01",
      title: "Demystifying the ATS: Technical Screen Parsing Protocols",
      summary: "An in-depth breakdown of standard corporate applicant parsing algorithms, regex parsing pipelines, formatting validation filters, and how resumes are converted to plain database strings.",
      date: "JUNE 28, 2026",
      readTime: "05 MIN READ",
      category: "PARSER_HEURISTICS",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80",
      glow: "group-hover:shadow-[0_0_30px_rgba(124,92,255,0.15)] group-hover:border-accentViolet/40"
    },
    {
      id: "ARTICLE_02",
      title: "Strong Action Verbs: Quantified Performance Statements",
      summary: "Stop detailing job duties and start listing concrete business metrics. Learn to restructure accomplishments using high-impact action verbs aligned with modern AI validation checkers.",
      date: "JUNE 15, 2026",
      readTime: "04 MIN READ",
      category: "COPY_WRITING_AI",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
      glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] group-hover:border-brandSuccess/40"
    },
    {
      id: "ARTICLE_03",
      title: "Vector Embeddings & Semantic Search in Hiring Markets",
      summary: "How modern recruit database platforms use cosine similarity distance calculations and vector databases (like Qdrant) to rank candidate compatibility without simple keyword matches.",
      date: "MAY 22, 2026",
      readTime: "06 MIN READ",
      category: "SEMANTIC_INDEX",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
      glow: "group-hover:shadow-[0_0_30px_rgba(91,140,255,0.15)] group-hover:border-accentPrimary/40"
    }
  ];

  return (
    <div className="min-h-screen text-textPrimary flex flex-col justify-between overflow-x-hidden relative font-sans bg-black">
      {/* Background HLS Video */}
      <BackgroundVideo />

      {/* 3D Perspective Scrolling Landscape Grid */}
      <div className="perspective-container">
        <div className="grid-3d" />
      </div>

      {/* Floating 3D Holographic Gyroscope */}
      <div className="absolute top-[8%] right-[8%] hidden lg:block pointer-events-none">
        <div className="rings-3d-container">
          <div className="ring-3d-element ring-3d-1" />
          <div className="ring-3d-element ring-3d-2" />
          <div className="ring-3d-element ring-3d-3" />
        </div>
      </div>

      {/* Dynamic Animated Background Glows */}
      <motion.div 
        animate={{ 
          x: [0, 80, -40, 0], 
          y: [0, 120, 60, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 22, 
          ease: "easeInOut" 
        }}
        className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-accentPrimary/5 rounded-full blur-[130px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 60, 0], 
          y: [0, -80, 110, 0],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 26, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-accentViolet/5 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Header */}
      <header className="w-full max-w-[1920px] mx-auto px-6 lg:px-16 py-6 flex items-center justify-between z-10 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg shadow-accentPrimary/20">
            R
          </div>
          <span className="font-bold text-textPrimary tracking-wide text-lg">AI Resume Analyzer</span>
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs text-textSecondary hover:text-white px-4 py-2 rounded-xl border border-borderSubtle bg-[#0c0d12]/60 hover:bg-bgSurfaceHover transition-all shadow-md"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 flex flex-col space-y-16 z-10">
        
        {/* Banner Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0c0d12]/80 border border-borderSubtle/60 px-4 py-2 rounded-full text-xs font-semibold text-accentViolet tracking-widest font-mono uppercase shadow-lg">
            <Terminal size={12} className="text-accentPrimary" />
            <span>[ RESOURCE_DATABASE: INSIGHT_LOG ]</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-urbanist text-white leading-tight">
            System Insights &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary to-accentViolet">
              Documentation
            </span>
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Stay aligned with parsing logic changes, applicant algorithms, and semantic classification rules.
          </p>
        </div>

        {/* High Tech Blog Post Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {posts.map((post, idx) => (
            <motion.article
              variants={cardVariants}
              key={idx}
              className="group relative bg-[#13151b]/80 border border-borderSubtle rounded-2xl overflow-hidden flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 backdrop-blur-md"
            >
              {/* Glow border overlay */}
              <div className={`absolute inset-0 rounded-2xl border border-transparent transition-all duration-300 pointer-events-none ${post.glow}`} />

              <div>
                {/* Image block with high-tech classification tags overlay */}
                <div className="h-48 w-full overflow-hidden relative bg-bgPrimary border-b border-borderSubtle/60">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />
                  <div className="absolute top-4 left-4 bg-bgPrimary/95 border border-borderSubtle/80 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md text-accentPrimary font-mono">
                    // {post.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-bgPrimary/90 border border-borderSubtle/60 text-[9px] font-mono text-textSecondary px-2 py-0.5 rounded">
                    {post.id}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-[10px] text-textSecondary/70 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-accentViolet" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-accentPrimary" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-accentViolet transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-textSecondary leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="p-6 pt-0 mt-2">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accentPrimary group-hover:text-white transition-colors"
                >
                  <span>EXECUTE_QUERY_CONNECTION</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderSubtle py-6 bg-[#060218]/80 text-center text-textSecondary text-xs z-10">
        &copy; {new Date().getFullYear()} AI Resume Analyzer. Production-Grade Portfolio Systems.
      </footer>
    </div>
  );
}
