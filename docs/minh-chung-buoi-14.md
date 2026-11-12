# Minh chứng checklist Buổi 14

> Hồ sơ làm việc cho checklist Buổi 14; **không thay thế bài nộp BT3 chính thức**. Các số liệu dưới đây phân biệt kết quả đã chạy với các minh chứng còn thiếu. Không ghi nhận test, ảnh chụp hoặc commit chưa thực hiện.

1. **Repo:** [SmartCRM - L8 CSAT/NPS](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps)  
   **Commit mới nhất đã có trên repo:** [254b3494eb06b3f5b70da8ac73d809b95e77ebc2](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/254b3494eb06b3f5b70da8ac73d809b95e77ebc2)  
   **Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE

2. **Phản hồi BT2:** [docs/thay-doi-thiet-ke.md](thay-doi-thiet-ke.md) — TD-05 ghi nhận phản hồi và quyết định xử lý. Phản hồi: bảng kiểm chứng 4.2 đạt; cần có `docs/ai-disclosure.md` và hướng dẫn chạy test trong README. README hiện đã có lệnh test; file khai báo AI và PDF nộp chính thức còn cần hoàn tất.

3. **Test Plan:** [docs/test-plan.md](test-plan.md) — phạm vi, môi trường và 12 ca kiểm thử hệ thống dự kiến. Các ca trong kế hoạch chưa được tính là đã chạy.

4. **Test Report:** [docs/test-report.md](test-report.md)
   - Số test case đã chạy thật: **10 test tự động cấp unit** / Số PASS: **10** / Số FAIL: **0**.
   - Đây là suite Jest hiện có, không phải 10–12 ca kiểm thử hệ thống theo Test Plan Buổi 14.
   - Đủ 5 loại (luồng đúng, biên, dữ liệu sai, bảo mật/chất lượng dữ liệu, tái lập): **Chưa** — còn thiếu minh chứng chạy hệ thống cho giá trị biên, dữ liệu sai, kiểm thử tái lập và ảnh chụp.
   - Ảnh chụp kết quả: **Chưa có** trong `docs/screenshots/`; chưa có ảnh để liên kết.

5. **Bug Log:** [docs/bug-log.md](bug-log.md)
   - BUG-01: Chưa ghi nhận bug đã tái lập và sửa; chưa có commit xác nhận.
   - BUG-02: Chưa ghi nhận bug đã tái lập và sửa; chưa có commit xác nhận.
   - BUG-03: Chưa ghi nhận bug đã tái lập và sửa; chưa có commit xác nhận.
   
   Không điền bug hoặc link commit giả. Cần cập nhật từng mục sau khi tái lập, sửa, chạy xác nhận và tạo commit riêng cho bug đó.

6. **Toàn bộ test PASS bằng một lệnh sau khi sửa bug:** **Chưa xác nhận cho toàn bộ kiểm thử Buổi 14.** Suite Jest hiện có chạy PASS bằng:

   ```powershell
   npm --prefix src/backend test -- --runInBand
   ```

   **CI:** Chưa làm.

7. **Việc còn lại trước hạn BT3:**
   - Chạy 10–12 ca hệ thống trong Test Plan, ghi kết quả thật và lưu ảnh từng ca trong `docs/screenshots/`; tái lập/sửa bug thật (nếu có), mỗi bug một commit riêng.
   - Bổ sung `docs/ai-disclosure.md`, hoàn thiện tài liệu BT3 và xuất/nộp đúng định dạng PDF; xác nhận các liên kết công khai mở được ở cửa sổ ẩn danh.
