import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CreditCard, Truck } from "lucide-react";

function CustomerLayout() {
    
        const [orders, setOrders] = useState([]);
    
        useEffect(() => {
            const user = JSON.parse(sessionStorage.getItem("user"));
    
            if (user) {
                axios.get(`http://localhost:5000/api/order/user/${user.phone}`)
                    .then(res => setOrders(res.data))
                    .catch(err => console.error("Error fetching orders:", err));
            }
        }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-10 pb-20">
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-4xl font-serif">Elena Gilbert</h2>
                    <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Private Member</p>
                </div>
                <div className="flex gap-10 text-[10px] uppercase font-bold tracking-widest">
                    <button className="text-black border-b-2 border-black pb-2">Orders</button>
                    <button>Wishlist</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Real-time Order Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Order
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Payment
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-400">
                                            No Orders Found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">

                                            {/* Order Number */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Package size={18} className="text-indigo-500" />
                                                    <span className="text-sm font-bold text-slate-800">
                                                        {order.orderNumber}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-slate-600">
                                                    <Calendar size={16} />
                                                    <span className="text-sm">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total Amount */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-semibold text-emerald-600">
                                                    ₹ {order.totalAmount}
                                                </span>
                                            </td>

                                            {/* Order Status */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                    {order.orderStatus}
                                                </span>
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <CreditCard size={16} className="text-slate-500" />
                                                    <span className={`text-sm font-semibold ${order.paymentStatus === "Paid"
                                                        ? "text-green-600"
                                                        : order.paymentStatus === "Failed"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                        }`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CustomerLayout;