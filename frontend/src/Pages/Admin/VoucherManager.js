import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VoucherManager.css";
import { useNavigate } from "react-router-dom";

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({ code: "", discount: "", expiryDate: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
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
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/vouchers"
      );
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/admin/vouchers/${editId}`,
          form
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:8080/api/admin/vouchers", form);
      }
      setForm({ code: "", discount: "", expiryDate: "" });
      fetchVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);
    }
  };

  const handleEdit = (voucher) => {
    setForm({
      code: voucher.code,
      discount: voucher.discount,
      expiryDate: voucher.expiryDate,
    });
    setIsEditing(true);
    setEditId(voucher._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/vouchers/${id}`);
      fetchVouchers();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  return (
    <div className="voucher-manager">
      <h1>Quản Lý Voucher</h1>
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
          name="code"
          placeholder="Mã voucher"
          value={form.code}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Giảm giá (%)"
          value={form.discount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expiryDate"
          placeholder="Ngày hết hạn"
          value={form.expiryDate}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Cập nhật" : "Thêm"}</button>
      </form>

      <ul>
        {vouchers.map((voucher) => (
          <li key={voucher._id}>
            <span>
              {voucher.code} - {voucher.discount}% -{" "}
              {new Date(voucher.expiryDate).toLocaleDateString()}
            </span>
            <button onClick={() => handleEdit(voucher)}>Sửa</button>
            <button onClick={() => handleDelete(voucher._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoucherManager;
