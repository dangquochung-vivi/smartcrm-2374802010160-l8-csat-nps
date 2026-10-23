# SmartCRM - Khảo sát CSAT/NPS (Luồng L8)

**Sinh viên:** Đặng Quốc Hùng - MSSV 2374802010160
**Track:** SE  
**Học phần:** Chuyên đề tốt nghiệp 1 - Trường Đại học Văn Lang

## 1. Mô tả
SmartCRM đo lường mức độ hài lòng sau dịch vụ bảo hành của Mekong Mobile.

Luồng L8: phiếu bảo hành hoàn tất (Closed) → khách hàng đăng ký/đăng nhập → gửi điểm CSAT/NPS và nhận xét → hệ thống ghi nhận phản hồi → nhân viên CSKH và quản lý xem danh sách, thống kê.

Các actor theo bài: Khách hàng, Bộ phận Marketing, Nhân viên CSKH, Quản lý/Ban giám đốc và Hệ thống CRM.

## 2. Chức năng
- Đăng nhập nội bộ bằng tài khoản và mật khẩu hoặc nút đăng nhập nhanh cho tài khoản demo.
- Xem dashboard, danh sách phản hồi và báo cáo CSAT/NPS.
- Gửi khảo sát với CSAT từ 1-5, NPS từ 0-10 và nhận xét.
- Bảo vệ API khảo sát bằng JWT; đăng xuất thu hồi token hiện tại.

## 3. Công nghệ và kiến trúc
- Backend: Node.js, Express, PostgreSQL client `pg`.
- Frontend: HTML, CSS và JavaScript thuần.
- Auth: JWT HS256 và băm mật khẩu demo bằng `scrypt`, không cần thư viện auth ngoài.
- Backend chia lớp `routes`, `services`, `repositories`.

Khảo sát hiện được lưu trong bộ nhớ của tiến trình. PostgreSQL chỉ được kiểm tra qua `/db-check`; repository khảo sát chưa được nối với database nên dữ liệu mẫu/gửi mới sẽ mất khi khởi động lại server.

**Chưa hoàn tất theo SRS:** tự động gửi link khảo sát qua SMS/email sau khi ticket Closed, lọc theo thời gian/tên khách hàng, biểu đồ theo tuần/tháng và lưu phản hồi bền vững trong PostgreSQL. Portal khách hiện nhận phản hồi thủ công qua form; không nên xem các mục trên là đã đạt chỉ vì API/dashboard đang chạy.

## 4. Chạy ứng dụng
Yêu cầu Node.js 18 trở lên.

```bash
cd src/backend
npm install
cd ../..
npm start
```

Tạo `.env` từ `.env.example` nếu cần cấu hình database. `SECRET_KEY` nên được đặt thành chuỗi ngẫu nhiên riêng; không commit `.env`. Mặc định ứng dụng chạy tại `http://localhost:3000`.

## 5. Đăng nhập demo
Mở `http://localhost:3000/login`. Tài khoản demo có thể đăng nhập nhanh bằng các nút trên trang; hoặc dùng mật khẩu chung `demo123`:

| Vai trò | Tên đăng nhập |
|---|---|
| Marketing | `marketing.demo` |
| Nhân viên CSKH | `cskh.demo` |
| Quản lý trung tâm | `quanly.demo` |

Đây là tài khoản trình diễn được khai báo trong mã nguồn, không phải hệ thống quản lý tài khoản dùng cho production. Token demo hết hạn sau 4 giờ; restart server sẽ vô hiệu hóa token hiện tại.

## 6. Cổng khách hàng
- Khách hàng đăng nhập tại `/customer/login` hoặc tạo tài khoản tại `/customer/register`.
- Tài khoản đăng ký dùng email làm tên đăng nhập; mật khẩu tối thiểu 8 ký tự và được băm bằng `scrypt`.
- Khách hàng gửi mã phiếu, điểm CSAT (1-5), điểm NPS (0-10) và nhận xét tối đa 500 ký tự.
- Khách hàng chỉ gửi khảo sát; API không cho customer đọc danh sách hoặc thống kê nội bộ.
- Tài khoản đăng ký hiện lưu trong bộ nhớ và bị xóa khi restart server.

## 7. API chính
- `POST /auth/login`: đăng nhập bằng tên đăng nhập và mật khẩu.
- `POST /auth/register`: đăng ký tài khoản khách hàng.
- `POST /auth/demo-login`: đăng nhập nhanh tài khoản demo.
- `GET /auth/me`: lấy danh tính từ token hiện tại.
- `POST /auth/logout`: thu hồi token hiện tại.
- `POST /surveys`: gửi khảo sát; khách hàng được nhận diện từ token.
- `GET /surveys`, `POST /surveys`, `GET /surveys/stats`: API khảo sát, yêu cầu `Authorization: Bearer <token>`.
- `GET /health`: kiểm tra server.
- `GET /db-check`: kiểm tra kết nối PostgreSQL, yêu cầu đăng nhập.

## 8. Kiểm thử
```bash
npm --prefix src/backend test -- --runInBand
```

Test bao gồm xác thực mật khẩu, chữ ký JWT, token hết hạn và các nghiệp vụ thống kê/khảo sát.

## 9. Tài liệu
- Yêu cầu: `docs/srs.md`
- Nhật ký thay đổi thiết kế: `docs/thay-doi-thiet-ke.md`
- Schema: `db/chema.sql`
