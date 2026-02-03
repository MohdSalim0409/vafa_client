import React from 'react'
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

function CustomerLayout() {

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-10 pb-20">
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-4xl font-serif">Elena Gilbert</h2>
                    <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Private Member</p>
                </div>
                <div className="flex gap-10 text-[10px] uppercase font-bold tracking-widest">
                    <button className="text-black border-b-2 border-black pb-2">Orders</button>
                    <button>Wishlist</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Real-time Order Card */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200" /></div>
                    <div className="flex-1">
                        <h4 className="font-bold">Midnight Velvet</h4>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">Shipped • Arriving Today</p>
                    </div>
                    <ChevronRight className="text-gray-300" />
                </div>
            </div>
        </motion.div>
    )
}

export default CustomerLayout;