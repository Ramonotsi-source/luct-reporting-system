import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/pl.module.css';
import shared from '../../styles/shared.module.css';

export default function PLDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return navigate('/login', { replace: true });

    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'pl') return navigate('/login', { replace: true });
      setUser(parsed);

      const testApi = async () => {
        try {
          await api.get('/courses');
          setLoading(false);
        } catch (err) {
          setError('Failed to load dashboard. Check your faculty courses.');
          setLoading(false);
        }
      };
      testApi();
    } catch (e) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles['pl-dashboard']}>
        <div className={shared['card']}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['pl-dashboard']}>
      <div className={styles['pl-header']}>
        <div>
          <h1>Welcome, {user?.name}</h1>
          <span className={`${shared['role-tag']} ${shared['role-pl']}`}>
            PROGRAM LEADER ({user?.faculty})
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

      {error && <Alert variant="danger" className="m-3">{error}</Alert>}

      <div className={styles['pl-actions']}>
        <div className={styles['pl-card']}>
          <h3>➕ Add New Course</h3>
          <p>Create and manage new courses in your program.</p>
          <Button variant="primary" onClick={() => navigate('/pl/course/add')}>
            Add Course
          </Button>
        </div>

        <div className={styles['pl-card']}>
          <h3>👨‍🏫 Assign Lecturer</h3>
          <p>Assign lecturers to existing courses or classes.</p>
          <Button variant="warning" onClick={() => navigate('/pl/lecturer/assign')}>
            Assign Lecturer
          </Button>
        </div>

        <div className={styles['pl-card']}>
          <h3>📚 Manage Courses</h3>
          <p>View and edit all courses in your faculty.</p>
          <Button variant="success" onClick={() => navigate('/pl/courses')}>
            Manage Courses
          </Button>
        </div>

        <div className={styles['pl-card']}>
          <h3>📊 View Reports</h3>
          <p>Monitor all lecture reports from your program.</p>
          <Button variant="info" onClick={() => navigate('/pl/reports')}>
            View Reports
          </Button>
        </div>
      </div>
    </div>
  );
}