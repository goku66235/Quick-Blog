import React from 'react'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-200 text-gray-900 mt-16'>

      <div className='max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>

        {/* Logo + About */}
        <div>
          <div className='flex items-center gap-2 mb-4'>
            <img src={assets.logo} alt="logo" className='w-8 h-8 object-contain' />
            <h2 className='text-white font-semibold text-lg'>Blogify</h2>
          </div>
          <p className='text-sm leading-relaxed hover:text-amber-400 transition'>
            A modern platform to explore blogs on tech, coding, and ideas that help you grow.
          </p>
        </div>

        {/* Dynamic Sections */}
        {footer_data.map((section, index) => (
          <div key={index}>
            <h3 className='text-white font-medium mb-4'>{section.title}</h3>

            <ul className='space-y-2 text-sm'>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="block py-1 transition
                   hover:text-cyan-400
                   active:text-cyan-500
                   active:scale-95"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom */}
      <div className='border-t border-gray-700 text-center text-xs sm:text-sm py-4'>
        © {new Date().getFullYear()}{" "}
        <span className='text-white font-medium'>Blogify</span>. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer