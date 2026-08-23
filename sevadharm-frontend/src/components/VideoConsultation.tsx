import React from 'react';
import { Video, Calendar, ArrowLeft } from 'lucide-react';

interface VideoConsultationProps {
  roomUrl: string;
  onLeaveCall: () => void;
}

export default function VideoConsultation({ roomUrl, onLeaveCall }: VideoConsultationProps) {
  // Helper to generate a Google Calendar link for 1-month advance bookings
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("SevaDharam Telehealth Consultation");
    const details = encodeURIComponent(`Encrypted virtual clinical session with your practitioner.\n\nJoin Video Call: ${roomUrl}`);
    
    // Default to current time or slot
    const now = new Date();
    const startIso = now.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(now.getTime() + 30 * 60000); // 30 mins session
    const endIso = end.toISOString().replace(/-|:|\.\d\d\d/g, '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startIso}/${endIso}`;
  };

  const finalMeetUrl = roomUrl || "https://meet.google.com/new";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
        <button 
          onClick={onLeaveCall}
          className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-brand transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Secure Google Meet Active
        </span>
      </div>

      {/* Main Video Box Container */}
      <div className="w-full h-[60vh] min-h-[450px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
        
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <Video className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">Ready for your Consultation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Click below to open your secure Google Meet room. You can also sync this session directly to your Google Calendar for up to 1 month in advance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a 
              href={finalMeetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition shadow-lg cursor-pointer"
            >
              <Video className="w-4 h-4" /> Join Video Call Now
            </a>

            <a 
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition border border-white/10 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}