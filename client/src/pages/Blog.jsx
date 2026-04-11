import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blog_data, assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentData, setCommentData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [notFound, setNotFound] = useState(false);

  const shareUrl = window.location.href;

  // ✅ SHARE HANDLER
  const handleShare = (type) => {
    const title = blog?.title || "Check this blog";

    if (type === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        "_blank",
        "width=600,height=400"
      );
    }

    if (type === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
        "_blank",
        "width=600,height=400"
      );
    }

    if (type === "google") {
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(googleUrl, "_blank", "width=600,height=400");
    }
  };

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${id}`);
        if (data.success) setBlog(data.blog);
        else throw new Error();
      } catch {
        const b = blog_data.find((b) => b._id === id || b.id === id);
        if (!b) setNotFound(true);
        else setBlog(b);
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${id}/comments`);

        const dummyBlog = blog_data.find((b) => b._id === id || b.id === id);
        const dummyComments = dummyBlog?.comments || [];

        const localAll =
          JSON.parse(localStorage.getItem("dummyComments")) || [];

        const localComments = localAll.filter((c) => c.blogId === id);

        if (data.success) {
          setComments([...localComments, ...data.comments, ...dummyComments]);
        }
      } catch {
        const dummyBlog = blog_data.find((b) => b._id === id || b.id === id);

        const localAll =
          JSON.parse(localStorage.getItem("dummyComments")) || [];

        const localComments = localAll.filter((c) => c.blogId === id);

        setComments([...localComments, ...(dummyBlog?.comments || [])]);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id, axios]);

  // ✅ SUBMIT COMMENT (FINAL FIXED)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentData.name || !commentData.message) {
      return toast.error("Name & message required");
    }

    try {
      const { data } = await axios.post(
        `/api/blog/${id}/comments`, // ✅ FIXED ROUTE
        commentData
      );

      if (data.success) {
        toast.success("Comment submitted 🚀");

        const newTemp = {
          _id: Date.now().toString(),
          ...commentData,
          isApproved: false,
        };

        setComments((prev) => [newTemp, ...prev]);

        setCommentData({ name: "", email: "", message: "" });
      }
    } catch {
      // ✅ LOCAL FALLBACK (PERFECT)
      const newComment = {
        _id: Date.now().toString(),
        blogId: id,
        name: commentData.name,
        email: commentData.email,
        message: commentData.message,
        isApproved: false,
        isLocal: true,
        createdAt: new Date(),
      };

      const existing =
        JSON.parse(localStorage.getItem("dummyComments")) || [];

      localStorage.setItem(
        "dummyComments",
        JSON.stringify([newComment, ...existing])
      );

      setComments((prev) => [newComment, ...prev]);

      setCommentData({ name: "", email: "", message: "" });

      toast.success("Saved locally!");
    }
  };

  // ❌ NOT FOUND
  if (notFound)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <h1 className="text-4xl font-bold mt-24">404 - Blog Not Found</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );

  if (!blog)
    return <p className="text-center mt-24 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* CONTENT */}
      <div className="pt-24 flex-1 flex justify-center">

        <div className="w-full px-10 sm:px-16 md:px-24 lg:px-56 flex justify-center">

          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 sm:p-8">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
              {blog.title}
            </h1>

            {/* AUTHOR */}
            <p className="text-center text-gray-500 mt-2 text-sm">
              ✍️ Published by{" "}
              <span className="font-semibold text-yellow-500">Admin</span>
            </p>

            {/* IMAGE */}
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="my-6 w-full rounded-lg shadow-sm object-contain"
              />
            )}

            {/* DESCRIPTION */}
            <div
              className="rich-text mt-4 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: blog.description || "<p>No description</p>",
              }}
            />

            {/* SHARE */}
            <div className="flex justify-center gap-6 mt-6">
              <img
                src={assets.facebook_icon}
                onClick={() => handleShare("facebook")}
                className="w-10 h-10 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={assets.twitter_icon}
                onClick={() => handleShare("twitter")}
                className="w-10 h-10 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={assets.googleplus_icon}
                onClick={() => handleShare("google")}
                className="w-10 h-10 cursor-pointer hover:scale-110 transition"
              />
            </div>

            {/* COMMENTS */}
            <h3 className="text-xl font-semibold mt-10 mb-4">
              Comments ({comments.length})
            </h3>

            <div className="space-y-4 mb-8">
              {comments.length === 0 && (
                <p className="text-gray-400 text-sm">No comments yet</p>
              )}

              {comments.map((c) => (
                <div key={c._id} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-medium">
                    {c.name}
                    {c.isLocal && (
                      <span className="text-xs text-blue-400 ml-2">(Local)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{c.message}</p>
                </div>
              ))}
            </div>

            {/* FORM */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={commentData.name}
                onChange={(e) =>
                  setCommentData({ ...commentData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="email"
                placeholder="Your Email (optional)"
                value={commentData.email}
                onChange={(e) =>
                  setCommentData({ ...commentData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Write your comment..."
                value={commentData.message}
                onChange={(e) =>
                  setCommentData({ ...commentData, message: e.target.value })
                }
                rows={5}
                className="w-full border px-3 py-2 rounded"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white bg-indigo-500 hover:bg-indigo-600"
              >
                🚀 Submit Comment
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;