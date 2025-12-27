import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://finai-buddy.vercel.app",   // <-- your Vercel frontend
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Health check
app.get("/", (_, res) => {
  res.send("FinAI Backend is running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
