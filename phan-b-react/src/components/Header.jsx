export default function Header({ favCount, darkMode, onToggleTheme }) {
  return (
    <header className="header">
      <h1>📚 Thư Viện Lớp Học (React)</h1>
      <div className="header-actions">
        <span>❤️ Yêu thích: <strong>{favCount}</strong></span>
        <button onClick={onToggleTheme} className="btn-outline">
          {darkMode ? '☀️ Sáng' : '🌙 Tối'}
        </button>
      </div>
    </header>
  );
}