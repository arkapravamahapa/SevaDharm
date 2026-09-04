import React from 'react';
import { 
  ArrowLeft, CheckCircle2, Youtube, Facebook, Instagram, Linkedin, 
  Mail, TrendingUp, Users, Activity, PieChart, 
  Globe2, PlayCircle, BarChart3, MapPin
} from 'lucide-react';

interface MrCologistCornerProps {
  onBack: () => void;
}

export default function MrCologistCorner({ onBack }: MrCologistCornerProps) {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 font-sans text-neutral-800">
      
      {/* Header Navigation */}
      <div className="bg-white border-b border-neutral-100 px-6 md:px-12 py-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-orange-50 hover:bg-orange-100 text-brand rounded-2xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest block mb-1">Official Media Kit</span>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">Mr. Cologist Corner</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto mt-12 space-y-10">
        
        {/* 1. INTRO & NICHE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Profile & About */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-orange-200 to-orange-100 p-8 md:w-2/5 flex flex-col items-center justify-center relative text-center">
              <div className="relative w-32 h-32 mx-auto bg-white rounded-full p-1.5 mb-5 shadow-xl">
                <img 
                  src="/mr-cologist.jpg" 
                  alt="Mr.Cologist" 
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-2 right-2 bg-brand rounded-full p-1 border-2 border-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Mr.Cologist</h3>
              <p className="text-brand font-bold text-[10px] uppercase tracking-widest mt-1">
                Medical Awareness Content Creator
              </p>

              {/* Direct Top Social Buttons */}
              <div className="flex items-center justify-center gap-2.5 mt-5">
                <a href="https://youtube.com/@mrcologist?si=DeOxSCnpSDgasgBS" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm hover:scale-110 hover:shadow-md transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/mr.cologist?igsi=ZnJyZ2tpcWInOXZk" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm hover:scale-110 hover:shadow-md transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/share/19V4YZU8L1/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 hover:shadow-md transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/himel-mr-cologist-909599379" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sky-600 shadow-sm hover:scale-110 hover:shadow-md transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="p-8 md:w-3/5 flex flex-col justify-center space-y-6">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-brand mb-3">My Intro & Mission</h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  <strong className="text-neutral-900">MR. COLOGIST</strong> is a medical educator and science content creator who makes complex healthcare topics simple through high-quality 3D animations, evidence-based explanations, and engaging storytelling.
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  The content covers human anatomy, diseases, surgical procedures, diagnostic techniques, medical equipment, and the latest medical devices used in modern healthcare.
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed italic border-l-2 border-brand pl-3">
                  The mission of MR. COLOGIST is to bridge the gap between medical science and the public by making healthcare education accessible, trustworthy, and fascinating for millions of people around the world.
                </p>
              </div>

              {/* Subscriber Stats Grid */}
              <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-4">
                <div className="text-center">
                  <span className="block font-black text-lg text-neutral-900">120k+</span>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Subscribers</span>
                </div>
                <div className="text-center border-l border-neutral-100">
                  <span className="block font-black text-lg text-neutral-900">250k+</span>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Followers</span>
                </div>
                <div className="text-center border-l border-neutral-100">
                  <span className="block font-black text-lg text-neutral-900">90k+</span>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Niche Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 flex flex-col justify-center">
            <h4 className="text-sm font-black uppercase tracking-widest text-brand mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Content Niche
            </h4>
            <p className="text-xs text-neutral-500 italic mb-6">
              *My Core Niche is Based on Surgical Videos and Medical Awareness
            </p>
            
            <div className="space-y-5">
              {[
                { label: 'Surgery Videos', pct: 40.7, color: 'bg-orange-800' },
                { label: 'Medical Awareness', pct: 33.3, color: 'bg-orange-600' },
                { label: 'Mechanism of Drugs', pct: 14.8, color: 'bg-orange-400' },
                { label: 'Medical Device Mechanism', pct: 11.1, color: 'bg-orange-200' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-neutral-700 uppercase tracking-wider">{item.label}</span>
                    <span className="text-neutral-900">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 2. DEMOGRAPHICS SECTION */}
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand mb-8 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <BarChart3 className="w-5 h-5" /> Audience Demographics
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Gender */}
            <div className="space-y-4">
              <h5 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Gender</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1"><span className="text-neutral-700">Male</span><span>79.9%</span></div>
                  <div className="w-full bg-neutral-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '79.9%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1"><span className="text-neutral-700">Female</span><span>20.1%</span></div>
                  <div className="w-full bg-neutral-100 rounded-full h-2"><div className="bg-pink-400 h-2 rounded-full" style={{ width: '20.1%' }}></div></div>
                </div>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-4">
              <h5 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Age</h5>
              <div className="space-y-2.5">
                {[
                  { range: '18-24', pct: 13.4 },
                  { range: '25-34', pct: 41.7 },
                  { range: '35-44', pct: 30.7 },
                  { range: '45-54', pct: 10.5 },
                  { range: '55-64', pct: 2.7 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-bold mb-1"><span className="text-neutral-600">{item.range}</span><span>{item.pct}%</span></div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5"><div className="bg-brand h-1.5 rounded-full" style={{ width: `${item.pct}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="space-y-4">
              <h5 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5"/> Countries</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1"><span className="text-neutral-700">India</span><span>95.2%</span></div>
                  <div className="w-full bg-neutral-100 rounded-full h-2"><div className="bg-brand h-2 rounded-full" style={{ width: '95.2%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1"><span className="text-neutral-700">Pakistan</span><span>3.0%</span></div>
                  <div className="w-full bg-neutral-100 rounded-full h-2"><div className="bg-orange-300 h-2 rounded-full" style={{ width: '3.0%' }}></div></div>
                </div>
              </div>
            </div>

            {/* Cities */}
            <div className="space-y-4">
              <h5 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Top Cities</h5>
              <div className="space-y-2.5">
                {[
                  { name: 'Delhi', pct: 35.1 },
                  { name: 'Mumbai', pct: 23.9 },
                  { name: 'Amedabad', pct: 18.7 },
                  { name: 'Surat', pct: 11.2 },
                  { name: 'Pune', pct: 11.2 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-bold mb-1"><span className="text-neutral-600">{item.name}</span><span>{item.pct}%</span></div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${item.pct}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3. BEST CONTENTS (REELS GRID - CLICKABLE) */}
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand mb-8 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <PlayCircle className="w-5 h-5" /> Best Contents
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Angioplasty Reel", views: "15M+ views", img: "/reel-angioplasty.jpg", url: "https://www.instagram.com/reel/DWbg6Kdj5xK/?igsi=MTloY2h3MDNrczA3cw==" },
              { title: "Biopsy Reel", views: "8M+ views", img: "/reel-biopsy.jpg", url: "https://www.instagram.com/reel/DV3dvHsDDG5/?igsi=MWNucWt1Yms2MWVrbQ==" },
              { title: "Brain Clot Surgery Reel", views: "6M+ views", img: "/reel-brain clot surgery.jpg", url: "https://www.instagram.com/reel/DULUVMZDlE0/?igsi=NzZ4ejcwdmI4NXpq" },
              { title: "Blood group Reel", views: "5M+ views", img: "/reel-bloodgroup.jpg", url: "https://www.instagram.com/reel/DYCgl83ABa4/?igsi=NzJpeTJuZ2RmdXVw" },
              { title: "Heart surgery Reel", views: "2M+ views", img: "/reel-heart.jpg", url: "https://www.instagram.com/reel/DT0Mj-3iK18/?igsi=cGhvcDdycDcwNjI5" },
              { title: "Skin Burn Reel", views: "2M+ views", img: "/reel-skinburn.jpg", url: "https://www.instagram.com/reel/DWTyc4qlLat/?igsi=dTdpNzRydzNrMzNo" }
            ].map((reel, idx) => (
              <a 
                key={idx} 
                href={reel.url}
                target="_blank" 
                rel="noreferrer" 
                className="relative rounded-2xl overflow-hidden border border-neutral-200 group bg-neutral-900 aspect-[4/5] block cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 -z-10"></div>
                <img 
                  src={reel.img} 
                  alt={reel.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-transparent transition-colors">
                  <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white transition-colors drop-shadow-md" />
                </div>

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="bg-white/95 backdrop-blur text-brand text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                    {reel.title}
                  </span>
                </div>

                {/* MORE PROMINENT VIEWS PILL */}
                <div className="absolute bottom-4 right-4 group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-brand text-white text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-[0_8px_20px_rgba(224,90,16,0.3)] border border-white/20">
                    <TrendingUp className="w-4 h-4" />
                    {reel.views}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 4. INFLUENCER IMPACT & CONTACT */}
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-[2rem] border border-orange-200 p-8 md:p-12 shadow-sm">
            <h3 className="text-4xl font-black text-brand italic tracking-tighter mb-10 text-center" style={{ fontFamily: 'Georgia, serif' }}>
              Influencer Impact
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-orange-100 hover:-translate-y-1 transition-transform">
                <h4 className="text-3xl font-black text-brand">450k+</h4>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 font-bold">Followers</p>
              </div>
              <div className="bg-brand p-6 rounded-2xl text-center shadow-md hover:-translate-y-1 transition-transform">
                <h4 className="text-3xl font-black text-white">500K</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/80 mt-1 font-bold">Average Reach</p>
              </div>
              <div className="bg-brand p-6 rounded-2xl text-center shadow-md hover:-translate-y-1 transition-transform">
                <h4 className="text-3xl font-black text-white">34%</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/80 mt-1 font-bold">Engagement Rate</p>
              </div>
              <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-orange-100 hover:-translate-y-1 transition-transform">
                <h4 className="text-3xl font-black text-brand">4k</h4>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 font-bold">Average Likes</p>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <a 
                href="mailto:himelbhaktal5@gmail.com" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-full text-brand font-black uppercase tracking-widest shadow-md hover:shadow-lg hover:scale-105 transition-all border border-orange-100"
              >
                <Mail className="w-5 h-5" />
                himelbhaktal5@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}