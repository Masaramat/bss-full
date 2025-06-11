CREATE TABLE adashe_commissions
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    account_id BIGINT,
    trx_id     VARCHAR(255),
    trx_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comm_account FOREIGN KEY (account_id) REFERENCES accounts (id)
);

-- Optionally, create an index for the foreign key column
CREATE INDEX idx_comm_account ON adashe_commissions (account_id);
