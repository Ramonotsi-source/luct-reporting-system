import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/prl.module.css';
import shared from '../../styles/shared.module.css';

export default function PRLReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleAddFeedback = (report) => {
    setSelectedReport(report);
    setFeedback(report.prl_feedback || '');
    setShowFeedback(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      await api.post(`/reports/${selectedReport.id}/feedback`, { feedback });
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, prl_feedback: feedback } : r
      ));
      setShowFeedback(false);
    } catch (err) {
      alert('Failed to add feedback');
    }
  };

  if (loading) {
    return (
      <div className={styles['prl-dashboard']}>
        <div className={shared['card']}>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['prl-dashboard']}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Lecture Reports</h2>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Attendance</th>
            <th>Feedback</th>
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
              <td>
                <Button 
                  size="sm" 
                  variant={report.prl_feedback ? "success" : "outline-secondary"}
                  onClick={() => handleAddFeedback(report)}
                >
                  {report.prl_feedback ? "Edit Feedback" : "Add Feedback"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showFeedback} onHide={() => setShowFeedback(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Feedback for {selectedReport?.course_name}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedback(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitFeedback}>
            Save Feedback
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}