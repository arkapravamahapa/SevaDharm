import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Search, Plus, Trash, Check, Bell, BellOff, ShoppingBag, ShieldAlert, BadgePercent, RefreshCw } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineStoreProps {
  onBackToDashboard: () => void;
}

export default function MedicineStore({ onBackToDashboard }: MedicineStoreProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ med: Medicine; qty: number }[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch live products from Python backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/products');
      if (!res.ok) throw new Error('Failed to fetch live pharmacy registry');
      
      const result = await res.json();
      
      // Map Python backend fields to Frontend Medicine interface
      const mappedMedicines: Medicine[] = (result.data || []).map((item: any) => ({
        id: item.id || Math.random().toString(),
        name: item.name,
        category: item.category,
        price: item.price,
        dosage: item.description || 'Take as directed by physician',
        frequency: 'Once daily after meals',
        reminderEnabled: false
      }));

      setMedicines(mappedMedicines);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.med.id === med.id);
      if (existing) {
        return prev.map(item => item.med.id === med.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { med, qty: 1 }];
    });
    triggerSuccess(`Added ${med.name} to pharmacy cart.`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.med.id !== id));
  };

  const toggleReminder = (id: string) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.reminderEnabled;
        triggerSuccess(nextState ? `Dosage alarm configured for ${m.name}` : `Alarm cancelled for ${m.name}`);
        return { ...m, reminderEnabled: nextState };
      }
      return m;
    }));
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.med.price * item.qty), 0);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Toast alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-brand-soft text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-brand animate-bounce" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Store Area */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-neutral-900">Seva Pharmacy Portal (Calcutta Network)</h3>
            <p className="text-neutral-500 text-sm">Purchase genuine medicines & configure clinical dosage alarms.</p>
          </div>
          <button 
            onClick={fetchProducts}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search pills, categories, syrup (e.g., Dolo, Antibiotic)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-sm font-medium"
          />
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMedicines.map(med => (
            <div 
              key={med.id}
              className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-all flex flex-col justify-between space-y-3.5"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">{med.category}</span>
                  <h4 className="font-bold text-sm text-neutral-800">{med.name}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{med.dosage}</p>
                </div>
                <button 
                  onClick={() => toggleReminder(med.id)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    med.reminderEnabled 
                      ? 'bg-brand/10 text-brand ring-1 ring-brand/20' 
                      : 'bg-white text-neutral-400 hover:text-neutral-600 border border-neutral-100 shadow-sm'
                  }`}
                  title={med.reminderEnabled ? 'Reminder Active' : 'Configure Reminder Alarm'}
                >
                  {med.reminderEnabled ? <Bell className="w-4.5 h-4.5 animate-swing" /> : <BellOff className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Dosage instruction banner if alarm configured */}
              {med.reminderEnabled && (
                <div className="p-2 bg-brand-light border border-brand-soft rounded-lg text-[10px] font-medium text-brand-dark flex items-center gap-1.5 animate-pulse">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Alarm: {med.frequency}</span>
                </div>
              )}

              {/* Price and Add CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-base font-mono font-bold text-neutral-800">₹{med.price}</span>
                <button 
                  onClick={() => addToCart(med)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}

          {!isLoading && filteredMedicines.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 border-2 border-dashed border-neutral-200 rounded-3xl">
              <p className="font-medium text-sm">No live inventory found matching your search.</p>
              <p className="text-xs mt-1">Make sure products are seeded in your database tables.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Cart & checkout summary */}
      <div className="space-y-6">
        {/* Cart Block */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShoppingBag className="w-5 h-5 text-neutral-700" />
              <h4 className="font-bold text-neutral-800">My Pharmacy Cart</h4>
              <span className="ml-auto px-2 py-0.5 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-500">{cart.length}</span>
            </div>

            {/* List */}
            <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[180px] custom-scrollbar space-y-3 pt-3">
              {cart.map(item => (
                <div key={item.med.id} className="flex items-center justify-between py-2.5">
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs text-neutral-800">{item.med.name}</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">₹{item.med.price} x {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-600">₹{item.med.price * item.qty}</span>
                    <button 
                      onClick={() => removeFromCart(item.med.id)}
                      className="p-1 text-neutral-400 hover:text-emergency cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-10 text-center text-xs text-neutral-400">
                  Pharmacy cart is empty. Add medicine above.
                </div>
              )}
            </div>
          </div>

          {/* Checkout footer */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="p-3.5 bg-brand-light border border-success-soft rounded-2xl flex items-center justify-between text-brand-dark">
                <div className="flex items-center gap-1.5">
                  <BadgePercent className="w-5 h-5 animate-pulse" />
                  <span className="text-xs font-bold">Charitable Subsidy</span>
                </div>
                <span className="text-xs font-bold font-mono">20% APPLIED</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Subtotal</span>
                <span className="font-mono text-neutral-800 font-bold">₹{cartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Subsidy discount</span>
                <span className="font-mono text-brand font-bold">-₹{Math.round(cartTotal * 0.20)}</span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-neutral-100">
                <span className="text-neutral-900 font-bold">Total Bill</span>
                <span className="font-mono text-brand font-black text-lg">₹{cartTotal - Math.round(cartTotal * 0.20)}</span>
              </div>

              <button 
                onClick={() => {
                  setCart([]);
                  triggerSuccess('Prescription order filed successfully! Dispatching drugs.');
                }}
                className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-2xl shadow-lg shadow-brand/10 transition-all cursor-pointer text-center"
              >
                Place Order
              </button>
            </div>
          )}
        </div>

        {/* Back navigation */}
        <button
          onClick={onBackToDashboard}
          className="w-full py-3.5 border border-neutral-200 text-neutral-600 hover:text-neutral-800 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center bg-white shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}