import React from "react";
import { assets } from "../../assets/assets";
import Moment from "moment";

const CommentTableitem = ({ item, handleApprove, handleDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">

      {/* TOP */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={assets.user_icon}
            className="w-7 h-7 rounded-full"
            alt="user"
          />

          <p className="text-sm font-medium text-gray-800">
            {item.name}

            {item.isLocal && (
              <span className="ml-2 text-xs text-blue-400">(Local)</span>
            )}
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {item.createdAt
            ? Moment(item.createdAt).fromNow()
            : "Just now"}
        </span>
      </div>

      {/* MESSAGE */}
      <p className="text-sm text-gray-600 mb-3">
        {item.message}
      </p>

      {/* EMAIL */}
      {item.email && (
        <p className="text-xs text-gray-400 mb-2">
          {item.email}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 items-center">

        {/* APPROVE */}
        {!item.isApproved && !item.isLocal && (
          <button
            onClick={() => handleApprove(item._id)}
            className="text-xs px-3 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
          >
            Approve
          </button>
        )}

        {/* STATUS */}
        {item.isApproved && (
          <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-600">
            Approved
          </span>
        )}

        {/* DELETE */}
        <button
          onClick={() => handleDelete(item._id)}
          className="text-xs px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CommentTableitem;