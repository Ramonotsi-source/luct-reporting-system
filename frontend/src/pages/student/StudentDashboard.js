import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/student.module.css';
import shared from '../../styles/shared.module.css';

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className={styles['student-dashboard']}>
      <div className={styles['student-header']}>
        <div>
          <h1>Welcome, {user.name}</h1>
          <span className={`${shared['role-tag']} ${shared['role-student']}`}>
            STUDENT ({user.faculty})
          </span>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Back</Button>
          <Button variant="outline-danger" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
          }}>Logout</Button>
        </div>
      </div>

      <div className={styles['student-actions']}>
        <div className={styles['student-card']}>
          <h3>📊 View Reports</h3>
          <p>Monitor lecture reports for your courses.</p>
          <Button variant="primary" onClick={() => navigate('/student/reports')}>
            View Reports
          </Button>
        </div>

        <div className={styles['student-card']}>
          <h3>⭐ Rate Lectures</h3>
          <p>Provide feedback on lectures you attended.</p>
          <Button variant="warning" onClick={() => navigate('/student/reports')}>
            Rate Lectures
          </Button>
        </div>
      </div>
    </div>
  );
}