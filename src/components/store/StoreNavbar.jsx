import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, ChevronDown, X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

function StoreNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authView, setAuthView] = useState('login');

    const handleClose = () => {
        setShowLoginModal(false);
        setTimeout(() => setAuthView('login'), 300);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 40 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
        },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
        })
    };

    return (
        <>
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 px-10 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-sm">
                    <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-800">
                        <a href="#shop" className="hover:text-neutral-400 transition-colors">Collection</a>
                        <a href="#story" className="hover:text-neutral-400 transition-colors">The Atelier</a>
                    </div>

                    <h1 className="text-xl font-serif tracking-[0.6em] uppercase absolute left-1/2 -translate-x-1/2 cursor-default font-light">
                        VAFAPERFUME
                    </h1>

                    <div className="flex items-center gap-6">
                        <AnimatePresence mode="wait">
                            {!isLoggedIn ? (
                                <motion.div key="auth" className="flex items-center gap-6">
                                    <button onClick={() => { setAuthView('login'); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-50 transition-all">Login</button>
                                    <button onClick={() => { setAuthView('signup'); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold bg-black text-white px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-all">Sign Up</button>
                                </motion.div>
                            ) : (
                                <div className="flex items-center gap-5">
                                    <User size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
                                    <ShoppingBag size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
                                    <button onClick={() => setIsLoggedIn(false)} className="text-neutral-300 hover:text-black transition-colors"><LogOut size={18} /></button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            {/* --- ELITE AUTH MODAL --- */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-[900px] h-[600px] bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex"
                        >
                            {/* Left Side: Visual/Branding Panel */}
                            <div className="hidden md:flex w-1/2 bg-neutral-900 relative p-12 flex-col justify-between text-white">
                                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="relative z-10">
                                    <Sparkles className="mb-4 opacity-50" size={24} />
                                    <h3 className="text-3xl font-serif tracking-widest uppercase font-light">The <br />Essence</h3>
                                </div>

                                <div className="relative z-10">
                                    <p className="text-sm font-light leading-relaxed tracking-wide italic opacity-80">
                                        "Fragrance is the invisible garment that speaks volumes before you ever say a word."
                                    </p>
                                    <div className="mt-6 h-[1px] w-12 bg-white/30" />
                                </div>
                            </div>

                            {/* Right Side: Form Panel */}
                            <div className="w-full md:w-1/2 p-12 flex flex-col relative bg-white">
                                <button onClick={handleClose} className="absolute top-8 right-8 text-neutral-300 hover:text-black transition-colors">
                                    <X size={24} strokeWidth={1} />
                                </button>

                                <AnimatePresence mode="wait">
                                    {authView === 'login' ? (
                                        <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="my-auto">
                                            <header className="mb-10">
                                                <h2 className="text-2xl font-serif tracking-[0.3em] uppercase mb-2">Welcome</h2>
                                                <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400 font-medium">Please enter your details to sign in</p>
                                            </header>

                                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                                {[
                                                    { label: 'Email Address', type: 'email', ph: 'name@email.com' },
                                                    { label: 'Password', type: 'password', ph: '••••••••' }
                                                ].map((field, i) => (
                                                    <motion.div key={field.label} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 block mb-2 ml-1">{field.label}</label>
                                                        <input type={field.type} placeholder={field.ph} className="w-full border-b border-neutral-100 py-3 text-sm focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-200" />
                                                    </motion.div>
                                                ))}

                                                <motion.button
                                                    custom={2} variants={itemVariants} initial="hidden" animate="visible"
                                                    onClick={() => { setIsLoggedIn(true); handleClose(); }}
                                                    className="w-full bg-black text-white py-4 rounded-full mt-4 flex items-center justify-center gap-3 group hover:shadow-2xl transition-all"
                                                >
                                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Sign In</span>
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </motion.button>
                                            </form>

                                            <footer className="mt-12 text-center">
                                                <button onClick={() => setAuthView('signup')} className="text-[9px] uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors">
                                                    New to VafaPerfume? <span className="text-black font-bold border-b border-black/10 pb-0.5">Create Account</span>
                                                </button>
                                            </footer>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="my-auto">
                                            <header className="mb-10">
                                                <h2 className="text-2xl font-serif tracking-[0.3em] uppercase mb-2">Join</h2>
                                                <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400 font-medium">Create your olfactory profile</p>
                                            </header>

                                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-b border-neutral-100 py-2">
                                                        <input type="text" placeholder="First Name" className="w-full text-sm focus:outline-none bg-transparent placeholder:text-neutral-200" />
                                                    </div>
                                                    <div className="border-b border-neutral-100 py-2">
                                                        <input type="text" placeholder="Last Name" className="w-full text-sm focus:outline-none bg-transparent placeholder:text-neutral-200" />
                                                    </div>
                                                </div>
                                                <input type="email" placeholder="Email" className="w-full border-b border-neutral-100 py-3 text-sm focus:outline-none focus:border-black transition-all bg-transparent" />
                                                <input type="password" placeholder="Password" className="w-full border-b border-neutral-100 py-3 text-sm focus:outline-none focus:border-black transition-all bg-transparent" />

                                                <button onClick={() => { setIsLoggedIn(true); handleClose(); }} className="w-full bg-black text-white py-4 rounded-full mt-4 flex items-center justify-center gap-3 group transition-all">
                                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Register</span>
                                                    <CheckCircle2 size={14} />
                                                </button>
                                            </form>

                                            <footer className="mt-10 text-center">
                                                <button onClick={() => setAuthView('login')} className="text-[9px] uppercase tracking-[0.15em] text-neutral-400 flex items-center gap-2 mx-auto hover:text-black transition-colors">
                                                    <ArrowLeft size={12} /> Already a member? <span className="text-black font-bold">Login</span>
                                                </button>
                                            </footer>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default StoreNavbar;