# Test Report — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE
**Ngày ghi nhận:** 2026-11-13

## Tóm tắt kết quả kiểm thử hệ thống

- **Đã chạy và có kết quả:** 12/12 ca · **PASS:** 12 · **FAIL:** 0.
- **Chưa chạy:** Không.
- **Ảnh kết quả:** [docs/screenshots/](screenshots/). Có ảnh TC-01 đến TC-12; ảnh TC-12 ghi nhận số lượng bản ghi không đổi sau hai lượt seed.
- PASS/FAIL dưới đây là kết quả quan sát được; TC-07 và TC-08 được chạy lại bằng JSON hợp lệ.

| ID | Kết quả | Thực tế quan sát | Minh chứng |
|---|---|---|---|
| TC-01 | PASS | `GET /health` trả HTTP 200, `status: OK`. | [TC-01.png](screenshots/TC-01.png), [TC-01.2.png](screenshots/TC-01.2.png) |
| TC-02 | PASS | Đăng nhập `cskh.demo` trả HTTP 200; vai trò `support`; token được cấp; phản hồi không có thuộc tính `passwordHash`. | [TC-02.png](screenshots/TC-02.png) |
| TC-03 | PASS | Đăng nhập `cskh.demo` với mật khẩu sai trả HTTP 401, mã `INVALID_CREDENTIALS`; không cấp token. | [TC-03.png](screenshots/TC-03.png) |
| TC-04 | PASS | `GET /surveys` không có token trả HTTP 401 Unauthorized. | [TC-04.png](screenshots/TC-04.png) |
| TC-05 | PASS | Tài khoản customer gọi `/surveys` và `/surveys/stats`; cả hai trả HTTP 403 và thông báo không có quyền xem dữ liệu nội bộ. | [TC-05.png](screenshots/TC-05.png) |
| TC-06 | PASS | Tra phiếu `BH-000005/2025` với số điện thoại đã đăng ký; giao diện báo tìm thấy phiếu và cho phép gửi đánh giá. | [TC-06.png](screenshots/TC-06.png) |
| TC-07 | PASS | Chạy lại với JSON hợp lệ, mã phiếu `BH-000005/2025` và số điện thoại `123`; HTTP 400, mã `INVALID_TICKET_LOOKUP`, thông báo “Số điện thoại cần có từ 7 đến 15 chữ số hợp lệ”. Ảnh lượt PASS mới đã được lưu; email đã che. | [TC-07.png](screenshots/TC-07.png) |
| TC-08 | PASS | Chạy với JSON hợp lệ, mã phiếu `BH-000005/2025` và số điện thoại hợp lệ không khớp `0901234567`; HTTP 404, mã `TICKET_NOT_FOUND`, thông báo “Không tìm thấy phiếu đã hoàn tất khớp với mã phiếu và số điện thoại”. | [TC-08.png](screenshots/TC-08.png) |
| TC-09 | PASS | Gửi đánh giá hợp lệ cho `BH-000005/2025`; HTTP 201, CSAT=3, NPS=7. | [TC-09.png](screenshots/TC-09.png) |
| TC-10 | PASS | Hai giá trị biên đều thành công: CSAT=1/NPS=0 và CSAT=5/NPS=10; cả hai trả HTTP 201. | [TC-10.png](screenshots/TC-10.png) |
| TC-11 | PASS | Sáu payload sai (CSAT 0, 6, chuỗi; NPS -1, 11, số thập phân) đều trả HTTP 400. | [TC-11.png](screenshots/TC-11.png) |
| TC-12 | PASS | Đếm trước seed: service_center=8, ticket=7320, survey_ticket=2460. Chạy `npm run db:seed` hai lần; mỗi lần báo ticketsImported=0, surveysImported=0. Sau lần 1 và lần 2, cả ba số đếm không đổi. | [TC-12.png](screenshots/TC-12.png) |

## Độ bao phủ checklist

- **Luồng đúng:** Có — TC-01, TC-02, TC-06, TC-09.
- **Biên:** Có — TC-10.
- **Dữ liệu sai:** Có — TC-07, TC-08 và TC-11.
- **Bảo mật/chất lượng dữ liệu:** Có — TC-04/05 và kiểm tra payload khảo sát TC-09/11.
- **Tái lập:** Có — TC-12 seed hai lần; số lượng bản ghi giữ nguyên. Tổng cộng đã chạy đủ 5/5 loại.
- **Toàn bộ test PASS bằng một lệnh sau khi sửa bug Buổi 14:** Chưa xác nhận; chưa có bug Buổi 14 được xác nhận/sửa và chưa chạy lại toàn bộ test bằng một lệnh duy nhất.
- **CI:** Chưa làm.

## Suite tự động hiện có

Lượt chạy đã ghi nhận trước đó: `npm --prefix src/backend test -- --runInBand` — 6 test suites, 39 test PASS, 0 FAIL (Windows, Node.js v22.14.0, npm 10.9.2). Đây là unit/service tests; không thay thế 12 ca kiểm thử hệ thống và không phải lượt chạy lại sau khi sửa bug Buổi 14.
