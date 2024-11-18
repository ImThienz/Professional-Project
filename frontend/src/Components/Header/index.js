import React, { useEffect, useState } from 'react';
import Logo from "../../Assets/logo.jpg";
import { Link } from "react-router-dom"; // Import Link
import { FaUserCircle, FaHeart } from "react-icons/fa"; 
import { FaShoppingCart } from "react-icons/fa";
import Button from '@mui/material/Button';
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import './Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Trạng thái menu thả xuống
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);


  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!isFavorite) {
      favorites.push('comicIdExample'); // Giả sử bạn đang dùng ID của comic
    } else {
      const updatedFavorites = favorites.filter(id => id !== 'comicIdExample');
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };


  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg-color">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Trang web đọc truyện của nhóm 06
            </p>
          </div>
        </div>
        <header className="header">
          <div className="container-fluid">
            <div className="row">
              <div className="logoWrapper col-sm-2 d-flex align-items-center">
                <Link to="/">
                  <img src={Logo} alt="Logo" />
                </Link>
              </div>

              {/* Thanh tìm kiếm */}
              <SearchBox />

              <div className="user d-flex align-items-center ml-auto">
                {/* Link đến trang yêu thích */}
                <Button className="circle mr-3" onClick={toggleFavorite}>
                  <Link to="/favorites"> {/* Thêm Link đến trang yêu thích */}
                    <FaHeart color={isFavorite ? "red" : "gray"} size={24} />
                  </Link>
                </Button>


                {/* Kiểm tra trạng thái đăng nhập */}
                {username ? (
                  <div className="logged-in-user mt-4">
                    <span>Xin chào, {username}</span>
                    <Button className="logout-btn ml-3" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <Button className="circle mr-8">
                    <Link to="/login">
                      <FaUserCircle />
                    </Link>
                  </Button>
                )}

                {/* Menu thả xuống cho Đăng nhập / Đăng ký */}
                {/* {!username && showDropdown && (
                  <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                    <Link to="/login" className="dropdown-item">
                      Đăng nhập
                    </Link>
                  </div>
                )} */}


                <div className="cartTab">
                  {/* <span className="price">55.000VND</span> */}
                  <Button className="cart ml-3">
                    <FaShoppingCart />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Navigation />
      </div>
    </>
  );
};

export default Header;
