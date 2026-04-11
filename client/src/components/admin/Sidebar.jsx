import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: assets.home_icon },
  { name: "Add Blogs", path: "/admin/addBlog", icon: assets.add_icon },
  { name: "List Blog", path: "/admin/listBlog", icon: assets.list_icon },
  { name: "Comments", path: "/admin/comments", icon: assets.comment_icon }
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-64
          bg-linear-to-b from-indigo-500 via-purple-500 to-pink-500
          p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* Close Button */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setOpen(false)}
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 mt-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-white text-primary shadow"
                    : "text-white hover:bg-white/20"
                }`
              }
            >
              <img src={item.icon} className="w-5" alt="" />
              <p>{item.name}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar