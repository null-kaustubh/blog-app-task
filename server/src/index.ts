import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";

console.log("🚀 Server file is being executed");

//Connect to database
connectDB();

const app = express();

//Security middleware
app.use(helmet());
app.use(compression());

//Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});
app.use("/api/", limiter);

//CORS config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

//Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

//Server health check ep
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

//Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error: ", err);

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  //JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  //Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

//404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
