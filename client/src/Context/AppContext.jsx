import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // ✅ SET BASE URL ONCE (FIXED)
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "/api";

  // ----------------- TOKEN SYNC -----------------
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
      const { data } = await axios.post("/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        toast.success("Login successful");
        navigate("/admin");
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
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // ----------------- FETCH BLOGS -----------------
  const fetchBlogs = async (dummyBlogs = []) => {
    try {
      const { data } = await axios.get("/blog/all");

      if (data.success) {
        const blogMap = new Map();
        data.blogs.forEach((b) => blogMap.set(b._id, b));
        setBlogs(Array.from(blogMap.values()));
      } else {
        setBlogs(dummyBlogs);
      }
    } catch (error) {
      toast.error("Error fetching blogs");
      setBlogs(dummyBlogs);
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);