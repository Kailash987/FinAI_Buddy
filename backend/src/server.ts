import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import progressRoutes from "./routes/progress";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Allow localhost on any port for development
      if (origin.match(/^http:\/\/localhost(:\d+)?$/) || 
          origin.match(/^http:\/\/127\.0\.0\.1(:\d+)?$/)) {
        return callback(null, true);
      }
      
      // Allow all Vercel deployments (*.vercel.app)
      if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
        return callback(null, true);
      }
      
      // Allow specific production origins (if you have a custom domain)
      const allowedOrigins = [
        "https://finai-buddy.vercel.app",
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Log rejected origins for debugging
      console.log(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/", (_, res) => {
  res.send("FinAI Backend is running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});