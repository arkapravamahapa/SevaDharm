import React, { useEffect, useRef, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { AlertCircle } from 'lucide-react';

interface VideoConsultationProps {
  roomUrl: string;
  onLeaveCall: () => void;
}

export default function VideoConsultation({ roomUrl, onLeaveCall }: VideoConsultationProps) {
  const callWrapper = useRef<HTMLDivElement>(null);
  const callFrame = useRef<DailyCall | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!callWrapper.current) return;
    
    // STRICT MODE FIX: Prevent double initialization
    if (callFrame.current) return; 

    // 1. Initialize the Daily.co iframe
    const frame = DailyIframe.createFrame(callWrapper.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '16px',
        backgroundColor: '#171717'
      },
      showLeaveButton: true,
      showFullscreenButton: true,
    });

    callFrame.current = frame;

    // 2. Handle when user clicks the red Leave button
    frame.on('left-meeting', () => {
      onLeaveCall();
    });

    // 3. BULLETPROOF ERROR CATCHING: Catch bad URLs (like 404s)
    frame.on('error', (e: any) => {
      console.error("Daily.co Video Error:", e);
      setError("Failed to connect to the medical room. The link may be expired or invalid.");
    });

    // 4. Join the room safely
    frame.join({ url: roomUrl }).catch(err => {
      console.error("Join Promise Failed:", err);
    });

    // 5. Strict Cleanup on Unmount
    return () => {
      if (frame) {
        frame.leave().then(() => {
          frame.destroy();
        }).catch(err => console.error("Cleanup error:", err));
        callFrame.current = null;
      }
    };
  }, [roomUrl, onLeaveCall]);

  return (
    <div className="w-full h-[70vh] min-h-[500px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 relative flex items-center justify-center">
      
      {/* Show Error Banner if room is 404 or broken */}
      {error && (
        <div className="absolute top-6 left-6 right-6 z-10 bg-red-500 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button 
            onClick={onLeaveCall}
            className="ml-auto px-4 py-2 bg-white text-red-600 text-xs font-black rounded-lg uppercase tracking-wider"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Daily.co Video Container */}
      <div ref={callWrapper} className="w-full h-full" />
    </div>
  );
}