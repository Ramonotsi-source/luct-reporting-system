import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/lecturer.module.css';
import shared from '../../styles/shared.module.css';

export default function LecturerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className={styles['lecturer-dashboard']}>
      <div className={styles['lecturer-header']}>
        <div>
          <h1>Welcome, {user.name}</h1>
          <span className={`${shared['role-tag']} ${shared['role-lecturer']}`}>
            LECTURER ({user.faculty})
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

      <div className={styles['lecturer-actions']}>
        <div className={styles['lecturer-card']}>
          <h3>📝 Submit Report</h3>
          <p>Fill out a lecture report form.</p>
          <Button variant="primary" onClick={() => navigate('/lecturer/report/new')}>
            New Report
          </Button>
        </div>

        <div className={styles['lecturer-card']}>
          <h3>📊 View My Reports</h3>
          <p>Monitor all your submitted reports.</p>
          <Button variant="info" onClick={() => navigate('/lecturer/reports')}>
            My Reports
          </Button>
        </div>
      </div>
    </div>
  );
}