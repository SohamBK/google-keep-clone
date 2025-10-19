// src/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mainRouter from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import swaggerDocument from "./common/swagger/openapi.json";
import requestLogger from "./common/middleware/requestLogger";
import startPurgeDeletedNotesJob from "./cron/purgeDeletedNotes.cron";
import cors from "cors";
import passport from "passport";
import googleAuthRouter from "../src/api/auth/google.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Mount the main API router under /api/v1 prefix
app.use("/api/v1", mainRouter);

// Mount Google Auth routes
app.use("/api/v1/google-auth", googleAuthRouter);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database connection
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB connection string is not defined in .env file");
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected !");
  } catch (error) {
    console.error("Mongodb connection failed", error);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Start the cron job to purge deleted notes
  startPurgeDeletedNotesJob();
};

const main = async () => {
  await connectDB();
  startServer();
};

main();
