import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// ------------------- BLOG ------------------- //

// Add blog
export const addBlog = async (req, res) => {
  try {
    let { title, subTitle, description, category, isPublished } = req.body;

    if (req.body.blog) {
      const blogData = JSON.parse(req.body.blog);
      title = blogData.title;
      subTitle = blogData.subTitle;
      description = blogData.description;
      category = blogData.category;
      isPublished = blogData.isPublished;
    }

    const imageFile = req.file;
    if (!title || !description || !category || !imageFile)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const response = await imagekit.upload({
      file: imageFile.buffer.toString("base64"),
      fileName: Date.now() + "-" + imageFile.originalname,
      folder: "/blogs",
    });

    const finalImage = imagekit.url({
      path: response.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: "800" }],
    });

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: finalImage || response.url,
      isPublished,
    });

    return res.status(200).json({ success: true, message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all published blogs (Home / Public)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blogs for admin (published + unpublished)
export const getAllAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle publish/unpublish blog
export const togglePublish = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog.isPublished = !blog.isPublished;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog is now ${blog.isPublished ? "published" : "unpublished"}`,
      blog,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- COMMENTS ------------------- //


// Add comment
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, email, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: blogId,        // ✅ ensure comment is linked to blog
      name,
      email,
      message,
      isApproved: false,   // ✅ NEW (important for admin approval)
    });

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get comments for a blog
export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blog: blogId,        // ✅ FIX: only this blog's comments
      isApproved: true     // ✅ FIX: only approved comments visible publicly
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};