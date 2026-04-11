import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../Context/AppContext';

const Navbar = () => {
  const { navigate, token, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">

      {/* CONTAINER */}
      <div className="app-container flex justify-between items-center py-4">

        {/* LOGO */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-36 cursor-pointer"
        />

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-4">
          {token ? (
            <>
              <button
                onClick={() => navigate('/admin')}
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/admin/login')}
              className="group flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
            >
              Login
              <img
                src={assets.arrow}
                className="w-3 group-hover:translate-x-1 transition"
                alt=""
              />
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 bg-white shadow">

          {token ? (
            <>
              <button
                onClick={() => {
                  navigate('/admin');
                  setMenuOpen(false);
                }}
                className="bg-green-600 text-white py-2 rounded-lg"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate('/admin/login'); // ✅ FIXED ROUTE
                setMenuOpen(false);
              }}
              className="bg-primary text-white py-2 rounded-lg"
            >
              Login
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default Navbar;