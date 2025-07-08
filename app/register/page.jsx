"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlusIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(" Registered Successfully!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
      <div className="w-full max-w-md border rounded-2xl shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-50">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoComplete="off"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
          <input
            autoComplete="off"
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
          <input
            autoComplete="off"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          >
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-transform duration-200 text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:scale-105 hover:bg-blue-700'
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlusIcon size={18} />}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}