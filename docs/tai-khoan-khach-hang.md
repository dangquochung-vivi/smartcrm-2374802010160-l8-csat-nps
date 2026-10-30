# Tài khoản khách hàng được lưu ở đâu?

Tài khoản khách hàng được lưu trong PostgreSQL, database `smartcrm`, bảng `public.customer_account`. Tài khoản vẫn còn sau khi đăng xuất hoặc khởi động lại ứng dụng.

Bảng lưu:

- Email đăng nhập
- Họ tên
- Thời gian tạo tài khoản
- Salt và mật khẩu đã băm để xác thực

**Mật khẩu gốc không được lưu.** Vì vậy không thể xem lại mật khẩu của người dùng trong pgAdmin; nếu quên mật khẩu thì cần bổ sung chức năng đặt lại mật khẩu.

## Xem tài khoản trong pgAdmin

1. Mở **pgAdmin 4** và kết nối server PostgreSQL trên máy.
2. Ở cây bên trái, mở lần lượt:
   `Servers` → server PostgreSQL → `Databases` → `smartcrm` → `Schemas` → `public` → `Tables`.
3. Nếu chưa thấy `customer_account`, nhấp chuột phải `Tables` → **Refresh**.
4. Nhấp chuột phải `customer_account` → **View/Edit Data** → **All Rows**.
5. Xem email và họ tên trong bảng. Không chia sẻ hoặc đăng tải thông tin cá nhân của khách hàng.

Không cần mở **Query Tool** hoặc tự chạy SQL để xem danh sách.

## Nếu chưa thấy database hoặc bảng

Đảm bảo PostgreSQL đang chạy và file `.env` của dự án trỏ tới đúng database `smartcrm`. Tại PowerShell mở ở thư mục dự án, chạy:

```powershell
npm --prefix src/backend run db:migrate
```

Lệnh này tạo/cập nhật cấu trúc bảng; không xóa tài khoản hiện có. Sau đó quay lại pgAdmin, nhấp chuột phải `Tables` → **Refresh**.

## Bảo vệ thông tin đăng nhập

- Không lưu mật khẩu gốc vào file văn bản, bảng tính hoặc repository.
- File `.env` chỉ chứa cấu hình kết nối PostgreSQL; không gửi file này cho người khác và không commit lên Git.
- Đăng nhập bằng email và mật khẩu đã đăng ký tại trang khách hàng.
