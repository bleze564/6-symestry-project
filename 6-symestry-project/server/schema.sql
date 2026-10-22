CREATE DATABASE IF NOT EXISTS investiq
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE investiq;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transactions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  description VARCHAR(255) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  amount_minor_units BIGINT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'UAH',
  occurred_at DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX transactions_user_date (user_id, occurred_at)
) ENGINE=InnoDB;

CREATE USER IF NOT EXISTS 'investiq_app'@'localhost'
  IDENTIFIED BY 'replace-with-your-local-password';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON investiq.* TO 'investiq_app'@'localhost';
