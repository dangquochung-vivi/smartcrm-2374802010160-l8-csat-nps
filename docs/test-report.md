# Test Report — SmartCRM L8 CSAT/NPS

**Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE  
**Ngày chạy:** 2026-11-13  
**Trạng thái:** Ghi nhận kết quả chạy thật; chưa phải Test Report hoàn chỉnh cho checklist Buổi 14.

## Kết quả chạy

| Lượt | Lệnh | Phạm vi | Đã chạy | PASS | FAIL | Ảnh |
|---|---|---|---:|---:|---:|---|
| 1 | `npm --prefix src/backend test -- --runInBand` | Jest unit tests hiện có | 10 | 10 | 0 | Chưa chụp |

Kết quả runner: **2 test suites passed, 10 tests passed, 0 failed**.

## Các test thực thi

### `src/backend/tests/authService.test.js` — 5 PASS

1. Danh sách tài khoản demo có đủ ba vai trò.
2. Xác minh mật khẩu demo đúng/sai và không lộ password hash.
3. Token hợp lệ được chấp nhận; chữ ký bị sửa bị từ chối.
4. Token hết hạn bị từ chối.
5. Đăng ký customer chuẩn hóa email, xác minh mật khẩu và từ chối email trùng.

### `src/backend/tests/ticket.test.js` — 5 PASS

1. Thống kê có ít nhất hai khảo sát mẫu.
2. CSAT trung bình có kiểu số hợp lệ.
3. NPS trung bình có kiểu số hợp lệ.
4. Tỷ lệ hài lòng nằm trong khoảng 0–100.
5. Gửi khảo sát hợp lệ lưu đúng mã phiếu.

## Đối chiếu yêu cầu Buổi 14

Mười test trên là unit tests đang có, không bao phủ thay cho 10–12 ca kiểm thử hệ thống trong [Test Plan](test-plan.md). Chưa có ảnh kết quả tại `docs/screenshots/`; chưa chạy các ca biên và dữ liệu sai của API, kiểm thử phân quyền đầu-cuối hoặc kiểm thử tái lập trên môi trường sạch. Do đó chưa thể kết luận đã đủ năm loại kiểm thử Buổi 14.

Chưa có lượt chạy FAIL nào trong report này. Không suy diễn rằng hệ thống không còn bug từ kết quả PASS của các unit tests.
