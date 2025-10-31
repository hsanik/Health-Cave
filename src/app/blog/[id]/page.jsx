'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="px-4 py-10">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-lg shadow"
      />
      <h1 className="text-3xl font-bold text-blue-600 mt-6 mb-4">
        {blog.title}
      </h1>
      <p className="text-gray-700 leading-relaxed">{blog.description}</p>
    </div>
  );
};

export default BlogDetailsPage;
