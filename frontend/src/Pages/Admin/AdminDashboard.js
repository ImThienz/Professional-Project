import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // User cần thay đổi quyền
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal
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
        navigate("/admin/login");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleSubmit = () => {
    navigate("/admin/manageComics");
  };

  const handleChapterSubmit = () => {
    navigate("/admin/manageChapters");
  };

  const handleVouchersSubmit = () => {
    navigate("/admin/manageVouchers");
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert("Người dùng đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Không thể xóa người dùng!");
      }
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleChangeRole = async (newRole) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `/api/admin/users/${selectedUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, role: response.data.user.role }
            : user
        )
      );
      alert("Đã thay đổi quyền thành công!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thay đổi quyền:", error);
      alert("Không thể thay đổi quyền!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Đăng Xuất
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Chỉnh sửa truyện tranh
        </button>
        <button
          onClick={handleChapterSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Chỉnh sửa Chapter truyện
        </button>
        <button
          onClick={handleVouchersSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Chỉnh sửa Vouchers
        </button>
      </div>

      <div className="bg-white shadow-md rounded">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="p-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white rounded"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => openRoleModal(user)}
                    className="bg-blue-500 text-white rounded"
                  >
                    Thay đổi Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chọn Role mới cho {selectedUser?.username}</h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleChangeRole("admin")}
                className="role-button admin"
              >
                Admin
              </button>
              <button
                onClick={() => handleChangeRole("reader")}
                className="role-button reader"
              >
                Reader
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-button"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
