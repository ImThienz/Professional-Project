import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./ComicReviews.css"; // Tạo file CSS riêng để thêm các style tùy chỉnh

const ComicReviews = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/comics/${id}`);
        const data = await response.json();
        setComic(data);
      } catch (error) {
        console.error("Lỗi khi tải truyện:", error);
      }
    };

    fetchComic();
  }, [id]);

  if (!comic) return <p>Loading...</p>;

  return (
    <div className="comic-reviews-container">
      <h1 className="comic-title">{comic.title}</h1>
      <h2 className="reviews-header">Đánh giá từ người dùng</h2>
      <div className="reviews-list">
        {comic.reviews.map((review) => (
          <div className="review-card" key={review._id}>
            <div className="review-header">
              {/* <img
                src={review.avatar || "/default-avatar.png"} // Hiển thị avatar người dùng hoặc ảnh mặc định
                alt={review.name}
                className="review-avatar"
              /> */}
              <strong className="review-name">{review.name}</strong>
            </div>
            <Rating
              value={review.rating}
              readOnly
              className="review-rating"
            />
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicReviews;
