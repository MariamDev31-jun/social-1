import mongoose from "mongoose";
import { env } from "../config/env";

console.log(env.db.url);

mongoose.connect(env.db.url)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err: Error) => {
        console.log("MongoDB connection error:", err.message);
    });