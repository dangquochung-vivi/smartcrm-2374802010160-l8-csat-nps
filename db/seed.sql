SELECT setval(pg_get_serial_sequence('service_center', 'center_id'), COALESCE(MAX(center_id), 1), COUNT(*) > 0)
FROM service_center;
SELECT setval(pg_get_serial_sequence('ticket', 'ticket_id'), COALESCE(MAX(ticket_id), 1), COUNT(*) > 0)
FROM ticket;
SELECT setval(pg_get_serial_sequence('survey_ticket', 'survey_id'), COALESCE(MAX(survey_id), 1), COUNT(*) > 0)
FROM survey_ticket;
