"use client";
import { useEffect, useState, useRef, useCallback } from "react";

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const observer = useRef();

  // Reset everything when component mounts
  useEffect(() => {
    setRooms([]);
    setPage(1);
    setHasMore(true);
    setSearchMode(false);
  }, []);

  // Fetch rooms when page or mode changes
  useEffect(() => {
    if (!searchMode) {
      fetchRooms(page);
    }
  }, [page, searchMode]);

  const fetchRooms = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/rooms?page=${currentPage}&limit=6`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.rooms)) {
        setRooms((prev) => {
          const newRooms = data.rooms.filter(
            (room) => !prev.some((r) => r._id === room._id)
          );
          return [...prev, ...newRooms];
        });
        setHasMore(data.rooms.length > 0);
      }
    } catch (err) {
      console.error("Fetch rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim() && !searchType.trim()) return;
    setSearchMode(true);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/public/search?city=${searchCity.trim()}&type=${searchType.trim()}`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRooms(data);
        setHasMore(false);
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchCity("");
    setSearchType("");
    setRooms([]);
    setPage(1);
    setHasMore(true);
    setSearchMode(false);
  };

  const lastRoomRef = useCallback(
    (node) => {
      if (loading || searchMode) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, searchMode]
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🏠 Available Rooms</h1>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Search by City"
          className="border rounded p-2"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
          <option value="Triple Room">Triple Room</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🔍 Search
        </button>
        {searchMode && (
          <button
            type="button"
            className="text-red-600 underline ml-2"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {rooms.length > 0 ? (
          rooms.map((room, index) => {
            const refProp =
              rooms.length === index + 1 && !searchMode
                ? { ref: lastRoomRef }
                : {};
            return (
              <div
                {...refProp}
                key={room._id || `room-${index}`}
                className="border p-4 rounded-2xl shadow hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold">{room.title}</h3>
                <p className="text-gray-600">
                  {room.city} • ₹{room.price}
                </p>
                <p className="text-sm">{room.description}</p>
                <p className="text-sm italic text-gray-500 mt-1">
                  Type: {room.type}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Owner: {room?.owner?.name}
                </p>
              </div>
            );
          })
        ) : !loading ? (
          <div className="col-span-full text-center text-gray-500">
            No rooms found.
          </div>
        ) : null}
      </div>

      {loading && (
        <div className="text-center mt-4 text-blue-600 font-medium animate-pulse">
          Loading...
        </div>
      )}

      {!hasMore && !loading && !searchMode && (
        <div className="text-center mt-4 text-gray-500">
          No more rooms to load.
        </div>
      )}
    </div>
  );
}