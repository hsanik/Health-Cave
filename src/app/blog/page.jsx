'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold pb-5 text-center text-black mb-8">
        Our Latest Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {blog.description}
                </p>
                <Link
                  href={`/blog/${blog._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
