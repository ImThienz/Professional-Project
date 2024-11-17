import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailPage.css";

const ComicDetailPage = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Comic ID: ${id}`);

    // Fetch comic details
    axios
      .get(`http://localhost:8080/api/v1/comics/${id}`)
      .then((response) => {
        setComic(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comic details:", error);
      });

    // Fetch chapters related to this comic
    axios
      .get(`http://localhost:8080/api/v1/chapters/byComic/${id}`)
      .then((response) => {
        setChapters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chapters:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!comic) {
    return <div>Không tìm thấy mẫu truyện nào!</div>;
  }

  const handlePayment = async () => {
    const response = await fetch(
      "http://localhost:8080/api/vnpay/create-payment-url",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1000000, // Số tiền thanh toán
          orderId: Date.now(), // Mã đơn hàng
          orderInfo: "Thanh toán đơn hàng",
        }),
      }
    );

    const { paymentUrl } = await response.json();
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect đến VNPay
    }
  };

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
      <button onClick={handlePayment}>Thanh toán với VNPAY</button>
    </div>
  );
};

export default ComicDetailPage;
