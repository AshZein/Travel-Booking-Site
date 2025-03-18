"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [editingField, setEditingField] = useState<string | null>(null);
    const [updatedValue, setUpdatedValue] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/profile', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch user data');
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [router]);

    const handleEditClick = (field: string) => {
        setEditingField(field);
        setUpdatedValue(user[field as keyof typeof user]);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [editingField as string]: updatedValue })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Update failed');

            setUser({ ...user, [editingField as string]: updatedValue });
            setEditingField(null);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                {Object.keys(user).map((field) => (
                    <div key={field} className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                        {editingField === field ? (
                            <input 
                                type="text" 
                                value={updatedValue} 
                                onChange={(e) => setUpdatedValue(e.target.value)} 
                                className="border p-2 rounded text-gray-900"
                            />
                        ) : (
                            <span>{user[field as keyof typeof user]}</span>
                        )}
                        {editingField === field ? (
                            <button 
                                className="ml-2 bg-green-500 text-white px-3 py-1 rounded" 
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        ) : (
                            <button 
                                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded" 
                                onClick={() => handleEditClick(field)}
                            >
                                ✏️
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;