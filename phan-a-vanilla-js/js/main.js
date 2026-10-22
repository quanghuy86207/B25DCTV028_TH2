import { fetchBooks, createBookAPI, deleteBookAPI } from './api.js';
import { getFavorites, saveFavorites, getTheme, saveTheme } from './storage.js';

let books = [];
let favorites = new Set(getFavorites());

// DOM Elements
const bookGrid = document.getElementById('book-grid');
const statusBar = document.getElementById('status-bar');
const favCountEl = document.getElementById('fav-count');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const form = document.getElementById('add-book-form');
const themeBtn = document.getElementById('theme-toggle');

// 1. Khởi tạo ứng dụng
async function init() {
  initTheme();
  updateFavHeader();
  statusBar.textContent = 'Đang tải...';

  try {
    books = await fetchBooks();
    populateGenres();
    render();
  } catch (err) {
    statusBar.textContent = `❌ Lỗi: ${err.message}`;
  }
}

// 2. Tạo danh sách thể loại bằng Set
function populateGenres() {
  const currentVal = genreFilter.value;
  genreFilter.textContent = '';

  const allOpt = document.createElement('option');
  allOpt.value = 'ALL';
  allOpt.textContent = 'Tất cả thể loại';
  genreFilter.appendChild(allOpt);

  const genres = new Set(books.map(b => b.genre));
  genres.forEach(genre => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    genreFilter.appendChild(opt);
  });

  if ([...genres].includes(currentVal)) {
    genreFilter.value = currentVal;
  }
}

// 3. Tạo thẻ sách bằng createElement và textContent (Không dùng innerHTML)
function createBookCard(book) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.id = book.id;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'book-meta';

  const titleEl = document.createElement('h3');
  titleEl.textContent = book.title;

  const authorEl = document.createElement('p');
  authorEl.textContent = `Tác giả: ${book.author}`;

  const genreEl = document.createElement('p');
  genreEl.textContent = `Thể loại: ${book.genre}`;

  const yearEl = document.createElement('p');
  yearEl.textContent = `Năm XB: ${book.year}`;

  infoDiv.append(titleEl, authorEl, genreEl, yearEl);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'card-actions';

  const isFav = favorites.has(String(book.id));
  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.className = `btn-outline btn-fav ${isFav ? 'active' : ''}`;
  favBtn.dataset.action = 'fav';
  favBtn.textContent = isFav ? '❤️ Đã thích' : '🤍 Yêu thích';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn-delete';
  delBtn.dataset.action = 'delete';
  delBtn.textContent = '🗑️ Xóa';

  actionsDiv.append(favBtn, delBtn);
  card.append(infoDiv, actionsDiv);

  return card;
}

// 4. Kết hợp lọc & hiển thị danh sách
function render() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filtered = books.filter(book => {
    const matchName = book.title.toLowerCase().includes(keyword);
    const matchGenre = selectedGenre === 'ALL' || book.genre === selectedGenre;
    return matchName && matchGenre;
  });

  statusBar.textContent = `Đang hiển thị ${filtered.length} / ${books.length} cuốn`;
  bookGrid.textContent = '';

  filtered.forEach(book => {
    bookGrid.appendChild(createBookCard(book));
  });
}

function updateFavHeader() {
  favCountEl.textContent = String(favorites.size);
}

// 5. Lắng nghe sự kiện tìm kiếm & lọc
searchInput.addEventListener('input', render);
genreFilter.addEventListener('change', render);

// 6. Event Delegation cho nút Yêu thích và Xóa
bookGrid.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const card = btn.closest('.book-card');
  const bookId = String(card.dataset.id);
  const action = btn.dataset.action;

  if (action === 'fav') {
    if (favorites.has(bookId)) {
      favorites.delete(bookId);
    } else {
      favorites.add(bookId);
    }
    saveFavorites([...favorites]);
    updateFavHeader();
    render();
  }

  if (action === 'delete') {
    const book = books.find(b => String(b.id) === bookId);
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sách "${book?.title}"?`);
    if (!confirmed) return;

    try {
      await deleteBookAPI(bookId);
      books = books.filter(b => String(b.id) !== bookId);
      favorites.delete(bookId);
      saveFavorites([...favorites]);
      updateFavHeader();
      populateGenres();
      render();
    } catch (err) {
      alert(err.message);
    }
  }
});

// 7. Validate Form khi gõ và khi gửi
const fields = {
  title: document.getElementById('title'),
  author: document.getElementById('author'),
  genre: document.getElementById('genre'),
  year: document.getElementById('year')
};

const errors = {
  title: document.getElementById('err-title'),
  author: document.getElementById('err-author'),
  genre: document.getElementById('err-genre'),
  year: document.getElementById('err-year')
};

function validateField(name) {
  const val = fields[name].value.trim();
  const currentYear = new Date().getFullYear();
  let msg = '';

  if (name === 'title' && val.length < 3) {
    msg = 'Tên sách phải có ít nhất 3 ký tự.';
  } else if (name === 'author' && !val) {
    msg = 'Tác giả là bắt buộc.';
  } else if (name === 'genre' && !val) {
    msg = 'Vui lòng chọn một thể loại.';
  } else if (name === 'year') {
    const num = Number(val);
    if (!val || Number.isNaN(num) || num < 1900 || num > currentYear) {
      msg = `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }
  }

  errors[name].textContent = msg;
  return msg === '';
}

Object.keys(fields).forEach(name => {
  fields[name].addEventListener('input', () => validateField(name));
  fields[name].addEventListener('change', () => validateField(name));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const isTitleValid = validateField('title');
  const isAuthorValid = validateField('author');
  const isGenreValid = validateField('genre');
  const isYearValid = validateField('year');

  if (!isTitleValid || !isAuthorValid || !isGenreValid || !isYearValid) return;

  const newBookPayload = {
    title: fields.title.value.trim(),
    author: fields.author.value.trim(),
    genre: fields.genre.value,
    year: Number(fields.year.value)
  };

  try {
    const createdBook = await createBookAPI(newBookPayload);
    // Thêm vào đầu danh sách
    books.unshift(createdBook);
    populateGenres();
    render();
    form.reset();
  } catch (err) {
    alert(err.message);
  }
});

// 8. Chế độ Sáng / Tối (Yêu cầu nâng cao)
function initTheme() {
  const current = getTheme();
  if (current === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️ Sáng';
  }
}

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  saveTheme(isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️ Sáng' : '🌙 Tối';
});

init();