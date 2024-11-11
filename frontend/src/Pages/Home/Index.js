import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy danh sách yêu thích từ localStorage khi component được mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  // Lấy danh sách truyện từ API
  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/comics/getAll')
      .then(response => {
        setComics(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comics:', error);
        setLoading(false);
      });
  }, []);

  // Thêm hoặc xóa truyện vào danh sách yêu thích
  const toggleFavorite = (comicId) => {
    let updatedFavorites;
    if (favorites.includes(comicId)) {
      updatedFavorites = favorites.filter(id => id !== comicId); // Xóa nếu đã yêu thích
    } else {
      updatedFavorites = [...favorites, comicId]; // Thêm nếu chưa yêu thích
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Lưu vào localStorage
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Danh sách Truyện tranh Nổi bật:</h1>
      <div className="comic-list-container">
        {comics.length === 0 ? (
          <p>Không tìm thấy mẫu truyện nào!</p>
        ) : (
          <div className="comic-list">
            {comics.map(comic => (
              <div key={comic._id} className="comic-item">
                <img 
                  src={comic.cover_image} 
                  alt={comic.title} 
                  className="comic-image" 
                  onClick={() => navigate(`/comics/${comic._id}`)}
                />
                <h2 className="comic-title">{comic.title}</h2>
                <FontAwesomeIcon 
                  icon={faHeart} 
                  onClick={() => toggleFavorite(comic._id)} 
                  className={favorites.includes(comic._id) ? 'favorite-icon active' : 'favorite-icon'}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
