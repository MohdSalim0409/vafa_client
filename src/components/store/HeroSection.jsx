import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

function HeroSection() {
    return (
       <section className="px-6 pt-32 pb-12"> 
            <div className="h-[75vh] rounded-[40px] overflow-hidden relative shadow-2xl">
                <img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2000" className="w-full h-full object-cover" alt="hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-16 text-white">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <p className="uppercase tracking-[0.5em] text-[10px] mb-4">Winter 2026 Collection</p>
                        <h2 className="text-6xl md:text-8xl font-serif italic mb-8 max-w-3xl leading-tight text-white shadow-sm">The Architecture of Scent</h2>
                        <button className="bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-widest hover:invert transition-all rounded-full shadow-lg">Discover the Scent</button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;