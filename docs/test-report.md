# Test Report — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE
**Ngày ghi nhận:** 2026-11-13

## Tóm tắt kết quả kiểm thử hệ thống

- **Đã chạy và có kết quả:** 9/12 ca · **PASS:** 7 · **FAIL:** 2.
- **Chưa xác minh/chưa chạy đúng ca:** TC-02, TC-03, TC-12.
- **Ảnh đã chụp cho ca được tính:** [docs/screenshots/](screenshots/). Email tài khoản đã được che trên ảnh TC-07, TC-08 và TC-09.
- PASS/FAIL dưới đây là kết quả quan sát được, không tự suy diễn thành bug ứng dụng. TC-07/08 gửi JSON sai cú pháp nên chưa xác minh được validation nghiệp vụ; cần chạy lại bằng JSON hợp lệ.

| ID | Kết quả | Thực tế quan sát | Minh chứng |
|---|---|---|---|
| TC-01 | PASS | Lần đầu `/health` chưa kết nối được vì server chưa chạy; sau khi khởi động, `GET /health` trả HTTP 200 và `status: OK`. | [TC-01.png](screenshots/TC-01.png) |
| TC-02 | Chưa xác minh | Chưa có kết quả đăng nhập nội bộ khớp ca trong Test Plan. Ảnh form tìm phiếu không chứng minh đăng nhập API và token. | — |
| TC-03 | Chưa xác minh | Chưa có minh chứng khớp ca đăng nhập nội bộ với mật khẩu sai. Ảnh trang khách hàng không đủ xác nhận ca này. | — |
| TC-04 | PASS | `GET /surveys` không có token trả HTTP 401 Unauthorized. | [TC-04.png](screenshots/TC-04.png) |
| TC-05 | PASS | Tài khoản customer gọi `/surveys` và `/surveys/stats`; cả hai trả HTTP 403 và thông báo không có quyền xem dữ liệu nội bộ. | [TC-05.png](screenshots/TC-05.png) |
| TC-06 | PASS | Tra phiếu `BH-000005/2025` với số điện thoại đã đăng ký; giao diện báo tìm thấy phiếu và cho phép gửi đánh giá. | [TC-06.png](screenshots/TC-06.png) |
| TC-07 | FAIL — cần chạy lại | Lượt thử trả HTTP 400 nhưng body báo `SyntaxError` do JSON gửi lên sai cú pháp; chưa chứng minh thông báo validation cho dữ liệu sai như Test Plan yêu cầu. | [TC-07.png](screenshots/TC-07.png) |
| TC-08 | FAIL — cần chạy lại | Lượt thử trả HTTP 400 thay vì HTTP 404 mong đợi; request cũng sai cú pháp JSON nên chưa xác minh được trường hợp số điện thoại không khớp. | [TC-08.png](screenshots/TC-08.png) |
| TC-09 | PASS | Gửi đánh giá hợp lệ cho `BH-000005/2025`; HTTP 201, CSAT=3, NPS=7. | [TC-09.png](screenshots/TC-09.png) |
| TC-10 | PASS | Hai giá trị biên đều thành công: CSAT=1/NPS=0 và CSAT=5/NPS=10; cả hai trả HTTP 201. | [TC-10.png](screenshots/TC-10.png) |
| TC-11 | PASS | Sáu payload sai (CSAT 0, 6, chuỗi; NPS -1, 11, số thập phân) đều trả HTTP 400. | [TC-11.png](screenshots/TC-11.png) |
| TC-12 | Chưa chạy | Chưa chạy seed hai lần và chưa đối chiếu dữ liệu mẫu trong DB thử nghiệm. | — |

## Độ bao phủ checklist

- **Luồng đúng:** Có — TC-01, TC-06, TC-09.
- **Biên:** Có — TC-10.
- **Dữ liệu sai:** Có — TC-11; TC-07/08 cần chạy lại với request JSON hợp lệ.
- **Bảo mật/chất lượng dữ liệu:** Có — TC-04/05 và kiểm tra payload khảo sát TC-09/11.
- **Tái lập:** Chưa — TC-12 chưa chạy. Tổng cộng có minh chứng cho 4/5 loại.
- **Toàn bộ test PASS bằng một lệnh sau khi sửa bug Buổi 14:** Chưa; hai lượt TC-07/08 chưa đạt kết quả mong đợi và chưa có bug Buổi 14 được xác nhận/sửa.
- **CI:** Chưa làm.

## Suite tự động hiện có

Lượt chạy đã ghi nhận trước đó: `npm --prefix src/backend test -- --runInBand` — 6 test suites, 39 test PASS, 0 FAIL (Windows, Node.js v22.14.0, npm 10.9.2). Đây là unit/service tests; không thay thế 12 ca kiểm thử hệ thống và không phải lượt chạy lại sau khi sửa bug Buổi 14.
