import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import userProfileImage from "../../Assets/user-profile.jpg";
import formUserProfile from "../../Assets/form-user-profile.jpg";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();  // Sử dụng useNavigate
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Nếu không có token, điều hướng về trang đăng nhập
      alert("Bạn phải đăng nhập để xem Profile!");
      navigate("/login");
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!email || !username || !password) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put("http://localhost:8080/api/users/update-profile", 
        { username, email, password }, config);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  return (
    <div className="profile-container">
      <h2>Cập nhật thông tin cá nhân</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <input style={{ opacity: "75%" }}
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input style={{ opacity: "75%" }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input style={{ opacity: "75%" }}
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input style={{ opacity: "75%" }}
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}

      <Link to="/myorders" className="btn btn-success">
        Đơn hàng của tôi
      </Link>
    </div>
  );
};

export default UserProfile;
