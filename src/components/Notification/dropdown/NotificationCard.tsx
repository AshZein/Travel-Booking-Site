import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

interface NotificationCardProps {
    message: string;
    date: string;
    read: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({message, date, read}) => {
    return (
        <div 
            className={`p-4 border rounded-md shadow-md ${read ? 'text-gray-500' : 'text-black'}`} 
        >
            <div className="text-sm text-left text-gray-400">{date}</div>
            <div className="text-lg font-semibold">{message}</div>
        </div>
    );
}

export default NotificationCard;