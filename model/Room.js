import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    city: String,
    price: Number,
    type: { type: String, enum: ["PG", "Hostel", "Flat","Single Room", "Double Room", "Triple Room"] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;