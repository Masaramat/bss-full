CREATE TABLE message
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    message      VARCHAR(255),
    show_balance BOOLEAN NOT NULL,
    type         TINYINT,
    UNIQUE KEY uk_type (type)
);
