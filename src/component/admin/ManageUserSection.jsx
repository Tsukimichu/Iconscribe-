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
  const [modal, setModal] = useState({ show: false, userId: null, action: null });
  const [duration, setDuration] = useState('');
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

  const handleTimedAction = () => {
    const seconds = parseInt(duration) * 60;
    if (isNaN(seconds) || seconds <= 0) return alert('Invalid duration');
    const targetStatus = modal.action === 'ban' ? 'Banned' : 'Suspended';

    updateStatus(modal.userId, targetStatus);
    setCountdowns(prev => ({ ...prev, [modal.userId]: seconds }));
    setModal({ show: false, userId: null, action: null });
    setDuration('');

    setTimeout(() => {
      updateStatus(modal.userId, 'Active');
      setCountdowns(prev => {
        const updated = { ...prev };
        delete updated[modal.userId];
        return updated;
      });
    }, seconds * 1000);
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
                  onClick={() => setModal({ show: true, userId: user.id, action: 'suspend' })}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                >
                  Suspend
                </button>
                <button
                  onClick={() => setModal({ show: true, userId: user.id, action: 'ban' })}
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
            className="bg-white p-6 rounded-lg shadow-xl w-80 space-y-4"
          >
            <h2 className="text-xl font-bold">
              Set {modal.action === 'ban' ? 'Ban' : 'Suspend'} Time
            </h2>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring focus:ring-blue-300"
              placeholder="Enter minutes"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModal({ show: false, userId: null, action: null })}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button onClick={handleTimedAction} className="bg-blue-600 text-white px-3 py-1 rounded">
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUserSection;
