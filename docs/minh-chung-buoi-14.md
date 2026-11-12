# Minh chứng checklist Buổi 14

> Hồ sơ làm việc cho checklist Buổi 14; **không thay thế bài nộp BT3 chính thức**. PASS/FAIL và minh chứng chỉ ghi theo kết quả thực tế; các lượt gửi JSON sai cú pháp không được coi là đã xác minh nghiệp vụ.

1. **Repo:** [SmartCRM - L8 CSAT/NPS](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps)
   - **Commit mới nhất trên nhánh main:** [mở danh sách commit](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commits/main)
   - **Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE

2. **Phản hồi BT2:** [docs/thay-doi-thiet-ke.md](thay-doi-thiet-ke.md).

3. **Test Plan:** [docs/test-plan.md](test-plan.md).

4. **Test Report:** [docs/test-report.md](test-report.md)
   - Số test case hệ thống đã chạy và có kết quả: **9/12** / PASS: **8** / FAIL: **1**.
   - Đủ 5 loại: **Chưa** — có minh chứng cho 4/5 loại; còn thiếu **tái lập (TC-12)**.
   - Ảnh chụp kết quả: [docs/screenshots/](screenshots/). Có ảnh cho TC-01, TC-04 đến TC-11; ảnh TC-07 hiện tại là lượt cũ gửi JSON sai cú pháp, cần thay bằng ảnh lần chạy PASS mới. Email đã được che ở ảnh TC-07, TC-08 và TC-09.

5. **Bug Log:** [docs/bug-log.md](bug-log.md)
   - BUG-01 · Chưa phân loại trong Bug Log hiện có · API xác thực miền/kiểu điểm khảo sát · [commit 4f9b3ed](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/4f9b3ed95d8b83597710863717c7cb4def172888). Commit chứa nhiều thay đổi, không phải commit riêng cho bug.
   - BUG-02 · Chưa xác nhận bug Buổi 14 được tái lập/sửa · Chưa có commit.
   - BUG-03 · Chưa xác nhận bug Buổi 14 được tái lập/sửa · Chưa có commit.

   TC-07 đã PASS khi chạy lại bằng JSON hợp lệ (HTTP 400, `INVALID_TICKET_LOOKUP`, lỗi định dạng số điện thoại). TC-08 vẫn cần chạy lại bằng JSON hợp lệ. Không tạo bug hoặc commit giả.

6. **Toàn bộ test PASS bằng một lệnh sau khi sửa bug:** **Chưa** — TC-08 chưa đạt kết quả mong đợi, TC-12 chưa chạy và chưa có lượt chạy lại sau khi sửa bug Buổi 14. Cần bổ sung ảnh minh chứng cho lượt TC-07 PASS.
   **CI:** Chưa làm.

7. **Việc còn lại trước hạn BT3:**
   - Chụp ảnh lượt TC-07 PASS mới; chạy lại TC-08 bằng JSON hợp lệ; chạy TC-02, TC-03 và TC-12, chụp ảnh kết quả thật.
   - Chỉ ghi nhận/sửa bug sau khi tái lập; hoàn thiện tài liệu BT3, tự xác nhận khai báo AI và kiểm tra link công khai ở cửa sổ ẩn danh.
