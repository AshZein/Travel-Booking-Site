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

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user data");
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/auth");
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  const handleEditClick = (field: string) => {
    setEditingField(field);
    setPasswordError("");

    if (field === "password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setUpdatedValue(user[field as keyof typeof user]);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !editingField) return;

    if (editingField === "password") {
      // validate passwords
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("Please fill in all password fields.");
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch("/api/user/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Password update failed");

        alert("Password updated successfully!");
        setEditingField(null);
      } catch (error: any) {
        console.error("Password update error:", error);
        setPasswordError(error.message || "Something went wrong.");
      }

      return;
    }

    // For other profile fields
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField]: updatedValue }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      setUser({ ...user, [editingField]: updatedValue });
      setEditingField(null);
      setUpdatedValue("");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Update failed. Please check console for details.");
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="auth-page flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Profile</h2>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-black">
          {Object.keys(user).map((field) => (
            <div
              key={field}
              className="flex justify-between items-center mb-4"
            >
              <span className="font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </span>

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

          {/* 🔐 Password Edit Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Password</span>
              {editingField === "password" ? (
                <button
                  className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              ) : (
                <button
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEditClick("password")}
                >
                  ✏️
                </button>
              )}
            </div>

            {editingField === "password" && (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                {passwordError && <p className="text-red-500">{passwordError}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;