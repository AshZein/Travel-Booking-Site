import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const HomeHeader: React.FC = () => {
    const HomeRouter = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
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
    
    return(
        <header className="header flex justify-between items-center text-white p-4">
            <div className="items-center flex gap-2">
                <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8 cursor-pointer" onClick={handleLogoClick}/>
                <h1 className="text-2xl cursor-pointer" onClick={handleLogoClick}>FlyNext</h1>
            </div>
            <div className="auth-buttons flex gap-4">
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
