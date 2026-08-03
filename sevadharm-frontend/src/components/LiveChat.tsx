import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

interface Message {
  id: string;
  appointment_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
}

interface LiveChatProps {
  appointmentId: string;
  currentUserId: string; // The ID of the logged-in patient or doctor
}

export default function LiveChat({ appointmentId, currentUserId }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 1. Fetch existing messages for this appointment
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('appointment_id', appointmentId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 2. Subscribe to real-time incoming messages
    const channel = supabase
      .channel('realtime-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `appointment_id=eq.${appointmentId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appointmentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const { error } = await supabase.from('chat_messages').insert([
        {
          appointment_id: appointmentId,
          sender_id: currentUserId,
          message_text: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      
      // Clear input after successful send
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
        <div className="p-2 bg-brand-soft rounded-xl text-brand">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-neutral-900">Secure Consultation Chat</h3>
          <p className="text-[10px] text-neutral-500 font-mono">End-to-End Encrypted</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-brand" />
            <span className="text-xs font-bold">Loading secure chat...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs font-bold text-neutral-400">
            No messages yet. Send a message to the doctor.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  isMe 
                    ? 'bg-brand text-white rounded-tr-sm' 
                    : 'bg-neutral-100 text-neutral-800 rounded-tl-sm'
                }`}>
                  <p>{msg.message_text}</p>
                  <span className={`text-[9px] mt-1 block font-mono ${isMe ? 'text-brand-light' : 'text-neutral-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-neutral-100">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={sending}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-brand transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-brand hover:bg-brand-hover text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}