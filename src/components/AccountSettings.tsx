import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from './PasswordInput';

const AccountSettings: React.FC = () => {
  const { user, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({ name });
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserEmail(email);
      setMessage('Email updated successfully');
    } catch (error) {
      setMessage('Failed to update email');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await updateUserPassword(password);
      setMessage('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Failed to update password');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleUpdateProfile} className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
      <form onSubmit={handleUpdateEmail} className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Email</h3>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Email
        </button>
      </form>
      <form onSubmit={handleUpdatePassword}>
        <h3 className="text-xl font-semibold mb-2">Update Password</h3>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">New Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password</label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;