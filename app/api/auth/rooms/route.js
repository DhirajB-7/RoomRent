import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/model/Room";
import jwt from "jsonwebtoken";

// ✅ POST - Create Room
export async function POST(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();
    const newRoom = new Room({ ...body, owner: decoded.id });
    await newRoom.save();
    return NextResponse.json({ message: "Room created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ GET - Get Rooms of Current Owner
export async function GET(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rooms = await Room.find({ owner: decoded.id });
    return NextResponse.json(rooms);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}