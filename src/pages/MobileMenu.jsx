import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowUpRight,
    Instagram,
    Facebook,
    LogIn,
    Package,
    Settings,
    UserPlus,
} from "lucide-react";

const navItems = [
    { name: "Home", desc: "Overview & latest drops" },
    { name: "Shop", desc: "Browse collections" },
    { name: "About", desc: "Our studio & philosophy" },
    { name: "Contact", desc: "Get in touch directly" },
];

const GOLD = "#D4AF37";

const MobileMenu = ({ setMobileMenuOpen }) => {
    // Lock background scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    // Animation Variants
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { delay: 0.5 } }
    };

    const menuVars = {
        initial: { scaleY: 0 },
        animate: {
            scaleY: 1,
            transition: {
                duration: 0.5,
                ease: [0.12, 0, 0.39, 0]
            }
        },
        exit: {
            scaleY: 0,
            transition: {
                delay: 0.5,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const linkVars = {
        initial: { y: "30vh", opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] }
        }
    };

    const staggeredContainerVars = {
        initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
        animate: { transition: { staggerChildren: 0.07, delayChildren: 0.2, staggerDirection: 1 } }
    };

    return (
        <motion.div
            variants={containerVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[3000] bg-black/40 backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FCFBF7] to-[#F2F0E9] flex flex-col origin-top">

                {/* Header */}
                <div className="flex items-center justify-between px-8 h-24">
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-[0.4em] uppercase text-black/40">Navigation</span>
                        <div className="h-[1px] w-8 bg-[#D4AF37] mt-1" />
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="group relative w-12 h-12 flex items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-all active:scale-95"
                    >
                        <X size={20} className="relative z-10 transition-colors group-hover:text-white" />
                        <div className="absolute inset-0 bg-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-8 py-4">
                    <motion.div
                        variants={staggeredContainerVars}
                        initial="initial"
                        animate="animate"
                        className="space-y-12"
                    >

                        {/* Navigation Links */}
                        <div className="grid gap-3">
                            {navItems.map((item, index) => (
                                <motion.a
                                    variants={linkVars}
                                    key={index}
                                    href="#"
                                    className="group block p-6 rounded-3xl bg-white border border-black/[0.03] hover:border-[#D4AF37]/30 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-light tracking-tight text-black group-hover:translate-x-1 transition-transform duration-300">
                                                {item.name}
                                            </h2>
                                            <p className="text-xs text-black/40 mt-1 uppercase tracking-wider font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/5 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Account Quick Grid */}
                        <motion.div variants={linkVars} className="space-y-4 pb-10">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-bold ml-1">
                                Member Services
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <AccountTile icon={<LogIn size={16} />} label="Login" />
                                <AccountTile icon={<UserPlus size={16} />} label="Join" />
                                <AccountTile icon={<Package size={16} />} label="Orders" />
                                <AccountTile icon={<Settings size={16} />} label="Setup" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="px-8 py-8 flex items-center justify-between border-t border-black/[0.05] bg-white/50 backdrop-blur-md">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Studio Vafa</p>
                        <p className="text-[10px] text-black/30">© 2026 All Rights Reserved</p>
                    </div>
                    <div className="flex gap-4">
                        <SocialCircle icon={<Instagram size={16} />} />
                        <SocialCircle icon={<Facebook size={16} />} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Helper Components for cleaner code
const AccountTile = ({ icon, label }) => (
    <button className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/[0.03] text-sm font-medium hover:bg-black hover:text-white transition-all group">
        <span className="text-[#D4AF37] group-hover:text-white transition-colors">{icon}</span>
        {label}
    </button>
);

const SocialCircle = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-full border border-black/[0.05] flex items-center justify-center text-black/60 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] transition-all">
        {icon}
    </a>
);

export default MobileMenu;