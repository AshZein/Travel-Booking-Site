"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Call your logout API route
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No refresh token found in local storage.");
        return;
      }

      // POST to /api/user/logout, sending the refreshToken
      const res = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }), 
      });

      if (res.ok) {
        // Clear tokens from local storage (or cookie) if the server returns a success
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Then redirect user to login
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="border px-4 py-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        Profile
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg right-0">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
            >
              Edit Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
