import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from "react-router-dom";
import StoreNavbar from "../components/store/StoreNavbar";
import HeroSection from "../components/store/HeroSection";
import AboutSection from "../components/store/AboutSection";

function Storefront() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StoreNavbar />
            <HeroSection />
            <AboutSection />
            <Menus />
        </motion.div>
    )
}

const Menus = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setRole(user.role);   // "admin" or "user"
        }
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl border border-gray-200">

            {/* STORE – everyone can see */}
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-[10px] font-bold uppercase transition ${isActive ? "bg-black text-white" : "hover:bg-gray-100"
                    }`
                }
            >
                Store
            </NavLink>

            {/* CUSTOMER – only user */}
            {role === "user" && (
                <NavLink
                    to="/customer"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-[10px] font-bold uppercase transition ${isActive ? "bg-black text-white" : "hover:bg-gray-100"
                        }`
                    }
                >
                    Customer
                </NavLink>
            )}

            {/* ADMIN – only admin */}
            {role === "admin" && (
                <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-[10px] font-bold uppercase transition ${isActive ? "bg-black text-white" : "hover:bg-gray-100"
                        }`
                    }
                >
                    Admin
                </NavLink>
            )}
        </div>
    );
};


export default Storefront;