import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";

import connectDB from "./configs/db.js";

import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/BlogRoute.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();

// ================= DATABASE =================
await connectDB();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
app.get("/api", (req, res) => {
  res.send("API WORKING ✅");
});

app.use("/api/ai", aiRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);

// ================= FRONTEND (RENDER FIXED) =================

const __dirname = path.resolve();

// ✅ CORRECT: serve React build
app.use(express.static(path.join(process.cwd(), "server", "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "server", "public", "index.html"));
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});

export default app;