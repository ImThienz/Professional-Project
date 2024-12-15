import React, { useEffect, useState } from "react";
import Logo from "../../Assets/logo.jpg";
import headerImage from "../../Assets/header.png";
import { Link } from "react-router-dom"; // Import Link
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import Button from "@mui/material/Button";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import adminLogo from "../../Assets/admin.png"; // Import hình ảnh
import contactIcon from "../../Assets/contact.png";
const Header = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Trạng thái menu thả xuống
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername(null); // Xử lý khi không có username
    }
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!isFavorite) {
      favorites.push("comicIdExample"); // Giả sử bạn đang dùng ID của comic
    } else {
      const updatedFavorites = favorites.filter(
        (id) => id !== "comicIdExample"
      );
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
        <div className="top-strip bg-color" style={{
          backgroundImage: `url(${headerImage})`, // Sử dụng ảnh import
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
          <div className="container d-flex align-items-center justify-content-between">
            {/* Thêm logo admin */}
            <Link to="/admin/dashboard">
              <img
                src={adminLogo} 
                alt="Admin Logo"
                style={{
                  height: "70px", 
                  width: "auto", 
                  cursor: "pointer", 
                  objectFit: "contain",
                }}
              />
            </Link>

            <p className="mb-0 mt-0 text-center flex-grow-1" style={{
              fontweight: "bold",
              fontSize: "35px",
            }}>
              Trang web <span className="text-danger">đọc & bán truyện</span> của nhóm 06
            </p>

            {/* Thêm icon dẫn đến trang liên hệ */}
            <Link to="/contact">
              <img 
                src={contactIcon} 
                alt="Contact Icon"
                style={{
                  height: "100px", 
                  width: "100px", 
                  cursor: "pointer", 
                  objectFit: "contain",
                }}
              />
            </Link>
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
                  <Link to="/favorites">
                    {" "}
                    {/* Thêm Link đến trang yêu thích */}
                    <FaHeart color={isFavorite ? "red" : "gray"} size={24} />
                  </Link>
                </Button>

                {/* Kiểm tra trạng thái đăng nhập */}
                {username ? (
                  <div className="logged-in-user mt-4 d-flex align-items-center">
                    <span className="mr-3">Xin chào, {username}</span>

                    {/* Link đến trang quản lý người dùng */}
                    <Button className="manage-user-btn mr-3">
                      <Link to="/user/profile">
                        Quản lý tài khoản
                      </Link>
                    </Button>

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


                <div className="cartTab">
                  <Button className="cart ml-3">
                    <Link to="/cart">
                      <FaShoppingCart />
                    </Link>
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
