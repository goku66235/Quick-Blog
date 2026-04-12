import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";

import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/BlogRoute.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();
await connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API =================
app.use("/api/ai", aiRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);

// ================= STATIC =================
const __dirname = path.resolve();

// 🔥 IMPORTANT FIX HERE

app.use(express.static(path.join(__dirname, "server", "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "server", "public", "index.html"));
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});