import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchComics } from '../../../services/api';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        const data = await searchComics(searchTerm);
        setResults(data);

        if (data.length === 1) {
          navigate(`/comics/${data[0]._id}`);
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
      }
    }
  };

  const handleNavigateToDetail = (comicId) => {
    navigate(`/comics/${comicId}`);
  };

  return (
    <div className="search-box position-relative">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm truyện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '400px' }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {results.length > 1 && (
        <div className="search-results bg-light shadow mt-2 rounded">
          <ul className="list-group">
            {results.map((comic) => (
              <li
                key={comic._id}
                className="list-group-item d-flex align-items-center"
                onClick={() => handleNavigateToDetail(comic._id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={comic.cover_image}
                  alt={comic.title}
                  className="me-3 rounded"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <span>{comic.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && searchTerm && (
        <p className="no-results text-danger mt-2">
          Không tìm thấy truyện nào phù hợp.
        </p>
      )}
    </div>
  );
};

export default SearchBox;
