"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/AuthHeader"; // <-- import the AuthHeader

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
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.phoneNumber
      ) {
        setError("All fields are required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
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

      // After login or register, push to home (or profile) page:
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
      {/* Include the AuthHeader at the top */}
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

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border p-2 rounded text-gray-900"
            />
          </div>

          {isRegister && (
            <>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded text-gray-900"
                />
              </div>

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

        <button className="mt-4 text-blue-700 underline" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Log in" : "Don't have an account? Register"}
        </button>
      </div>
    </>
  );
};

export default AuthPage;
