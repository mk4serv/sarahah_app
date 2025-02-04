import dotenv from "dotenv"; // Load environment variables
import mongoose from "mongoose";
dotenv.config();

export const database_connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌", error);
    process.exit(1);
  }
};


