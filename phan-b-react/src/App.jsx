import { useState, useEffect } from 'react';
import { initialBooks } from './data/books';
import Header from './components/Header';
import Section from './components/Section';
import GenreFilter from './components/GenreFilter';
import BookList from './components/BookList';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('react_favorites')) || [];
    } catch {
      return [];
    }
  });
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // State cho Form thêm sách & lỗi validate
  const [formData, setFormData] = useState({ title: '', author: '', genre: '', year: '' });
  const [errors, setErrors] = useState({ title: '', author: '', genre: '', year: '' });

  // Lưu danh sách yêu thích vào localStorage
  useEffect(() => {
    localStorage.setItem('react_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Danh sách thể loại tạo bằng Set
  const genres = ['ALL', ...new Set(books.map((b) => b.genre))];

  // Xử lý Yêu thích
  const handleToggleFavorite = (bookId) => {
    setFavoriteIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  // Xử lý Xóa sách (có hỏi xác nhận)
  const handleDeleteBook = (bookId, bookTitle) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${bookTitle}"?`)) {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setFavoriteIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  // Hàm kiểm tra từng ô input trong Form thêm sách
  const validateField = (name, value) => {
    const val = String(value).trim();
    const currentYear = new Date().getFullYear();
    let msg = '';

    if (name === 'title' && val.length < 3) {
      msg = 'Tên sách phải từ 3 ký tự.';
    } else if (name === 'author' && !val) {
      msg = 'Tác giả là bắt buộc.';
    } else if (name === 'genre' && !val) {
      msg = 'Phải chọn thể loại.';
    } else if (name === 'year') {
      const num = Number(val);
      if (!val || Number.isNaN(num) || num < 1900 || num > currentYear) {
        msg = `Năm từ 1900 đến ${currentYear}.`;
      }
    }
    return msg;
  };

  // Validate ngay khi gõ / chọn
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Xử lý khi bấm nút Thêm sách
  const handleAddBook = (e) => {
    e.preventDefault();
    const newErrors = {
      title: validateField('title', formData.title),
      author: validateField('author', formData.author),
      genre: validateField('genre', formData.genre),
      year: validateField('year', formData.year),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    const newBook = {
      id: Date.now(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre,
      year: Number(formData.year),
    };

    // Thêm vào đầu danh sách
    setBooks((prev) => [newBook, ...prev]);
    setFormData({ title: '', author: '', genre: '', year: '' });
  };

  // Kết hợp lọc theo tên và thể loại
  const filteredBooks = books.filter((b) => {
    const matchName = b.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchGenre = selectedGenre === 'ALL' || b.genre === selectedGenre;
    return matchName && matchGenre;
  });

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Header
        favCount={favoriteIds.length}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      <main className="container">
        {/* 1. Form thêm sách mới */}
        <Section title="Thêm sách mới">
          <form onSubmit={handleAddBook} noValidate className="add-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tên sách (*)</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ít nhất 3 ký tự..."
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <small className="error-msg">{errors.title}</small>
              </div>

              <div className="form-group">
                <label>Tác giả (*)</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Nhập tên tác giả..."
                  value={formData.author}
                  onChange={handleInputChange}
                />
                <small className="error-msg">{errors.author}</small>
              </div>

              <div className="form-group">
                <label>Thể loại (*)</label>
                <select name="genre" value={formData.genre} onChange={handleInputChange}>
                  <option value="">-- Chọn thể loại --</option>
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Văn học">Văn học</option>
                  <option value="Kỹ năng">Kỹ năng</option>
                </select>
                <small className="error-msg">{errors.genre}</small>
              </div>

              <div className="form-group">
                <label>Năm xuất bản (*)</label>
                <input
                  type="number"
                  name="year"
                  placeholder="1900 - nay"
                  value={formData.year}
                  onChange={handleInputChange}
                />
                <small className="error-msg">{errors.year}</small>
              </div>
            </div>
            <button type="submit" className="btn-primary">➕ Thêm sách</button>
          </form>
        </Section>

        {/* 2. Thanh công cụ: Ô tìm kiếm + Chọn/Lọc thể loại */}
        <Section title="Thanh công cụ Tìm kiếm & Lọc">
          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm kiếm sách theo tên ngay khi gõ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === 'ALL' ? 'Tất cả thể loại' : g}
                </option>
              ))}
            </select>
          </div>

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </Section>

        {/* 3. Dòng trạng thái */}
        <p className="status-bar">
          Đang hiển thị {filteredBooks.length} / {books.length} cuốn
        </p>

        {/* 4. Lưới thẻ sách (3 cột máy tính, 1 cột điện thoại) */}
        <Section>
          <BookList
            books={filteredBooks}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onDeleteBook={handleDeleteBook}
          />
        </Section>
      </main>

      <Footer />
    </div>
  );
}