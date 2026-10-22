// Đổi USE_MOCK_API = true và điền link mockapi.io của bạn nếu dùng MockAPI
const USE_MOCK_API = false;
const API_URL = 'https://660000000000000000000000.mockapi.io/api/v1/books';
const LOCAL_URL = './books.json';

export async function fetchBooks() {
  const url = USE_MOCK_API ? API_URL : LOCAL_URL;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu (${response.status})`);
  }
  return await response.json();
}

export async function createBookAPI(bookData) {
  if (!USE_MOCK_API) {
    return { ...bookData, id: Date.now().toString() };
  }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  if (!response.ok) throw new Error('Không thể thêm sách lên server');
  return await response.json();
}

export async function deleteBookAPI(id) {
  if (!USE_MOCK_API) return true;
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Không thể xóa sách trên server');
  return true;
}