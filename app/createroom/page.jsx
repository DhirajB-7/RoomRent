"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateRoom() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    price: "",
    type: "PG",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(" Room created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || " Failed to create room");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl border mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Room Title"
          className="input"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price per month"
          className="input"
          onChange={handleChange}
          required
        />
        <select
          name="type"
          className="input"
          onChange={handleChange}
          value={form.type}
        >
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
          <option value="Triple Room">Triple Room</option>
        </select>

        <button
          className="btn bg-green-600 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
}