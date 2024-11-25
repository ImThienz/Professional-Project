import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ChaptersPage.css";

const ChaptersPage = () => {
  const { id } = useParams(); // Lấy comic_id từ URL
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null); // Chapter được chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/chapters/byComic/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }
        const data = await response.json();
        setChapters(data);
        setSelectedChapter(data[0]); // Mặc định chọn chapter đầu tiên
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  const handleChapterChange = (e) => {
    const chapterNumber = Number(e.target.value);
    const chapter = chapters.find((ch) => ch.chapter_number === chapterNumber);
    setSelectedChapter(chapter);
  };

  if (loading) return <p>Loading chapters...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chapters-page-container">
      <h2>Chapters</h2>

      {/* Dropdown chọn chapter */}
      <div className="chapter-dropdown-container">
        <select
          className="chapter-dropdown"
          onChange={handleChapterChange}
          value={selectedChapter?.chapter_number || ""}
        >
          {chapters.map((chapter) => (
            <option key={chapter.chapter_number} value={chapter.chapter_number}>
              Chapter {chapter.chapter_number}
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị nội dung chapter được chọn */}
      {selectedChapter && (
        <div className="chapter-item">
          <h3 className="chapter-title">
            Chapter {selectedChapter.chapter_number}: {selectedChapter.title}
          </h3>
          <p className="chapter-content">{selectedChapter.content}</p>
          <div className="chapter-images-container">
            {selectedChapter.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Chapter ${selectedChapter.chapter_number} Image ${
                  index + 1
                }`}
                className="chapter-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersPage;
