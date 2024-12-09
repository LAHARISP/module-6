
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "HOD" | "MENTOR" | "STUDENT";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate inputs
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the role matches
        if (data.role && data.role.toLowerCase() === selectedRole.toLowerCase()) {
          router.push(`/${selectedRole.toLowerCase()}`); // Navigate to the respective dashboard
        } else {
          setError("Selected role does not match your account");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-white bg-opacity-70"></div>

      <div className="relative min-h-screen flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Image
              src="/DRAIT.jpg"
              alt="Dr. Ambedkar Institute of Technology Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#37474F] mb-2">
              Dr. AMBEDKAR INSTITUTE OF TECHNOLOGY
            </h1>
            <p className="text-sm text-gray-600">
              Outer Ring Road, Malathahalli, Bengaluru-560056, Karnataka, India
            </p>
          </div>

          <h2 className="text-3xl font-bold text-center text-[#37474F] mb-8">
            REGISTRATION MODULE
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {(["HOD", "MENTOR", "STUDENT"] as const).map((role) => (
              <button
                key={role}
                className={`px-8 py-2 rounded ${
                  selectedRole === role
                    ? "bg-[#37474F] text-white"
                    : "bg-[#5C6BC0] text-white hover:bg-[#37474F]"
                }`}
                onClick={() => setSelectedRole(role)}
                type="button"
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto">
            <div>
              <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-black w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full p-2 border rounded"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#37474F] text-white hover:bg-[#455A64] py-2 rounded"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
