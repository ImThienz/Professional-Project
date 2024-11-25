import React, { useState, useEffect } from "react";

const ChaptersList = ({ comicId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/chapters/byComic/${comicId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }
        const data = await response.json();
        setChapters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (comicId) {
      fetchChapters();
    }
  }, [comicId]);

  if (loading) return <p>Loading chapters...</p>;
  if (error) return <p>Error: {error}</p>;
  if (chapters.length === 0)
    return <p>No chapters available for this comic.</p>;

  return (
    <div>
      <h3>Chapters</h3>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter._id}>
            <h4>
              Chapter {chapter.chapter_number}: {chapter.title}
            </h4>
            <p>{chapter.content}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {chapter.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Chapter ${chapter.chapter_number} Image ${index + 1}`}
                  style={{
                    width: "150px",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChaptersList;
