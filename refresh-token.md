### Các API authentication có thể được gọi ở 2 nơi:

1.  **Server component**: Ví dụ page `/account/me` cần gợi API `/me` ở server-component để lấy thông tin profile của
    user.

2.  **Client component**: Ví dụ page `/account/me` cần gợi API `/me` ở server-component để lấy thông tin profile của
    user. => Hết hạn access token có thể xảy ra ở server component và client component

### Các trường hợp hết hạn access token

- **Đang dùng thì hết hạn**: Ta sẽ không để trường hợp này xảy ra, bằng cách có 1 setInterval check token liên tục để
  refresh token trước khi nó hết hạn.

- **Lâu ngày không vào web, vào lại thì hết hạn**: Khi vao lại website thì middleware.ts sẽ được gọi đầu tiên. Chúng ta
  sẽ kiểm tra xem access token còn không (vì access token sẽ bị xoá khi hết hạn), nếu không còn thì chúng ta sẽ gọi cho
  redirect về page client component có nhiệm vụ gọi API refresh token và redirect ngược về trang cũ.

_Lưu ý để tránh bị bug khi thực hiện "Đang dùng thì hết hạn"_:

- Không để refresh token bị gọi duplicate
- Khi refresh token bi loi o route handler => tra ve 401 bat ke loi gi
- Khi refresh token bi loi o useEffect client => ngung interval ngay
- Dua logic check vao layout o trang authenticated: khong cho chay refresh token o nhung trang ma unauthenticated nhu:
  login, register, logout
- Kiem tra logic flow trong middleware
