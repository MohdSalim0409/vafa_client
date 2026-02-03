import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react';

function StoreNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 px-10 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-sm">
                
                {/* Left: Navigation */}
                <div className="flex gap-8 text-[10px] uppercase font-semibold tracking-[0.25em] text-gray-800">
                    <a href="#collection" className="hover:opacity-40 transition-opacity">Shop</a>
                    <a href="#about" className="hover:opacity-40 transition-opacity">Story</a>
                </div>

                {/* Center: Branding */}
                <h1 className="text-xl font-serif tracking-[0.6em] uppercase absolute left-1/2 -translate-x-1/2">
                    Aetheria
                </h1>

                {/* Right: Dynamic Interface */}
                <div className="flex items-center gap-6">
                    <AnimatePresence mode="wait">
                        {!isLoggedIn ? (
                            <motion.div 
                                key="auth-ui"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-6"
                            >
                                <button 
                                    onClick={() => setIsLoggedIn(true)}
                                    className="text-[10px] uppercase tracking-[0.2em] font-bold"
                                >
                                    Login
                                </button>
                                <button className="text-[10px] uppercase tracking-[0.2em] font-bold bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition-transform">
                                    Sign Up
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="user-ui"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-5"
                            >
                                <div className="flex items-center gap-1 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-black transition-colors">
                                        <User size={14} strokeWidth={2.5} />
                                    </div>
                                    <ChevronDown size={12} className="text-gray-400 group-hover:text-black transition-colors" />
                                </div>

                                <div className="h-4 w-[1px] bg-gray-200" />

                                <div className="relative group cursor-pointer">
                                    <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[7px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        2
                                    </span>
                                </div>

                                <button onClick={() => setIsLoggedIn(false)} className="text-gray-300 hover:text-black transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}

export default StoreNavbar;