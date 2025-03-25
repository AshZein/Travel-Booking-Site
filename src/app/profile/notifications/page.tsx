"use client";
import React, { useState, useEffect } from 'react';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import { useRouter } from "next/navigation";
import NotificationCard from '@/components/Notification/page/NotificationCard';

const Page = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notifications, setNotifications] = useState([]);

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
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
            });
        }
    }, []);

    return (
        <div>
            <HomeHeader />
            <main>
                <h1>Notifications</h1>
                <div>
                    {notifications.map((notification: any, index: number) => (
                        <NotificationCard key={index} id={notification.id} message={notification.message} date={notification.date} read={notification.read}/>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );  
}

export default withItineraryProvider(Page);