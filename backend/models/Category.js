const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);