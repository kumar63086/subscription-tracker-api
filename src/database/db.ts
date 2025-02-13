import mongoose from "mongoose";
import { MONGO_URI } from "../config/env";

// Ensure that MONGO_URI is a string, throw an error if not defined
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// Function to connect to the database
const connectDb = async (): Promise<void> => {
  try {
    const data = await mongoose.connect(MONGO_URI);
    console.log(`DATABASE CONNECTED WITH ${data.connections[0].name}`);
  } catch (error: unknown) {
    // Handle error with 'unknown' type and proper type guarding
    if (error instanceof Error) {
      console.log("Error connecting to the database:", error.message);
    } else {
      console.log("An unknown error occurred while connecting to the database.");
    }
    setTimeout(connectDb, 5000); // Retry after 5 seconds
  }
};

export default connectDb;
