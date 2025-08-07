CREATE TABLE loan_repayments
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT,
    interest DOUBLE NOT NULL,
    monitoring_fee DOUBLE NOT NULL,
    processing_fee DOUBLE NOT NULL,
    principal DOUBLE NOT NULL,
    status         TINYINT,
    maturity_date  TIMESTAMP,
    payment_date   TIMESTAMP,
    days_overdue   BIGINT,
    total DOUBLE NOT NULL,

    CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES loan_applications (id)
);

-- Optionally, create an index for the foreign key column
CREATE INDEX idx_application ON loan_repayments (application_id);
