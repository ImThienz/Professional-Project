import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";
import home from "../../Assets/home.jpg";
import { FaArrowRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import Rating from "@mui/material/Rating";

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy danh sách yêu thích từ localStorage khi component được mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Lấy danh sách truyện từ API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/comics/getAll")
      .then((response) => {
        setComics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comics:", error);
        setLoading(false);
      });
  }, []);

  // Thêm hoặc xóa truyện vào danh sách yêu thích
  const toggleFavorite = (comicId) => {
    let updatedFavorites;
    if (favorites.includes(comicId)) {
      updatedFavorites = favorites.filter((id) => id !== comicId); // Xóa nếu đã yêu thích
    } else {
      updatedFavorites = [...favorites, comicId]; // Thêm nếu chưa yêu thích
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Lưu vào localStorage
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Danh sách Truyện tranh Nổi bật:</h1>
      <div className="comic-list-container" style={{
        backgroundImage: `url(${home})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        borderRadius: "10px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        minWidth: "800px", 
        margin: "0 auto",
        color: "black", 
      }}>
        {comics.length === 0 ? (
          <p>Không tìm thấy mẫu truyện nào!</p>
        ) : (
          <div className="comic-list">
            {comics.map((comic) => (
              <div key={comic._id} className="comic-item">
                {/* Chỉnh sửa đường dẫn hình ảnh */}
                <img
                  src={`http://localhost:8080${comic.cover_image}`}
                  alt={comic.title}
                  className="comic-image"
                  onClick={() => navigate(`/comics/${comic._id}`)}
                />
                <h2 className="comic-title">{comic.title}</h2>
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={() => toggleFavorite(comic._id)}
                  className={
                    favorites.includes(comic._id)
                      ? "favorite-icon active"
                      : "favorite-icon"
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slider section */}
      <div className="col-md-9 productRow">
        <div className="d-flex align-items-center">
          <div className="info w-75">
            <h2 className="mb-0 hd mt-4">BEST SELLERS</h2>
            <p className="text-light text-sml mb-0">
              Truyện bán chạy số 1 tại Việt Nam!!!
            </p>
          </div>

          <button className="viewAllBtn ml-auto">
            Xem tất cả <FaArrowRight />
          </button>
        </div>

        <div className="product_row w-100 mt-4">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {comics.slice(0, 5).map((comic) => (
              <SwiperSlide key={comic._id}>
                <div className="item productItem">
                  <div className="imgWrapper">
                    <img
                      src={`http://localhost:8080${comic.cover_image}`}
                      alt={comic.title}
                      className="w-100"
                    />
                    <h4>{comic.title}</h4>
                    <span className="text-success d-block">In Stock</span>
                    <Rating name="read-only" value={4} readOnly />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
