"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/AuthHeader";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      const { firstName, lastName, email, password, confirmPassword, phoneNumber } = formData;

      if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
        setError("All fields are required");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!/^\d{10}$/.test(phoneNumber)) {
        setError("Phone number must be exactly 10 digits");
        return;
      }
    }

    const requestBody = isRegister
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    const endpoint = isRegister ? "/api/user/register" : "/api/user/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <AuthHeader />

      <div className="auth-page flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
        <h2 className="text-2xl font-bold mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          {isRegister && (
            <>
              <div className="flex space-x-2">
                <div className="flex flex-col w-1/2">
                  <label className="font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded text-gray-900"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded text-gray-900"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded text-gray-900"
            />
          </div>

          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(val) => setFormData({ ...formData, password: val })}
            showStrength={isRegister}
          />

          {isRegister && (
            <>
              <PasswordInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
              />

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded text-gray-900"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button
          className="mt-4 text-blue-700 underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have an account? Log in" : "Don't have an account? Register"}
        </button>
      </div>
    </>
  );
};

export default AuthPage;

// 🔐 Reusable password input with eye toggle & strength bar
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
    const length = value.length;
    if (length === 0) return -1;
    if (length < 6) return 0;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);

    const complexity = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    return complexity; // 1 = weak, 2 = fair, 3 = good, 4 = strong
  };

  const strength = getStrength();
  const strengthLabel = ["Poor", "Weak", "Fair", "Good", "Strong"][strength] || "";
  const strengthWidths = ["5%", "25%", "50%", "75%", "100%"];
  const strengthColors = [
    "bg-red-800",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-300",
    "bg-green-600",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded pr-12 text-gray-900"
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-base leading-none"
        >
          {visible ? "🙈" : "👁️"}
        </button>
      </div>

      {showStrength && value.length > 0 && strength >= 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
              style={{ width: strengthWidths[strength] }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-600">{strengthLabel}</p>
        </div>
      )}
    </div>
  );
};