import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState(""); // header search
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ----------------- LOGIN -----------------
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/admin/login", { email, password });

      if (data.success) {
        setToken(data.token);           // save token
        toast.success("Login successful");
        navigate("/admin");             // go to dashboard
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  // ----------------- LOGOUT -----------------
  const logout = () => {
    setToken(null); // removes from state + localStorage
    toast.success("Logged out successfully");
    navigate("/admin"); // redirect to login page
  };

  // ----------------- FETCH BLOGS -----------------
  const fetchBlogs = async (dummyBlogs = []) => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        const blogMap = new Map();
        data.blogs.forEach((b) => blogMap.set(b._id || b.id, b));
        dummyBlogs.forEach((b) => {
          if (!blogMap.has(b._id || b.id)) blogMap.set(b._id || b.id, b);
        });
        setBlogs(Array.from(blogMap.values()));
      } else {
        setBlogs(dummyBlogs);
      }
    } catch (error) {
      toast.error("Error fetching blogs, showing dummy blogs");
      setBlogs(dummyBlogs);
    }
  };

  const value = {
    axios,
    input,
    setInput,
    activeCategory,
    setActiveCategory,
    blogs,
    setBlogs,
    fetchBlogs,
    token,
    setToken,
    navigate,
    login,   // ✅ added
    logout,  // ✅ added
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);