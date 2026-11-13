# Test Plan — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE
**Trạng thái:** Đã thực hiện 12 ca theo kế hoạch; kết quả và ảnh minh chứng được ghi trong [Test Report](test-report.md).

## Phạm vi

Kiểm thử thủ công/API các luồng xác thực, phân quyền và khảo sát CSAT/NPS trên ứng dụng SmartCRM L8 có PostgreSQL. Đối chiếu HTTP status, nội dung phản hồi, quyền truy cập và dữ liệu lưu trong DB. Không kiểm thử SMS/email, tải cao hoặc production deployment. Kiểm thử tái lập giới hạn ở việc nạp bộ dữ liệu mẫu nhiều lần trên DB thử nghiệm riêng.

## Môi trường và dữ liệu

- Windows, Node.js 18+, PostgreSQL local; cấu hình `.env` cho DB thử nghiệm riêng, `APP_PORT` và `SECRET_KEY`.
- Cài dependency theo lockfile (`npm ci --prefix src/backend`), tạo schema và nạp dữ liệu mẫu bằng `npm --prefix src/backend run db:setup`; chạy ứng dụng bằng `npm start`; xác nhận `/health` trả trạng thái OK.
- Không chạy setup/seed trên DB dùng chung hoặc có dữ liệu cần giữ. Dùng tài khoản customer thử nghiệm và các phiếu mẫu đã hoàn tất, đúng mã/số điện thoại, chưa gửi khảo sát. Dành một phiếu mới cho từng lần gửi thành công.
- Chụp ảnh kết quả thật sau mỗi ca vào `docs/screenshots/TC-01.png` … `TC-12.png`; che mật khẩu, token và dữ liệu cá nhân.

## Tiêu chí đạt

PASS chỉ khi phản hồi HTTP, nội dung, phân quyền và tác động DB khớp toàn bộ kết quả mong đợi. Mỗi sai khác là FAIL, cần ghi nhận và tái lập trước khi sửa. Chụp minh chứng cho từng lượt chạy; sau khi sửa lỗi chạy lại toàn bộ ca. Không xem các test unit/service là thay thế cho test hệ thống.

## Các ca kiểm thử dự kiến

| ID | Loại | Tiền điều kiện / dữ liệu | Thao tác | Kết quả mong đợi |
|---|---|---|---|---|
| TC-01 | Luồng đúng | Server và PostgreSQL thử nghiệm hoạt động | Gọi `GET /health` | HTTP 200; trạng thái OK |
| TC-02 | Luồng đúng | Tài khoản nội bộ demo hợp lệ | Đăng nhập qua `POST /auth/login` | HTTP 200; có token và vai trò; không lộ password hash |
| TC-03 | Dữ liệu sai | Tên đăng nhập hợp lệ, mật khẩu sai | Gọi `POST /auth/login` | HTTP 401; không cấp token |
| TC-04 | Bảo mật | Không có Bearer token | Gọi `GET /surveys` | HTTP 401; không trả danh sách |
| TC-05 | Bảo mật | Đăng nhập customer hợp lệ | Gọi `GET /surveys` và `GET /surveys/stats` | Cả hai trả HTTP 403; không lộ dữ liệu nội bộ |
| TC-06 | Luồng đúng | Customer token; phiếu đã hoàn tất, khớp số điện thoại và chưa khảo sát | Gọi `POST /surveys/ticket-check` với mã phiếu và số điện thoại đúng | HTTP 200; trả thông tin đúng phiếu và trạng thái chưa khảo sát |
| TC-07 | Dữ liệu sai | Customer token | Gọi `POST /surveys/ticket-check` với mã trống hoặc số điện thoại sai định dạng | HTTP 400; thông báo lỗi rõ; không thay đổi DB |
| TC-08 | Dữ liệu sai | Customer token; mã phiếu tồn tại nhưng số điện thoại không khớp | Gọi `POST /surveys/ticket-check` | HTTP 404; không trả thông tin khách/phiếu |
| TC-09 | Luồng đúng / chất lượng dữ liệu | Customer token và phiếu thử nghiệm hợp lệ chưa khảo sát | Gửi `POST /surveys` với CSAT=3, NPS=7 | HTTP 201; DB lưu đúng điểm và gắn với phiếu được xác minh |
| TC-10 | Biên | Hai phiếu thử nghiệm khác nhau, đều hợp lệ và chưa khảo sát | Gửi lần lượt CSAT=1/NPS=0 và CSAT=5/NPS=10 | Cả hai HTTP 201; DB lưu chính xác các giá trị biên |
| TC-11 | Dữ liệu sai / chất lượng dữ liệu | Customer token và phiếu hợp lệ chưa khảo sát | Gửi lần lượt CSAT=0, 6, chuỗi số; NPS=-1, 11, số thập phân | Mỗi payload sai trả HTTP 400; không tạo khảo sát |
| TC-12 | Tái lập | DB thử nghiệm riêng đã ghi nhận số lượng bản ghi mẫu ban đầu | Chạy `npm --prefix src/backend run db:seed` hai lần; kiểm tra số lượng bản ghi mẫu sau mỗi lần | Dữ liệu seed không bị nhân đôi; số lượng và các bản ghi mẫu không đổi giữa hai lần |

## Phần chưa kiểm thử

Chưa kiểm thử SMS/email tự động, lưu trữ/khôi phục ngoài môi trường PostgreSQL thử nghiệm, performance/load hoặc triển khai production. Kết quả 12 ca trong phạm vi được ghi tại [Test Report](test-report.md).
