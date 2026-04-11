import express from "express";
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  togglePublish,
  addComment,
  getComments,
  deleteBlog
} from "../controllers/BlogController.js";

import { upload } from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// BLOG
blogRouter.post("/add", auth, upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.patch("/:blogId/toggle-publish", auth, togglePublish);
blogRouter.delete("/:blogId", auth, deleteBlog);

// COMMENTS (IMPORTANT FIX HERE)
blogRouter.post("/:blogId/comments", addComment);   // ✅ FIXED
blogRouter.get("/:blogId/comments", getComments);   // ✅ OK

export default blogRouter;