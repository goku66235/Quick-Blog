import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/blog/${_id || blog.id}`)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all text-sm max-w-xs mx-auto"
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-32 sm:h-36 object-cover"
      />

      {/* Category badge */}
      {category && (
        <span className="ml-3 mt-3 px-2 py-0.5 inline-block bg-primary/15 text-primary text-[10px] rounded-full font-medium">
          {category}
        </span>
      )}

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h5 className="mb-1 font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
          {title}
        </h5>

        <p
          className="text-gray-600 text-[10px] sm:text-sm line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description ? description.slice(0, 80) : "No description",
          }}
        />
      </div>
    </motion.div>
  );
};

export default BlogCard;