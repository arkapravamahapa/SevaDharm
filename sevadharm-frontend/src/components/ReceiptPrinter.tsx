import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, FileX, Copy } from 'lucide-react';

interface ReceiptPrinterProps {
  doctorName?: string;
  appointmentId?: string;
}

export default function ReceiptPrinter({ doctorName = "Doctor", appointmentId = "TXN-0000" }: ReceiptPrinterProps) {
  const [printState, setPrintState] = useState<'idle' | 'printing' | 'done' | 'tearing'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrintState('printing');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (printState === 'printing') {
      const timer = setTimeout(() => setPrintState('done'), 3000); 
      return () => clearTimeout(timer);
    }
    if (printState === 'tearing') {
      const timer = setTimeout(() => setPrintState('idle'), 600); 
      return () => clearTimeout(timer);
    }
  }, [printState]);

  const handleReprint = () => {
    setPrintState('idle');
    setTimeout(() => setPrintState('printing'), 100);
  };

  const handleTear = () => {
    if (printState === 'done') {
      setPrintState('tearing');
    }
  };

  const barcodePattern = [2, 4, 1, 3, 2, 5, 1, 2, 4, 1, 1, 3, 2, 4, 2, 1, 3, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1];
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center font-sans py-4 select-none w-full">
      <div className="relative flex flex-col items-center w-full max-w-[400px]">
        {/* Hardware Printer Slot */}
        <div className="relative z-20 w-[360px] h-12 bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-neutral-700 flex flex-col items-center justify-end pb-1.5">
          <div className="w-[310px] h-2 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)]"></div>
          <div className="absolute top-1 left-4 right-4 h-3 bg-white/10 rounded-full blur-[1px]"></div>
        </div>

        {/* Paper Clipping Mask */}
        <div className="relative z-10 w-[310px] h-[580px] overflow-hidden -mt-2">
          <motion.div
            initial={{ y: "-100%", opacity: 1, rotate: 0 }}
            animate={{
              y: printState === 'idle' ? "-100%" 
               : printState === 'printing' ? "0%" 
               : printState === 'done' ? "0%" 
               : "120%", 
              opacity: printState === 'tearing' ? 0 : 1,
              rotate: printState === 'tearing' ? -5 : 0 
            }}
            transition={{
              y: { 
                duration: printState === 'printing' ? 3 : (printState === 'tearing' ? 0.6 : 0), 
                ease: printState === 'printing' ? "linear" : "easeIn" 
              },
              opacity: { duration: printState === 'tearing' ? 0.4 : 0, delay: 0.2 },
              rotate: { duration: 0.6, ease: "easeIn" }
            }}
            className="absolute top-0 left-0 w-full bg-white text-neutral-800 flex flex-col shadow-xl filter drop-shadow-md origin-top"
          >
            <div className="p-6 font-mono text-[11px] leading-relaxed">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-sm tracking-widest text-brand">SEVADHARAM</h3>
                  <p className="text-gray-500 text-[9px] tracking-widest mt-0.5">DIGITAL HEALTH RECEIPT</p>
                </div>
                <div className="w-8 h-8 bg-brand text-white flex items-center justify-center font-bold text-xl rounded-bl-xl rounded-tr-sm">
                  +
                </div>
              </div>

              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-3 mb-4">
                <span className="font-bold uppercase tracking-wider text-gray-500">Patient Copy</span>
                <span className="text-gray-400 max-w-[100px] truncate" title={appointmentId}>Txn: {appointmentId.substring(0,8)}</span>
              </div>

              <div className="absolute top-20 right-4 z-10 rotate-[-15deg]">
                <div className="border-4 border-emerald-500 text-emerald-500 p-2 rounded-lg text-center bg-white/80 backdrop-blur-sm">
                  <p className="font-black text-2xl tracking-widest leading-none">PAID</p>
                  <p className="font-bold text-[8px] tracking-widest mt-1">{today.toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-6 relative z-0">
                <h2 className="text-4xl font-bold tracking-tighter">₹499.00</h2>
                <p className="text-gray-400 mt-1 uppercase text-[9px] tracking-wider">{today} | Online Payment</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Consultation: {doctorName}</span>
                  <span>₹499.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹499.00</span>
             </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (0%)</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t-2 border-dashed border-gray-200 pt-3 mb-8">
                <span className="font-bold text-sm">GRAND TOTAL</span>
                <span className="font-bold text-sm">₹499.00</span>
              </div>

              <div className="text-center space-y-4">
                <p className="font-bold text-gray-400 text-[9px] tracking-widest uppercase">
                  Thank you for trusting SevaDharam
                </p>
                <div className="flex justify-center items-end h-10 w-full px-4 gap-[2px]">
                  {barcodePattern.map((width, i) => (
                    <div key={i} className="bg-neutral-900 h-full" style={{ width: `${width}px` }}></div>
                  ))}
                </div>
                <p className="text-[8px] text-gray-400 tracking-[0.3em] truncate max-w-full px-4">{appointmentId}</p>
              </div>
            </div>

            <div className="w-full h-3 relative overflow-hidden text-white -mb-[1px]">
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full fill-current drop-shadow-sm">
                <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={printState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center h-12"
          >
            {printState === 'printing' && (
              <>
                <h3 className="font-bold text-lg text-gray-900">Printing Receipt...</h3>
              </>
            )}
            {printState === 'done' && (
              <>
                <h3 className="font-bold text-lg text-emerald-600">Payment Successful</h3>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={handleReprint}
            disabled={printState === 'printing'}
            className="flex items-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Re-print
          </button>
          <button 
            onClick={handleTear}
            disabled={printState !== 'done'}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <FileX className="w-3.5 h-3.5" /> Tear
          </button>
        </div>
      </div>
    </div>
  );
}