import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageComics.css";
import { useNavigate } from "react-router-dom";

const ManageComics = () => {
  const [comics, setComics] = useState([]);
  const [editingComic, setEditingComic] = useState(null);
  const [form, setForm] = useState({
    title: "",
    comic_id: "",
    author: "",
    price: "",
    category_id: "",
    genre: "",
    description: "",
    cover_image: null,
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
    // Fetch all comics from the backend
    axios.get("/api/v1/admin").then((res) => setComics(res.data.comics));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, cover_image: e.target.files[0] }));
  };

  const handleEdit = (comic) => {
    setEditingComic(comic._id);
    setForm({ ...comic });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this comic?")) {
      axios.delete(`/api/v1/admin/${id}`).then(() => {
        setComics((prev) => prev.filter((comic) => comic._id !== id));
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // Kiểm tra xem có hình ảnh không và gửi
    if (editingComic) {
      axios
        .put(`/api/v1/admin/${editingComic}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("Updated comic:", res.data); // Log dữ liệu sau khi cập nhật
          setComics((prev) =>
            prev.map((comic) => (comic._id === editingComic ? res.data : comic))
          );
          setEditingComic(null);
          setForm({
            title: "",
            comic_id: "",
            author: "",
            price: "",
            category_id: "",
            genre: "",
            description: "",
            cover_image: null,
          });
        })
        .catch((err) => {
          console.error("Error updating comic:", err);
          alert("Error updating comic");
        });
    } else {
      axios
        .post("/api/v1/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("New comic added:", res.data); // Log comic mới thêm vào
          setComics((prev) => [...prev, res.data]);
        })
        .catch((err) => {
          console.error("Error adding comic:", err);
          alert("Error adding comic");
        });
    }
  };

  return (
    <div className="manage-comics-container">
      <h1>Manage Comics</h1>
      
      {/* Button to go back */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Quay về Trang Chủ Admin
      </button>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="comic_id"
          placeholder="Comic ID"
          value={form.comic_id}
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
          type="number"
          name="category_id"
          placeholder="Category ID"
          value={form.category_id}
          onChange={handleInputChange}
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">{editingComic ? "Update" : "Add"} Comic</button>
      </form>

      <h2>Comic List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comics.map((comic) => (
            <tr key={comic._id}>
              <td>{comic.title}</td>
              <td>{comic.author}</td>
              <td>{comic.price}</td>
              <td>
                <button onClick={() => handleEdit(comic)}>Edit</button>
                <button onClick={() => handleDelete(comic._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageComics;
