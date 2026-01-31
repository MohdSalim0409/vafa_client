import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingBag, Menu, LogIn, Settings, Package } from "lucide-react";
import vafa from '../assets/vafa.jpeg';
import LoginModal from './LoginModal';

const Navbar = ({ isScrolled, setMobileMenuOpen }) => {
    // State for the Account Dropdown
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [loginOpen, setLoginOpen] = useState(false);


    const colors = {
        gold: "#B59410",
        charcoal: "#1A1A1A",
        offWhite: "#FCFBFA",
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[1000] flex items-center transition-all duration-500 ${isScrolled
                ? "h-[75px] bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
                : "h-[100px] bg-transparent border-b border-transparent"
                }`}
        >
            <nav className="flex justify-between items-center w-full px-[5%] max-w-[1600px] mx-auto">

                {/* Logo Section */}
                <div className="flex items-center">
                    <img
                        src={vafa}
                        alt="Vafa"
                        className={`mr-4 transition-all duration-500 rounded-sm grayscale ${isScrolled ? "h-[35px] grayscale" : "h-[45px]"}`}
                    />
                    <div className="flex flex-col items-center cursor-pointer scale-90 mr-8">
                        <h1
                            className="font-serif text-[28px] font-light tracking-[12px] mr-[-12px] leading-none transition-colors duration-300"
                            style={{ color: colors.charcoal }}
                        >
                            VAFA
                        </h1>
                        <div className="flex items-center gap-2 w-full mt-1.5">
                            <div className={`h-[0.5px] flex-1 transition-all ${isScrolled ? 'bg-gray-200' : 'bg-gray-300'}`}></div>
                            <span className="text-[7px] tracking-[4px] font-semibold uppercase text-gray-400">
                                PERFUMES
                            </span>
                            <div className={`h-[0.5px] flex-1 transition-all ${isScrolled ? 'bg-gray-200' : 'bg-gray-300'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-[40px] ml-5">
                    {['SHOP', 'PERFUMES', 'ATTAR'].map((item) => (
                        <button
                            key={item}
                            className="relative py-2 text-[10px] font-bold tracking-[2.5px] transition-all duration-300 group"
                            style={{ color: colors.charcoal }}
                        >
                            {item}
                            <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#B59410] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </button>
                    ))}
                </div>

                {/* Icons Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-4">
                        <button className="hidden lg:flex p-2 hover:scale-110 transition-transform">
                            <Search size={18} color={colors.charcoal} strokeWidth={1.2} />
                        </button>

                        {/* --- PROFESSIONAL USER DROPDOWN --- */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className={`hidden lg:flex p-2 transition-all duration-300 rounded-full ${isAccountOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <User size={18} color={colors.charcoal} strokeWidth={1.2} />
                            </button>

                            {/* Dropdown Menu */}
                            {isAccountOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Welcome</p>
                                    </div>
                                    <button
                                        onClick={() => setLoginOpen(true)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[11px]"
                                    >
                                        <LogIn size={14} /> LOGIN / REGISTER
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Package size={14} className="text-gray-400" /> MY ORDERS
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings size={14} className="text-gray-400" /> SETTINGS
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* ---------------------------------- */}

                        <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden lg:block"></div>

                        <button className="p-2 group relative">
                            <div className="relative">
                                <ShoppingBag
                                    size={20}
                                    style={{ color: isScrolled ? colors.charcoal : colors.gold }}
                                    strokeWidth={1.2}
                                    className="transition-colors duration-300"
                                />
                                <span className="absolute -top-1 -right-2 bg-[#1A1A1A] text-white text-[7px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    0
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 ml-1"
                        >
                            <Menu size={24} color={colors.charcoal} />
                        </button>
                    </div>
                </div>
            </nav>
            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
            />

        </header>
    );
};

export default Navbar;