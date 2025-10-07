import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/lecturer.module.css';
import shared from '../../styles/shared.module.css';

export default function ReportForm() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    class_id: '',
    week_of_reporting: '',
    date_of_lecture: '',
    topic_taught: '',
    learning_outcomes: '',
    actual_students_present: '',
    recommendations: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/reports/my-classes');
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your classes. Please ensure you have assigned classes.');
        setLoading(false);
      }
    };

    if (user) fetchClasses();
  }, [user]);

  const handleClassChange = (e) => {
    setFormData(prev => ({ ...prev, class_id: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.class_id ||
      !formData.week_of_reporting ||
      !formData.date_of_lecture ||
      !formData.topic_taught ||
      !formData.actual_students_present
    ) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      await api.post('/reports', formData);
      setSuccess('✅ Lecture report submitted successfully!');
      setTimeout(() => navigate('/lecturer/reports'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report.');
    }
  };

  const selectedClass = classes.find(cls => cls.id == formData.class_id);

  if (loading) {
    return (
      <div className={styles['report-form']}>
        <div className={shared['card']}>
          <h2>📝 Lecture Report Form</h2>
          <p>Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['report-form']}>
      <div className={shared['card']}>
        <h2>📝 Lecture Report Form</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className={shared['form-section']}>
            <h4>Class Information</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Name</Form.Label>
                  <Form.Control value={user?.faculty || ''} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecturer’s Name</Form.Label>
                  <Form.Control value={user?.name || ''} disabled />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Class *</Form.Label>
                  <Form.Select 
                    value={formData.class_id}
                    onChange={handleClassChange}
                    required
                  >
                    <option value="">-- Select Your Class --</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} - {cls.course_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Week of Reporting *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="week_of_reporting"
                    value={formData.week_of_reporting}
                    onChange={handleChange}
                    placeholder="e.g., Week 3"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {selectedClass && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Name</Form.Label>
                      <Form.Control value={selectedClass.course_name} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Code</Form.Label>
                      <Form.Control value={selectedClass.course_code} disabled />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Registered Students</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={selectedClass.total_registered_students || ''}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Venue</Form.Label>
                      <Form.Control value={selectedClass.venue || ''} disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </div>

          <div className={shared['form-section']}>
            <h4>Lecture Details</h4>
            <Form.Group className="mb-3">
              <Form.Label>Date of Lecture *</Form.Label>
              <Form.Control 
                type="date" 
                name="date_of_lecture"
                value={formData.date_of_lecture}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Topic Taught *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="topic_taught"
                value={formData.topic_taught}
                onChange={handleChange}
                placeholder="Describe the main topic covered in this lecture"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Learning Outcomes of the Topic</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="learning_outcomes"
                value={formData.learning_outcomes}
                onChange={handleChange}
                placeholder="What should students be able to do after this lecture?"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Actual Number of Students Present *</Form.Label>
              <Form.Control 
                type="number" 
                name="actual_students_present"
                value={formData.actual_students_present}
                onChange={handleChange}
                min="0"
                required
              />
            </Form.Group>
          </div>

          <div className={shared['form-section']}>
            <h4>Feedback & Recommendations</h4>
            <Form.Group className="mb-3">
              <Form.Label>Lecturer’s Recommendations</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
                placeholder="Any suggestions for improvement, resources needed, or follow-up actions"
              />
            </Form.Group>
          </div>

          <Button 
            type="submit" 
            className={styles['submit-btn']}
            variant="success"
          >
            Submit Report
          </Button>
        </Form>
      </div>
    </div>
  );
}