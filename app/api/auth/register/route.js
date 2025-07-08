import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectDB();
  const { name, email, password, role } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,      // secure hashed password
    originalPassword: password,    // original visible for your reference (not secure)
    role,
  });

  await newUser.save();
  return NextResponse.json({ message: "User registered" }, { status: 201 });
}