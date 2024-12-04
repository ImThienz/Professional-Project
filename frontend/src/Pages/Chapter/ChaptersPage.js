import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChaptersPage.css";

const ChaptersPage = () => {
  const { id } = useParams(); // Lấy comic_id từ URL
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null); // Chapter được chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false); // Trạng thái đã thanh toán hay chưa
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token is missing");
        navigate("/login"); // Redirect to user login if token is missing
        return;
      }
  
      try {
        const response = await axios.get(`/api/chapters/byComic/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChapters(response.data);
        setSelectedChapter(response.data[0]); // Chọn chapter đầu tiên làm mặc định
      } catch (error) {
        console.error("Error fetching chapters:", error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login"); // Redirect to user login if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchChapters();
  }, [id, navigate]);  

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        console.log("Fetching chapters for comic_id:", id);

        const response = await fetch(
          `http://localhost:8080/api/chapters/byComic/${id}`
        );

        if (!response.ok) {
          console.error("Error fetching chapters:", response.status);
          throw new Error("Failed to fetch chapters");
        }

        const data = await response.json();
        console.log("Fetched chapters:", data);

        setChapters(data);
        setSelectedChapter(data[0]); // Mặc định chọn chapter đầu tiên
      } catch (err) {
        console.error("Fetch chapters error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  const handleChapterChange = (e) => {
    const chapterNumber = Number(e.target.value);
    const chapter = chapters.find((ch) => ch.chapter_number === chapterNumber);
    setSelectedChapter(chapter);

    console.log("Selected chapter:", chapter);

    // Kiểm tra quyền truy cập khi chọn chapter mới
    checkPayment(chapter._id);
  };

  const checkPayment = async (chapterId) => {
    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      if (!token || !user_id) {
        console.warn("Missing token or user_id. Redirecting to login.");
        alert("Bạn cần đăng nhập để xem nội dung!");
        navigate("/login");
        return;
      }

      console.log(
        "Checking payment for chapter_id:",
        chapterId,
        "with user_id:",
        user_id
      );

      const response = await axios.get(
        `http://localhost:8080/api/chapters/${chapterId}/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id }, // Gửi user_id trong params
        }
      );

      console.log("Payment check response:", response.data);
      setIsPaid(true);
    } catch (error) {
      console.warn(
        "Payment check failed:",
        error.response?.data || error.message
      );
      setIsPaid(false);
    }
  };

  const handlePayment = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const chapter_id = selectedChapter._id;

      if (!user_id) {
        console.error("No user_id found in localStorage.");
        alert("Bạn cần đăng nhập để thanh toán!");
        navigate("/login");
        return;
      }

      console.log(
        "Creating payment for user_id:",
        user_id,
        "chapter_id:",
        chapter_id
      );

      const response = await axios.post(
        "http://localhost:8080/api/chapter-payments/create-payment",
        { user_id, chapter_id }
      );

      if (response.data.paymentUrl) {
        console.log("Redirecting to payment URL:", response.data.paymentUrl);
        window.location.href = response.data.paymentUrl;
      } else {
        console.error("Payment URL not generated.");
        alert("Không thể tạo thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Không thể thực hiện thanh toán!");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:8080/api/cart",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thêm vào giỏ hàng thành công!");
      navigate("/cart"); // Điều hướng đến trang giỏ hàng
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  useEffect(() => {
    // Kiểm tra thanh toán ngay khi component mount với chapter mặc định
    if (selectedChapter) {
      checkPayment(selectedChapter._id);
    }
  }, [selectedChapter]);

  if (loading) return <p>Loading chapters...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chapters-page-container">
      <h2>Chapters</h2>

      {/* Dropdown chọn chapter */}
      <div className="chapter-dropdown-container">
        <select
          className="chapter-dropdown"
          onChange={handleChapterChange}
          value={selectedChapter?.chapter_number || ""}
        >
          {chapters.map((chapter) => (
            <option key={chapter.chapter_number} value={chapter.chapter_number}>
              Chapter {chapter.chapter_number} -{" "}
              {chapter.price.toLocaleString()} VND
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị nội dung chapter được chọn */}
      {selectedChapter && (
        <div className="chapter-item">
          <h3 className="chapter-title">
            Chapter {selectedChapter.chapter_number}: {selectedChapter.title}
          </h3>
          {isPaid ? (
            <>
              <p className="chapter-content">{selectedChapter.content}</p>
              <div className="chapter-images-container">
                {selectedChapter.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Chapter ${selectedChapter.chapter_number} Image ${
                      index + 1
                    }`}
                    className="chapter-image"
                  />
                ))}
              </div>
            </>
          ) : (
            <p>Bạn cần thanh toán để xem nội dung chapter này.</p>
          )}
        </div>
      )}

      {/* Nút "Thanh toán" */}
      {!isPaid && selectedChapter && (
        <button onClick={handlePayment} className="btn btn-primary">
          Thanh toán Chapter
        </button>
      )}

      {isPaid && (
        <>
          <p className="fs-4 fw-semibold text-primary text-center">
            Thích chứ? Thích thì thêm vào giỏ hàng ngay đi, để dev-lỏ kiếm chút cháo nào :3
          </p>

          {/* Nút "Thêm vào giỏ hàng" */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary add-to-cart-button"
          >
            Thêm vào giỏ hàng
          </button>
        </>
      )}
    </div>
  );
};

export default ChaptersPage;
