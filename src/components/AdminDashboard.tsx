import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulated API call to fetch users
    const fetchUsers = () => {
      const mockUsers: User[] = [
        { id: '1', email: 'admin@example.com', isAdmin: true },
        { id: '2', email: 'user1@example.com', isAdmin: false },
        { id: '3', email: 'user2@example.com', isAdmin: false },
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
    ));
  };

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="flex items-center justify-between">
              <span>{user.email}</span>
              <div>
                <span className={`mr-2 ${user.isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
                <button
                  onClick={() => toggleAdminStatus(user.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Toggle Admin
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;