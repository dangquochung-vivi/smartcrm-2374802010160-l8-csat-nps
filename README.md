"# SmartCRM - L8 CSAT NPS" 
# Smart CRM - L8 Khảo sát hài lòng CSAT / NPS

**sinh viên:** Đặng Quốc Hùng - MSSV: 2374802010160  
**Track:** SE  
**Học phần:** Chuyên đề tốt nghiệp 1 - Trường ĐH Văn Lang  

## 1. Mô tả bài toán
Luồng nghiệp vụ: Bắt đầu gửi khảo sát CSAT/NPS sau khi khách hàng hoàn tất giao dịch -> Khách hàng chấm điểm và đánh giá -> Lưu trữ kết quả -> Thống kê và hiển thị báo cáo độ hài lòng.

## 2. Phạm vi
- Làm: Xây dựng API và giao diện thu thập đánh giá CSAT/NPS, tính toán điểm số và báo cáo thống kê.
- Không làm: Các luồng quản lý nhân sự và phân quyền nâng cao ngoài phạm vi đồ án.

## 3. Công nghệ sử dụng
| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js / Express (hoặc Python Flask) |
| Frontend | ReactJS |
| Database | MongoDB Atlas / PostgreSQL |

## 4. Cấu trúc thư mục
## 5. Hướng dẫn cài đặt & chạy
## 6. Khai báo sử dụng công cụ AI
| Công cụ | Dùng vào việc gì | Cách tự kiểm chứng |
|---|---|---|
| Gemini | Hỗ trợ cấu trúc code và giải đáp thắc mắc cú pháp Git | Kiểm tra qua kết quả chạy thực tế và tài liệu hướng dẫn |
## 2. Yêu cầu môi trường
* Node.js v22 LTS (hoặc từ v20+)
* PostgreSQL 16 (hoặc SQLite 3)
* Biến môi trường: xem file `.env.example` (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `APP_PORT`)

## 6. Trạng thái hiện tại (Buổi 8)
* [x] Tạo file nhật ký thay đổi thiết kế `docs/thay-doi-thiet-ke.md` theo phản hồi BT1
* [x] Tạo cấu trúc thư mục `src/backend/` chuẩn 3 lớp: `routes/`, `services/`, `repositories/`
* [x] Đã khởi tạo schema SQL cho Luồng L8 (các bảng `service_center`, `ticket`, `survey_ticket`)
* [x] Hiện thực thành công API CRUD khảo sát CSAT & NPS (`/surveys`)