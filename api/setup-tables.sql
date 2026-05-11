-- Run this once in your Ionos phpMyAdmin to create the required tables

CREATE TABLE IF NOT EXISTS tryout_registrations (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    age            INT,
    dob            DATE,
    parent_name    VARCHAR(200),
    parent_phone   VARCHAR(30),
    parent_email   VARCHAR(150),
    player_level   VARCHAR(50),
    preferred_days VARCHAR(200),
    preferred_time VARCHAR(50),
    referral        VARCHAR(200),
    assigned_coach  VARCHAR(100),
    medical_notes   TEXT,
    goals           TEXT,
    waiver_accepted ENUM('Yes','No') DEFAULT 'No',
    submitted_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_registrations (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    age            INT,
    dob            DATE,
    parent_name    VARCHAR(200),
    parent_phone   VARCHAR(30),
    parent_email   VARCHAR(150),
    player_level   VARCHAR(50),
    preferred_days VARCHAR(200),
    preferred_time  VARCHAR(50),
    assigned_coach  VARCHAR(100),
    medical_notes   TEXT,
    goals           TEXT,
    waiver_accepted ENUM('Yes','No') DEFAULT 'No',
    submitted_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
