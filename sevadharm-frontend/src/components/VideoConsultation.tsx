import React, { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

interface VideoConsultationProps {
  roomUrl: string;
  onLeaveCall: () => void;
}

export default function VideoConsultation({ roomUrl, onLeaveCall }: VideoConsultationProps) {
  const callWrapper = useRef<HTMLDivElement>(null);
  const callFrame = useRef<any>(null);

  useEffect(() => {
    if (!callWrapper.current) return;
    
    // Prevent double-joining in React Strict Mode
    if (callFrame.current) return; 

    // 1. Initialize the Daily.co iframe
    callFrame.current = DailyIframe.createFrame(callWrapper.current, {
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

    // 2. Join the room
    callFrame.current.join({ url: roomUrl });

    // 3. Listen for the user clicking the red "Leave" button
    callFrame.current.on('left-meeting', () => {
      onLeaveCall();
    });

    // 4. Cleanup function to destroy the iframe when unmounting
    return () => {
      if (callFrame.current) {
        callFrame.current.leave().then(() => {
          callFrame.current.destroy();
          callFrame.current = null;
        });
      }
    };
  }, [roomUrl, onLeaveCall]);

  return (
    <div className="w-full h-[70vh] min-h-[500px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
      <div ref={callWrapper} className="w-full h-full" />
    </div>
  );
}