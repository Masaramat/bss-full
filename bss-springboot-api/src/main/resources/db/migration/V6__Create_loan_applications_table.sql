CREATE TABLE loan_applications
(
    id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    amount_in_words          VARCHAR(255),
    status                   TINYINT,
    applied_at               TIMESTAMP,
    approved_at              TIMESTAMP,
    disbursed_at             TIMESTAMP,
    maturity                 TIMESTAMP,
    tenor                    INT,
    collateral_deposit DOUBLE,
    search_fee DOUBLE,
    forms_fee DOUBLE,
    amount_approved DOUBLE,
    amount_in_words_approved VARCHAR(255),
    tenor_approved           INT,
    days_overdue             BIGINT,
    applied_by_id            BIGINT,
    approved_by_id           BIGINT,
    disbursed_by_id          BIGINT,
    customer_id              BIGINT,
    loan_product_id          BIGINT,
    group_id                 BIGINT,

    CONSTRAINT fk_applied_by FOREIGN KEY (applied_by_id) REFERENCES users (id),
    CONSTRAINT fk_approved_by FOREIGN KEY (approved_by_id) REFERENCES users (id),
    CONSTRAINT fk_disbursed_by FOREIGN KEY (disbursed_by_id) REFERENCES users (id),
    CONSTRAINT fk_customer_loan_app FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_loan_product FOREIGN KEY (loan_product_id) REFERENCES loan_products (id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES customer_groups (id)
);

-- Optionally, create indexes for foreign key columns
CREATE INDEX idx_applied_by ON loan_applications (applied_by_id);
CREATE INDEX idx_approved_by ON loan_applications (approved_by_id);
CREATE INDEX idx_disbursed_by ON loan_applications (disbursed_by_id);
CREATE INDEX idx_customer ON loan_applications (customer_id);
CREATE INDEX idx_loan_product ON loan_applications (loan_product_id);
CREATE INDEX idx_group ON loan_applications (group_id);
