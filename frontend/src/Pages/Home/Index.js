import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const genre = location.state?.genre || null; // Lấy thông tin thể loại từ Navigation

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = genre
          ? await axios.get(`http://localhost:8080/api/comics/category/${genre}`)
          : await axios.get("http://localhost:8080/api/v1/comics/getAll");
        setComics(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu truyện. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [genre]);

  // Lấy danh sách yêu thích từ localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (comicId) => {
    const updatedFavorites = favorites.includes(comicId)
      ? favorites.filter((id) => id !== comicId)
      : [...favorites, comicId];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{genre ? `Thể loại: ${genre}` : "Danh sách Truyện tranh Nổi bật"}</h1>
      <div
        className="comic-list-container"
        style={{
          backgroundImage: `url(${home})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          minWidth: "800px",
          margin: "0 auto",
          color: "black",
        }}
      >
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : comics.length === 0 ? (
          <p>Không tìm thấy mẫu truyện nào!</p>
        ) : (
          <div className="comic-list">
            {comics.map((comic) => (
              <div key={comic._id} className="comic-item">
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

      {/* Slider Section */}
      {!genre && (
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
      )}
    </div>
  );
};

export default HomePage;
