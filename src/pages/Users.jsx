import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Users List</h1>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 border">Name</th>
                        <th className="p-3 border">Phone</th>
                        <th className="p-3 border">Role</th>
                        <th className="p-3 border">Address</th>
                        <th className="p-3 border">Created</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u._id} className="text-center hover:bg-gray-50">
                            <td className="p-3 border">{u.name}</td>
                            <td className="p-3 border">{u.phone}</td>
                            <td className="p-3 border">{u.role}</td>
                            <td className="p-3 border">{u.address}</td>
                            <td className="p-3 border">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
