import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Danh sách Truyện tranh Nổi bật:</h1>
      <div className="comic-list-container">
        {comics.length === 0 ? (
          <p>No comics available</p>
        ) : (
          <div className="comic-list">
            {comics.map(comic => (
              <div 
                key={comic._id} 
                className="comic-item" 
                onClick={() => navigate(`/comics/${comic._id}`)} // Chuyển hướng đến trang chi tiết
              >
                <img src={comic.cover_image} alt={comic.title} className="comic-image" />
                <h2 className="comic-title">{comic.title}</h2>
                {/* <p className="comic-description">{comic.description}</p> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
