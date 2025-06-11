CREATE TABLE loan_products
(
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(255) NOT NULL,
    interest_rate DOUBLE NOT NULL,
    monitoring_fee_rate DOUBLE NOT NULL,
    processing_fee_rate DOUBLE NOT NULL,
    tenor INT          NOT NULL
);
