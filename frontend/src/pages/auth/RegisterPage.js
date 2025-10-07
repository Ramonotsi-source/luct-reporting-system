import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../index.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [faculty, setFaculty] = useState('Faculty of Information & Communication Technology');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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

  const courseOptions = programs[faculty] || [];
  const yearOptions = courseOptions.includes(course) && course.toLowerCase().includes('degree') ? [1,2,3,4] : [1,2,3];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 6 || password.length > 20) {
      setError('Password must be 6–20 characters');
      setLoading(false);
      return;
    }

    if (role === 'student' && (!course || !year)) {
      setError('Course and Year are required for students');
      setLoading(false);
      return;
    }

    try {
      const userData = { name, email, password, role, faculty };
      if (role === 'student') {
        userData.course = course;
        userData.year = year;
      }

      await api.post('/auth/register', userData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <h2 className="text-center mb-4">LUCT Registration</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="prl">Principal Lecturer (PRL)</option>
              <option value="pl">Program Leader (PL)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Faculty</Form.Label>
            <Form.Select value={faculty} onChange={(e) => setFaculty(e.target.value)} required>
              {Object.keys(programs).map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {role === 'student' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Course *</Form.Label>
                <Form.Select value={course} onChange={(e) => setCourse(e.target.value)} required>
                  <option value="">-- Select Course --</option>
                  {courseOptions.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Year of Study *</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(e.target.value)} required disabled={!course}>
                  <option value="">-- Select Year --</option>
                  {yearOptions.map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}

          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>Already have an account? <a href="/login">Login here</a></small>
        </div>
      </Card>
    </div>
  );
}