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

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Optionally inform backend
      if (refreshToken) {
        await fetch("/api/user/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }

      // Always clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      // Still clear tokens just in case
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
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
        <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg right-0 z-10">
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
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}