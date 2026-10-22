# Bài Thực Hành 02 - Lập Trình Web

## So sánh cách làm giao diện bằng DOM thuần (Phần A) và React (Phần B)

| Tiêu chí | Phần A – JavaScript Thuần (DOM Imperative) | Phần B – React Cơ Bản (Declarative) |
| :--- | :--- | :--- |
| **Cách cập nhật giao diện** | Phải thao tác trực tiếp lên cây DOM (`document.createElement`, `textContent`, `appendChild`) mỗi khi dữ liệu thay đổi. | Chỉ cần cập nhật `state` bằng `useState`, React tự động tính toán và cập nhật lại giao diện thông qua Virtual DOM. |
| **Tổ chức mã nguồn** | Tách theo chức năng kỹ thuật (`api.js`, `storage.js`, `main.js`), giao diện HTML tách rời khỏi logic JS. | Chia nhỏ giao diện thành các Component độc lập, tái sử dụng cao (`Header`, `Section`, `GenreFilter`, `BookCard`, `BookList`) kết hợp JSX. |
| **Xử lý sự kiện** | Cần dùng kỹ thuật **Event Delegation** (`e.target.closest()`) trên thẻ cha để tránh gắn sự kiện lặp lại khi render lại danh sách. | Gắn trực tiếp sự kiện (`onClick`) lên từng component và truyền hàm xử lý từ component cha xuống con thông qua `props`. |
| **Đồng bộ dữ liệu (State)** | Lập trình viên phải tự nhớ gọi hàm `render()` và `updateFavHeader()` sau mỗi thao tác thêm, xóa, yêu thích. | Dữ liệu một chiều (one-way data binding): khi `favoriteIds` hoặc `selectedGenre` đổi, cả `Header` và `BookList` tự động đồng bộ. |