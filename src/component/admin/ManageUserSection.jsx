import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Pause, UserX, Check, Archive, RotateCcw, Clock } from "lucide-react";


const ManageUserSection = () => {
  const [users, setUsers] = useState([]);
  const [archived, setArchived] = useState([]);
  const [showArchives, setShowArchives] = useState(false);
  const [modal, setModal] = useState({ show: false, userId: null });
  const [time, setTime] = useState("00:00");
  const [duration, setDuration] = useState("1 day");
  const [message, setMessage] = useState("");
  const [countdowns, setCountdowns] = useState({});
  const [newUserAlert, setNewUserAlert] = useState(false);
  const [lastUserCount, setLastUserCount] = useState(0);
  const [newUsers, setNewUsers] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [seenUsers, setSeenUsers] = useState([]);



  // ------------------------------
  // Fetch Users + Archived Users
  // ------------------------------
  useEffect(() => {
    let firstLoad = true;

    const fetchUsers = () => {
      fetch("http://localhost:5000/api/users")
        .then((res) => res.json())
        .then((data) => {
          const newList = Array.isArray(data.data) ? data.data : [];

          // Detect new users (ignore first load)
          if (!firstLoad && newList.length > lastUserCount) {
            const diff = newList.length - lastUserCount;

            // Only consider users that haven't been seen yet
            const foundNewUsers = newList
              .slice(-diff)
              .filter((u) => !seenUsers.includes(u.user_id));

            if (foundNewUsers.length > 0) {
              setNewUsers(foundNewUsers);
              setNewUserAlert(true);

              setTimeout(() => setNewUserAlert(false), 10000);
            }
          }

          // update for next fetch
          setLastUserCount(newList.length);
          firstLoad = false;
          setUsers(newList);
        })
        .catch((err) => console.error("❌ Error fetching users:", err));
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [lastUserCount, seenUsers]);




  // ------------------------------
  // Close dropdown when clicking outside
  // ------------------------------
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".notif-bell-area")) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Countdown for suspended users
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        let changed = false;
        Object.keys(prev).forEach((userId) => {
          if (prev[userId] > 0) {
            updated[userId] = prev[userId] - 1;
            changed = true;
          } else {
            updated[userId] = 0;
          }
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusStyle = {
    Active: "bg-green-100 text-green-700",
    Suspended: "bg-yellow-100 text-yellow-800",
    Inactive: "bg-gray-100 text-gray-600",
    Banned: "bg-red-100 text-red-700",
  };

  // Update user status
  const updateStatus = async (userId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      console.log(data);

      setUsers((prev) => prev.map((u) => (u.user_id === userId ? { ...u, status } : u)));
      setArchived((prev) => prev.map((u) => (u.user_id === userId ? { ...u, status } : u)));
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  const archiveUser = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${userId}/archive`,
        { method: "PUT" }
      );
      const data = await res.json();
      console.log(data);

      const toArchive = users.find((u) => u.user_id === userId);
      if (toArchive) {
        setArchived((prev) => [...prev, toArchive]);
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      }
    } catch (err) {
      console.error("❌ Error archiving user:", err);
    }
  };

  const restoreUser = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${userId}/restore`,
        { method: "PUT" }
      );
      const data = await res.json();
      console.log(data);

      const toRestore = archived.find((u) => u.user_id === userId);
      if (toRestore) {
        setUsers((prev) => [...prev, { ...toRestore, status: "Active" }]);
        setArchived((prev) => prev.filter((u) => u.user_id !== userId));
      }
    } catch (err) {
      console.error("❌ Error restoring user:", err);
    }
  };

  // Suspend user
  const handleSuspendConfirm = () => {
    const seconds =
      {
        "1 day": 86400,
        "3 days": 259200,
        "7 days": 604800,
      }[duration] || 86400;

    // set suspended and countdown
    updateStatus(modal.userId, "Suspended");
    setCountdowns((prev) => ({ ...prev, [modal.userId]: seconds }));

    // close modal & reset
    setModal({ show: false, userId: null });
    setTime("00:00");
    setDuration("1 day");
    setMessage("");

    // auto-reactivate after seconds
    setTimeout(() => {
      updateStatus(modal.userId, "Active");
      setCountdowns((prev) => {
        const updated = { ...prev };
        delete updated[modal.userId];
        return updated;
      });
    }, seconds * 1000);
  };

  const handleBan = (userId) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      updateStatus(userId, "Banned");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0m 0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const visibleUsers = showArchives ? archived : users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto p-4"
    >
    <div className="flex items-center justify-between mb-2">
      <h1 className="text-4xl font-extrabold text-cyan-700">Manage Users</h1>
      <div className="flex items-center gap-4">
              <div className="relative notif-bell-area mb-4">

        {/* 🔔 Bell */}
        <Bell
          onClick={() => {
            setIsNotifOpen((prev) => !prev);
            setNewUserAlert(false);
          }}
          className={`w-6 h-6 text-gray-700 cursor-pointer transition 
            ${newUserAlert ? "animate-bounce" : ""}
          `}
        />

        {/* 🔴 Red dot */}
        {newUserAlert && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}

        {/* ▼ Dropdown */}
        {isNotifOpen && (
          <div
            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-3 border border-gray-200 animate-fadeSlide z-50"
          >
            <p className="font-semibold text-gray-700 mb-2">New Users</p>

            {newUsers.length === 0 && (
              <p className="text-sm text-gray-500 italic">No new users</p>
            )}

            {newUsers.map((u) => (
              <div
                key={u.user_id}
                className="p-2 bg-gray-100 rounded-lg mb-1 flex flex-col"
              >
                <span className="font-medium text-gray-800">{u.name}</span>
                <span className="text-xs text-gray-500">{u.email}</span>
              </div>
            ))}

            {/* ⚠️ CLEAR NOTIFS BUTTON */}
            {newUsers.length > 0 && (
              <button
                onClick={() => {
                  setSeenUsers((prev) => [...prev, ...newUsers.map((u) => u.user_id)]);
                  setNewUsers([]);
                  setNewUserAlert(false);
                }}
                className="w-full mt-2 text-center text-xs text-red-600 hover:text-red-700 font-medium py-1 border-t pt-2"
              >
                Clear Notifications
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setShowArchives(!showArchives)}
          className="bg-[#243b7d] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          {showArchives ? 'Back to Users' : 'View Archives'}
        </button>
      </div>
      </div>
    </div>


      <div className="max-h-[550px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[900px] text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                { key: "user_id", label: "User ID" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Contact" },
                { key: "address", label: "Address" },
                { key: "business", label: "Business" },
                { key: "status", label: "Status" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-3 px-6 font-semibold cursor-default text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-6 font-semibold text-center text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {visibleUsers.map((user, idx) => {
              const isSuspended = user.status === "Suspended";
              const isBanned = user.status === "Banned";

              return (
                <motion.tr
                  key={user.user_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-gray-200 transition ${
                    isBanned ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-6">{user.user_id}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.phone}</td>
                  <td className="py-3 px-6">{user.address || "—"}</td>
                  <td className="py-3 px-6">{user.business || "—"}</td>

                  <td className="py-3 px-6">
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[user.status]}`}
                      >
                        {user.status}
                      </span>
                      {countdowns[user.user_id] > 0 && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>⏱ {formatTime(countdowns[user.user_id])}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {!showArchives ? (
                        <>
                          {user.status === "Active" && (
                            <>
                              {/* Suspend — yellow */}
                              <button
                                onClick={() => setModal({ show: true, userId: user.user_id })}
                                className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium transition"
                              >
                                <span>Suspend</span>
                              </button>

                              {/* Ban — red */}
                              <button
                                onClick={() => handleBan(user.user_id)}
                                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition"
                              >
                                <span>Ban</span>
                              </button>
                            </>
                          )}

                          {user.status !== "Active" && user.status !== "Banned" && (
                            <button
                              onClick={() => updateStatus(user.user_id, "Active")}
                              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm font-medium transition"
                            >
                              <span>Activate</span>
                            </button>
                          )}

                          {/* Archive — always available (if not archived) */}
                          <button
                            onClick={() => archiveUser(user.user_id)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition"
                            disabled={isBanned}
                            title={isBanned ? "Cannot archive a banned user" : "Archive"}
                          >
                            <span>Archive</span>
                          </button>
                        </>
                      ) : (
                        /* Restore on archive view */
                        <button
                          onClick={() => restoreUser(user.user_id)}
                          className="flex items-center gap-2 bg-[#243b7d] hover:bg-[#203560] text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Suspend Modal */}
      {modal.show && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3">Suspend User</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-sm"
                >
                  <option value="1 day">1 day</option>
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Suspension Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setModal({ show: false, userId: null })}
                  className="bg-gray-100 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendConfirm}
                  className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
                >
                  Suspend
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUserSection;
