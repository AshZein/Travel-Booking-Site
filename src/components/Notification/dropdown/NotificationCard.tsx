import React, { useState } from 'react';
import NotificationPopup from '@/components/Notification/NotificationPopup';

interface NotificationCardProps {
    id: number;
    message: string;
    date: string;
    read: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({id, message, date, read }) => {
    const [showPopup, setShowPopup] = useState(false);

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
            return response.json();
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };

    // Format the date
    const formatDate = (isoDate: string) => {
        const dateObj = new Date(isoDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <>
            <div 
                className={`p-2 border rounded-md shadow-md ${read ? 'text-gray-500' : 'text-black'}`}
                onClick={clickPopup}
            
            >
                <div className="text-sm text-left text-gray-400">{formatDate(date)}</div>
                <div className="text-md font-semibold">{message}</div>
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
}

export default NotificationCard;