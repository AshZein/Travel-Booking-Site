"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationDrop from "@/components/Notification/dropdown/NotificationDrop";
import { SunIcon } from "@heroicons/react/24/solid";
import { MoonIcon } from "@heroicons/react/16/solid";


const HomeHeader: React.FC = () => {
  const HomeRouter = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // For the Notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  
  // For the Profile dropdown (Edit / Logout)
  const [showDropdown, setShowDropdown] = useState(false);

  // Ref to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      // Fallback to system preference if no localStorage value
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  /**
   * 1) Check local storage for tokens on mount:
   *    If there's "token" or "accessToken", user is logged in.
   */
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  

  /**
   * Close *all* dropdowns if clicking outside the dropdown area.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logo click → homepage
  const handleLogoClick = () => {
    HomeRouter.push("/");
  };

  // Auth button or user image click → toggle profile dropdown if logged in, else go /auth
  const handleAuthClick = () => {
    if (!isAuthenticated) {
      HomeRouter.push("/auth");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleEditProfile = () => {
    setShowDropdown(false);
    HomeRouter.push("/profile");
  };

  const handleLogout = async () => {
    // Remove tokens from localStorage. 
    // (Optionally call /api/user/logout if you have a backend route.)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setShowDropdown(false);
    HomeRouter.push("/");
  };

  // Notification bell click → toggle notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="header flex justify-between items-center text-white p-4">
      {/* -- LEFT: Logo + Title -- */}
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


      {/* -- RIGHT: Notification + Auth Button + Dropdowns -- */}

      <div className="auth-buttons flex gap-4 relative" ref={dropdownRef}>
    <div className="grid grid-cols-4 gap-2">
      <SunIcon className="w-10 h-10"></SunIcon>
      <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full relative transition-all">
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white border rounded-full transition-all ${
            darkMode ? "left-6" : "left-0"
          }`}
        ></div>
      </div>
    </label>
    <MoonIcon className="w-10 h-10"></MoonIcon>

    </div>
        {/* Show notification bell if logged in */}
        <img
          src="itinerarysymbol_white.png"
          alt="Itinerary"
          className="h-8 cursor-pointer"
          onClick={() => HomeRouter.push("/itinerary")}
        />

        {/* Notification bell (only if logged in) */}
        {isAuthenticated && (
          <div className="relative">
            <img
              src="whiteNotificationBell.png"
              alt="NotificationBell"
              className="h-8 cursor-pointer"
              onClick={toggleNotifications}
            />
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded border"
                style={{ zIndex: 50 }}
              >
                <NotificationDrop />
              </div>
            )}
          </div>
        )}

        {/* Auth / Profile (round avatar) */}
        {isAuthenticated ? (
          <img
            // Use a user-specific URL or a default placeholder:
            src="default.png"
            alt="Profile"
            className="h-8 w-8 rounded-full cursor-pointer border border-white"
            onClick={handleAuthClick}
          />
        ) : (
          <button
            className="auth-button text-white font-bold py-2 px-4 rounded bg-blue-500"
            onClick={handleAuthClick}
          >
            Login / Register
          </button>
        )}

        {/* Profile dropdown (Edit Profile / Logout) */}
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

export default HomeHeader;
