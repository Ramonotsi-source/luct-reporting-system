CREATE DATABASE IF NOT EXISTS luct_reporting;
USE luct_reporting;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'prl', 'pl') NOT NULL,
    faculty VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    faculty VARCHAR(100),
    pl_id INT,
    FOREIGN KEY (pl_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    venue VARCHAR(100),
    scheduled_time TIME,
    day_of_week VARCHAR(20),
    total_registered_students INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE lecture_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    week_of_reporting VARCHAR(50) NOT NULL,
    date_of_lecture DATE NOT NULL,
    topic_taught TEXT NOT NULL,
    learning_outcomes TEXT,
    actual_students_present INT NOT NULL,
    recommendations TEXT,
    prl_feedback TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE lecture_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    lecture_report_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_report_id) REFERENCES lecture_reports(id) ON DELETE CASCADE
);

INSERT INTO Users (name, email, password, role, faculty) VALUES
('Dr Thokoane Lecturer', 'lecturer@limkokwing.al', '$2b$10$abcdefghijklmnopqrstuv', 'lecturer', 'Information & Communication Technology'),
(' Dahkops PRL', 'prl@limkokwing.al', '$2b$10$abcdefghijklmnopqrstuv', 'prl', 'Information & Communication Technology'),
(' Ramonotsi PL', 'pl@limkokwing.al', '$2b$10$abcdefghijklmnopqrstuv', 'pl', 'Information & Communication Technology'),
('Makopoi Ramonotsi', 'student@gmail.com', '$2b$10$abcdefghijklmnopqrstuv', 'student', 'Information & Communication Technology');

INSERT INTO courses (course_name, course_code, faculty, pl_id) VALUES
('Introduction to Programming', 'CS101', 'Information & Communication Technology', 3);

INSERT INTO classes (course_id, lecturer_id, class_name, venue, scheduled_time, day_of_week, total_registered_students) VALUES
(1, 1, 'CS101-A', 'MM7', '09:00:00', 'Monday', 50); 