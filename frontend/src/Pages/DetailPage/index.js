import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailPage.css";

const ComicDetailPage = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);

  useEffect(() => {
    // Lấy thông tin truyện từ backend
    axios
      .get(`http://localhost:8080/api/v1/comics/${id}`)
      .then((response) => {
        setComic(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comic details:", error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/cart",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  if (!comic) return <div>Loading...</div>;

  // Đảm bảo đường dẫn hình ảnh đúng
  const imageUrl = `http://localhost:8080${comic.cover_image}`;

  return (
    <div className="comic-detail-container">
      <h1 className="comic-title">{comic.title}</h1>
      {/* Đảm bảo hiển thị hình ảnh */}
      <img src={imageUrl} alt={comic.title} className="comic-cover" />
      <div className="comic-details">
        <p>
          <strong>Author:</strong> {comic.author}
        </p>
        <p>
          <strong>Genre:</strong> {comic.genre}
        </p>
        <p>
          <strong>Description:</strong>
        </p>
        <p className="comic-description">{comic.description}</p>
      </div>

      <Link to="/" className="back-button">
        Quay về Danh sách Truyện tranh
      </Link>
      <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
    </div>
  );
};

export default ComicDetailPage;
