import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users, LogOut, Warehouse, LayoutDashboard } from "lucide-react";
import VafaBlack from "../assets/VafaBlack.png";

function AdminLayout() {

	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex min-h-screen"
		>
			{/* Sidebar */}
			<aside className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col fixed h-full z-[60]">
				<div className="flex items-center gap-3 mb-12">
					<img src={VafaBlack} alt="Vafa Logo" className="w-8 h-8" />
					<h2 className="font-serif text-xl font-bold tracking-tight text-gray-900">
						Vafa Admin
					</h2>
				</div>

				<nav className="space-y-3 flex-1">

					<NavLink
						to="/admin/dashboard"
						className={({ isActive }) =>
							`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
								? "bg-black text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100 hover:text-black"
							}`
						}
					>
						<LayoutDashboard  size={18} />
						<span className="text-sm font-semibold">Admin Dashboard</span>
					</NavLink>

					<NavLink
						to="/admin/users"
						className={({ isActive }) =>
							`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
								? "bg-black text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100 hover:text-black"
							}`
						}
					>
						<Users size={18} />
						<span className="text-sm font-semibold">User Directory</span>
					</NavLink>

					<NavLink
						to="/admin/perfumes"
						className={({ isActive }) =>
							`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
								? "bg-black text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100 hover:text-black"
							}`
						}
					>
						<Package size={18} />
						<span className="text-sm font-semibold">Perfume Directory</span>
					</NavLink>

					<NavLink
						to="/admin/inventory"
						className={({ isActive }) =>
							`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
								? "bg-black text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100 hover:text-black"
							}`
						}
					>
						<Warehouse size={18} />
						<span className="text-sm font-semibold">Inventory Control</span>
					</NavLink>

					<NavLink
						to="/admin/orders"
						className={({ isActive }) =>
							`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
								? "bg-black text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100 hover:text-black"
							}`
						}
					>
						<ShoppingBag size={18} />
						<span className="text-sm font-semibold">Order History</span>
					</NavLink>

				</nav>

				<button
					onClick={() => { sessionStorage.removeItem('user'); navigate('/') }}
					className="flex items-center gap-3 text-red-500 text-sm font-bold p-4 hover:bg-red-50 rounded-xl transition"
				>
					<LogOut size={18} /> Logout
				</button>
			</aside>

			{/* Main Content */}
			<main className="flex-1 ml-72 p-12 bg-[#F8F9FA]">
				<Outlet />
			</main>
		</motion.div>
	);
}

export default AdminLayout;