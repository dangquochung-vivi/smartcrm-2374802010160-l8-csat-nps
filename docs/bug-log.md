# Nhật ký lỗi

## BUG-01 — Service chưa xác thực kiểu số nguyên của điểm khảo sát

- **Mức độ:** Chưa được phân loại trong Bug Log gốc; cần đánh giá theo tác động với người dùng và chất lượng dữ liệu.
- **Tái lập:** trước khi sửa, gọi `POST /surveys` qua service với điểm CSAT là chuỗi `"5"` hoặc giá trị thập phân `4.5`. So sánh phạm vi bằng toán tử `<`/`>` trong JavaScript không đảm bảo kiểu số nguyên.
- **Nguyên nhân:** service trước đây chỉ kiểm tra biên; không xác nhận kiểu số nguyên trước khi chuyển dữ liệu xuống repository.
- **Sửa:** kiểm tra payload, mã phiếu, kiểu số nguyên và giới hạn CSAT/NPS/nhận xét trong `surveyService`; API trả HTTP 400 với thông báo cụ thể cho dữ liệu sai.
- **Xác nhận:** các test hợp lệ, biên và dữ liệu sai trong `src/backend/tests/surveyService.test.js` chạy bằng lệnh test trong README.
- **Commit có chứa phần sửa:** [4f9b3ed](https://github.com/dangquochung-vivi/smartcrm-2374802010160-l8-csat-nps/commit/4f9b3ed95d8b83597710863717c7cb4def172888). Commit này bao gồm nhiều thay đổi chức năng, không phải commit riêng cho BUG-01; không đáp ứng yêu cầu Buổi 14 về một bug/một commit.

## Tình trạng Bug Log Buổi 14

Bug Log hiện có một lỗi lịch sử được mô tả ở trên. Chưa có minh chứng trong hồ sơ này cho BUG-02 hoặc BUG-03 được tái lập, sửa, kiểm thử lại và commit riêng. Không tạo mục bug giả để đủ số lượng; cần cập nhật sau khi phát hiện lỗi thật.
