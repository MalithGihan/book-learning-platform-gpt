import mongoose from "mongoose";

export async function connectDB(mongoUri: string) {
  if (!mongoUri) throw new Error("MONGO_URI is missing");

  mongoose.connection.on("connected", () => {
    console.log("-----------Connect--------> MongoDB connected", mongoose.connection.name);
  });

  mongoose.connection.on("error", (err) => {
    console.error("-----------Failed--------> MongoDB connection error:", err);
  });

  await mongoose.connect(mongoUri);
}
