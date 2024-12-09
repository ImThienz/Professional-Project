import React, { useState } from "react";
import axios from "axios";
import './Contact.css'; // Import file CSS

const ContactPage = () => {
  // State để lưu thông tin form và trạng thái
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm kiểm tra lỗi trước khi gửi form
  const validateForm = () => {
    let errors = {};
    if (!formData.username) errors.username = "Tên người dùng là bắt buộc.";
    if (!formData.email) errors.email = "Email là bắt buộc.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email không hợp lệ.";
    if (!formData.message) errors.message = "Lời nhắn là bắt buộc.";
    return errors;
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra lỗi trước khi gửi form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Nếu có lỗi thì không gửi form
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/contact", formData);
      setStatusMessage(response.data.message);
      setFormData({ username: "", email: "", message: "" });
      setFormErrors({});
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setStatusMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h2>Liên Hệ Với Chúng Tôi</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="username">Tên Người Dùng</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Nhập tên người dùng"
          />
          {formErrors.username && <p className="error">{formErrors.username}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email của bạn"
          />
          {formErrors.email && <p className="error">{formErrors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Lời nhắn</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Viết lời nhắn của bạn..."
          />
          {formErrors.message && <p className="error">{formErrors.message}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>

      {statusMessage && (
        <p className={`status-message ${isLoading ? "loading" : statusMessage.includes("thành công") ? "success" : "error"}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default ContactPage;
