# Minh chứng checklist Buổi 14

> Hồ sơ làm việc cho checklist Buổi 14; **không thay thế bài nộp BT3 chính thức**. Các số liệu dưới đây phân biệt kết quả đã chạy với các minh chứng còn thiếu. Không ghi nhận test, ảnh chụp hoặc commit chưa thực hiện.

1. **Repo:** [SmartCRM - L8 CSAT/NPS](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps)
   - **Commit gốc tham chiếu trước khi thêm hồ sơ này:** [0884c9c46d78bd2d131863fdc50902a6ebed1047](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/0884c9c46d78bd2d131863fdc50902a6ebed1047)
   - **Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE

2. **Phản hồi BT2:** [docs/thay-doi-thiet-ke.md](thay-doi-thiet-ke.md) — TD-05 ghi nhận phản hồi và quyết định xử lý. README đã có lệnh test và phần khai báo AI tổng quát; hồ sơ khai báo riêng, test docs và PDF nộp chính thức cần hoàn thiện/kiểm tra.

3. **Test Plan:** [docs/test-plan.md](test-plan.md) — phạm vi, môi trường và 12 ca kiểm thử hệ thống dự kiến. Các ca trong kế hoạch chưa được tính là đã chạy.

4. **Test Report:** [docs/test-report.md](test-report.md)
   - Kiểm thử hệ thống Buổi 14 đã chạy: **0/12** / PASS: **0** / FAIL: **0**.
   - Riêng suite tự động hiện có: **39 test / 39 PASS / 0 FAIL**, bằng lệnh `npm --prefix src/backend test -- --runInBand`. Đây là unit/service tests, không thay thế 12 ca kiểm thử hệ thống.
   - Đủ 5 loại cho kiểm thử hệ thống: **Chưa xác nhận** — các ca trong Test Plan chưa chạy.
   - Ảnh chụp kết quả: **Chưa có** trong `docs/screenshots/`.

5. **Bug Log:** [docs/bug-log.md](bug-log.md)
   - BUG-01 · Chưa phân loại trong Bug Log hiện có · API xác thực miền/kiểu điểm khảo sát · [commit 4f9b3ed](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/4f9b3ed95d8b83597710863717c7cb4def172888). Commit này chứa nhiều thay đổi, không phải commit riêng cho bug.
   - BUG-02 · Chưa có bug Buổi 14 được tái lập và xác nhận · Chưa có commit.
   - BUG-03 · Chưa có bug Buổi 14 được tái lập và xác nhận · Chưa có commit.
   
   Chưa đạt yêu cầu ba bug Buổi 14, mỗi bug một commit riêng. Không điền bug hoặc link commit giả.

6. **Toàn bộ test PASS bằng một lệnh sau khi sửa bug:** **Suite hiện có PASS, nhưng chưa xác nhận sau khi sửa ba bug Buổi 14.** Lệnh đã chạy:

   ```powershell
   npm --prefix src/backend test -- --runInBand
   ```

   **CI:** Chưa làm.

7. **Việc còn lại trước hạn BT3:**
   - Chạy 10–12 ca hệ thống trong Test Plan, ghi kết quả thật và lưu ảnh từng ca trong `docs/screenshots/`; tái lập/sửa bug thật (nếu có), mỗi bug một commit riêng.
   - Tự xác nhận `docs/ai-disclosure.md`, hoàn thiện tài liệu BT3 và xuất/nộp đúng định dạng PDF; xác nhận các liên kết công khai mở được ở cửa sổ ẩn danh.
