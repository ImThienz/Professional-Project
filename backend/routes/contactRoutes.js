const express = require("express");
const { createContactRequest, getAllContactRequests } = require("../controllers/contactController");
const checkAdminRole = require("../middlewares/checkAdminRole");

const router = express.Router();

// POST để nhận yêu cầu liên hệ từ người dùng
router.post("/", createContactRequest);

// GET để Admin lấy tất cả yêu cầu liên hệ
router.get("/", checkAdminRole, getAllContactRequests); 

module.exports = router;
