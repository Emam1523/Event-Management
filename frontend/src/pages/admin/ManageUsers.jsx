import { useState, useEffect } from "react";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiShield,
  FiSearch,
  FiTrash2,
  FiSlash,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api, { adminAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminAPI.getUsers();
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteUser = async (userId) => {
    if (currentUser && currentUser.id === userId) {
      alert("Self-termination is prohibited!");
      return;
    }
    if (!window.confirm("Strike this member from the directory permanently?"))
      return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleToggleBlock = async (userId, currentRole) => {
    if (currentRole === "admin") {
      alert("You cannot block an administrator.");
      return;
    }
    const newRole = currentRole === "blocked" ? "user" : "blocked";
    if (
      !window.confirm(
        `Are you sure you want to ${currentRole === "blocked" ? "unblock" : "block"} this user?`,
      )
    )
      return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Member Directory
          </h1>
          <p className="text-gray-400 font-medium">
            Manage the elite community of your event platform.
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Member
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Credentials
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Rank
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Date Joined
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">
                  Settings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-white/5 rounded-lg"></div>
                          <div className="w-20 h-3 bg-white/5 rounded-lg"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      variants={itemVariants}
                      layout
                      className="group hover:bg-white/3 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-linear-to-br from-brand-orange/20 to-orange-500/20 border border-brand-orange/20 text-brand-orange rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-brand-orange/5">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-black text-white group-hover:text-brand-orange transition-colors">
                              {u.name}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                              #{u.id.toString().slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1 text-sm font-medium">
                          <span className="flex items-center gap-2 text-gray-300">
                            <FiMail className="text-brand-orange opacity-60" />{" "}
                            {u.email}
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-2 text-gray-400 text-xs">
                              <FiPhone className="opacity-60" /> {u.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {u.role === "admin" && (
                            <FiShield className="text-purple-400" />
                          )}
                          <span
                            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                              u.role === "admin"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-lg shadow-purple-500/10"
                                : "bg-white/5 text-gray-500 border-white/10"
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6"></td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role !== "admin" && (
                            <>
                              <button
                                onClick={() => handleToggleBlock(u.id, u.role)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                                  u.role === "blocked"
                                    ? "bg-orange-500/10 text-brand-orange border-brand-orange/20 hover:bg-orange-500/20"
                                    : "bg-white/5 text-gray-500 border-white/10 hover:text-brand-orange"
                                }`}
                                title={
                                  u.role === "blocked"
                                    ? "Unblock Member"
                                    : "Block Member"
                                }
                              >
                                <FiSlash />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                                title="Strike Member"
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiUser className="text-3xl text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No members found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Try refining your search to discover users in the directory.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageUsers;
