export default function BookCard({ book, isFavorite, onToggleFavorite, onDeleteBook }) {
  return (
    <article className="book-card">
      <div className="book-meta">
        <h3>{book.title}</h3>
        <p><strong>Mã sách:</strong> #{book.id}</p>
        <p><strong>Tác giả:</strong> {book.author}</p>
        <p><strong>Thể loại:</strong> {book.genre}</p>
        <p><strong>Năm XB:</strong> {book.year}</p>
      </div>
      <div className="card-actions">
        <button
          type="button"
          onClick={() => onToggleFavorite(book.id)}
          className={`btn-outline ${isFavorite ? 'fav-active' : ''}`}
        >
          {isFavorite ? '❤️ Đã thích' : '🤍 Yêu thích'}
        </button>
        <button
          type="button"
          onClick={() => onDeleteBook(book.id, book.title)}
          className="btn-delete"
        >
          🗑️ Xóa
        </button>
      </div>
    </article>
  );
}