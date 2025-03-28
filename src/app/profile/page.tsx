"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/HomeHeader";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedValue, setUpdatedValue] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch user data");
        // data = { user: {...} }
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditClick = (field: string) => {
    setEditingField(field);
    setUpdatedValue(user[field as keyof typeof user]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField as string]: updatedValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      // Update local state with the new value
      setUser({ ...user, [editingField as string]: updatedValue });
      setEditingField(null);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <HomeHeader />

      {/*
        1) Use the "auth-page" class to match the teal background 
           used in your login/register pages (per globals.css).
      */}
      <div className="auth-page flex flex-col items-center justify-center min-h-screen p-6">
        {/* White text heading to contrast with teal background */}
        <h2 className="text-2xl font-bold mb-6 text-white">Profile</h2>

        {/*
          2) White "card" in the middle for user fields, matching 
             the style of your login form (white background, black text).
        */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          {Object.keys(user).map((field) => (
            <div
              key={field}
              className="flex justify-between items-center mb-4 text-black"
            >
              {/* Capitalize field name */}
              <span className="font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </span>

              {/* Either show input for editing, or the current field value */}
              {editingField === field ? (
                <input
                  type="text"
                  value={updatedValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  className="border p-2 rounded text-black"
                />
              ) : (
                <span>{user[field as keyof typeof user]}</span>
              )}

              {/* Save button if editing, else edit button */}
              {editingField === field ? (
                <button
                  className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              ) : (
                <button
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEditClick(field)}
                >
                  ✏️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
