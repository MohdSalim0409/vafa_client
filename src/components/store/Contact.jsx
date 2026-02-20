import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="bg-white min-h-screen font-serif selection:bg-stone-900 selection:text-white text-stone-900 overflow-x-hidden">
            
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 relative z-10">
                
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
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-7xl md:text-[100px] font-light tracking-tighter leading-[0.85] mb-12">
                                Get in <br />
                                <span className="italic">Touch</span>
                            </h1>
                            <p className="max-w-xs text-stone-500 font-light leading-relaxed text-lg mb-20">
                                Whether seeking a bespoke scent or a professional collaboration, our concierge is at your disposal.
                            </p>
                        </motion.div>

                        <div className="space-y-16">
                            <motion.section 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h4 className="font-sans text-[9px] tracking-[0.4em] uppercase text-stone-900 font-semibold mb-6">Maison Vafa</h4>
                                <p className="text-md leading-relaxed font-light italic text-stone-600">
                                    12 Rue de Castiglione, 75001 Paris<br />
                                    concierge@vafa.fr<br />
                                    +33 (0) 1 40 20 01 01
                                </p>
                            </motion.section>

                            <motion.section 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-10 font-sans text-[10px] tracking-widest uppercase text-stone-400"
                            >
                                <a href="#" className="hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1">Instagram</a>
                                <a href="#" className="hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1">Archive</a>
                            </motion.section>
                        </div>
                    </div>

                    {/* Right Column: Minimalist Inquiry Form */}
                    <section className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-64 flex flex-col justify-center border-t border-stone-100"
                                >
                                    <h2 className="text-3xl font-light italic mb-4">Inquiry Received.</h2>
                                    <p className="text-stone-400 font-sans text-[10px] tracking-[0.3em] uppercase">
                                        Vafa advisors will reach out shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-12"
                                >
                                    {/* Line item styling for professional feel */}
                                    {[
                                        { id: 'name', label: 'Full Identity', type: 'text', placeholder: 'Name Surname' },
                                        { id: 'email', label: 'Communication', type: 'email', placeholder: 'email@vafa.fr' },
                                    ].map((field, idx) => (
                                        <div key={field.id} className="group relative border-b border-stone-100 pb-4">
                                            <label className="block font-sans text-[9px] tracking-[0.4em] uppercase text-stone-400 mb-2 transition-colors group-focus-within:text-stone-900">
                                                0{idx + 1}. {field.label}
                                            </label>
                                            <input 
                                                required
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                className="w-full bg-transparent py-2 outline-none font-light text-xl tracking-wide placeholder:text-stone-200"
                                                onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                                            />
                                        </div>
                                    ))}

                                    <div className="group relative border-b border-stone-100 pb-4">
                                        <label className="block font-sans text-[9px] tracking-[0.4em] uppercase text-stone-400 mb-2 transition-colors group-focus-within:text-stone-900">
                                            03. Message
                                        </label>
                                        <textarea 
                                            required
                                            rows="4" 
                                            placeholder="Specify your inquiry..."
                                            className="w-full bg-transparent py-2 outline-none font-light text-xl tracking-wide resize-none placeholder:text-stone-200"
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        />
                                    </div>

                                    <div className="pt-10">
                                        <button 
                                            type="submit" 
                                            className="w-full md:w-auto px-20 py-6 bg-stone-900 text-white font-sans text-[10px] tracking-[0.6em] uppercase transition-all duration-500 hover:bg-stone-800"
                                        >
                                            Submit Inquiry
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </main>

            {/* Bottom Signature Line */}
            <footer className="w-full border-t border-stone-50 py-16 mt-20">
                <div className="max-w-[1400px] mx-auto px-12 flex flex-col items-center">
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