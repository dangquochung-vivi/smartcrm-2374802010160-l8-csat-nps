# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
### Dự án: Smart CRM - Luồng L8: Khảo sát hài lòng CSAT / NPS
* Mã sinh viên: 2374802010160
* Họ và tên: Đặng Quốc Hùng
* Track: SE

## 1. Giới thiệu tổng quan & Định nghĩa thuật ngữ

### 1.1. Mục đích
Tài liệu này mô tả chi tiết các yêu cầu chức năng và phi chức năng đối với luồng L8 (Khảo sát hài lòng CSAT và NPS) trong hệ thống Smart CRM, nhằm phục vụ công tác đo lường mức độ hài lòng của khách hàng và lòng trung thành đối với doanh nghiệp.

### 1.2. Phạm vi hệ thống
Hệ thống cung cấp tính năng tự động gửi biểu mẫu khảo sát sau khi hoàn tất dịch vụ, thu thập phản hồi điểm số CSAT/NPS, lưu trữ ý kiến đóng góp chi tiết, cung cấp công cụ lọc/tìm kiếm cho nhân viên CSKH và tổng hợp báo cáo trực quan cho ban quản lý.

### 1.3. Định nghĩa thuật ngữ
* CSAT (Customer Satisfaction Score): Chỉ số đo lường sự hài lòng của khách hàng đối với dịch vụ.
* NPS (Net Promoter Score): Chỉ số đo lường mức độ sẵn sàng giới thiệu dịch vụ của khách hàng.
* FR (Functional Requirement): Yêu cầu chức năng của hệ thống.
* NFR (Non-Functional Requirement): Yêu cầu phi chức năng của hệ thống.
* MoSCoW: Phương pháp ưu tiên yêu cầu gồm các mức độ Must have, Should have, Could have, Won't have.

## 2. Mô tả tổng quan về Tác nhân và Use Case

### 2.1. Danh sách Tác nhân (Actors)
* Hệ thống CRM: Tự động kích hoạt các mốc thời gian và điều kiện để gửi form.
* Khách hàng: Người trực tiếp thực hiện đánh giá điểm số và đóng góp ý kiến.
* Nhân viên CSKH: Theo dõi, tiếp nhận, lọc và tìm kiếm các phản hồi khảo sát.
* Quản lý / Ban giám đốc: Xem Dashboard tổng hợp các chỉ số CSAT, NPS và đánh giá hiệu suất.

### 2.2. Danh sách Use Case tương ứng
* UC-01: Tự động kích hoạt & gửi form khảo sát.
* UC-02: Thực hiện đánh giá điểm số CSAT & NPS.
* UC-03: Nhập ý kiến đóng góp chi tiết.
* UC-04: Xem danh sách phản hồi khảo sát.
* UC-05: Lọc và tìm kiếm phản hồi theo tiêu chí.
* UC-06: Xem Dashboard tổng hợp chỉ số.

## 3. Yêu cầu chức năng (Functional Requirements)

* FR-L8-01 (Tự động gửi form): Hệ thống phải tự động gửi biểu mẫu khảo sát CSAT và NPS qua email hoặc SMS cho khách hàng ngay sau khi ticket hỗ trợ được đóng trạng thái Resolved (Thuộc User Story US-01, liên quan Use Case UC-01, mức độ ưu tiên Must Have).
* FR-L8-02 (Đánh giá điểm số): Giao diện biểu mẫu phải cung cấp thang điểm đánh giá từ 1 đến 5 cho CSAT và từ 0 đến 10 cho NPS, bắt buộc khách hàng nhập trước khi nộp (Thuộc User Story US-02, liên quan Use Case UC-02, mức độ ưu tiên Must Have).
* FR-L8-03 (Nhập ý kiến chi tiết): Cho phép khách hàng nhập nội dung văn bản góp ý bổ sung với giới hạn tối đa 500 ký tự (Thuộc User Story US-03, liên quan Use Case UC-03, mức độ ưu tiên Should Have).
* FR-L8-04 (Xem danh sách phản hồi): Cung cấp giao diện cho Nhân viên CSKH xem danh sách toàn bộ các phiếu khảo sát đã gửi về theo thời gian thực (Thuộc User Story US-04, liên quan Use Case UC-04, mức độ ưu tiên Must Have).
* FR-L8-05 (Lọc và tìm kiếm): Hỗ trợ bộ lọc tìm kiếm phản hồi theo khoảng thời gian, theo mức điểm số, hoặc theo tên khách hàng (Thuộc User Story US-05, liên quan Use Case UC-05, mức độ ưu tiên Should Have).
* FR-L8-06 (Hiển thị Dashboard): Cung cấp biểu đồ trực quan tổng hợp chỉ số CSAT trung bình và điểm số NPS theo tuần/tháng dành cho Quản lý (Thuộc User Story US-06, liên quan Use Case UC-06, mức độ ưu tiên Must Have).

## 4. Yêu cầu phi chức năng (Non-functional Requirements)

* NFR-01 (Hiệu năng phản hồi): Thời gian tải trang hiển thị danh sách phản hồi hoặc load biểu đồ Dashboard trên hệ thống phải nhỏ hơn hoặc bằng 2 giây dưới điều kiện chuẩn.
* NFR-02 (Tính bảo mật): Dữ liệu phản hồi và thông tin định danh của khách hàng phải được mã hóa ở mức cơ sở dữ liệu, đảm bảo phân quyền chặt chẽ chỉ nhân viên có thẩm quyền mới được truy cập.
* NFR-03 (Tính sẵn sàng): Hệ thống khảo sát trực tuyến phải đảm bảo thời gian hoạt động liên tục đạt tỷ lệ lớn hơn hoặc bằng 99.5% trong giờ hành chính.

## 5. Giao diện người dùng dự kiến (UI Wireframe Description)
* Màn hình Khảo sát: Thiết kế dạng Responsive tương thích tốt trên cả thiết bị di động và máy tính, bố cục trực quan với các nút bấm chọn điểm số to rõ.
* Màn hình Dashboard Quản lý: Trình bày dạng các thẻ thống kê tổng quan kết hợp biểu đồ cột hoặc đường thể hiện xu hướng biến động chỉ số NPS qua các tháng.

## 6. Bảng truy vết yêu cầu (Traceability Matrix)

* FR-L8-01: Tương ứng với User Story US-01 (Gửi form tự động), liên quan Use Case UC-01, mức độ ưu tiên Must Have.
* FR-L8-02: Tương ứng với User Story US-02 (Nhập điểm số đánh giá), liên quan Use Case UC-02, mức độ ưu tiên Must Have.
* FR-L8-03: Tương ứng với User Story US-03 (Gửi ý kiến phản hồi chi tiết), liên quan Use Case UC-03, mức độ ưu tiên Should Have.
* FR-L8-04: Tương ứng với User Story US-04 (Quản lý danh sách phản hồi), liên quan Use Case UC-04, mức độ ưu tiên Must Have.
* FR-L8-05: Tương ứng với User Story US-05 (Tìm kiếm và lọc dữ liệu khảo sát), liên quan Use Case UC-05, mức độ ưu tiên Should Have.
* FR-L8-06: Tương ứng với User Story US-06 (Thống kê báo cáo trên Dashboard), liên quan Use Case UC-06, mức độ ưu tiên Must Have.