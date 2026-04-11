import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { login, navigate } = useAppContext();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  // ✅ PRO FIX: Trigger popup on EVERY route hit
  useEffect(() => {
    if (location.pathname === "/admin/login") {
      setShowPopup(false); // reset first
      setTimeout(() => setShowPopup(true), 100); // force re-trigger
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Admin <span className="text-yellow-300 font-bold">Login</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400"
                : "bg-yellow-400 hover:bg-yellow-300"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="py-2.5 border text-gray-200 w-full"
        >
          ← Back to Home
        </button>
      </div>

      {/* ✅ POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center shadow-lg animate-scaleIn">

            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Admin Access Required
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              To add your own blogs, request admin access by emailing:
            </p>

            <p className="text-sm font-medium text-primary mb-6 break-all">
              arbindkumaroy139@gmail.com
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-primary text-white px-5 py-2 rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;