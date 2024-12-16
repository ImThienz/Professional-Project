const Comic = require("../models/Comic");

const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const comic = await Comic.findById(req.params.id);

    if (!comic) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const alreadyReviewed = comic.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Bạn đã đánh giá truyện này rồi" });
    }

    const review = {
      user: req.user._id,
      name: req.user.username,
      rating: Number(rating),
      comment,
    };

    comic.reviews.push(review);
    comic.numReviews = comic.reviews.length;
    comic.rating =
      comic.reviews.reduce((acc, item) => item.rating + acc, 0) /
      comic.reviews.length;

    await comic.save();
    res.status(201).json({ message: "Đánh giá đã được thêm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { createReview };
