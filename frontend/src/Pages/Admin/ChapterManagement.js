import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChapterManagement.css"; // Import CSS thông thường
import { useNavigate } from "react-router-dom";

const ChapterManagement = () => {
  const [comics, setComics] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [form, setForm] = useState({
    chapter_number: "",
    title: "",
    content: "",
    images: [], // Mảng lưu danh sách URL hình ảnh
    price: 10000,
  });
  const [newImage, setNewImage] = useState(""); // URL hình ảnh mới
  const [editingChapterId, setEditingChapterId] = useState(null);

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      const response = await axios.get(
        "/api/admin/chapters/comics-with-chapters"
      );
      setComics(response.data);
    } catch (error) {
      console.error("Error fetching comics:", error);
    }
  };

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        // Nếu không phải admin, chuyển hướng về trang login
        navigate("/admin/login");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSelectComic = (comic) => {
    setSelectedComic(comic);
    setChapters(comic.chapters || []);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        comic_id: selectedComic?._id,
      };

      if (editingChapterId) {
        await axios.put(`/api/admin/chapters/${editingChapterId}`, payload);
        alert("Chapter updated successfully");
      } else {
        await axios.post("/api/admin/chapters", payload);
        alert("Chapter added successfully");
      }

      resetForm();
      fetchComics();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (chapter) => {
    setForm({
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      content: chapter.content,
      images: chapter.images || [],
      price: chapter.price,
    });
    setEditingChapterId(chapter._id);
  };

  const handleDelete = async (chapterId) => {
    try {
      await axios.delete(`/api/admin/chapters/${chapterId}`);
      alert("Chapter deleted successfully");
      fetchComics();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const resetForm = () => {
    setForm({
      chapter_number: "",
      title: "",
      content: "",
      images: [],
      price: 10000,
    });
    setNewImage("");
    setEditingChapterId(null);
  };

  // Hàm xử lý URL cho hình ảnh
  const getImageUrl = (imagePath) => {
    const baseUrl = "http://localhost:8080"; // Backend chạy trên cổng 8080
    const fullUrl = imagePath
      ? imagePath.startsWith("/uploads/")
        ? `${baseUrl}${imagePath}`
        : `${baseUrl}/uploads/${imagePath}`
      : "https://via.placeholder.com/250x350"; // URL mặc định nếu không có hình ảnh
    return fullUrl;
  };

  // Thêm URL hình ảnh vào danh sách
  const addImageToList = () => {
    if (newImage.trim()) {
      setForm({ ...form, images: [...form.images, newImage.trim()] });
      setNewImage("");
    }
  };

  // Xóa URL hình ảnh khỏi danh sách
  const removeImageFromList = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="manage-chapter">
      <div className="container">
        <h1>Chapter Management</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        >
          Quay về Trang Chủ Admin
        </button>

        {/* Danh sách truyện */}
        <div className="comic-section">
          <h2>Select Comic</h2>
          <div className="comic-list">
            {comics.map((comic) => (
              <div
                key={comic._id}
                className={`comic-card ${
                  selectedComic?._id === comic._id ? "comic-card-selected" : ""
                }`}
                onClick={() => handleSelectComic(comic)}
              >
                <img
                  src={getImageUrl(comic.cover_image)} // Dùng hàm xử lý URL
                  alt={comic.title}
                  className="comic-cover"
                />
                <h3 className="comic-title">{comic.title}</h3>
                <p className="comic-description">{comic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách chapters */}
        {selectedComic && (
          <div className="chapter-section">
            <h2>Chapters of {selectedComic.title}</h2>
            <table className="chapter-table">
              <thead>
                <tr>
                  <th>Chapter #</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr key={chapter._id}>
                    <td>{chapter.chapter_number}</td>
                    <td>{chapter.title}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(chapter._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form thêm/sửa chapter */}
        {selectedComic && (
          <div className="form-section">
            <h2>{editingChapterId ? "Edit Chapter" : "Add New Chapter"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="chapter_number">Chapter Number</label>
                <input
                  type="number"
                  id="chapter_number"
                  value={form.chapter_number}
                  onChange={(e) =>
                    setForm({ ...form, chapter_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows="5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-image">Add Image URL</label>
                <input
                  type="text"
                  id="new-image"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  onClick={addImageToList}
                  className="add-image-button"
                >
                  Add Image
                </button>
              </div>
              <div className="image-preview">
                {form.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageFromList(index)}
                      className="remove-image-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingChapterId ? "Update Chapter" : "Add Chapter"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="reset-button"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManagement;
