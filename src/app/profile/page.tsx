"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/HomeHeader";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedValue, setUpdatedValue] = useState("");
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUser(data.user);
    } catch (error) {
      console.error(error);
      router.push("/auth");
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) router.push("/");
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
      setUpdatedValue(user[field as keyof typeof user] as string);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !editingField) return;

    if (editingField === "password") {
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
      if (newPassword === currentPassword) {
        setPasswordError("New password must be different from current password.");
        return;
      }

      try {
        const response = await fetch("/api/user/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        alert("Password updated!");
        setEditingField(null);
      } catch (error: any) {
        setPasswordError(error.message || "Something went wrong.");
      }
      return;
    }

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
      if (!response.ok) throw new Error(data.message);
      setUser({ ...user, [editingField]: updatedValue });
      setEditingField(null);
      setUpdatedValue("");
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/user/upload-picture", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const cacheBuster = Date.now();
      const img = document.getElementById("profilePic") as HTMLImageElement;
      if (img) img.src = `images/users/${user.id}.png?${cacheBuster}`;
    } catch (err) {
      alert("Failed to upload image.");
      console.error(err);
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="auth-page flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Profile</h2>

        <div className="relative mb-6">
          <img
            id="profilePic"
            src={`images/users/${user.id}.png`}
            onError={(e) => ((e.target as HTMLImageElement).src = "images/users/default.png")}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow"
            onClick={() => document.getElementById("uploadPicInput")?.click()}
          >
            ✏️
          </button>
          <input
            id="uploadPicInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-black">
          {Object.keys(user).map(
            (field) =>
              field !== "id" && (
                <div key={field} className="grid grid-cols-3 items-center gap-4 mb-4">
                  <span className="font-medium text-left">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  {editingField === field ? (
                    <input
                      type="text"
                      value={updatedValue}
                      onChange={(e) => setUpdatedValue(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  ) : (
                    <span className="text-center">{user[field as keyof typeof user]}</span>
                  )}
                  <div className="flex justify-end">
                    {editingField === field ? (
                      <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEditClick(field)}>
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
              )
          )}

          {/* 🔐 Password row */}
          <div className="grid grid-cols-3 items-center gap-4 mb-4">
            <span className="font-medium text-left">Password</span>
            <span className="text-center">••••••</span>
            <div className="flex justify-end">
              {editingField === "password" ? (
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEditClick("password")}>
                  ✏️
                </button>
              )}
            </div>
          </div>

          {editingField === "password" && (
            <div className="space-y-4">
              <PasswordInput label="Current password" value={currentPassword} onChange={setCurrentPassword} />
              <PasswordInput label="New password" value={newPassword} onChange={setNewPassword} showStrength />
              <PasswordInput label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

// 👁️ Password input with toggle & strength bar
const PasswordInput = ({
  label,
  value,
  onChange,
  showStrength = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  showStrength?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  const getStrength = () => {
    if (value.length === 0) return -1;
    if (value.length < 6) return 0;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    return [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  };

  const strength = getStrength();
  const labels = ["Poor", "Weak", "Fair", "Good", "Strong"];
  const widths = ["5%", "25%", "50%", "75%", "100%"];
  const colors = ["bg-red-800", "bg-red-400", "bg-yellow-400", "bg-green-300", "bg-green-600"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? "🙈" : "👁️"}
        </button>
      </div>
      {showStrength && strength >= 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${colors[strength]}`}
              style={{ width: widths[strength] }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-600">{labels[strength]}</p>
        </div>
      )}
    </div>
  );
};