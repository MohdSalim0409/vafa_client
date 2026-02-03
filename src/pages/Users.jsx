import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Search,
    UserPlus,
    PencilLine,
    Trash2,
    MoreHorizontal,
    User,
    Mail
} from "lucide-react"; // npm install lucide-react

function Users() {
    const [users, setUsers] = useState([]);
    const [deleteId, setDeleteId] = useState(null);


    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${deleteId}`);
            setUsers(users.filter(u => u._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete error:", err);
        }
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
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-200">
                            <UserPlus size={16} />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-center">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
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
                                        <div className="text-sm text-slate-600 font-medium">{u.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-400">{u.address}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-1">
                                            {/* Action Buttons */}
                                            <button
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
            </div>
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
        </div>
    );
}

export default Users;