const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // % giảm giá
  expiryDate: { type: Date, required: true }, // Ngày hết hạn
});

module.exports = mongoose.model("Voucher", voucherSchema);
