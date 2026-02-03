import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import StoreFront from "./pages/StoreFront";
import Order from './pages/Orders';
import Users from './pages/Users';
import Perfumes from './pages/Perfumes';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StoreFront />} />
				<Route path="/customer" element={<CustomerLayout />} />
				<Route path="/admin/*" element={<AdminLayout />} >
					<Route path="orders" element={<Order />} />
					<Route path="perfumes" element={<Perfumes />} />
					<Route path="users" element={<Users />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;