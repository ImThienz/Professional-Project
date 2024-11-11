import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [comics, setComics] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/comics/getAll')
      .then(response => {
        const favoriteComics = response.data.filter(comic => favorites.includes(comic._id));
        setComics(favoriteComics);
      })
      .catch(error => {
        console.error('Error fetching comics:', error);
      });
  }, [favorites]);

  return (
    <div>
      <h1>Truyện Yêu Thích:</h1>
      <div className="comic-list-container">
        {comics.length === 0 ? (
          <p>No favorite comics available</p>
        ) : (
          <div className="comic-list">
            {comics.map(comic => (
              <div 
                key={comic._id} 
                className="comic-item" 
                onClick={() => navigate(`/comics/${comic._id}`)}
              >
                <img src={comic.cover_image} alt={comic.title} className="comic-image" />
                <h2 className="comic-title">{comic.title}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
