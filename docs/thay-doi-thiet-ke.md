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