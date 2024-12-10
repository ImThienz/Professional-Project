import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Manga Comic Inc.</h3>
          <p>
            Chào mừng bạn đến với website siêu chất lượng, nơi cung cấp trải nghiệm đọc và mua truyện tốt nhất!
          </p>
        </div>

        <div className="footer-section links">
          <h4>Liên Kết Nhanh</h4>
          <ul>
            <li><a href="/">Home Page</a></li>
            <li><a href="/favorites">Favorite</a></li>
            <li><a href="/user/profile">Profile</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h4>Kết Nối Với Chúng Tôi</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/share/19Uwkytb9T/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://x.com/dzkoi23" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Manga Comic Inc. | All right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
