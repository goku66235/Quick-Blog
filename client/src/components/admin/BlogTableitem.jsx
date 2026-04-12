import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const BlogTableitem = ({ blog, fetchBlogs, index }) => {
  const { _id, title, createdAt, isPublished } = blog;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const togglePublish = async () => {
    try {
      const { data } = await axios.patch(`/api/blog/${_id}/toggle-publish`);
      if (data.success)
        toast.success(`Blog is now ${data.blog.isPublished ? "Published" : "Unpublished"}`);
      fetchBlogs();
    } catch (err) {
      toast.error("Error toggling publish");
    }
  };

  const deleteBlog = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this blog?")) return;

    try {
      const { data } = await axios.delete(`/api/blog/${_id}`);
      if (data.success) {
        toast.success("Blog deleted!");
        fetchBlogs();
      }
    } catch {
      toast.error("Error deleting blog");
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="px-3 py-3">{index + 1}</td>

      <td className="px-3 py-3 font-medium text-gray-800">
        {title}
      </td>

      <td className="px-3 py-3 hidden sm:table-cell">
        {BlogDate.toDateString()}
      </td>

      <td className="px-3 py-3 hidden sm:table-cell">
        <span className={`px-2 py-1 rounded text-xs ${
          isPublished ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
        }`}>
          {isPublished ? "Published" : "Unpublished"}
        </span>
      </td>

      <td className="px-3 py-3">
        <div className="flex flex-col sm:flex-row gap-2">

          <button
  onClick={togglePublish}
  className={`px-2 py-1 rounded text-xs border transition cursor-pointer
    ${
      isPublished
        ? "bg-yellow-100 text-yellow-700 border-yellow-400 hover:bg-yellow-200"
        : "bg-green-100 text-green-700 border-green-400 hover:bg-green-200"
    }`}
>
  {isPublished ? "Unpublish" : "Publish"}
</button>

          <img
            src={assets.cross_icon}
            className="w-4 cursor-pointer"
            onClick={deleteBlog}
          />
        </div>
      </td>

    </tr>
  );
};

export default BlogTableitem;