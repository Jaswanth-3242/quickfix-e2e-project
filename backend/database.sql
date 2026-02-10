-- Quick Fix Database Schema

CREATE DATABASE IF NOT EXISTS quickfix_db;
USE quickfix_db;

-- Users table (customers, providers, admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role ENUM('customer', 'provider', 'admin') DEFAULT 'customer',
    address TEXT,
    profile_image VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INT DEFAULT 60,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    provider_id INT NULL,
    service_id INT NOT NULL,
    urgency ENUM('normal', 'urgent', 'emergency') DEFAULT 'normal',
    time_slot VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    scheduled_date DATETIME NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Service providers specialization
CREATE TABLE provider_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    service_id INT NOT NULL,
    experience_years INT DEFAULT 0,
    certification VARCHAR(255),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE KEY unique_provider_service (provider_id, service_id)
);

-- Reviews and ratings
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    customer_id INT NOT NULL,
    provider_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Real-time tracking
CREATE TABLE tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    provider_id INT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status_message VARCHAR(255),
    estimated_arrival DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'payment', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO services (name, category, description, base_price) VALUES
('Electrical Repair', 'Electrical', 'Wiring, switch repairs, electrical installations', 500.00),
('Plumbing Service', 'Plumbing', 'Pipe repairs, leak fixing, installations', 400.00),
('Carpentry Work', 'Carpentry', 'Furniture repair, custom woodwork', 600.00),
('House Painting', 'Painting', 'Interior and exterior painting services', 350.00),
('AC Repair', 'Appliance', 'Air conditioner servicing and repair', 450.00),
('Home Cleaning', 'Cleaning', 'Deep cleaning and maintenance', 300.00);

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@quickfix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample provider
INSERT INTO users (name, email, password, phone, role) VALUES
('John Electrician', 'john@provider.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'provider');