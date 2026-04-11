import React, { useEffect, useState } from "react";
import CommentTableitem from "../../components/admin/CommentTableitem";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");
  const { axios } = useAppContext();

  // ✅ Fetch comments
  const fetchComments = async () => {
    try {
      const { data } = await axios.get("/api/admin/comments");

      const localComments =
        JSON.parse(localStorage.getItem("dummyComments")) || [];

      if (data.success) {
        setComments([...data.comments, ...localComments]);
      } else {
        toast.error(data.message);
        setComments(localComments);
      }
    } catch {
      const localComments =
        JSON.parse(localStorage.getItem("dummyComments")) || [];
      setComments(localComments);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    const comment = comments.find((c) => c._id === id);

    // 🚫 Block local comments
    if (!comment || comment.isLocal) {
      toast.error("Local comment cannot be approved");
      return;
    }

    try {
      const { data } = await axios.patch(
        `/api/admin/comment/${id}/approve`
      );

      if (data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, isApproved: true } : c
          )
        );

        toast.success("Approved ✅");
      }
    } catch {
      toast.error("Approve failed");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    const comment = comments.find((c) => c._id === id);

    try {
      // DB delete
      if (!comment?.isLocal) {
        await axios.delete(`/api/admin/comment/${id}`);
        toast.success("Deleted from server");
      } else {
        throw new Error("local");
      }

      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // Local delete fallback
      const local =
        JSON.parse(localStorage.getItem("dummyComments")) || [];

      const updatedLocal = local.filter((c) => c._id !== id);

      localStorage.setItem("dummyComments", JSON.stringify(updatedLocal));

      setComments((prev) => prev.filter((c) => c._id !== id));

      toast.success("Deleted locally");
    }
  };

  // ✅ Filter
  const filteredComments = comments.filter((item) =>
    filter === "Approved" ? item.isApproved : !item.isApproved
  );

  return (
    <div className="flex-1 p-5 sm:p-10 bg-blue-50/50 min-h-screen">
      <h1 className="text-xl font-semibold mb-6">Comments</h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("Approved")}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            filter === "Approved"
              ? "bg-primary text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("Not Approved")}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            filter === "Not Approved"
              ? "bg-primary text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Not Approved
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4 max-w-3xl">
        {filteredComments.length === 0 && (
          <p className="text-gray-400 text-sm">No comments found</p>
        )}

        {filteredComments.map((item) => (
          <CommentTableitem
            key={item._id}
            item={item}
            handleApprove={handleApprove}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;