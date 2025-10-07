
import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/prl.module.css';
import shared from '../../styles/shared.module.css';

export default function PRLDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return navigate('/login', { replace: true });

    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'prl') return navigate('/login', { replace: true });
      setUser(parsed);

      const testApi = async () => {
        try {
          await api.get('/reports');
          setLoading(false);
        } catch (err) {
          setError('Failed to load dashboard. Check your faculty reports.');
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
      <div className={styles['prl-dashboard']}>
        <div className={shared['card']}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['prl-dashboard']}>
      <div className={styles['prl-header']}>
        <div>
          <h1>Welcome, {user?.name}</h1>
          <span className={`${shared['role-tag']} ${shared['role-prl']}`}>
            PRINCIPAL LECTURER ({user?.faculty})
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

      <div className={styles['prl-actions']}>
        <div className={styles['prl-card']}>
          <h3>📊 View Reports</h3>
          <p>View all lecture reports in your faculty stream.</p>
          <Button variant="primary" onClick={() => navigate('/prl/reports')}>View Reports</Button>
        </div>

        <div className={styles['prl-card']}>
          <h3>📥 Export Reports</h3>
          <p>Download reports in Excel format for analysis.</p>
          <Button variant="success" onClick={async () => {
            try {
              const response = await api.get('/export/reports', { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'lecture_reports.xlsx');
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              alert('Export failed. Please try again.');
            }
          }}>Export to Excel</Button>
        </div>
      </div>
    </div>
  );
}