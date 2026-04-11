import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: String,
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true } // ✅ adds createdAt automatically
);

export default mongoose.model("Blog", blogSchema);