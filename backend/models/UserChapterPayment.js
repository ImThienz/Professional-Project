const mongoose = require("mongoose");

const userChapterPaymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Dùng ObjectId
  chapter_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Dùng ObjectId
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserChapterPayment", userChapterPaymentSchema);
