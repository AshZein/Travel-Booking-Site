import React from 'react';

interface NotificationCardProps {
    message: string;
    date: string;
    read: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ message, date, read }) => {
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
        <div 
            className={`p-4 border rounded-md shadow-md ${read ? 'text-gray-500' : 'text-black'}`} 
        >
            <div className="text-sm text-left text-gray-400">{formatDate(date)}</div>
            <div className="text-lg font-semibold">{message}</div>
        </div>
    );
}

export default NotificationCard;