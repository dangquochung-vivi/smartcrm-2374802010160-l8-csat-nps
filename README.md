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

Phiếu bảo hành, trung tâm, khảo sát và tài khoản khách đã đăng ký được lưu trong PostgreSQL. Mật khẩu khách được băm kèm salt, không lưu mật khẩu gốc. Danh sách token đã đăng xuất vẫn lưu trong RAM và được xóa khi khởi động lại server.

**Chưa hoàn tất theo SRS:** hệ thống chưa tích hợp SMS/email tự động, bộ lọc khảo sát theo thời gian/tên khách hàng và biểu đồ xu hướng theo tuần/tháng. Khách hàng gửi khảo sát thủ công qua portal.

## 4. Chạy ứng dụng
### Cài đặt và chạy trên Windows

Làm lần lượt từ đầu đến cuối. Bạn **không cần mở Query Tool, không cần viết hoặc chạy câu lệnh SQL**. Lệnh `db:setup` ở bước 6 sẽ tự tạo các bảng và dữ liệu mẫu.

#### A. Cài các chương trình cần thiết (chỉ làm một lần)

1. Cài **Git for Windows** từ [git-scm.com/download/win](https://git-scm.com/download/win).
2. Cài **Node.js bản LTS** từ [nodejs.org](https://nodejs.org/). Mở PowerShell mới, kiểm tra cài đặt:
   ```powershell
   node --version
   npm --version
   ```
   Nếu hiện số phiên bản cho cả hai lệnh là được.
3. Cài **PostgreSQL cho Windows** từ [postgresql.org/download/windows](https://www.postgresql.org/download/windows/). Trong trình cài đặt, giữ các lựa chọn mặc định, đảm bảo có **pgAdmin 4**, đặt mật khẩu cho user `postgres` và nhớ mật khẩu này. Cổng mặc định là `5432`.
4. Mở **pgAdmin 4** từ Start Menu. Ở khung bên trái, mở `Servers` rồi chọn server PostgreSQL đã cài. Nếu pgAdmin hỏi mật khẩu, nhập mật khẩu `postgres` đã đặt ở bước trên.

#### B. Tạo database bằng giao diện pgAdmin

1. Trong pgAdmin, mở server PostgreSQL → nhấp chuột phải vào **Databases** → chọn **Create → Database...**.
2. Ở ô **Database**, nhập chính xác `smartcrm`.
3. Ở ô **Owner**, chọn `postgres`, sau đó nhấn **Save**.
4. Trong cây bên trái, kiểm tra thấy `smartcrm` xuất hiện dưới `Databases`.

> Chỉ tạo database rỗng ở pgAdmin. Không cần tạo bảng hay chạy SQL trong pgAdmin; ứng dụng sẽ tự làm ở bước 6.

**Hoặc tạo database ngay trong PowerShell:** mở PowerShell và chạy lệnh sau. Khi được hỏi, nhập mật khẩu của user `postgres`:
```powershell
createdb -U postgres -h localhost -p 5432 smartcrm
```
Nếu báo `createdb is not recognized`, dùng chức năng tìm kiếm của Windows để tìm `createdb.exe` trong thư mục cài PostgreSQL, thường ở `C:\Program Files\PostgreSQL\<phiên-bản>\bin\createdb.exe`, rồi chạy bằng đường dẫn đầy đủ. Ví dụ nếu phiên bản là 16:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres -h localhost -p 5432 smartcrm
```
Chỉ dùng **một** trong hai cách tạo database ở phần B. Nếu database `smartcrm` đã tồn tại, không cần tạo lại.

Nếu không thấy server trong pgAdmin: nhấp chuột phải **Servers** → **Register → Server...**. Tab **General**, nhập tên tùy ý (ví dụ `PostgreSQL local`). Tab **Connection**, nhập **Host name/address** `localhost`, **Port** `5432`, **Maintenance database** `postgres`, **Username** `postgres` và mật khẩu đã đặt khi cài PostgreSQL; nhấn **Save**, sau đó làm lại các bước tạo database ở trên.

#### C. Tải mã nguồn và chạy ứng dụng

1. Mở PowerShell, chuyển đến thư mục Downloads:
   ```powershell
   Set-Location "$HOME\Downloads"
   ```
   Nếu muốn lưu dự án ở nơi khác, thay `"$HOME\Downloads"` bằng đường dẫn thư mục đó.
2. Tải dự án từ GitHub rồi đi vào thư mục vừa tải:
   ```powershell
   git clone https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps.git
   cd smartcrm-2374802010160-l8-csat-nps
   ```
3. Tạo file cấu hình `.env` từ file mẫu và mở bằng Notepad:
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```
4. Trong Notepad, sửa dòng `DB_PASSWORD=your_local_postgres_password` thành mật khẩu PostgreSQL của bạn, ví dụ `DB_PASSWORD=MatKhauBanDaDat`. Không thêm dấu nháy quanh mật khẩu. Nếu lúc cài PostgreSQL bạn đổi user, cổng hoặc tên database thì sửa các dòng `DB_USER`, `DB_PORT`, `DB_NAME` tương ứng. Giữ `DB_NAME=smartcrm` nếu đã tạo database theo bước B. Lưu file (`Ctrl + S`) rồi đóng Notepad. **Không gửi hoặc commit file `.env` vì file này chứa mật khẩu.**
5. Cài các thư viện dự án:
   ```powershell
   npm --prefix src/backend ci
   ```
6. Tạo bảng và nạp dữ liệu mẫu tự động:
   ```powershell
   npm --prefix src/backend run db:setup
   ```
   Chờ đến khi thấy `Database schema and sample data are ready.`. Lệnh này tự kết nối database `smartcrm`, tạo các bảng cần thiết (kể cả bảng tài khoản khách hàng) và nạp dữ liệu demo. Chạy lệnh này cả khi cập nhật dự án. Bạn không phải thao tác gì trong Query Tool.
7. Khởi động ứng dụng:
   ```powershell
   npm start
   ```
8. Giữ cửa sổ PowerShell đang chạy server mở. Mở trình duyệt và vào **http://localhost:3000/login**. Trang kiểm tra server: [http://localhost:3000/health](http://localhost:3000/health).

Các trang trong ứng dụng:
- Tổng quan và báo cáo: [http://localhost:3000/](http://localhost:3000/)
- Xem danh sách phản hồi: [http://localhost:3000/survey/list](http://localhost:3000/survey/list)
- Quản lý trung tâm và phiếu bảo hành: [http://localhost:3000/operations](http://localhost:3000/operations)
- Cổng khách hàng: [http://localhost:3000/customer/login](http://localhost:3000/customer/login)

**Nếu gặp lỗi kết nối database:**
- `password authentication failed`: kiểm tra lại mật khẩu `postgres` trong file `.env`, lưu file rồi chạy lại `db:setup`.
- `ECONNREFUSED`: PostgreSQL chưa chạy. Mở ứng dụng **Services** của Windows, tìm dịch vụ tên bắt đầu bằng `postgresql`, nhấn chuột phải → **Start**, rồi chạy lại `db:setup`.
- `database "smartcrm" does not exist`: quay lại pgAdmin và tạo database `smartcrm` theo phần B.
- Sau khi sửa lỗi, chạy lại `npm --prefix src/backend run db:setup`. Có thể chạy lại lệnh này an toàn.

Để tắt ứng dụng, quay lại cửa sổ PowerShell chạy server và nhấn `Ctrl + C`.

**Chạy kiểm thử:** Mở PowerShell thứ hai tại thư mục dự án (không tắt cửa sổ server nếu đang demo):
```powershell
npm --prefix src/backend test -- --runInBand
```
Test tự dựng dữ liệu và không cần kết nối database. Để nạp lại dữ liệu mẫu (không tạo bản ghi trùng):
```powershell
npm --prefix src/backend run db:seed
```

### Chạy thử từ giao diện
1. Đăng nhập nội bộ tại `/login` bằng nút demo hoặc tài khoản ở mục 5.
2. Ở trang Tổng quan, xem số phiếu khảo sát và các chỉ số CSAT/NPS.
3. Chọn **Danh sách** để nhân viên xem và tìm phản hồi theo tên khách hàng, số điện thoại hoặc mã phiếu. Kết quả hiển thị thông tin phiếu, khách hàng, điểm và nhận xét. Nhân viên không tạo hoặc trả lời khảo sát thay khách hàng.
4. Mở `/operations` để thêm, xem, sửa, xóa trung tâm và phiếu. Phiếu đã có khảo sát hoặc trung tâm đang có phiếu sẽ không bị xóa nhầm.
5. Khách hàng đăng ký/đăng nhập tại `/customer/login`, nhập mã phiếu và số điện thoại trên phiếu để tìm. Nếu phiếu đã hoàn tất và chưa được đánh giá, khách hàng chọn điểm CSAT/NPS và gửi nhận xét.
6. Trong PowerShell tại thư mục dự án, chạy `npm --prefix src/backend run db:seed` lần nữa; khóa nghiệp vụ giúp không tạo bản ghi demo trùng.

## 5. Đăng nhập demo
Mở `http://localhost:3000/login`. Tài khoản demo có thể đăng nhập nhanh bằng các nút trên trang; hoặc dùng mật khẩu chung `demo123`:

| Vai trò | Tên đăng nhập |
|---|---|
| Marketing | `marketing.demo` |
| Nhân viên CSKH | `cskh.demo` |
| Quản lý trung tâm | `quanly.demo` |

Đây là tài khoản trình diễn được khai báo trong mã nguồn, không phải hệ thống quản lý tài khoản dùng cho production. Token demo hết hạn sau 4 giờ; restart server sẽ vô hiệu hóa token hiện tại.

## 6. Cổng khách hàng
- Khách hàng đăng nhập tại `/customer/login` hoặc tạo tài khoản tại `/customer/register`. Tài khoản được lưu trong bảng PostgreSQL `customer_account`, nên vẫn dùng được sau khi đăng xuất hoặc khởi động lại server.
- Tài khoản đăng ký dùng email làm tên đăng nhập; mật khẩu tối thiểu 8 ký tự và được băm bằng `scrypt`.
- Khách hàng tìm phiếu bằng mã phiếu và số điện thoại đã đăng ký trên phiếu; chỉ phiếu hoàn tất, đúng thông tin và chưa có khảo sát mới được gửi đánh giá.
- Khách hàng gửi điểm CSAT (1-5), điểm NPS (0-10) và nhận xét tối đa 500 ký tự.
- Khách hàng chỉ gửi khảo sát; API không cho customer đọc danh sách hoặc thống kê nội bộ.
- Tài khoản và khảo sát lưu trong PostgreSQL; chỉ danh sách token đã đăng xuất lưu trong RAM và bị xóa khi restart server.

## 7. API chính
- `POST /auth/login`: đăng nhập bằng tên đăng nhập và mật khẩu.
- `POST /auth/register`: đăng ký tài khoản khách hàng.
- `POST /auth/demo-login`: đăng nhập nhanh tài khoản demo.
- `GET /auth/me`: lấy danh tính từ token hiện tại.
- `POST /auth/logout`: thu hồi token hiện tại.
- `/api/service-centers`: CRUD trung tâm bảo hành (`GET`, `POST`, `PUT`, `DELETE`), yêu cầu tài khoản nội bộ.
- `/api/tickets`: CRUD phiếu bảo hành (`GET`, `POST`, `PUT`, `DELETE`), yêu cầu tài khoản nội bộ.
- `POST /surveys/ticket-check`: khách hàng tìm phiếu theo mã và số điện thoại; yêu cầu token khách hàng.
- `POST /surveys`: khách hàng gửi đánh giá cho phiếu khớp mã và số điện thoại; yêu cầu token khách hàng.
- `GET /surveys`, `GET /surveys/stats`: nhân viên nội bộ xem danh sách và thống kê; yêu cầu `Authorization: Bearer <token>`.
- `GET /health`: kiểm tra server.
- `GET /db-check`: kiểm tra kết nối PostgreSQL, yêu cầu đăng nhập.

## 8. Tài liệu
- Yêu cầu: `docs/srs.md`
- Nhật ký thay đổi thiết kế: `docs/thay-doi-thiet-ke.md`
- Nhật ký lỗi: `docs/bug-log.md`
- Hướng dẫn xem tài khoản khách hàng trong pgAdmin: `docs/tai-khoan-khach-hang.md`
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
