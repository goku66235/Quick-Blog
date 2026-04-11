import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <div className='flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-white sticky top-0 z-40'>
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          <img
            src={assets.logo}
            alt=""
            className='w-28 sm:w-36 cursor-pointer'
            onClick={() => navigate('/')}
          />
        </div>

        {/* Right */}
        <button
          onClick={logout}
          className='text-sm px-4 sm:px-6 py-2 bg-primary text-white rounded-full'
        >
          Logout
        </button>
      </div>

      {/* Layout Body */}
      <div className="flex">

        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* Content */}
        <div className='flex-1 p-4 sm:p-6 md:p-10'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout