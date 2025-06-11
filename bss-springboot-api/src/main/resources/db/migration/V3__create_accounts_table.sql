CREATE TABLE accounts
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    account_type   TINYINT      NOT NULL,
    balance DOUBLE NOT NULL,
    account_status TINYINT      NOT NULL,
    loan_cycle     INT,
    loan_id        BIGINT,
    customer_id    BIGINT,
    account_number VARCHAR(10)  NOT NULL UNIQUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT uk_account_number UNIQUE (account_number)
);

CREATE INDEX idx_customer_id ON accounts (customer_id);
