"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditRoomPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    price: "",
    type: "PG",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  const fetchRoomDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/auth/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setForm(data);
      } else {
        toast.error(data.error || "Failed to load room");
        router.push("/dashboard");
      }
    } catch (err) {
    //   toast.error("Error loading room");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/auth/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to update room");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-blue-600">Loading room...</p>;

  return (
    <div className="max-w-xl border mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Room Title"
          className="input"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          className="input"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price per month"
          className="input"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          className="input"
          value={form.type}
          onChange={handleChange}
        >
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
          <option value="Double Room">Triple Room</option>
        </select>

        <button
          className="btn bg-blue-600 text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Room"}
        </button>
      </form>
    </div>
  );
}