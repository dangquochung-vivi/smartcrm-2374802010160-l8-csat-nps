# Nhật ký thay đổi thiết kế
## Sau phản hồi Bài tập 1 (Buổi 8)

### TD-01 Bổ sung index và tối ưu truy vấn thống kê CSAT/NPS
- **Phản hồi của GV:** Cần đảm bảo các cột lọc điểm số có cơ chế đánh index để phục vụ báo cáo Dashboard nhanh chóng.
- **Quyết định:** SỬA
- **Lý do:** Đáp ứng yêu cầu hiệu năng NFR01 (tải dashboard dưới 2 giây).
- **Ảnh hưởng:** Bổ sung các câu lệnh `CREATE INDEX` vào file `schema.sql` trong thư mục `db/`.

### TD-02 Giữ nguyên mô hình 3 bảng cốt lõi cho luồng L8
- **Phản hồi của GV:** Đảm bảo các bảng dữ liệu liên kết chặt chẽ không có bảng cô lập.
- **Quyết định:** GIỮ NGUYÊN
- **Lý do:** 3 bảng (`service_center`, `ticket`, `survey_ticket`) đã bao trọn vẹn luồng nghiệp vụ khảo sát từ gửi phiếu đến lưu đánh giá.
- **Ảnh hưởng:** Không thay đổi cấu trúc ERD đã vẽ.

### TD-03 Bổ sung cổng tài khoản khách hàng cho prototype L8
- **Nguồn yêu cầu:** Bổ sung luồng khách hàng đăng ký từ yêu cầu hoàn thiện giao diện.
- **Quyết định:** SỬA
- **Lý do:** Khách hàng cần một điểm vào riêng để gửi đánh giá sau dịch vụ, tách khỏi dashboard nội bộ.
- **Ảnh hưởng:** Thêm đăng ký/đăng nhập khách hàng bằng email, form gửi CSAT/NPS; API lấy thông tin khách hàng từ token và chặn khách đọc danh sách/thống kê nội bộ.

### TD-04 Phân biệt chức năng prototype với yêu cầu SRS chưa triển khai
- **Nguồn yêu cầu:** Đối chiếu prototype hiện tại với FR-L8-01, FR-L8-05, FR-L8-06 và NFR-02.
- **Quyết định:** GHI RÕ TRẠNG THÁI
- **Lý do:** Tránh mô tả sai rằng ứng dụng đã tự gửi SMS/email, lọc đầy đủ, có biểu đồ xu hướng hoặc lưu dữ liệu bền vững.
- **Ảnh hưởng:** README và SRS ghi rõ các phần còn thiếu; hiện tại khảo sát/tài khoản đăng ký lưu trong bộ nhớ, portal nhận phản hồi qua form thủ công.