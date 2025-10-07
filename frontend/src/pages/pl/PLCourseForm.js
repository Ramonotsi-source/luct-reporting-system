import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/pl.module.css';
import shared from '../../styles/shared.module.css';

export default function PLCourseForm() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    faculty: 'Faculty of Information & Communication Technology'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const programs = {
    'Faculty of Information & Communication Technology': [
      'Degree in Information Technology',
      'Degree in Software Engineering with Multi-Media',
      'Degree in Business Information Technology',
      'Diploma in Information Technology',
      'Diploma in Software Engineering with Multi-Media',
      'Diploma in Business Information Technology'
    ],
    'Faculty of Design and Innovation': [
      'Degree in Graphical Design',
      'Degree in Advertising',
      'Diploma in Graphical Design',
      'Diploma in Advertising',
      'Diploma in Fashion and Apparel Design'
    ],
    'Faculty of Communication, Media & Broadcasting': [
      'Degree in Professional communication',
      'Degree in Digital Film & Television',
      'Degree in Broadcasting & Journalism',
      'Diploma in Television and Film Production',
      'Diploma in Broadcasting',
      'Diploma in Digital Film & Television',
      'Diploma in Journalism and Media',
      'Diploma in Public Relations'
    ],
    'Faculty of Business Management & Globalization': [
      'Degree in International Business',
      'Degree in Entrepreneurship',
      'Degree in Human Resource Management',
      'Degree in Accounting',
      'Diploma in Business Management',
      'Diploma in Marketing',
      'Diploma in Human Resource Management',
      'Diploma in Retail Management'
    ],
    'Faculty of Creativity in Tourism And Hospitality': [
      'Degree in Tourism Management',
      'Diploma in International Tourism',
      'Diploma in Tourism Management',
      'Diploma in Hotel Management',
      'Diploma in Events Management'
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.course_name || !formData.course_code) {
      setError('Course name and code are required.');
      return;
    }

    try {
      await api.post('/courses', formData);
      setSuccess('✅ Course added successfully!');
      setTimeout(() => navigate('/pl/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add course. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>➕ Add New Course</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/pl/dashboard')}>
          ← Back
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name *</Form.Label>
              <Form.Select
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Program --</option>
                {programs[formData.faculty]?.map((course, idx) => (
                  <option key={idx} value={course}>
                    {course}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Course Code *</Form.Label>
              <Form.Control
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                placeholder="e.g., IT101"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Faculty *</Form.Label>
          <Form.Select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
          >
            {Object.keys(programs).map(fac => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2 mt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate('/pl/dashboard')}
            className="flex-grow-1"
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-grow-1">
            Add Course
          </Button>
        </div>
      </Form>
    </Container>
  );
}