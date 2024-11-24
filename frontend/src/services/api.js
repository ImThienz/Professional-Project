import axios from 'axios';

export const searchComics = async (title) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comics/search`, {
        params: { title }, // Đảm bảo query parameter đúng
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm truyện:', error.response?.data || error.message);
      return [];
    }
  };
  