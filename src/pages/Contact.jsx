import React from 'react';

const PerfumeContact = () => {
    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            {/* Hero Section with Split Color */}
            <div className="flex flex-col lg:flex-row min-h-[90vh]">

                {/* Left Side: Visual & Brand Statement */}
                <div className="lg:w-5/12 bg-[#1a2e21] text-[#e0d5c0] p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative SVG Element (Subtle floral watermark) */}
                    <div className="absolute top-[-10%] right-[-10%] opacity-10 rotate-12">
                        <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 0C50 0 30 40 0 50C30 60 50 100 50 100C50 100 70 60 100 50C70 40 50 0 50 0Z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-xs uppercase tracking-[0.5em] mb-8 opacity-80">The Essence of Nature</h2>
                        <h1 className="text-5xl lg:text-7xl font-serif italic leading-tight">
                            VAFA  <br />
                            <span className="text-[#d4a373]">PERFUMES.</span>
                        </h1>
                    </div>

                    <div className="relative z-10 mt-12 space-y-6 border-l border-[#d4a373]/30 pl-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#d4a373] mb-1">Visit our Atelier</p>
                            <p className="text-sm font-light">Place de la Madeleine, Paris</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#d4a373] mb-1">Direct Line</p>
                            <p className="text-sm font-light">+33 1 42 65 12 12</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Colorful Form */}
                <div className="lg:w-7/12 bg-white p-8 lg:p-24 flex items-center">
                    <div className="w-full max-w-lg mx-auto">
                        <form className="space-y-10">
                            <div className="group relative">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 group-focus-within:text-[#1a2e21] transition-colors">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#d4a373] transition-all bg-transparent italic text-lg"
                                    placeholder="Amélie Laurent"
                                />
                            </div>

                            <div className="group relative">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 group-focus-within:text-[#1a2e21] transition-colors">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#d4a373] transition-all bg-transparent italic text-lg"
                                    placeholder="amelie@maison.com"
                                />
                            </div>

                            <div className="group relative">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 group-focus-within:text-[#1a2e21] transition-colors">
                                    Your Message
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#d4a373] transition-all bg-transparent italic text-lg resize-none"
                                    placeholder="I am looking for notes of sandalwood..."
                                />
                            </div>

                            <button className="relative overflow-hidden group bg-[#1a2e21] text-white px-12 py-5 rounded-full transition-all hover:pr-16">
                                <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-bold">
                                    Send Inquiry
                                </span>
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                                    →
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Subtle Footer-style accent */}
            <div className="h-2 bg-gradient-to-r from-[#1a2e21] via-[#d4a373] to-[#e9edc9]"></div>
        </div>
    );
};

export default PerfumeContact;