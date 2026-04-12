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

// ================= FRONTEND =================
const __dirname = path.resolve();

// IMPORTANT: your build is inside server/public
app.use(express.static(path.join(__dirname, "server", "public")));

// fallback for React routes ONLY
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "server", "public", "index.html"));
});
// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});