const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// Kiểm tra voucher
router.post("/check-voucher", async (req, res) => {
  const { code } = req.body;

  try {
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(400).json({ message: "Voucher không tồn tại" });
    }

    if (new Date() > voucher.expiryDate) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    res.status(200).json({ discount: voucher.discount });
  } catch (error) {
    console.error("Error checking voucher:", error);
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại sau!" });
  }
});

module.exports = router;
