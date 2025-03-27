"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationDrop from '@/components/Notification/dropdown/NotificationDrop';

const HomeHeader: React.FC = () => {
<<<<<<< HEAD
  const HomeRouter = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
=======
    const HomeRouter = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);
>>>>>>> c658f742ec203665e58441b74db523db8e6abd43

  useEffect(() => {
    // Check if there's a valid token in local storage:
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
<<<<<<< HEAD
  }, []);

  const handleLogoClick = () => {
    HomeRouter.push("/");
  };

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      // Not logged in, go to /auth
      HomeRouter.push("/auth");
    } else {
      // Already logged in, toggle dropdown
      setShowDropdown(!showDropdown);
    }
  };

  const handleEditProfile = () => {
    setShowDropdown(false);
    HomeRouter.push("/profile");
  };

  const handleLogout = async () => {
    // (Optional) call /api/user/logout here, passing refreshToken if you store that
    // For now, just remove token from localStorage and redirect to /auth
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowDropdown(false);
    HomeRouter.push("/auth");
  };

  return (
    <header className="header flex justify-between items-center text-white p-4">
      {/* Left: logo and brand */}
      <div className="items-center flex gap-2">
        <img
          src="logo_no_back.png"
          alt="FlyNext Logo"
          className="h-8 cursor-pointer"
          onClick={handleLogoClick}
        />
        <h1 className="text-2xl cursor-pointer" onClick={handleLogoClick}>
          FlyNext
        </h1>
      </div>

      {/* Middle: itinerary icon (optional) */}
      <div>
        <img
          src="itinerarysymbol_white.png"
          alt="Itinerary"
          className="h-8 cursor-pointer"
          onClick={() => HomeRouter.push("/itinerary")}
        />
      </div>

      {/* Right: Auth button + (possibly) a dropdown */}
      <div className="auth-buttons flex gap-4 relative" ref={dropdownRef}>
        <button
          className="auth-button text-white font-bold py-2 px-4 rounded bg-blue-500"
          onClick={handleAuthClick}
        >
          {isAuthenticated ? "Profile" : "Login / Register"}
        </button>

        {/* Only show dropdown if user is logged in AND showDropdown is true */}
        {isAuthenticated && showDropdown && (
          <div className="absolute right-0 mt-12 w-40 bg-white text-black rounded shadow-md">
            <ul className="py-1">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleEditProfile}
              >
                Edit Profile
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
=======

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
                            <div className="absolute right-1 mt-2 w-64 bg-white text-black shadow-lg rounded border" style={{ zIndex: 50 }}>
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
>>>>>>> c658f742ec203665e58441b74db523db8e6abd43

export default HomeHeader;
