const ContactRequest = require("../models/ContactRequest");

// Hàm tạo yêu cầu liên hệ của User
const createContactRequest = async (req, res) => {
  const { username, email, message } = req.body;

  try {
    const newRequest = new ContactRequest({ username, email, message });
    await newRequest.save();
    res.status(200).json({ message: "Yêu cầu liên hệ đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi khi lưu yêu cầu liên hệ:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

// Hàm lấy tất cả yêu cầu liên hệ cho Admin
const getAllContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find(); // Lấy tất cả yêu cầu liên hệ
    res.status(200).json(requests);
  } catch (error) {
    console.error("Lỗi khi lấy yêu cầu liên hệ:", error);
    res.status(500).json({ message: "Không thể lấy yêu cầu liên hệ" });
  }
};

// Xuất cả hai hàm để sử dụng trong routes
module.exports = { createContactRequest, getAllContactRequests };
