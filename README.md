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
Yêu cầu Node.js 18 trở lên và Git.

1. Clone repository:
```bash
git clone https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps.git
```

2. Vào thư mục dự án:
```bash
cd smartcrm-2374802010160-l8-csat-nps
```

3. Cài đúng dependency backend từ lockfile:
```bash
npm --prefix src/backend ci
```

4. Nếu cần kiểm tra kết nối PostgreSQL, tạo `.env` từ `.env.example`.

PowerShell:
```powershell
Copy-Item .env.example .env
```

Git Bash:
```bash
cp .env.example .env
```

Điền thông tin database và `SECRET_KEY` trong `.env`. Không commit file này. PostgreSQL không bắt buộc để chạy demo khảo sát hiện tại.

5. Khởi động từ thư mục gốc dự án:
```bash
npm start
```

6. Mở giao diện nội bộ:
```text
http://localhost:3000/login
```

7. Chạy test trong terminal khác:
```bash
npm --prefix src/backend test -- --runInBand
```

### Kết quả kiểm tra bản clone sạch
Đã clone repository vào thư mục tạm, cài dependency bằng `npm --prefix src/backend ci`, chạy test backend và khởi động server từ thư mục gốc. Luồng đăng ký khách hàng và gửi khảo sát đã được kiểm tra qua giao diện/API. Phản hồi khảo sát hiện vẫn lưu trong RAM, không phải PostgreSQL.

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

## 8. Tài liệu
- Yêu cầu: `docs/srs.md`
- Nhật ký thay đổi thiết kế: `docs/thay-doi-thiet-ke.md`
- Schema: `db/chema.sql`

## 9. Khai báo sử dụng AI
- **Họ và tên:** Đặng Quốc Hùng
- **MSSV:** 2374802010160
- **Ngày:** 23/10/2026

| Công cụ | Phần được hỗ trợ | Cách kiểm tra |
|---|---|---|
| GitHub Copilot | Hỗ trợ chỉnh sửa giao diện, xác thực, cổng khách hàng, test và tài liệu L8 | Đối chiếu SRS/luồng L8; chạy test backend; thử đăng ký, đăng nhập và gửi khảo sát trên bản clone sạch |

**Cam kết:** Sinh viên xác nhận đã tự rà soát mã nguồn, tài liệu và kết quả kiểm thử, đồng thời chịu trách nhiệm về nội dung nộp. Chỉ giữ cam kết này sau khi đã tự kiểm tra và đồng ý.
