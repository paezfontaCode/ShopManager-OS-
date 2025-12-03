import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { usersAPI } from '../services/api';
import Modal from '../components/Modal';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'technician' as 'admin' | 'technician'
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = (await usersAPI.getAll()) as any;
            setUsers(data.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
            console.error('Users error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                username: user.username,
                password: '', // Password not shown/editable directly here
                role: user.role
            });
        } else {
            setCurrentUser(null);
            setFormData({
                username: '',
                password: '',
                role: 'technician'
            });
        }
        setIsModalOpen(true);
    };

    const handleOpenPasswordModal = (user: User) => {
        setCurrentUser(user);
        setPasswordData({
            newPassword: '',
            confirmPassword: ''
        });
        setIsPasswordModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setCurrentUser(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Update user (username/role)
                await usersAPI.update(currentUser.id, {
                    username: formData.username,
                    role: formData.role
                });
                alert(t.userUpdated);
            } else {
                // Create user
                await usersAPI.create(formData);
                alert(t.userCreated);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Failed to save user');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert(t.passwordMismatch);
            return;
        }

        if (!currentUser) return;

        try {
            await usersAPI.changePassword(currentUser.id, {
                new_password: passwordData.newPassword
            });
            alert(t.passwordChanged);
            handleClosePasswordModal();
        } catch (err) {
            console.error('Error changing password:', err);
            alert('Failed to change password');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t.confirmDelete)) {
            try {
                await usersAPI.delete(id);
                alert(t.userDeleted);
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                <p className="font-semibold">Error loading users</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.userManagement}</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {t.addNewUser}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t.username}</th>
                            <th scope="col" className="px-6 py-3">{t.role}</th>
                            <th scope="col" className="px-6 py-3">{t.created}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            {user.role === 'admin' ? t.admin : t.technician}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="font-medium text-primary dark:text-primary-light hover:underline"
                                            >
                                                {t.editUser}
                                            </button>
                                            <button
                                                onClick={() => handleOpenPasswordModal(user)}
                                                className="font-medium text-yellow-600 dark:text-yellow-400 hover:underline"
                                            >
                                                {t.changePassword}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                            >
                                                {t.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    {t.noDataFound}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentUser ? t.editUser : t.addNewUser}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.username}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {!currentUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.password}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.role}</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
                        >
                            <option value="technician">{t.technician}</option>
                            <option value="admin">{t.admin}</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
                        >
                            {currentUser ? t.update : t.create}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                title={`${t.changePassword}: ${currentUser?.username}`}
            >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.newPassword}</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.confirmPassword}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClosePasswordModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
                        >
                            {t.changePassword}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
