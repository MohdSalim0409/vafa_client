import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen font-serif selection:bg-stone-900 selection:text-white text-stone-900 overflow-x-hidden">
            <main className="mx-auto px-6 md:px-16 pt-32 pb-24 relative z-10">
                {/* Upper Branding Bar */}
                <div className="flex justify-between items-center mb-32">
                    <div className="flex flex-col">
                        <span className="font-sans text-[11px] tracking-[0.6em] uppercase font-bold">Vafa</span>
                        <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-stone-400">Parfumerie</span>
                    </div>
                    <div className="h-px flex-grow mx-12 bg-stone-100 hidden md:block" />
                    <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-stone-400">Est. 2026 — Paris</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-24">
                    {/* Left Column: Typography & Info */}
                    <div className="lg:col-span-5 pr-0 lg:pr-24">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                            <h1 className="text-7xl md:text-[100px] font-light tracking-tighter leading-[0.85] mb-12">
                                Get in <br />
                                <span className="italic">Touch</span>
                            </h1>
                            <p className="max-w-xs text-stone-500 font-light leading-relaxed text-lg mb-20">Whether seeking a bespoke scent or a professional collaboration, our concierge is at your disposal.</p>
                        </motion.div>

                        <div className="space-y-16">
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <h4 className="font-sans text-[9px] tracking-[0.4em] uppercase text-stone-900 font-semibold mb-6">Maison Vafa</h4>
                                <p className="text-md leading-relaxed font-light italic text-stone-600">
                                    12 Rue de Castiglione, 75001 Paris
                                    <br />
                                    concierge@vafa.fr
                                    <br />
                                    +33 (0) 1 40 20 01 01
                                </p>
                            </motion.section>

                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-10 font-sans text-[10px] tracking-widest uppercase text-stone-400">
                                <a href="#" className="hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1">
                                    Instagram
                                </a>
                                <a href="#" className="hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1">
                                    Archive
                                </a>
                            </motion.section>
                        </div>
                    </div>

                    {/* Right Column: Minimalist Inquiry Form */}
                    <section className="lg:col-span-7 space-y-20">
                        {/* The 'Curated Inquiry' Header */}
                        <div>
                            <h2 className="text-3xl font-light italic mb-8">How may we assist you?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {["Bespoke Scent Design", "Private Consultation", "Partnerships", "General Inquiries"].map((item) => (
                                    <button key={item} className="border border-stone-100 p-8 text-left hover:border-stone-900 transition-all duration-300 group">
                                        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-900">Inquire</span>
                                        <p className="mt-4 text-xl font-light">{item}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Only show the 'Minimalist Detail' area when a path is selected */}
                        <div className="border-l-2 border-stone-900 pl-8">
                            <p className="text-stone-500 font-light italic text-lg leading-relaxed">"Our fragrance advisors provide a tailored experience. Please select the nature of your interest, and we will personally curate a dialogue to match your specific requirements."</p>
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom Signature Line */}
            <footer className="w-full border-t border-stone-50 pb-16">
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-light italic mb-4">Vafa</span>
                    <div className="flex gap-4 items-center">
                        <div className="h-px w-10 bg-stone-200" />
                        <p className="font-sans text-[8px] tracking-[1.2em] text-stone-300 uppercase">Paris Grasse Dubai</p>
                        <div className="h-px w-10 bg-stone-200" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
