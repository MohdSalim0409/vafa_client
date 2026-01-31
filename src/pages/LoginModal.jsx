import React, { useState, useEffect } from "react";
import { X, Lock, Mail, ArrowRight, UserPlus, User, ShieldCheck } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
    const [view, setView] = useState("login"); // "login" or "register"

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-[95%] max-w-[420px] p-10 rounded-[2.5rem] shadow-2xl relative border border-slate-100 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {view === "login" ? (
                    /* LOGIN VIEW */
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                            <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your details</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                                    <input type="email" placeholder="name@company.com" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                                    <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300" />
                                </div>
                            </div>

                            <button className="group w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
                                Sign In
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="mt-10 text-center text-slate-400 text-sm font-medium">
                            New here?{" "}
                            <button onClick={() => setView("register")} className="text-slate-900 font-bold hover:underline underline-offset-4">
                                Create an account
                            </button>
                        </p>
                    </div>
                ) : (
                    /* REGISTER VIEW */
                    <div className="animate-in fade-in slide-in-from-left-8 duration-500">
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                <UserPlus size={24} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Get Started</h2>
                            <p className="text-slate-500 mt-2 text-sm font-medium">Join our community today</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input type="email" placeholder="name@company.com" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input type="password" placeholder="Create a password" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 outline-none transition-all" />
                                </div>
                            </div>

                            <button className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2">
                                Create Account
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="mt-10 text-center text-slate-400 text-sm font-medium">
                            Already have an account?{" "}
                            <button onClick={() => setView("login")} className="text-indigo-600 font-bold hover:underline underline-offset-4">
                                Log in instead
                            </button>
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginModal;