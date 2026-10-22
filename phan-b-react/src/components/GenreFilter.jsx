export default function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-buttons">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelectGenre(genre)}
          className={selectedGenre === genre ? 'btn-primary' : 'btn-outline'}
        >
          {genre === 'ALL' ? 'Tất cả' : genre}
        </button>
      ))}
    </div>
  );
}