import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, MapPin, Pill, Phone, X } from 'lucide-react';

interface PharmacyDashboardProps {
  currentUser: any;
}

export default function PharmacyDashboard({ currentUser }: PharmacyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'transit' | 'delivered'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Mock data for pharmacy
  const cases = [
    { id: '1', patientName: 'Rajesh Kumar', orderTime: '10:30 AM', status: 'pending', items: 3, amount: '₹450', address: 'Block C, Apollo Apts, HSR Layout' },
    { id: '2', patientName: 'Sunita Sharma', orderTime: '11:15 AM', status: 'pending', items: 1, amount: '₹120', address: 'Villa 14, Palm Meadows, Whitefield' },
    { id: '3', patientName: 'Amit Patel', orderTime: '09:00 AM', status: 'transit', items: 5, amount: '₹1250', address: 'Flat 302, Galaxy Enclave, Koramangala' },
    { id: '4', patientName: 'Vikram Singh', orderTime: '08:15 AM', status: 'delivered', items: 2, amount: '₹340', address: 'House 42, Sector 4, HSR Layout' }
  ];

  const filteredCases = cases.filter(c => c.status === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            Welcome, <span className="italic font-serif text-emerald-600 font-medium">{currentUser?.name || 'Seva Pharmacy'}</span>
          </h2>
          <p className="text-neutral-500 text-sm max-w-xl leading-normal">
            Track and manage your medicine delivery cases. Ensure timely dispatch of prescribed medicines to patients.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-b-2 ${activeTab === 'pending' ? 'border-brand text-brand' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          Pending Orders
        </button>
        <button 
          onClick={() => setActiveTab('transit')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-b-2 ${activeTab === 'transit' ? 'border-amber-500 text-amber-600' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          In Transit
        </button>
        <button 
          onClick={() => setActiveTab('delivered')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-b-2 ${activeTab === 'delivered' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          Delivered
        </button>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map(order => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSelectedOrder(order)}
            className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-brand/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'pending' ? 'bg-brand-soft text-brand' : 
                  order.status === 'transit' ? 'bg-amber-50 text-amber-500' : 
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  {order.status === 'pending' ? <Package className="w-5 h-5" /> : 
                   order.status === 'transit' ? <Truck className="w-5 h-5" /> : 
                   <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{order.patientName}</h4>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Ordered at {order.orderTime}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-neutral-700">{order.amount}</span>
            </div>
            
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <div className="flex items-start gap-2 text-xs text-neutral-600">
                <Pill className="w-4 h-4 shrink-0 text-neutral-400" />
                <span>{order.items} items (Prescription verified)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-600">
                <MapPin className="w-4 h-4 shrink-0 text-neutral-400" />
                <span>{order.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
              <button className="flex-1 py-2 glass-btn-secondary text-neutral-700 text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer flex items-center justify-center gap-2">
                <Phone className="w-3 h-3" /> Call Patient
              </button>
              
              {/* 
                DELIVERY STATUS ACTIONS COMMENTED OUT FOR MAINTENANCE 
                
                {order.status === 'pending' && (
                  <button className="flex-1 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-hover transition-colors cursor-pointer">
                    Dispatch Order
                  </button>
                )}
                {order.status === 'transit' && (
                  <button className="flex-1 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-colors cursor-pointer">
                    Mark Delivered
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button className="flex-1 py-2 bg-neutral-100 text-neutral-400 text-[10px] font-bold uppercase tracking-widest rounded-full cursor-not-allowed">
                    Completed
                  </button>
                )}
              */}
              
              <div className="flex-1 py-2 bg-neutral-100 text-neutral-400 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center justify-center cursor-not-allowed">
                Deliveries Paused
              </div>

            </div>
          </motion.div>
        ))}
        {filteredCases.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
            <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">No cases found</h3>
            <p className="text-xs text-neutral-400 mt-1">There are no orders in the {activeTab} state.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedOrder.status === 'pending' ? 'bg-brand-soft text-brand' : 
                  selectedOrder.status === 'transit' ? 'bg-amber-50 text-amber-500' : 
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  {selectedOrder.status === 'pending' ? <Package className="w-6 h-6" /> : 
                   selectedOrder.status === 'transit' ? <Truck className="w-6 h-6" /> : 
                   <CheckCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedOrder.patientName}</h3>
                  <p className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                    <span className="font-bold text-neutral-700">Order #{selectedOrder.id.padStart(5, '0')}</span> 
                    • {selectedOrder.orderTime}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Delivery Details</h4>
                  <div className="flex items-start gap-2 text-sm text-neutral-700">
                    <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{selectedOrder.address}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Order Summary</h4>
                  <div className="flex justify-between items-center mb-3 text-sm text-neutral-700">
                    <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-neutral-400" /> {selectedOrder.items} items</span>
                    <span className="font-bold">{selectedOrder.amount}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-center font-bold text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-brand">{selectedOrder.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer">Close</button>
                 
                 {/* 
                   MODAL DELIVERY ACTIONS COMMENTED OUT FOR MAINTENANCE 
                   
                   {selectedOrder.status === 'pending' && (
                    <button onClick={() => {
                      alert('Order dispatched!');
                      setSelectedOrder(null);
                    }} className="flex-1 py-3 bg-brand text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors cursor-pointer">Dispatch Order</button>
                   )}
                   {selectedOrder.status === 'transit' && (
                    <button onClick={() => {
                      alert('Order marked as delivered!');
                      setSelectedOrder(null);
                    }} className="flex-1 py-3 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors cursor-pointer">Mark Delivered</button>
                   )}
                 */}
                 
                 <div className="flex-1 py-3 bg-neutral-50 border border-neutral-200 text-neutral-400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center cursor-not-allowed">
                   Deliveries Paused
                 </div>
                 
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}