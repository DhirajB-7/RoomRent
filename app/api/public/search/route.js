// /app/api/public/rooms/search/route.js 
import { NextResponse } from "next/server"; 
import connectDB from "@/lib/db";
 import Room from "@/model/Room";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city") || "";
        const type = searchParams.get("type") || "";

        const query = {};

        if (city) {
            query.city = { $regex: new RegExp(city, "i") }; // case-insensitive match
        }

        if (type) {
            query.type = type;
        }

        const rooms = await Room.find(query).populate("owner", "name");
        return NextResponse.json(rooms);

    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}