import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// ======================= ADMIN LOGIN ======================= //
export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Trim inputs
    email = email?.trim();
    password = password?.trim();

    // ✅ Trim env variables
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// ======================= DASHBOARD ======================= //
export const getDashboard = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const comments = await Comment.find()
      .populate({ path: "blog", select: "title isPublished" }) // ✅ Populate blog info
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, blogs, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================= COMMENTS ======================= //

// Fetch all comments (for admin panel)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({ path: "blog", select: "title isPublished" }) // ✅ Populate blog info
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Approve comment
export const approveCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.isApproved = true;
    await comment.save();

    res.json({
      success: true,
      message: "Comment approved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Delete comment
export const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};