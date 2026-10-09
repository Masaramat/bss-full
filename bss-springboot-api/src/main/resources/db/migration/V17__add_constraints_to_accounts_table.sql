
-- One account of type 0 per customer
CREATE UNIQUE INDEX uk_accounts_type_0_customer
    ON accounts (
        (CASE WHEN account_type = 0 THEN customer_id ELSE NULL END)
        );

-- One account of type 2 per customer
CREATE UNIQUE INDEX uk_accounts_type_2_customer
    ON accounts (
        (CASE WHEN account_type = 2 THEN customer_id ELSE NULL END)
        );

-- One account of type 1 per loan ID
CREATE UNIQUE INDEX uk_accounts_type_1_loan
    ON accounts (
        (CASE WHEN account_type = 1 THEN loan_id ELSE NULL END)
        );

-- Loan accounts must have a loan ID
ALTER TABLE accounts
    ADD CONSTRAINT chk_loan_account_has_loan_id
        CHECK (account_type <> 1 OR loan_id IS NOT NULL);