CREATE TABLE loan_liquidation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    user_id BIGINT,
    liquidation_reason VARCHAR(255),
    amount DECIMAL(38,2) NOT NULL,
    loan_amount DECIMAL(38,2),
    interest_amount DECIMAL(38,2),
    interest_paid_amount DECIMAL(38,2),
    liquidation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_liquidation_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id)
);
