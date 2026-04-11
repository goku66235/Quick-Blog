import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const AddBlog = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    subTitle: "",
    description: "",
    category: "Startup",
    image: null,
    isPublished: false,
    publisher: "Admin",
  });

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  // ================= QUILL =================
  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your blog here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        setData((prev) => ({
          ...prev,
          description: quillRef.current.root.innerHTML,
        }));
      });
    }
  }, []);

  // ================= IMAGE =================
  const handleImage = (e) => {
    if (e.target.files[0]) {
      setData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ================= AI GENERATE =================
  const generateWithAI = async () => {
    if (!data.title) {
      return toast.error("Enter title first");
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/ai/generate", {
        title: data.title,
        category: data.category,
      });

      if (response.data.success) {
        const content = response.data.content;

        quillRef.current.root.innerHTML = content;

        setData((prev) => ({
          ...prev,
          description: content,
        }));

        toast.success("AI content generated ✨");
      } else {
        toast.error("Failed to generate content");
      }
    } catch (error) {
      console.error(error);
      toast.error("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.title || !data.description || !data.image) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "blog",
        JSON.stringify({
          title: data.title,
          subTitle: data.subTitle,
          description: data.description,
          category: data.category,
          isPublished: data.isPublished,
          publisher: data.publisher,
        })
      );

      formData.append("image", data.image);

      const res = await axios.post("/api/blog/add", formData);

      if (res.data.success) {
        toast.success("Blog added successfully 🚀");

        setData({
          title: "",
          subTitle: "",
          description: "",
          category: "Startup",
          image: null,
          isPublished: false,
          publisher: "Admin",
        });

        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(res.data.message || "Failed to add blog");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-blue-50/50 p-4 sm:p-6 lg:p-10">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md         /* mobile compact */
          sm:max-w-3xl     /* tablet wider */
          lg:max-w-5xl     /* desktop full layout */
          mx-auto
          bg-white
          rounded-2xl
          shadow-md
          p-5
          sm:p-8
          lg:p-10
          space-y-6
        "
      >
        {/* Upload */}
        <div className="w-full flex justify-center sm:justify-start">
          <div
            onClick={handleImageClick}
            className="
              w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36
              border-2 border-dashed rounded-lg 
              flex items-center justify-center 
              cursor-pointer hover:border-primary transition
            "
          >
            <img
              src={data.image ? URL.createObjectURL(data.image) : assets.upload_area}
              alt="thumbnail"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleImage}
          />
        </div>

        {/* Title, Subtitle, Publisher */}
        <input
          type="text"
          placeholder="Blog Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="w-full border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        />

        <input
          type="text"
          placeholder="Sub Title"
          value={data.subTitle}
          onChange={(e) => setData({ ...data, subTitle: e.target.value })}
          className="w-full border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        />

        <input
          type="text"
          placeholder="Publisher"
          value={data.publisher}
          onChange={(e) => setData({ ...data, publisher: e.target.value })}
          className="w-full border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        />

        {/* AI Button */}
        <button
          type="button"
          onClick={generateWithAI}
          className="w-full py-2.5 rounded-lg text-white font-semibold
          bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
          hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          ✨ Create Description with AI
        </button>

        {/* Editor */}
        <div
          ref={editorRef}
          className="border rounded-lg rich-text w-full"
          style={{
            minHeight: "180px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        />

        {/* Category + Publish */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <select
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none w-full sm:w-auto"
          >
            <option>Startup</option>
            <option>Technology</option>
            <option>Lifestyle</option>
            <option>Finance</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isPublished}
              onChange={() => setData({ ...data, isPublished: !data.isPublished })}
            />
            Publish
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white 
          bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
          transition-all duration-300
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-lg"}
          `}
        >
          {loading ? "Adding..." : "🚀 Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;