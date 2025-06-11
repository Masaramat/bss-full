CREATE TABLE transactions
(
    id          BINARY(16) PRIMARY KEY,
    amount DOUBLE NOT NULL,
    account_id  BIGINT,
    trx_no      VARCHAR(255),
    trx_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    user_id     BIGINT,

    CONSTRAINT fk_trx_account FOREIGN KEY (account_id) REFERENCES accounts (id),
    CONSTRAINT fk_trx_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Optionally, create indexes for foreign key columns
CREATE INDEX idx_account ON transactions (account_id);
CREATE INDEX idx_user ON transactions (user_id);
