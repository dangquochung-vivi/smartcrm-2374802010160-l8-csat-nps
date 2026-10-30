# Tích hợp dataset Mekong Mobile (Track SE)

Dataset đề mô phỏng Mekong Mobile và được cung cấp cho mục đích học tập. Repo chỉ lưu mẫu nhỏ 300 phiếu đã chuẩn hóa tại `data/sample/tickets.csv`; các CSV lớn không được commit.

## Mapping dữ liệu

| Dataset đề | SmartCRM | Cách xử lý |
|---|---|---|
| `service_centers.csv` | `service_center` | Dùng tên trung tâm và thành phố làm địa chỉ |
| `tickets_history.csv` | `ticket` | Dùng mã phiếu, trạng thái, thời điểm nhận |
| `customers_raw.csv` | các cột khách trong `ticket` | Nối bằng `customer_id = record_id`; chuẩn hóa số điện thoại |
| `products.csv` | `ticket.device_model` | Nối bằng `product_id`, dùng `product_name` |
| `survey_responses.csv` | `survey_ticket` | Nối bằng ticket ID, lưu `score` thành CSAT và ngày phản hồi |

Khách hàng thiếu số điện thoại không được import thành phiếu vì cổng khách cần xác minh mã phiếu cùng số điện thoại. Trong bộ đề này có 483/7.800 phiếu thiếu số điện thoại; 145 phản hồi khảo sát liên kết với các phiếu đó cũng bị bỏ qua. Tên khách không dùng làm khóa. Trạng thái gốc được giữ nguyên; `DA_DONG` được công nhận là phiếu đã hoàn tất.

Dataset chỉ có CSAT 1–5, không có câu trả lời NPS. Vì vậy `survey_ticket.nps_score` cho phản hồi lịch sử là `NULL`; dashboard và danh sách hiển thị `—` khi chưa có NPS. Form khảo sát mới vẫn bắt buộc người dùng trả lời NPS 0–10.

## Nạp mẫu và nạp toàn bộ

`npm --prefix src/backend run db:setup` tạo schema và nạp mẫu nhỏ. `npm --prefix src/backend run db:seed` nạp lại mẫu; khóa ticket và phản hồi giúp không nhân đôi bản ghi.

Để nạp toàn bộ dataset:

1. Giải nén file đề vào `data/raw` từ PowerShell ở thư mục gốc repo:
   ```powershell
   Expand-Archive -LiteralPath "$HOME\Downloads\CDTN1_Mekong Mobile_Dataset Smart CRM.zip" -DestinationPath "data\raw"
   ```
2. Chạy:
   ```powershell
   npm --prefix src/backend run db:import-dataset -- data/raw/dataset
   ```

Import full không xóa dữ liệu sẵn có, bỏ qua số điện thoại thiếu/không hợp lệ và dùng `ON CONFLICT DO NOTHING` để có thể chạy lại. `data/raw/` bị Git ignore; không commit hoặc đẩy CSV gốc lên GitHub.
