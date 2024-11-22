import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailPage.css";
const ComicDetailPage = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/comics/${id}`).then((response) => {
      setComic(response.data);
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

  return (
    <div className="comic-detail-container">
      <h1 className="comic-title">{comic.title}</h1>
      <img src={comic.cover_image} alt={comic.title} className="comic-cover" />
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

      {/* <h2>Chapters</h2>
      <div className="chapter-list">
        {chapters.length === 0 ? (
          <p>No chapters available for this comic.</p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter._id} className="chapter-item">
              <img src={chapter.url} alt={chapter.title} className="chapter-image" />
              <div className="chapter-details">
                <h3>{chapter.title}</h3>
                <p><strong>Chapter {chapter.chapter_number}</strong></p>
                <p><strong>Release Date:</strong> {new Date(chapter.release_date).toLocaleDateString()}</p>
                <p><strong>Pages:</strong> {chapter.page_count}</p>
              </div>
            </div>
          ))
        )}
      </div> */}

      <Link to="/" className="back-button">
        Quay về Danh sách Truyện tranh
      </Link>
      <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
    </div>
  );
};

export default ComicDetailPage;
