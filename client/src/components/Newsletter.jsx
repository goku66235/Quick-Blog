import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email!");
    if (!email.includes('@')) return toast.error("Please enter a valid email!");

    toast.success("Subscribed successfully!");
    setEmail('');
  };

  return (
    <div className='bg-gray-50 py-10 px-4'>
      <div className='mx-auto text-center w-full sm:w-3/4 lg:w-1/2'>
        <h1 className='text-2xl sm:text-4xl font-semibold text-gray-800 mb-3'>
          Never Miss a Blog!
        </h1>
        <p className='text-gray-500 text-sm sm:text-base mb-6'>
          Subscribe to get the latest blogs, new tech, and exclusive updates.
        </p>

        <form 
          onSubmit={handleSubmit}
          className='flex items-center w-full border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm'
        >
          <input
            type="email"
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='flex-1 px-4 py-3 outline-none text-sm'
          />
          <button
            type="submit"
            className='bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-all'
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;