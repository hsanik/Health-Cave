'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/blogs`;

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch(baseUrl);
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete a blog
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This blog will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
            fetchBlogs();
          } else {
            Swal.fire('Error!', 'Failed to delete the blog.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  // Edit a blog with modal
  const handleEdit = async (id) => {
    try {
      // Fetch the blog data first
      const res = await fetch(`${baseUrl}/${id}`);
      if (!res.ok) {
        Swal.fire('Error!', 'Failed to fetch blog data.', 'error');
        return;
      }
      const blog = await res.json();

      // Show edit modal
      const { value: formValues } = await Swal.fire({
        title: 'Edit Blog',
        html: `
          <div style="text-align: left;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Title</label>
            <input id="swal-input-title" class="swal2-input" style="width: 90%; margin-bottom: 15px;" value="${blog.title || ''}" placeholder="Blog Title">
            
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Description</label>
            <textarea id="swal-input-description" class="swal2-textarea" style="width: 90%; height: 120px; margin-bottom: 15px;" placeholder="Blog Description">${blog.description || ''}</textarea>
            
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Image URL</label>
            <input id="swal-input-image" class="swal2-input" style="width: 90%; margin-bottom: 15px;" value="${blog.image || ''}" placeholder="Image URL">
            
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Author</label>
            <input id="swal-input-author" class="swal2-input" style="width: 90%; margin-bottom: 15px;" value="${blog.author || ''}" placeholder="Author Name">
            
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Category</label>
            <input id="swal-input-category" class="swal2-input" style="width: 90%;" value="${blog.category || ''}" placeholder="Category">
          </div>
        `,
        width: '600px',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update Blog',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
          const title = document.getElementById('swal-input-title').value;
          const description = document.getElementById('swal-input-description').value;
          const image = document.getElementById('swal-input-image').value;
          const author = document.getElementById('swal-input-author').value;
          const category = document.getElementById('swal-input-category').value;

          if (!title || !description || !image) {
            Swal.showValidationMessage('Please fill in all required fields (Title, Description, Image)');
            return false;
          }

          return { title, description, image, author, category };
        }
      });

      // If user confirmed, update the blog
      if (formValues) {
        try {
          const updateRes = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
          });

          if (updateRes.ok) {
            Swal.fire('Updated!', 'Blog has been updated successfully.', 'success');
            fetchBlogs();
          } else {
            Swal.fire('Error!', 'Failed to update the blog.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Failed to load blog data.', 'error');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading blogs...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Blogs</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left border-b">Image</th>
              <th className="py-3 px-4 text-left border-b">Title</th>
              <th className="py-3 px-4 text-left border-b">Description</th>
              <th className="py-3 px-4 text-center border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="py-3 px-4 border-b">{blog.title}</td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {blog.description?.slice(0, 80)}...
                </td>
                <td className="py-3 px-4 border-b text-center flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(blog._id)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 rounded object-cover mb-3"
            />
            <h2 className="text-lg font-semibold">{blog.title}</h2>
            <p className="text-gray-600 text-sm mt-2">
              {blog.description?.slice(0, 100)}...
            </p>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(blog._id)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(blog._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;