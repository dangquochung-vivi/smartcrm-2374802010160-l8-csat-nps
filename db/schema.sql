-- Schema for SmartCRM L8 and the SE ticket/center CRUD module.

CREATE TABLE IF NOT EXISTS customer_account (
    email VARCHAR(254) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    password_salt BYTEA NOT NULL CHECK (octet_length(password_salt) = 16),
    password_hash BYTEA NOT NULL CHECK (octet_length(password_hash) = 64),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_center (
    center_id SERIAL PRIMARY KEY,
    center_name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) UNIQUE NOT NULL,
    center_id INT NOT NULL REFERENCES service_center(center_id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    device_model VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'MOI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS survey_ticket (
    survey_id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL UNIQUE REFERENCES ticket(ticket_id) ON DELETE RESTRICT,
    csat_score SMALLINT NOT NULL CHECK (csat_score BETWEEN 1 AND 5),
    nps_score SMALLINT NOT NULL CHECK (nps_score BETWEEN 0 AND 10),
    feedback_content VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_survey_scores ON survey_ticket(csat_score, nps_score);