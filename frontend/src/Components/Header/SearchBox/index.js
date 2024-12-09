import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchComics } from '../../../services/api';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500); // Debounce time (500ms)

    return () => clearTimeout(timer); // Cleanup on component unmount or searchTerm change
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchComics(searchTerm);
      setResults(data);
      setLoading(false);

      if (data.length === 1) {
        navigate(`/comics/${data[0]._id}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Lỗi khi tìm kiếm:', error);
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
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading} // Disable button while loading
        >
          Tìm kiếm
        </button>
      </div>

      {loading && <p className="text-muted">Đang tìm kiếm...</p>}

      {results.length > 0 && (
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
                  src={comic.cover_image || 'http://localhost:8080/uploads/default.jpg'}
                  alt={comic.title}
                  className="me-3 rounded"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                  }}
                />
                <span className="text-truncate" style={{ maxWidth: '300px' }}>
                  {comic.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && searchTerm && !loading && (
        <p className="no-results text-danger mt-2">
          Không tìm thấy truyện nào phù hợp.
        </p>
      )}
    </div>
  );
};

export default SearchBox;
