import React, { useEffect, useState } from "react";
import { blog_data, blogCategories } from "../assets/assets"; // dummy blogs
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import Loader from "./Loader";

const BlogList = () => {
  const { input: searchInput, activeCategory, setActiveCategory, axios } = useAppContext();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("/api/blog/all");
        if (data.success) {
          setBlogs([...data.blogs, ...blog_data]); // merge admin + dummy blogs
        } else {
          setBlogs(blog_data);
        }
      } catch (err) {
        toast.error("Server down, showing dummy blogs");
        setBlogs(blog_data);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    const matchesSearch =
      searchInput === "" ||
      blog.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchInput.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-4">Latest Blogs</h1>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {blogCategories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm cursor-pointer transition-all ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => <BlogCard key={blog._id || blog.id} blog={blog} />)
        ) : (
          <p className="col-span-full text-center text-gray-400">No blogs found 😢</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;