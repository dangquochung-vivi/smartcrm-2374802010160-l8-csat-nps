# Test Plan — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE  
**Trạng thái:** Kế hoạch kiểm thử hệ thống; các ca trong bảng chưa được ghi nhận là đã chạy.

## Phạm vi

Kiểm thử thủ công/API các luồng đăng nhập, gửi khảo sát và phân quyền của ứng dụng SmartCRM L8. Đối chiếu mã HTTP, nội dung phản hồi, danh tính người gửi và số liệu khảo sát trước/sau thao tác. Không kiểm thử việc gửi SMS/email, truy vấn lưu bền vững PostgreSQL, tải cao hoặc deploy production vì các chức năng/môi trường đó hiện chưa được xác nhận sẵn sàng.

## Môi trường và dữ liệu

- Node.js 18 trở lên; cài dependency bằng `npm ci --prefix src/backend`, chạy server bằng `npm start`.
- Ứng dụng local tại `http://localhost:3000`; kiểm tra `/health` trước khi bắt đầu.
- Tài khoản demo chỉ dùng cho kiểm thử cục bộ; không đưa mật khẩu hoặc token vào ảnh chụp công khai.
- Dữ liệu khảo sát mẫu ban đầu trong repository là hai phiếu `PB-2-00001` và `PB-2-00002`. Tạo email đăng ký mới cho mỗi lần chạy; dữ liệu ứng dụng lưu trong bộ nhớ và cần khởi động lại server để trở về trạng thái ban đầu.
- Lưu ảnh minh chứng sau mỗi ca tại `docs/screenshots/TC-01.png` … `TC-12.png`, thể hiện thao tác/lệnh và kết quả thực tế.

## Tiêu chí đạt

Ca kiểm thử PASS khi kết quả quan sát được khớp đầy đủ với kết quả mong đợi, gồm mã HTTP, nội dung phản hồi, quyền truy cập và tác động dữ liệu. Sai khác bất kỳ phải ghi FAIL và tạo Bug Log sau khi tái lập; không đổi kết quả thành PASS vì đã sửa sau đó. Chạy lại toàn bộ ca sau sửa lỗi và lưu ảnh cho mỗi lượt.

## Các ca kiểm thử dự kiến

| ID | Loại | Tiền điều kiện / dữ liệu | Thao tác | Kết quả mong đợi |
|---|---|---|---|---|
| TC-01 | Luồng đúng | Server hoạt động; thông tin tài khoản nội bộ hợp lệ | Đăng nhập qua `POST /auth/login` | HTTP 200; trả token và thông tin vai trò, không trả password hash |
| TC-02 | Dữ liệu sai | Tên đăng nhập hợp lệ, mật khẩu sai | Gọi `POST /auth/login` | HTTP 401; không cấp token |
| TC-03 | Bảo mật | Không gửi Bearer token | Gọi `GET /surveys` | HTTP 401; không trả danh sách khảo sát |
| TC-04 | Bảo mật | Đăng nhập tài khoản customer hợp lệ | Gọi `GET /surveys` và `GET /surveys/stats` | HTTP 403 cho dữ liệu nội bộ; không lộ danh sách/thống kê |
| TC-05 | Luồng đúng / chất lượng dữ liệu | Customer đăng nhập; điểm CSAT 4, NPS 8 | Gửi `POST /surveys` với mã phiếu và nhận xét hợp lệ | HTTP 201; phản hồi thành công; danh tính customer lấy từ token |
| TC-06 | Biên | Customer đăng nhập; CSAT = 1, NPS = 5 | Gửi khảo sát hợp lệ | HTTP 201; lưu đúng điểm CSAT thấp nhất hợp lệ |
| TC-07 | Biên | Customer đăng nhập; CSAT = 5, NPS = 5 | Gửi khảo sát hợp lệ | HTTP 201; lưu đúng điểm CSAT cao nhất hợp lệ |
| TC-08 | Biên / dữ liệu sai | Customer đăng nhập; lần lượt CSAT = 0 và CSAT = 6 | Gửi khảo sát cho từng giá trị | Cả hai lần bị từ chối HTTP 400; số khảo sát không tăng |
| TC-09 | Biên | Customer đăng nhập; CSAT = 3, NPS = 0 | Gửi khảo sát hợp lệ | HTTP 201; lưu đúng điểm NPS thấp nhất hợp lệ |
| TC-10 | Biên | Customer đăng nhập; CSAT = 3, NPS = 10 | Gửi khảo sát hợp lệ | HTTP 201; lưu đúng điểm NPS cao nhất hợp lệ |
| TC-11 | Biên / dữ liệu sai | Customer đăng nhập; lần lượt NPS = -1 và NPS = 11 | Gửi khảo sát cho từng giá trị | Cả hai lần bị từ chối HTTP 400; số khảo sát không tăng |
| TC-12 | Tái lập | Khởi động lại server từ cùng mã nguồn và dữ liệu mẫu | Gọi `GET /surveys/stats` hai lần trên hai lần khởi động độc lập | Thống kê ban đầu giống nhau; không phụ thuộc dữ liệu còn sót từ lượt trước |

## Phần chưa kiểm thử

Chưa kiểm thử tích hợp SMS/email, lưu trữ bền vững PostgreSQL, lọc theo thời gian/tên, biểu đồ xu hướng, hiệu năng tải và triển khai production. Không coi các ca dự kiến hoặc suite unit hiện có là minh chứng thay cho kiểm thử hệ thống ở trên.
