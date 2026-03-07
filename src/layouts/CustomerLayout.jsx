import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    Package,
    ShoppingBag,
    Clock,
    User,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    LogOut,
    X,
    Save,
    Phone
} from "lucide-react";

function CustomerLayout() {

    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", address: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            axios
                .get(`http://localhost:5000/api/order/user/${storedUser.phone}`)
                .then((res) => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching orders:", err);
                    setLoading(false);
                });
        }
    }, []);

    const handleEditProfile = () => {
        setIsSaving(true);
        // Simulate an API call
        setTimeout(() => setIsSaving(false), 1500);
    };
    const handleEditToggle = () => {
        if (!isEditing) {
            // Reset form to current user data when opening
            setEditForm({
                name: user?.name || "",
                address: user?.address || ""
            });
        }
        setIsEditing(!isEditing);
        setUpdateMessage({ type: "", text: "" });
    };
    const handleSaveProfile = async () => {
        if (!user?.phone) return;

        setIsSaving(true);
        setUpdateMessage({ type: "", text: "" });

        try {
            const response = await axios.put(`http://localhost:5000/api/users/phone/${user.phone}`, {
                name: editForm.name,
                address: editForm.address
            });

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);

                // Update session storage
                sessionStorage.setItem("user", JSON.stringify(updatedUser));

                setUpdateMessage({
                    type: "success",
                    text: "Profile updated successfully!"
                });

                // Exit edit mode after successful update
                setTimeout(() => {
                    setIsEditing(false);
                    setUpdateMessage({ type: "", text: "" });
                }, 2000);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setUpdateMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to update profile"
            });
        } finally {
            setIsSaving(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-50/50 mx-auto px-4 md:px-10 pb-20 pt-10"
        >
            {/* --- Header Section --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-200 pb-8 gap-6">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">
                        Account Dashboard
                    </span>
                    <h2 className="text-4xl font-serif text-slate-900 tracking-tight">
                        {user?.name || "Member Profile"}
                    </h2>
                </div>

                <nav className="flex gap-8 text-[11px] uppercase font-bold tracking-widest">
                    {["orders", "profile"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 transition-all relative ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {tab === "orders" ? "Orders" : "Profile"}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === "orders" ? (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                    <ShoppingBag size={18} className="text-indigo-500" />
                                    Purchase History
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            {["Reference", "Date", "Amount", "Status", "Payment"].map((h) => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan="5" className="py-20 text-center text-slate-400 animate-pulse text-sm">Synchronizing data...</td></tr>
                                        ) : orders.length === 0 ? (
                                            <tr><td colSpan="5" className="py-20 text-center text-slate-400 text-sm italic">No transaction records found.</td></tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5 font-bold text-slate-700 text-sm">#{order.orderNumber}</td>
                                                    <td className="px-6 py-5 text-slate-500 text-sm">
                                                        {new Date(order.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-5 font-bold text-slate-900 text-sm">₹{order.totalAmount}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                            }`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{order.paymentStatus}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <Package className="text-indigo-400 mb-4" size={24} />
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">Total Spendings</p>
                                    <h4 className="text-3xl font-serif mt-1">₹{orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</h4>
                                </div>
                                <div className="absolute -right-4 -bottom-4 text-white/5 rotate-12"><Package size={120} /></div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Summary</h4>
                                <div className="space-y-4">
                                    <SummaryItem label="Phone" value={user?.phone} />
                                    <SummaryItem label="Member Tier" value="Private Gold" color="text-indigo-600" />
                                    <SummaryItem label="Reward Points" value="1,240 pts" />
                                </div>
                            </div>
                        </aside>
                    </motion.div>
                ) : (
                    /* --- PROFESSIONAL PROFILE VIEW --- */
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="mx-auto grid grid-cols-1 md:grid-cols-12 gap-10"
                    >
                        {/* Sidebar */}
                        <div className="md:col-span-4 space-y-10">
                            <div className="bg-white border border-slate-200 rounded-[1rem] p-8 text-center shadow-sm">
                                <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-serif mb-4 shadow-lg ring-4 ring-slate-50">
                                    {user?.name?.charAt(0) || "M"}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                                <p className="text-slate-400 text-xs mt-1 mb-6 font-medium">{user?.phone}</p>
                                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Status</p>
                                        <p className="text-sm font-bold text-emerald-600">Active</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Role</p>
                                        <p className="text-sm font-bold text-slate-700">{user?.role || "Member"}</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => { sessionStorage.removeItem('user'); navigate('/') }} className="bg-slate-900 rounded-[1rem] w-full p-6 text-white shadow-sm border border-slate-800">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Security Settings</h4>
                                <SecurityLink icon={<LogOut size={14} />} label="Revoke Access" color="text-rose-400" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                                <h3 className="font-bold text-slate-800 text-sm">
                                    {isEditing ? "Edit Profile Information" : "General Information"}
                                </h3>
                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleEditToggle}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1"
                                            >
                                                <X size={14} /> Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-all disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <Save size={14} /> {isSaving ? "Saving..." : "Save Changes"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEditToggle}
                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-all"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-10">
                                {isEditing ? (
                                    /* Edit Mode Form */
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-2">
                                                Address
                                            </label>
                                            <textarea
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                                            <ProfileField label="Full Legal Name" value={user?.name} />
                                            <ProfileField label="Mobile Number" value={user?.phone} />
                                            <ProfileField label="Account Type" value={user?.role} />
                                            <ProfileField label="Member Since" value={new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || "January 2024"} />
                                            <ProfileField label="Address" value={user?.address || "Not provided"} />
                                            <ProfileField label="Location" value="New Delhi, IN" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* --- REFINED SUB-COMPONENTS --- */

function ProfileField({ label, value }) {
    return (
        <div className="group">
            <label className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-2 transition-colors group-hover:text-indigo-500">
                {label}
            </label>
            <p className="text-base text-slate-800 font-medium border-b border-transparent transition-all group-hover:border-slate-100 pb-1">
                {value || "—"}
            </p>
        </div>
    );
}

function SummaryItem({ label, value, color = "text-slate-700" }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

function SecurityLink({ icon, label, color = "text-slate-300" }) {
    return (
        <button className={`w-full flex items-center justify-between py-3 group hover:px-2 transition-all rounded-xl hover:bg-white/5`}>
            <div className="flex items-center gap-3">
                <span className={color}>{icon}</span>
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{label}</span>
            </div>
            <ChevronRight size={12} className="text-slate-600" />
        </button>
    );
}

export default CustomerLayout;