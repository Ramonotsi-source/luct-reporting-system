import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/pl.module.css';
import shared from '../../styles/shared.module.css';

export default function PLReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        console.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className={styles['pl-dashboard']}>
        <div className={shared['card']}>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['pl-dashboard']}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Lecture Reports</h2>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Attendance</th>
            <th>PRL Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
              <td>{report.course_name}</td>
              <td>{report.lecturer_name}</td>
              <td>{report.topic_taught.substring(0, 30)}...</td>
              <td>{report.actual_students_present}/{report.total_registered_students}</td>
              <td>{report.prl_feedback || '—'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}