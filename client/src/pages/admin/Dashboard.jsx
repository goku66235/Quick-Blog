import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableitem from "../../components/admin/BlogTableitem";
import { useAppContext } from "../../Context/AppContext";

const Dashboard = () => {
  const { axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const fetchDashboard = async () => {
    try {
      const { data: blogsData } = await axios.get("/api/blog/all");
      const blogs = blogsData.success ? blogsData.blogs : [];

      const drafts = blogs.filter((b) => !b.isPublished).length;

      let commentsCount = 0;
      for (let blog of blogs) {
        try {
          const { data } = await axios.get(`/api/blog/${blog._id}/comments`);
          if (data.success) commentsCount += data.comments.length;
        } catch {}
      }

      const recentBlogs = [...blogs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setDashboardData({
        blogs: blogs.length,
        comments: commentsCount,
        drafts,
        recentBlogs,
      });
    } catch {
      setDashboardData({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: [],
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen">

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {[ 
          { icon: assets.dashboard_icon_1, label: "Blogs", value: dashboardData.blogs },
          { icon: assets.dashboard_icon_2, label: "Comments", value: dashboardData.comments },
          { icon: assets.dashboard_icon_3, label: "Drafts", value: dashboardData.drafts }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
            <img src={item.icon} className="w-10" />
            <div>
              <p className="text-xl font-semibold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="min-w-150 w-full text-sm text-gray-500">

          <thead className="text-gray-700 text-left uppercase">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3 hidden sm:table-cell">Date</th>
              <th className="px-3 py-3 hidden sm:table-cell">Status</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {dashboardData.recentBlogs.length > 0 ? (
              dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableitem
                  key={blog._id || index}
                  blog={blog}
                  fetchBlogs={fetchDashboard}
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No recent blogs found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Dashboard;