# Nhật ký lỗi

## BUG-01 — API nhận điểm khảo sát sai kiểu hoặc ngoài miền hợp lệ

- **Tái lập:** gửi `POST /surveys` với `csat_score` bằng chuỗi `"5"`, `csat_score` bằng `0`, hoặc `nps_score` bằng `11`.
- **Nguyên nhân:** service trước đây chỉ so sánh lớn/nhỏ; chuỗi số có thể lọt qua và giá trị không phải số có thể tạo thống kê sai.
- **Sửa:** kiểm tra payload, mã phiếu, kiểu số nguyên và giới hạn CSAT/NPS/nhận xét trong `surveyService`; API trả HTTP 400 với thông báo cụ thể cho dữ liệu sai.
- **Xác nhận:** các test hợp lệ, biên và dữ liệu sai trong `src/backend/tests/surveyService.test.js` chạy bằng lệnh test trong README.
