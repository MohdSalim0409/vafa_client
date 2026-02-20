import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CreditCard, ShoppingBag, Clock } from "lucide-react";

function CustomerLayout() {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            axios.get(`http://localhost:5000/api/order/user/${storedUser.phone}`)
                .then(res => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching orders:", err);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 md:px-10 pb-20 pt-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-serif text-slate-900">
                        {user?.name || "Member Profile"}
                    </h2>
                    <p className="text-indigo-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">
                        {user?.role || "Private Member"}
                    </p>
                </div>
                <div className="flex gap-8 text-[11px] uppercase font-bold tracking-widest">
                    <button className="text-black border-b-2 border-black pb-2 transition-all">Orders</button>
                    <button className="text-gray-400 hover:text-black transition-all pb-2">Wishlist</button>
                    <button className="text-gray-400 hover:text-black transition-all pb-2">Settings</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Main Table (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <ShoppingBag size={18} /> Recent Orders
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    {["Order", "Date", "Total", "Status", "Payment"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-20 text-slate-400 animate-pulse">Loading your orders...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-20 text-slate-400">No orders found.</td></tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                        #{order.orderNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-slate-500 text-sm">
                                                {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-sm font-bold text-slate-900">₹{order.totalAmount}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight
                                                    ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`text-[11px] font-bold ${order.paymentStatus === "Paid" ? "text-emerald-500" : "text-rose-500"}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/10 rounded-lg"><Package size={20} /></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Overview</span>
                        </div>
                        <p className="text-slate-400 text-xs">Total Orders</p>
                        <h4 className="text-3xl font-serif mt-1">{orders.length}</h4>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" /> Account Summary
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Phone</span>
                                <span className="font-medium text-slate-700">{user?.phone}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Loyalty Points</span>
                                <span className="font-medium text-indigo-600">1,250 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CustomerLayout;