CREATE TABLE customers
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(255),
    date_of_birth VARCHAR(255),
    bvn           BIGINT UNIQUE NULL, -- Add unique constraint here
    address       VARCHAR(255),
    customer_type TINYINT
);
