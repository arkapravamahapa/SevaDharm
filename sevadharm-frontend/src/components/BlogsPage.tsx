import React from 'react';
import { motion, Variants } from 'motion/react'; // 1. Added Variants import
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { BLOGS } from '../data';

interface BlogsPageProps {
  onBack: () => void;
  onArticleClick: (id: string) => void;
}

export default function BlogsPage({ onBack, onArticleClick }: BlogsPageProps) {

  // 2. Explicitly type the object as Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // 3. Explicitly type the object as Variants to fix the TypeScript error
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-6 md:px-12 py-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 rounded-2xl transition-all"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest block mb-1">SevaDharam Health Journal</span>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">Health & Wellness Blog</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mt-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {BLOGS.map(blog => (
            <motion.div
              key={blog.id}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.15)' }}
              onClick={() => onArticleClick(blog.id)}
              className="bg-white border border-neutral-200 hover:border-brand rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className="relative overflow-hidden h-48 bg-neutral-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-white">
                  <span className="text-[9px] font-mono font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-brand" /> Article
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{blog.author}</span>
                  </div>
                </div>

                <h4 className="font-bold text-base text-neutral-900 leading-snug uppercase tracking-wider mb-3 group-hover:text-brand transition-colors line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed flex-1 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-100 text-[10px] font-bold text-neutral-400 group-hover:text-brand uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Full Article <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}