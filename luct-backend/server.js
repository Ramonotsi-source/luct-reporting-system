const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://luct-frontend.netlify.app']
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files (optional)
app.use(express.static(path.join(__dirname, '../frontend')));

// Sample API route (replace with your real routes)
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is LIVE! ✅" });
});

// Handle all other routes
app.get('*', (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Use PORT from environment (required for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});