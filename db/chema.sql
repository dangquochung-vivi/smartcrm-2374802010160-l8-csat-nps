-- DDL Skeleton cho Luồng L8: Khảo sát hài lòng CSAT và NPS (Smart CRM - Mekong Mobile)

-- 1. Bảng Trung tâm bảo hành
CREATE TABLE IF NOT EXISTS service_center (
    center_id SERIAL PRIMARY KEY,
    center_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Phiếu bảo hành (Ticket)
CREATE TABLE IF NOT EXISTS ticket (
    ticket_id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) UNIQUE NOT NULL,
    center_id INT REFERENCES service_center(center_id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    device_model VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'MOI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Khảo sát CSAT & NPS (Survey Ticket)
CREATE TABLE IF NOT EXISTS survey_ticket (
    survey_id SERIAL PRIMARY KEY,
    ticket_id INT UNIQUE REFERENCES ticket(ticket_id) ON DELETE CASCADE,
    csat_score SMALLINT CHECK (csat_score BETWEEN 1 AND 5),
    nps_score SMALLINT CHECK (nps_score BETWEEN 0 AND 10),
    feedback_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Index hỗ trợ hiệu năng truy vấn cho NFR (Theo thiết kế TD-01)
CREATE INDEX IF NOT EXISTS idx_survey_ticket_id ON survey_ticket(ticket_id);
CREATE INDEX IF NOT EXISTS idx_survey_scores ON survey_ticket(csat_score, nps_score);

-- Dữ liệu mẫu (Seed data)
INSERT INTO service_center (center_id, center_name, address) VALUES 
(1, 'Mekong Mobile - Quận 1', '123 Nguyễn Huệ, Q1, TP.HCM'),
(2, 'Mekong Mobile - Gò Vấp', '456 Quang Trung, Q.Gò Vấp, TP.HCM')
ON CONFLICT (center_id) DO NOTHING;

INSERT INTO ticket (ticket_id, ticket_code, center_id, customer_name, customer_phone, device_model, status) VALUES 
(1, 'PB-2-00001', 1, 'Nguyễn Văn A', '0901234567', 'iPhone 14 Pro', 'HOAN_TAT'),
(2, 'PB-2-00002', 2, 'Trần Thị B', '0907654321', 'Samsung Galaxy S23', 'HOAN_TAT')
ON CONFLICT (ticket_id) DO NOTHING;

INSERT INTO survey_ticket (survey_id, ticket_id, csat_score, nps_score, feedback_content) VALUES 
(1, 1, 5, 9, 'Dịch vụ rất tốt'),
(2, 2, 4, 8, 'Thái độ phục vụ hài lòng')
ON CONFLICT (survey_id) DO NOTHING;