"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaUserShield, FaTrashAlt, FaSearch } from "react-icons/fa";

const UsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication and role
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const userRole = session?.user?.role || 'user';
    if (userRole !== 'admin') {
      Swal.fire({
        title: 'Access Denied',
        text: 'Only administrators can access this page.',
        icon: 'error',
        confirmButtonColor: '#435ba1',
      }).then(() => {
        router.push('/dashboard');
      });
      return;
    }

    // Fetch users if admin
    fetchUsers();
  }, [status, session, router]);

  // Fetch all users from MongoDB
  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        Swal.fire("Error", "Failed to load users", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Search filter
  useEffect(() => {
    const result = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, users]);

  // Make Admin
  const handleMakeAdmin = async (id) => {
    Swal.fire({
      title: "Make this user an Admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/users/${id}/admin`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          });
          
          if (res.ok) {
            setUsers((prev) =>
              prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
            );
            Swal.fire("Success", "User promoted to admin!", "success");
          } else {
            const error = await res.json();
            Swal.fire("Error", error.message || "Failed to promote user", "error");
          }
        } catch (err) {
          Swal.fire("Error", err.message, "error");
        }
      }
    });
  };

  // Delete user
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/users/${id}`, {
            method: "DELETE",
          });
          
          if (res.ok) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            Swal.fire("Deleted!", "User has been removed.", "success");
          } else {
            const error = await res.json();
            Swal.fire("Error", error.message || "Failed to delete user", "error");
          }
        } catch (err) {
          Swal.fire("Error", err.message, "error");
        }
      }
    });
  };

  if (loading || status === 'loading') {
    return (
      <div className="w-11/12 mx-auto my-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-6 bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/3">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-[#136afb] text-white">
            <tr>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Role</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">{user.name}</td>
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3 capitalize">{user.role}</td>
                <td className="py-2 px-3 flex items-center justify-center gap-3">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="text-green-600 hover:text-green-800"
                      title="Make Admin"
                    >
                      <FaUserShield size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filtered.map((user) => (
          <div
            key={user._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2"
          >
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
            <div className="flex gap-4 mt-2">
              {user.role !== "admin" && (
                <button
                  onClick={() => handleMakeAdmin(user._id)}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm"
                >
                  <FaUserShield /> Make Admin
                </button>
              )}
              <button
                onClick={() => handleDelete(user._id)}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
