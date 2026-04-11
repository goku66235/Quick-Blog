import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import connectDB from "./configs/db.js";

import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/BlogRoute.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();

// ✅ CONNECT DATABASE
await connectDB();

// ✅ CORS (PRODUCTION SAFE)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ✅ BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API ROUTES
app.get("/api", (req, res) => res.send("API WORKING ✅"));

app.use("/api/ai", aiRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);

// ✅ SERVE FRONTEND (IMPORTANT)
// ✅ SERVE FRONTEND (FIXED)
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "server/public")));

// ✅ React catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public/index.html"));
});
// ✅ PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});

export default app;