import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Menu, User, Search, Plus, Heart,
    Package, Users, LayoutDashboard, LogOut,
    Trash2, Edit, ChevronRight, X, CreditCard, MapPin, Send, CheckCircle
} from 'lucide-react';

function StoreNavbar() {

    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest">
                <a href="#collection" className="hover:opacity-50">Collection</a>
                <a href="#about" className="hover:opacity-50">About</a>
            </div>
            <h1 className="text-2xl font-serif tracking-[0.4em] uppercase absolute left-1/2 -translate-x-1/2">Aetheria</h1>
            <div className="flex gap-6 items-center">
                <button ><User size={18} /></button>
                <div className="relative cursor-pointer">
                    <ShoppingBag size={18} />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
                </div>
            </div>
        </nav>
    )
}

export default StoreNavbar