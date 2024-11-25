import React, { useState, useEffect } from "react";
import ChaptersList from "./ChaptersList";

const ComicList = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComicId, setSelectedComicId] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/comics/getAll");
        if (!response.ok) {
          throw new Error("Failed to fetch comics");
        }
        const data = await response.json();
        setComics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  if (loading) return <p>Loading comics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Comics</h2>
      <ul>
        {comics.map((comic) => (
          <li key={comic._id}>
            <span>{comic.title}</span>
            <button onClick={() => setSelectedComicId(comic._id)}>
              View Chapters
            </button>
          </li>
        ))}
      </ul>

      {/* Hiển thị chapters */}
      {selectedComicId && <ChaptersList comicId={selectedComicId} />}
    </div>
  );
};

export default ComicList;
