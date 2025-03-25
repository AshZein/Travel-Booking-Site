import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NotificationCard from '@/components/Notification/dropdown/NotificationCard';

const NotificationDrop: React.FC = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');
    const [notification, setNotifications] = useState([]);

    useEffect(() => {
        setIsAuthenticated(!!token);
        if (isAuthenticated) {
            fetch('/api/user/notifications', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            })
            .then(response => response.json())
            .then(data => {
            const sortedNotifications = data.notifications.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setNotifications(sortedNotifications);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
            console.log(notification);
        }
    }, []);
    
    return(
        <div className="notification-dropdown">
            {notification.slice(0, 5).map((notif: any, index: number) => (
            <NotificationCard key={index} message={notif.message} date={notif.date} read={notif.read}/>
            ))}
        </div>
    );
}

export default NotificationDrop;