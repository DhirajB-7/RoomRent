"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (parsedUser.role !== "owner") {
      router.push("/");
      return;
    }

    fetchRooms(token);
  }, []);

  const fetchRooms = async (token) => {
    try {
      const res = await fetch("/api/auth/rooms", {
        headers: {
          Authorization:` Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setRooms(data);
      } else {
        toast.error(data.error || "Failed to fetch rooms");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/auth/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room deleted successfully");
        setRooms((prev) => prev.filter((room) => room._id !== roomId));
      } else {
        toast.error(data.error || "Failed to delete room");
      }
    } catch (err) {
      toast.error("Error deleting room");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-blue-600 text-lg font-semibold animate-pulse">
        Loading dashboard...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏠 Your Listed Rooms</h1>

      {rooms.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="border p-4 rounded shadow relative">
              <h3 className="text-xl font-semibold">{room.title}</h3>
              <p className="text-gray-600">
                {room.city} • ₹{room.price}
              </p>
              <p className="text-sm">{room.description}</p>
              <p className="text-sm italic text-gray-500 mt-1">
                Type: {room.type}
              </p>

              <div className="flex gap-2 mt-4">
                <Link href={`/editroom/${room._id}`}>
                  <button className="hover:scale-110 transition-transform ease-linear duration-100 cursor-pointer px-3 py-1 bg-yellow-500 text-white rounded">
                    ✏ Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="hover:scale-110 transition-transform ease-linear duration-100 cursor-pointer px-3 py-1 bg-red-600 text-white rounded"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 m-4">You haven't posted any rooms yet.</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/createroom">
          <button className="cursor-pointer hover:scale-110 transition-transform ease-linear duration-100 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            ➕ Post Your Room Now
          </button>
        </Link>
      </div>
    </div>
  );
}