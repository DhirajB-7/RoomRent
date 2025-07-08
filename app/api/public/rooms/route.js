import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/model/Room";
import User from "@/model/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;
    const skip = (page - 1) * limit;

    const rooms = await Room.find()
      .skip(skip)
      .limit(limit)
      .populate("owner", "name");

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("Error is here", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}