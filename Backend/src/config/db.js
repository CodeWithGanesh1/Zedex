import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
    try {
        console.log("URI:", config.MONGO_URI);

        await mongoose.connect(config.MONGO_URI);

        console.log("MongoDB connected");
    } catch (err) {
        console.error("Mongo Error Full:", err);
        throw err;
    }
};

export default connectDB;