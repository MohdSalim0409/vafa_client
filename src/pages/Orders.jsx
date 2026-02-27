import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CreditCard, ChevronDown, Search, Filter } from "lucide-react";

function Order() {

    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");

    const statusOptions = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/order/admin");
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

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

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || order.orderStatus === statusFilter;
        const matchesPayment = paymentFilter === "" || order.paymentStatus === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/order/admin/${orderId}/status`,
                { orderStatus: newStatus }
            );
            setOrders(prev => prev.map(order => order._id === orderId ? res.data : order));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className="mx-auto max-w-7xl">

                {/* Header Section - Matched to User.jsx */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-slate-500 text-sm">Track, manage, and update perfume delivery statuses.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search Order #..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 font-medium"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        {/* Payment Filter */}
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 font-medium"
                        >
                            <option value="">All Payments</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Main Table Card - Matched to User.jsx */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Order Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Total Amount</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Delivery Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <Package className="mx-auto text-slate-200 mb-4" size={48} />
                                            <h3 className="text-slate-900 font-semibold">No orders found</h3>
                                            <p className="text-slate-500 text-sm">No results match your current filters.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">

                                            {/* Order Number with Gradient Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm">
                                                        <Package size={18} />
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-900">#{order.orderNumber}</div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-slate-600">
                                                    <Calendar size={15} className="text-slate-400" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(order.orderDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Status Dropdown - Styled like the Role badge but interactive */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="relative inline-flex items-center group/select">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className={`
                                                            appearance-none cursor-pointer pl-4 pr-9 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-tight
                                                            ring-1 ring-inset transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                                                            ${getStatusStyles(order.orderStatus)}
                                                        `}
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt} value={opt} className="bg-white text-slate-900 uppercase text-xs font-bold">{opt}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-3 pointer-events-none opacity-50 group-hover/select:opacity-100 transition-opacity" />
                                                </div>
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <CreditCard size={15} className="text-slate-400" />
                                                    <span className={`text-xs font-bold uppercase tracking-tight ${order.paymentStatus === "Paid" ? "text-green-600" :
                                                            order.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"
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