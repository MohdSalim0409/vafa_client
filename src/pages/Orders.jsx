import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CreditCard, ChevronDown } from "lucide-react";

function Order() {
    const [orders, setOrders] = useState([]);

    // The Enum options from your Mongoose schema
    const statusOptions = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/order/admin`
                );
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    // Helper to apply dynamic colors to the dropdown based on status
    const getStatusStyles = (status) => {
        switch (status) {
            case "Placed": return "bg-blue-50 text-blue-700 ring-blue-600/20";
            case "Packed": return "bg-purple-50 text-purple-700 ring-purple-600/20";
            case "Shipped": return "bg-amber-50 text-amber-700 ring-amber-600/20";
            case "Delivered": return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
            case "Cancelled": return "bg-rose-50 text-rose-700 ring-rose-600/20";
            case "Returned": return "bg-slate-100 text-slate-700 ring-slate-600/20";
            default: return "bg-slate-50 text-slate-700 ring-slate-600/20";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Admin Orders
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Manage perfume orders and update delivery statuses.
                        </p>
                    </div>
                </div>

                {/* Orders Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Order</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Total</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Payment</th>
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

                                            {/* Order Status - Dropdown Button Design */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="relative inline-flex items-center justify-center group">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;

                                                            try {
                                                                const res = await axios.put(
                                                                    `http://localhost:5000/api/order/admin/${order._id}/status`,
                                                                    { orderStatus: newStatus }
                                                                );

                                                                // Update UI instantly without refresh
                                                                setOrders(prevOrders =>
                                                                    prevOrders.map(o =>
                                                                        o._id === order._id ? res.data : o
                                                                    )
                                                                );

                                                            } catch (error) {
                                                                console.error("Error updating status:", error);
                                                            }
                                                        }}
                                                        className={`
                                                            appearance-none cursor-pointer pl-4 pr-9 py-1.5 rounded-full text-[11px] font-bold 
                                                            ring-1 ring-inset transition-all focus:outline-none focus:ring-2
                                                            ${getStatusStyles(order.orderStatus)}
                                                        `}
                                                    >
                                                        {statusOptions.map((opt) => (
                                                            <option key={opt} value={opt} className="text-slate-900 bg-white">
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 pointer-events-none text-current opacity-60">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <CreditCard size={16} className="text-slate-500" />
                                                    <span className={`text-sm font-semibold ${order.paymentStatus === "Paid" ? "text-green-600" :
                                                            order.paymentStatus === "Failed" ? "text-red-600" :
                                                                "text-yellow-600"
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
        </div>
    );
}

export default Order;