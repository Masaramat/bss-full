CREATE TABLE users
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    username   VARCHAR(255) NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    role       TINYINT      NOT NULL,
    password   VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN      NOT NULL
);