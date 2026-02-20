import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CreditCard, Truck } from "lucide-react";

function Order() {

    const [orders, setOrders] = useState([]);

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

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className="mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            My Orders
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Track and manage your perfume purchases.
                        </p>
                    </div>
                </div>

                {/* Orders Table Card */}
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
        </div>
    );
}

export default Order;