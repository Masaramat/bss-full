CREATE TABLE rejection
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reason VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    user_id BIGINT NOT NULL,

    loan_application_id BIGINT NOT NULL,
    rejection_date DATETIME DEFAULT CURRENT_TIMESTAMP
);