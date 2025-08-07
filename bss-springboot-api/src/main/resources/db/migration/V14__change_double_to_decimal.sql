ALTER TABLE accounts
    MODIFY balance DECIMAL(38,2);

ALTER TABLE loan_applications
    MODIFY amount DECIMAL(38,2),
    MODIFY collateral_deposit DECIMAL(38,2),
    MODIFY search_fee DECIMAL(38,2),
    MODIFY forms_fee DECIMAL(38,2),
    MODIFY amount_approved DECIMAL(38,2);

ALTER TABLE loan_repayments
    MODIFY interest DECIMAL(38,2),
    MODIFY monitoring_fee DECIMAL(38,2),
    MODIFY processing_fee DECIMAL(38,2),
    MODIFY principal DECIMAL(38,2),
    MODIFY total DECIMAL(38,2),
    MODIFY total_due DECIMAL(38,2),
    MODIFY total_interest_paid DECIMAL(38,2),
    MODIFY total_paid DECIMAL(38,2);

ALTER TABLE transactions
    MODIFY amount DECIMAL(38,2);

ALTER TABLE adashe_setup
    MODIFY commission_rate DECIMAL(38,2),
    MODIFY minimum_deposit DECIMAL(38,2);

ALTER TABLE adashe_commissions
    MODIFY amount DECIMAL(38,2);

