import mongoose from "mongoose";
const connection = { isConnected: 0 };
const url: string = process.env.MONGO_URI as string;

export const connectToDB = async () => {
  try {
    if (connection?.isConnected) return;
    const db = await mongoose.connect(url);
    connection.isConnected = db.connections[0].readyState;
    console.log("mongodb connected successfully...");
  } catch (error) {
    throw new Error(error as string);
  }
};
