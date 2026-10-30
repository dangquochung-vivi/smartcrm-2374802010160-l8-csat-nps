INSERT INTO service_center (center_name, address) VALUES
    ('Mekong Mobile - Quận 1', '123 Nguyễn Huệ, Q1, TP.HCM'),
    ('Mekong Mobile - Gò Vấp', '456 Quang Trung, Q.Gò Vấp, TP.HCM')
ON CONFLICT (center_name) DO NOTHING;

INSERT INTO ticket (ticket_code, center_id, customer_name, customer_phone, device_model, status)
SELECT seed.ticket_code, center.center_id, seed.customer_name, seed.customer_phone, seed.device_model, 'HOAN_TAT'
FROM (VALUES
    ('PB-2-00001', 'Mekong Mobile - Quận 1', 'Nguyễn Văn A', '0901234567', 'iPhone 14 Pro'),
    ('PB-2-00002', 'Mekong Mobile - Gò Vấp', 'Trần Thị B', '0907654321', 'Samsung Galaxy S23')
) AS seed(ticket_code, center_name, customer_name, customer_phone, device_model)
JOIN service_center AS center ON center.center_name = seed.center_name
ON CONFLICT (ticket_code) DO NOTHING;

INSERT INTO survey_ticket (ticket_id, csat_score, nps_score, feedback_content)
SELECT ticket.ticket_id, seed.csat_score, seed.nps_score, seed.feedback_content
FROM (VALUES
    ('PB-2-00001', 5, 9, 'Dịch vụ rất tốt'),
    ('PB-2-00002', 4, 8, 'Thái độ phục vụ hài lòng')
) AS seed(ticket_code, csat_score, nps_score, feedback_content)
JOIN ticket ON ticket.ticket_code = seed.ticket_code
ON CONFLICT (ticket_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('service_center', 'center_id'), COALESCE(MAX(center_id), 1), COUNT(*) > 0)
FROM service_center;
SELECT setval(pg_get_serial_sequence('ticket', 'ticket_id'), COALESCE(MAX(ticket_id), 1), COUNT(*) > 0)
FROM ticket;
SELECT setval(pg_get_serial_sequence('survey_ticket', 'survey_id'), COALESCE(MAX(survey_id), 1), COUNT(*) > 0)
FROM survey_ticket;
