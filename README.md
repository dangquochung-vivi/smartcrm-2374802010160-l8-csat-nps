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
- Backend chia lớp `routes`, `services`, `repositories`; hai module CRUD là trung tâm bảo hành và phiếu bảo hành.

Phiếu bảo hành, trung tâm và khảo sát được lưu trong PostgreSQL. Tài khoản khách đăng ký và danh sách token đăng xuất vẫn lưu trong RAM nên sẽ mất khi khởi động lại server.

**Chưa hoàn tất theo SRS:** hệ thống chưa tích hợp SMS/email tự động, bộ lọc khảo sát theo thời gian/tên khách hàng và biểu đồ xu hướng theo tuần/tháng. Khách hàng gửi khảo sát thủ công qua portal.

## 4. Chạy ứng dụng
### Cài đặt và chạy trên Windows

**Cần có:** Git, Node.js 18 trở lên và PostgreSQL đang chạy. Tạo database tên `smartcrm` trong pgAdmin nếu chưa có.

1. Mở PowerShell.
2. Clone repository và vào thư mục dự án:
   ```powershell
   git clone https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps.git
   cd smartcrm-2374802010160-l8-csat-nps
   ```
3. Tạo file cấu hình riêng từ file mẫu:
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```
   Điền `DB_USER` và `DB_PASSWORD` theo PostgreSQL trên máy. Đảm bảo database tên `smartcrm` đã được tạo (có thể tạo trong pgAdmin). Không chia sẻ hoặc commit `.env`.
4. Cài dependency theo lockfile:
   ```powershell
   npm --prefix src/backend ci
   ```
5. Tạo bảng và nạp dữ liệu demo (có thể chạy lại an toàn):
   ```powershell
   npm --prefix src/backend run db:setup
   ```
6. Khởi động ứng dụng:
   ```powershell
   npm start
   ```
7. Khi thấy thông báo server chạy tại `http://localhost:3000`, mở trình duyệt vào **http://localhost:3000/login**.

Màn hình Dashboard: `http://localhost:3000/`. Quản lý trung tâm và phiếu: `http://localhost:3000/operations`. Cổng khách hàng: `http://localhost:3000/customer/login`.
Để tắt ứng dụng, quay lại cửa sổ chạy server và nhấn `Ctrl + C`.

**Chạy kiểm thử:** Mở PowerShell khác tại thư mục dự án:
```powershell
npm --prefix src/backend test -- --runInBand
```
Test tự dựng dữ liệu, không cần database. Để chỉ chạy lại dữ liệu demo:
```powershell
npm --prefix src/backend run db:seed
```

### Chạy thử từ giao diện
1. Đăng nhập nội bộ tại `/login` bằng nút demo hoặc tài khoản ở mục 5.
2. Mở Dashboard để xem phản hồi và thống kê được đọc từ PostgreSQL.
3. Mở `/operations` để thêm, xem, sửa, xóa trung tâm và phiếu. Phiếu đã có khảo sát hoặc trung tâm đang có phiếu sẽ không bị xóa nhầm.
4. Khách hàng đăng ký/đăng nhập tại `/customer/login`, sau đó gửi khảo sát cho mã phiếu trạng thái `HOAN_TAT`.
5. Chạy `db:seed` lần nữa; khóa nghiệp vụ giúp không tạo bản ghi demo trùng.

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
- Khảo sát lưu trong PostgreSQL; tài khoản đăng ký lưu trong bộ nhớ và bị xóa khi restart server.

## 7. API chính
- `POST /auth/login`: đăng nhập bằng tên đăng nhập và mật khẩu.
- `POST /auth/register`: đăng ký tài khoản khách hàng.
- `POST /auth/demo-login`: đăng nhập nhanh tài khoản demo.
- `GET /auth/me`: lấy danh tính từ token hiện tại.
- `POST /auth/logout`: thu hồi token hiện tại.
- `/api/service-centers`: CRUD trung tâm bảo hành (`GET`, `POST`, `PUT`, `DELETE`), yêu cầu tài khoản nội bộ.
- `/api/tickets`: CRUD phiếu bảo hành (`GET`, `POST`, `PUT`, `DELETE`), yêu cầu tài khoản nội bộ.
- `POST /surveys`: gửi khảo sát; khách hàng được nhận diện từ token.
- `GET /surveys`, `POST /surveys`, `GET /surveys/stats`: API khảo sát, yêu cầu `Authorization: Bearer <token>`.
- `GET /health`: kiểm tra server.
- `GET /db-check`: kiểm tra kết nối PostgreSQL, yêu cầu đăng nhập.

## 8. Tài liệu
- Yêu cầu: `docs/srs.md`
- Nhật ký thay đổi thiết kế: `docs/thay-doi-thiet-ke.md`
- Nhật ký lỗi: `docs/bug-log.md`
- Schema/migration: `db/schema.sql`
- Dữ liệu demo chạy lại an toàn: `db/seed.sql`

## 9. Checklist demo Buổi 12 (C1-C7)
- **C1:** clone repo và làm đúng các bước ở mục 4 trong thư mục mới.
- **C2:** lần theo `routes` → `services` → `repositories`; service không nhận `req/res`.
- **C3:** tại `/operations`, demo CRUD cho trung tâm và phiếu; database có schema và seed.
- **C4:** chạy một lệnh test; có test luồng đúng, biên và dữ liệu sai.
- **C5:** chạy `npm --prefix src/backend run db:seed` hai lần; số lượng bản ghi seed không tăng.
- **C6:** khi PostgreSQL tắt, `/db-check` báo 503, API nghiệp vụ báo lỗi có kiểm soát và `/health` vẫn hoạt động.
- **C7:** gửi điểm ngoài miền hoặc dữ liệu không hợp lệ; API từ chối rõ ràng, server không sập.

Trước khi nộp, commit phiên bản đã kiểm tra, sau đó đẩy tag `v0.2` riêng (`git push origin v0.2`). `git push` nhánh không tự đẩy tag.

## 10. Khai báo sử dụng AI
- **Họ và tên:** Đặng Quốc Hùng
- **MSSV:** 2374802010160
- **Ngày:** 23/10/2026

| Công cụ | Phần được hỗ trợ | Cách kiểm tra |
|---|---|---|
| GitHub Copilot | Hỗ trợ chỉnh sửa giao diện, xác thực, cổng khách hàng, test và tài liệu L8 | Đối chiếu SRS/luồng L8; chạy test backend; thử đăng ký, đăng nhập và gửi khảo sát trên bản clone sạch |

**Cam kết:** Sinh viên xác nhận đã tự rà soát mã nguồn, tài liệu và kết quả kiểm thử, đồng thời chịu trách nhiệm về nội dung nộp. Chỉ giữ cam kết này sau khi đã tự kiểm tra và đồng ý.
