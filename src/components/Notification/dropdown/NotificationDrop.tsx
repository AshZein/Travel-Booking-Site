import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NotificationCard from '@/components/Notification/dropdown/NotificationCard';

const NotificationDrop: React.FC = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    interface Notification {
        id: number;
        message: string;
        date: string;
        read: boolean;
    }

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // Retrieve the token inside useEffect
        setIsAuthenticated(!!token);

        if (token) {
            fetch('/api/user/notifications', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => response.json())
            .then(data => {
                const sortedNotifications = data.notifications.sort(
                    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setNotifications(sortedNotifications);
            });
        }
    }, []);

    const markAsRead = (id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <span className="text-bold" style={{ display: 'block', textAlign: 'center' }}><b>Notifications</b></span>
                {notifications.length > 0 ? <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => router.push('/profile/notifications')}
                >
                    Show All ({notifications.filter((notif: any) => !notif.read).length} Unread)
                </span> : <p className='pt-2'>No Notifications to show</p>}
            </div>
            {notifications.slice(0, 5).map((notif: any, index: number) => (
                <NotificationCard
                    key={index}
                    id={notif.id}
                    message={notif.message}
                    date={notif.date}
                    read={notif.read}
                    onMarkAsRead={markAsRead} // Pass the markAsRead function
                />
            ))}
        </div>
    );
};

export default NotificationDrop;