import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NotificationDrop from '@/components/Notification/dropdown/NotificationDrop';

const HomeHeader: React.FC = () => {
    const HomeRouter = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogoClick = () => {
        HomeRouter.push('/');
    };

    const handleAuthClick = () => {
        if(isAuthenticated)
            HomeRouter.push('/profile')
        else
            HomeRouter.push('/auth'); // Single auth page for both login and register
    };

    const toggleNotifications = () => {
        console.log('Toggling notifications', !showNotifications);
        setShowNotifications((showNotifications) => !showNotifications); // Toggle the visibility of NotificationDrop
    };
    
    return(
        <header className="header flex justify-between items-center text-white p-4">
            <div className="items-center flex gap-2">
                <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8 cursor-pointer" onClick={handleLogoClick}/>
                <h1 className="text-2xl cursor-pointer" onClick={handleLogoClick}>FlyNext</h1>
            </div>
            <div className="auth-buttons flex gap-8 items-center">
                <img src="itinerarysymbol_white.png" alt="Itinerary" className="h-9 mt-1 cursor-pointer" onClick={() => HomeRouter.push('/itinerary')}/>
                
                {isAuthenticated ? (
                    <div className="relative">
                        <img
                            src="whiteNotificationBell.png"
                            alt="NotificationBell"
                            className="h-8 cursor-pointer"
                            onClick={toggleNotifications}
                        />
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded border border-red-500">
                                <NotificationDrop />
                            </div>
                        )}
                    </div>
                ) : null}
                
                <button 
                    className="auth-button text-white font-bold py-2 px-4 rounded bg-blue-500"
                    onClick={handleAuthClick}
                >
                    {isAuthenticated ? 'Profile' : 'Login / Register'}
                </button>
            </div>
        </header>
    );
}

export default HomeHeader;
