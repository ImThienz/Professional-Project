import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageComics.css";
import { useNavigate } from "react-router-dom";

const ManageComics = () => {
  const [comics, setComics] = useState([]);
  const [editingComic, setEditingComic] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category_id: "",
    genre: "",
    description: "",
    cover_image: null, // Lưu file ảnh upload
  });
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

  useEffect(() => {
    axios.get("/api/v1/admin").then((res) => setComics(res.data.comics));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, cover_image: e.target.files[0] })); // Lưu file ảnh upload
  };

  const handleEdit = (comic) => {
    setEditingComic(comic._id);
    setForm({
      title: comic.title,
      author: comic.author,
      price: comic.price,
      category_id: comic.category_id,
      genre: comic.genre,
      description: comic.description,
      cover_image: null, // Không cần tải lại file hình ảnh cũ
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this comic?")) {
      axios
        .delete(`/api/v1/admin/${id}`)
        .then(() => {
          setComics((prev) => prev.filter((comic) => comic._id !== id));
        })
        .catch((error) => console.error("Error deleting comic:", error));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(); // Sử dụng FormData để gửi cả text và file
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    const endpoint = editingComic
      ? `/api/v1/admin/${editingComic}`
      : "/api/v1/admin";

    const method = editingComic ? "put" : "post";

    axios({
      method,
      url: endpoint,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng định dạng
      },
    })
      .then((res) => {
        if (editingComic) {
          setComics((prev) =>
            prev.map((comic) => (comic._id === editingComic ? res.data : comic))
          );
        } else {
          setComics((prev) => [...prev, res.data]);
        }

        setEditingComic(null);
        setForm({
          title: "",
          author: "",
          price: "",
          category_id: "",
          genre: "",
          description: "",
          cover_image: null,
        });
      })
      .catch((error) => {
        console.error("Error submitting comic:", error);
      });
  };

  const getImageUrl = (imagePath) => {
    const baseUrl = "http://localhost:8080"; // URL backend
    return imagePath
      ? `${baseUrl}${imagePath}`
      : "https://via.placeholder.com/250x350";
  };

  return (
    <div className="manage-comics-container">
      <h1>Manage Comics</h1>
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Quay về Trang Chủ Admin
      </button>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <input type="file" name="cover_image" onChange={handleFileChange} />
        {form.cover_image && (
          <img
            src={URL.createObjectURL(form.cover_image)}
            alt="Preview"
            className="preview-image"
          />
        )}
        <button type="submit">{editingComic ? "Update" : "Add"} Comic</button>
      </form>

      <h2>Comic List</h2>
      <div className="comic-list">
        {comics.map((comic) => (
          <div key={comic._id} className="comic-card">
            <img
              src={getImageUrl(comic.cover_image)}
              alt={comic.title}
              className="comic-cover"
            />
            <h3>{comic.title}</h3>
            <p>{comic.description}</p>
            <button onClick={() => handleEdit(comic)}>Edit</button>
            <button onClick={() => handleDelete(comic._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageComics;
