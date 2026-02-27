import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, TrendingDown, Clock, CreditCard, AlertTriangle, Star, Truck, RefreshCw } from "lucide-react";

function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        metrics: {
            totalRevenue: 0,
            totalOrders: 0,
            totalCustomers: 0,
            totalProducts: 0,
            averageOrderValue: 0,
            conversionRate: 0,
            pendingOrders: 0,
            lowStockItems: 0,
        },
        revenueData: [],
        orderStatusData: [],
        topProducts: [],
        recentOrders: [],
        categoryDistribution: [],
        monthlyComparison: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/dashboard/stats");
            if (response.data.success) {
                setDashboardData({
                    metrics: response.data.metrics || {
                        totalRevenue: 0,
                        totalOrders: 0,
                        totalCustomers: 0,
                        totalProducts: 0,
                        averageOrderValue: 0,
                        conversionRate: 0,
                        pendingOrders: 0,
                        lowStockItems: 0,
                    },
                    revenueData: response.data.charts?.revenueData || [],
                    orderStatusData: response.data.charts?.orderStatusData || [],
                    topProducts: response.data.charts?.topProducts || [],
                    recentOrders: response.data.recentOrders || [],
                    categoryDistribution: response.data.charts?.categoryDistribution || [],
                    monthlyComparison: response.data.charts?.monthlyComparison || [],
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Add safety checks for array data
    const revenueData = Array.isArray(dashboardData.revenueData) ? dashboardData.revenueData : [];
    const orderStatusData = Array.isArray(dashboardData.orderStatusData) ? dashboardData.orderStatusData : [];
    const topProducts = Array.isArray(dashboardData.topProducts) ? dashboardData.topProducts : [];
    const recentOrders = Array.isArray(dashboardData.recentOrders) ? dashboardData.recentOrders : [];
    const categoryDistribution = Array.isArray(dashboardData.categoryDistribution) ? dashboardData.categoryDistribution : [];

    return (
        <div className="min-h-screen">
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Revenue" value={formatCurrency(dashboardData.metrics.totalRevenue)} icon={<DollarSign className="w-6 h-6 text-green-600" />} trend="+12.5%" trendUp={true} bgColor="bg-green-100" />
                <MetricCard title="Total Orders" value={dashboardData.metrics.totalOrders} icon={<ShoppingBag className="w-6 h-6 text-blue-600" />} trend="+8.2%" trendUp={true} bgColor="bg-blue-100" />
                <MetricCard title="Total Customers" value={dashboardData.metrics.totalCustomers} icon={<Users className="w-6 h-6 text-purple-600" />} trend="+5.7%" trendUp={true} bgColor="bg-purple-100" />
                <MetricCard title="Avg. Order Value" value={formatCurrency(dashboardData.metrics.averageOrderValue)} icon={<TrendingUp className="w-6 h-6 text-orange-600" />} trend="-2.3%" trendUp={false} bgColor="bg-orange-100" />
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SimpleMetricCard title="Pending Orders" value={dashboardData.metrics.pendingOrders} icon={<Clock className="w-5 h-5 text-yellow-600" />} bgColor="bg-yellow-50" />
                <SimpleMetricCard title="Low Stock Items" value={dashboardData.metrics.lowStockItems} icon={<AlertTriangle className="w-5 h-5 text-red-600" />} bgColor="bg-red-50" />
                <SimpleMetricCard title="Total Products" value={dashboardData.metrics.totalProducts} icon={<Package className="w-5 h-5 text-indigo-600" />} bgColor="bg-indigo-50" />
                <SimpleMetricCard title="Conversion Rate" value={`${dashboardData.metrics.conversionRate}%`} icon={<TrendingUp className="w-5 h-5 text-teal-600" />} bgColor="bg-teal-50" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
                        <select className="border rounded-lg px-3 py-1 text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Revenue" />
                            <Area type="monotone" dataKey="profit" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Profit" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#3B82F6" name="Units Sold" />
                            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Orders →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === "Delivered" ? "bg-green-100 text-green-800" : order.status === "Shipped" ? "bg-blue-100 text-blue-800" : order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : order.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <QuickActionButton icon={<Package />} title="Add New Product" description="Add new perfume to inventory" color="bg-blue-600" />
                <QuickActionButton icon={<Truck />} title="Update Orders" description="Process pending orders" color="bg-green-600" />
                <QuickActionButton icon={<Users />} title="Manage Users" description="View and manage customers" color="bg-purple-600" />
                <QuickActionButton icon={<CreditCard />} title="View Reports" description="Generate sales reports" color="bg-orange-600" />
            </div>
        </div>
    );
}

// Metric Card Component (unchanged)
const MetricCard = ({ title, value, icon, trend, trendUp, bgColor }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                <div className="flex items-center mt-2">
                    {trendUp ? <TrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
                    <span className={`text-sm ${trendUp ? "text-green-600" : "text-red-600"}`}>{trend}</span>
                    <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
            </div>
            <div className={`${bgColor} p-3 rounded-full`}>{icon}</div>
        </div>
    </div>
);

// Simple Metric Card Component (unchanged)
const SimpleMetricCard = ({ title, value, icon, bgColor }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`${bgColor} p-3 rounded-full`}>{icon}</div>
        </div>
    </div>
);

// Quick Action Button Component (unchanged)
const QuickActionButton = ({ icon, title, description, color }) => (
    <button className={`${color} text-white rounded-lg p-4 hover:opacity-90 transition-opacity`}>
        <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">{icon}</div>
            <div className="text-left">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-xs text-white text-opacity-90">{description}</p>
            </div>
        </div>
    </button>
);

export default Dashboard;
