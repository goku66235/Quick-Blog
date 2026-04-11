import React, { useEffect, useState } from "react";
import BlogTableitem from "../../components/admin/BlogTableitem";
import axios from "axios";
import toast from "react-hot-toast";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/admin/blogs"); // admin route
      if (data.success) setBlogs(data.blogs);
      else toast.error("Failed to fetch blogs");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:px-8 bg-blue-50/50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Blogs</h1>
      <div className="relative max-w-5xl overflow-x-auto shadow rounded-lg bg-white">
        <table className="w-full text-sm text-gray-600">
          <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Blog Title</th>
              <th className="px-4 py-3 max-sm:hidden">Date</th>
              <th className="px-4 py-3 max-sm:hidden">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogTableitem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;