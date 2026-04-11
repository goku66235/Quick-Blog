import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Blog from './Blog'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="w-full overflow-y-hidden">

      <Navbar />

      <div className="app-container">
        <Header />
        <BlogList />
        <Newsletter />
      </div>

      <Footer />
      
    </div>
  )
}

export default Home
