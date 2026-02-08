import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, UserPlus, PencilLine, Trash2, Users } from "lucide-react";

function User() {

    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        phone: "",
        address: ""
    });
    const [users, setUsers] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    useEffect(() => { getUsers() }, []);

    const deleteUser = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${deleteId}`);
            setUsers(users.filter(u => u._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addUser = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/users", formData);
            setUsers([res.data, ...users]);
            setShowAddModal(false);
            setFormData({
                name: "", password: "",
                phone: "", address: ""
            });
        } catch (err) {
            console.error("Add error : ", err);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            password: user.password,
            phone: user.phone,
            address: user.address
        });
        setEditId(user._id);
        setIsEdit(true);
        setShowAddModal(true);
    };

    const updateUser = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${editId}`, formData);
            setUsers(users.map(u => u._id === editId ? res.data : u));
            resetModal();
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const resetModal = () => {
        setShowAddModal(false);
        setIsEdit(false);
        setEditId(null);
        setFormData({ name: "", password: "", phone: "", address: "" });
    };
    
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className=" mx-auto">

                {/* Header with Search & Add Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
                        <p className="text-slate-500 text-sm">Create, edit, and manage your organization's members.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
                        >

                            <UserPlus size={16} />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Address</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-16 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-semibold border border-slate-200">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{u.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 font-medium">{u.password}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 font-medium">{u.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-400">{u.address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-1">
                                                {/* Action Buttons */}
                                                <button
                                                    onClick={() => handleEdit(u)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <PencilLine size={18} />
                                                </button>

                                                <button
                                                    onClick={() => setDeleteId(u._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <div className="py-20 text-center">
                            <Users className="mx-auto text-slate-200 mb-4" size={48} />
                            <h3 className="text-slate-900 font-semibold">No users found</h3>
                            <p className="text-slate-500 text-sm">Start by adding your first user to the system.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                    <div className="bg-white rounded-xl shadow-xl w-80 p-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">Delete User</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete this user?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteUser}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add and Edit User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit User' : 'Create New User'}</h2>
                            <p className="text-sm text-slate-500">Fill in the details {isEdit ? 'to edit member.' : 'to register a new member.'}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Residential Address</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={isEdit ? updateUser : addUser}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95"
                            >
                                {isEdit ? "Update User" : "Save User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default User;