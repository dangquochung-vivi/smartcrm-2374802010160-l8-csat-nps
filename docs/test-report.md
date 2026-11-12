# Test Report — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE
**Ngày chạy:** 2026-11-13
**Trạng thái:** Báo cáo kết quả suite tự động hiện có; chưa phải kết quả 12 ca kiểm thử hệ thống Buổi 14.

## Kết quả đã chạy

| Lượt | Lệnh | Phạm vi | Đã chạy | PASS | FAIL | Ảnh |
|---|---|---|---:|---:|---:|---|
| 1 | `npm --prefix src/backend test -- --runInBand` | Jest unit/service tests hiện có | 39 | 39 | 0 | Chưa chụp |

Kết quả runner: **6 test suites passed, 39 tests passed, 0 failed**. Môi trường lần chạy: Windows, Node.js v22.14.0, npm 10.9.2. Bộ test tự dựng dữ liệu/mocks; không chứng minh đã chạy đủ luồng hệ thống với PostgreSQL.

## Đối chiếu checklist Buổi 14

- **Ca kiểm thử hệ thống trong [Test Plan](test-plan.md) đã chạy thật:** 0/12; PASS: 0; FAIL: 0. Chưa chạy không đồng nghĩa với PASS.
- **Đủ năm loại cho 10–12 ca hệ thống:** Chưa xác nhận. Bảng test dự kiến có các loại luồng đúng, biên, dữ liệu sai, bảo mật/chất lượng dữ liệu và tái lập, nhưng chưa có lượt chạy/minh chứng để tính.
- **Ảnh chụp:** Chưa có ảnh kết quả test Buổi 14 trong `docs/screenshots/`.
- **Test sau khi sửa ba bug Buổi 14:** Chưa xác nhận; hiện chưa có ba bug mới được tái lập, sửa và commit riêng.

Suite Jest 39/39 là kết quả thật của kiểm thử mã tự động hiện có, không được dùng thay cho số ca hệ thống, ảnh chụp hoặc bug fix mà checklist yêu cầu.
