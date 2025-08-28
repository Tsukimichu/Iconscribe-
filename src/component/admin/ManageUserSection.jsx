import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ManageUserSection = () => {
  const [users, setUsers] = useState([
    { id: '001', name: 'Aldrin Portento', email: 'Aldrin@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '002', name: 'Dave Geroleo', email: 'Dave@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '003', name: 'Carl Madrigal', email: 'Carl@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '004', name: 'Mark Meñiring', email: 'Mark@gmail.com', contact: '09098765453', status: 'Suspended' },
    { id: '005', name: 'Jabiel Medroño', email: 'jabiel@gmail.com', contact: '09098765453', status: 'Inactive' },
    { id: '006', name: 'James Palma', email: 'James@gmail.com', contact: '09098765453', status: 'Banned' },
  ]);

  const [archived, setArchived] = useState([]);
  const [showArchives, setShowArchives] = useState(false);
  const [modal, setModal] = useState({ show: false, userId: null });
  const [time, setTime] = useState('00:00');
  const [duration, setDuration] = useState('1 day');
  const [message, setMessage] = useState('');
  const [countdowns, setCountdowns] = useState({});
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = {};
        let changed = false;
        Object.keys(prev).forEach(id => {
          if (prev[id] > 0) {
            updated[id] = prev[id] - 1;
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusStyle = {
    Active: 'bg-green-100 text-green-700',
    Suspended: 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-gray-100 text-gray-600',
    Banned: 'bg-red-100 text-red-700',
  };

  const updateStatus = (id, status) => {
    setUsers(users.map(user => (user.id === id ? { ...user, status } : user)));
  };

  const archiveUser = id => {
    const toArchive = users.find(user => user.id === id);
    setArchived([...archived, toArchive]);
    setUsers(users.filter(user => user.id !== id));
  };

  const restoreUser = id => {
    const toRestore = archived.find(user => user.id === id);
    setUsers([...users, { ...toRestore, status: 'Active' }]);
    setArchived(archived.filter(user => user.id !== id));
  };

  const handleSuspendConfirm = () => {
    const seconds = {
      '1 day': 86400,
      '3 days': 259200,
      '7 days': 604800
    }[duration] || 86400;

    updateStatus(modal.userId, 'Suspended');
    setCountdowns(prev => ({ ...prev, [modal.userId]: seconds }));
    setModal({ show: false, userId: null });
    setTime('00:00');
    setDuration('1 day');
    setMessage('');

    setTimeout(() => {
      updateStatus(modal.userId, 'Active');
      setCountdowns(prev => {
        const updated = { ...prev };
        delete updated[modal.userId];
        return updated;
      });
    }, seconds * 1000);
  };

  const handleBan = userId => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      updateStatus(userId, 'Banned');
    }
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-100 transition">
      <td className="px-4 py-3 font-medium">{user.id}</td>
      <td className="px-4 py-3">{user.name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{user.contact}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[user.status]}`}>
          {user.status}
        </span>
        {countdowns[user.id] > 0 && (
          <div className="text-xs text-gray-500 mt-1">⏱ {formatTime(countdowns[user.id])}</div>
        )}
      </td>
      <td className="px-4 py-3 space-x-2">
        {!showArchives ? (
          <>
            {user.status === 'Active' && (
              <>
                <button
                  onClick={() => setModal({ show: true, userId: user.id })}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleBan(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Ban
                </button>
              </>
            )}
            {user.status !== 'Active' && (
              <button
                onClick={() => updateStatus(user.id, 'Active')}
                className="bg-yellow-400 text-white px-3 py-1 rounded text-xs"
              >
                Activate
              </button>
            )}
            <button
              onClick={() => archiveUser(user.id)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-xs"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => restoreUser(user.id)}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
          >
            Restore
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white p-6 shadow-2xl"
    >
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-[#243b7d]">Manage Users</h1>
        <button
          onClick={() => setShowArchives(!showArchives)}
          className="bg-[#243b7d] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          {showArchives ? 'Back to Users' : 'View Archives'}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(showArchives ? archived : users).map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800">Suspend User</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
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
                onChange={e => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModal({ show: false, userId: null })}
                className="bg-gray-300 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Suspend
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUserSection;
