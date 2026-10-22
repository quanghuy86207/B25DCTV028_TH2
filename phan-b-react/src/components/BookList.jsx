import BookCard from './BookCard';

export default function BookList({ books, favoriteIds, onToggleFavorite, onDeleteBook }) {
  if (books.length === 0) {
    return <p className="empty-msg">Không tìm thấy cuốn sách nào phù hợp.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
          onDeleteBook={onDeleteBook}
        />
      ))}
    </div>
  );
}