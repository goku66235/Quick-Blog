import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    name: { type: String, required: true },
    email: { type: String }, // optional
    message: { type: String, required: true },
    isApproved:{type:Boolean,default:false}
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// ✅ Use CommentSchema here
const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;