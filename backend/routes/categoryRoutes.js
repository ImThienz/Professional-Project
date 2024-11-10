const express = require('express');
const router = express.Router();
const Comic = require('../models/Comic'); // Model for comics

// Route to get comics by category_id
router.get('/:categoryId/comics', async (req, res) => {
  try {
    const comics = await Comic.find({ category_id: parseInt(req.params.categoryId) });
    res.json(comics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
