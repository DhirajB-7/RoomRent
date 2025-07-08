import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/model/Room";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const room = await Room.findOne({ _id: params.id, owner: decoded.id });

    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    await room.deleteOne();
    return NextResponse.json({ message: "Room deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();

    const room = await Room.findOne({ _id: params.id, owner: decoded.id });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    room.title = body.title;
    room.description = body.description;
    room.city = body.city;
    room.price = body.price;
    room.type = body.type;

    await room.save();
    return NextResponse.json({ message: "Room updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}