import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/users/login" : "/api/users/signup";

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");

        // Lưu token, user_id và username vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id); // Lưu user_id
        if (data.username) {
          localStorage.setItem("username", data.username); // Lưu username nếu có
        }

        console.log("Lưu user_id vào localStorage:", data.user_id);

        // Điều hướng về trang chủ và reload
        navigate("/");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-signup">
      <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Tên tài khoản</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? "Đăng Nhập" : "Đăng Ký"}</button>
      </form>
      <p>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </span>
      </p>
    </div>
  );
};

export default LoginSignup;
