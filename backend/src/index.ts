// src/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mainRouter from "./routes/routes"; // Corrected: Points to src/routes/routes.ts
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./common/swagger/openapi.json"; // Path relative to backend root
import requestLogger from "./common/middleware/requestLogger"; // Corrected path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Mount the main API router under /api/v1 prefix
app.use("/api/v1", mainRouter);

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
};

const main = async () => {
  await connectDB();
  startServer();
};

main();
