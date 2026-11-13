# Minh chứng checklist Buổi 14

> Hồ sơ minh chứng này không thay thế bài nộp BT3 chính thức. Thông tin PASS/FAIL được ghi theo kết quả thực tế; không tạo bug hoặc commit chưa có.

1. **Repo:** [SmartCRM L8 CSAT/NPS](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps)
   - **Commit mới nhất:** [mở danh sách commit trên main](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commits/main)
   - **Sinh viên:** Đặng Quốc Hùng (2374802010160) · **Track:** SE

2. **Phản hồi BT2:** [docs/thay-doi-thiet-ke.md](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/blob/main/docs/thay-doi-thiet-ke.md).

3. **Test Plan:** [docs/test-plan.md](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/blob/main/docs/test-plan.md).

4. **Test Report:** [docs/test-report.md](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/blob/main/docs/test-report.md)
   - Số test case đã chạy thật: **12 / PASS: 12 / FAIL: 0**.
   - Đủ 5 loại (luồng đúng, biên, dữ liệu sai, bảo mật/chất lượng dữ liệu, tái lập): **Có** — thiếu loại: **không**.
   - Ảnh chụp kết quả: [docs/screenshots/](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/tree/main/docs/screenshots) — có TC-01 đến TC-12.

5. **Bug Log:** [docs/bug-log.md](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/blob/main/docs/bug-log.md)
   - BUG-01 · Chưa phân loại · Service chưa xác thực kiểu số nguyên của điểm khảo sát · [commit có chứa thay đổi](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/4f9b3ed95d8b83597710863717c7cb4def172888). Commit này gồm nhiều thay đổi, không phải commit riêng cho bug.
   - BUG-02 · Chưa có bug Buổi 14 được tái lập và xác nhận · Chưa có commit.
   - BUG-03 · Chưa có bug Buổi 14 được tái lập và xác nhận · Chưa có commit.

   Không đánh đồng các ca TC-07/08 (đã PASS khi request hợp lệ) với bug mới. Không tạo bug hoặc commit giả.

6. **Toàn bộ test PASS bằng một lệnh sau khi sửa bug:** **Chưa xác nhận** — 12/12 ca hệ thống đã PASS, nhưng chưa xác nhận có bug Buổi 14 được sửa và chưa chạy lại toàn bộ suite bằng một lệnh sau sửa.
   - Lệnh suite tự động hiện có: `npm --prefix src/backend test -- --runInBand` (lượt đã ghi nhận: 39 PASS / 0 FAIL).
   - **CI:** Chưa làm.

7. **Việc còn lại trước hạn BT3:**
   - Hoàn thiện và kiểm tra các tài liệu BT3, khai báo AI và yêu cầu nộp cuối; xác nhận link mở được ở cửa sổ ẩn danh.
   - Nếu cần đáp ứng yêu cầu bug của BT3, tiếp tục tái lập lỗi thật, mỗi bug một commit riêng; hiện hồ sơ chưa xác nhận đủ ba bug.
