import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useAppContext } from "../Context/AppContext";

const Header = () => {
  const { input, setInput } = useAppContext();
  const text = ["Your", "own", "blogging", "platform"];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
  const child = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="relative mx-6 sm:mx-16 xl:mx-24">
      <div className="text-center mt-20 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 mb-6 border-2 border-transparent bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold rounded-full shadow-lg cursor-pointer hover:scale-105 transition-all"
        >
          <p>NEW: AI Feature Integrated</p>
          <img src={assets.star_icon} className="w-4 h-4 animate-bounce" alt="star" />
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-6xl font-bold text-gray-800 flex flex-wrap justify-center gap-2"
        >
          {text.map((word, i) => (
            <motion.span
              key={i}
              variants={child}
              className={
                word === "blogging"
                  ? "bg-linear-to-r underline from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold"
                  : ""
              }
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="my-6 sm:my-8 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base"
        >
          Explore articles on technology, coding, productivity, and real-world projects.
          Share your ideas and connect with a community of passionate bloggers.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center lg:w-1/2 max-w-md sm:max-w-lg mx-auto border border-gray-300 bg-white rounded-full overflow-hidden shadow-lg"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for blogs"
            className="flex-1 px-6 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-6 py-2 rounded-full m-1 font-semibold hover:scale-105 transition-transform"
          >
            Search
          </button>
        </motion.form>
      </div>

      <img
        src={assets.gradientBackground}
        alt="bg"
        className="absolute top-0 left-0 w-full opacity-20 -z-10"
      />
    </div>
  );
};

export default Header;