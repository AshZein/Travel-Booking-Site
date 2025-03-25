import React, { useState } from 'react';
import NotificationPopup from '@/components/Notification/NotificationPopup';

interface NotificationCardProps {
    id: number;
    message: string;
    date: string;
    read: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ id, message, date, read }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [readStatus, setRead] = useState(read);
    const [cleared, setCleared] = useState(false);

    const clickPopup = () => {
        setShowPopup(true);

        const accessToken = localStorage.getItem('accessToken');
        fetch(`/api/user/notifications`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                id,
                read: true,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update notification status');
                }
                setRead(true);
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const clearNotification = () => {
        const accessToken = localStorage.getItem('accessToken');
        fetch(`/api/user/notifications`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                id,
                cleared: true,
                read: true
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to clear notification');
                }
                setRead(true);
                setCleared(true); // Mark the notification as cleared
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const formatDate = (isoDate: string) => {
        const dateObj = new Date(isoDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    if (cleared) {
        return null; // Do not render the notification if it is cleared
    }

    return (
        <>
            <div
                className={`p-2 border bg-white shadow-md flex items-center gap-2 relative ${readStatus ? 'text-gray-500' : 'text-black'}`}
            >
                <div className="flex-1 cursor-pointer" onClick={clickPopup}>
                    <div className="text-sm text-left text-gray-400">{formatDate(date)}</div>
                    <div className="text-md font-semibold">{message}</div>
                </div>
                <span
                    className="absolute bottom-1 right-2 text-gray-400 text-xs underline hover:text-gray-600 cursor-pointer"
                    onClick={clearNotification}
                >
                    Clear
                </span>
            </div>
            {showPopup && (
                <NotificationPopup
                    message={message}
                    date={formatDate(date)}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
};

export default NotificationCard;