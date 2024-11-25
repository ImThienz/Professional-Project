import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ComicChapters = () => {
  const { comicId } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetch(`/api/comics/${comicId}/chapters`)
      .then((response) => response.json())
      .then((data) => setChapters(data.chapters))
      .catch((error) => console.error("Error fetching chapters:", error));
  }, [comicId]);

  return (
    <div>
      <h2>Chapters</h2>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.chapter_number}>
            <Link to={`/chapters/${chapter._id}/images`}>
              {chapter.chapter_number}: {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComicChapters;
