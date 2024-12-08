const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// Lấy danh sách tất cả voucher
router.get("/", async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Thêm voucher mới
router.post("/", async (req, res) => {
  const { code, discount, expiryDate } = req.body;

  try {
    const newVoucher = new Voucher({ code, discount, expiryDate });
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể tạo voucher mới" });
  }
});

// Cập nhật voucher
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiryDate } = req.body;

  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { code, discount, expiryDate },
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ error: "Voucher không tồn tại" });
    }
    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể cập nhật voucher" });
  }
});

// Xóa voucher
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(id);
    if (!deletedVoucher) {
      return res.status(404).json({ error: "Voucher không tồn tại" });
    }
    res.status(200).json({ message: "Voucher đã bị xóa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể xóa voucher" });
  }
});

module.exports = router;
