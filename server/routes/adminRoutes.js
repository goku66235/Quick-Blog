import express from "express";
import auth from "../middleware/auth.js";
import {
  adminLogin,
  getDashboard,
  deleteCommentById,
  approveCommentById
} from "../controllers/adminController.js";

import { getAllAdminBlogs } from "../controllers/BlogController.js";
import Comment from "../models/Comment.js";

const adminRouter = express.Router();

// AUTH
adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", auth, getDashboard);

// COMMENTS
adminRouter.get("/comments", auth, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blog", "title isPublished")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// APPROVE
adminRouter.patch(
  "/comment/:commentId/approve",
  auth,
  approveCommentById
);

// DELETE
adminRouter.delete(
  "/comment/:commentId",
  auth,
  deleteCommentById
);

// BLOGS
adminRouter.get("/blogs", auth, getAllAdminBlogs);

export default adminRouter;