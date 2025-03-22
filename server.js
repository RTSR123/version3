const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Connect to Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scheme_navigator'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL');
  }
});

// Serve Registration Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

// Handle Registration
app.post('/register', (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  
  db.query(sql, [`${first_name} ${last_name}`, email, password], (err) => {
    if (err) {
      console.error('Error registering user:', err.message);
      res.send('Error occurred. Please try again.');
    } else {
      res.send('Registration successful! <a href="login.html">Login here</a>');
    }
  });
});

// Serve Login Page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err.message);
      res.send('Error occurred. Please try again.');
    } else if (results.length > 0) {
      res.send('Login successful! <a href="result.html">Proceed to Dashboard</a>');
    } else {
      res.send('User not found. <a href="registration.html">Register here</a>');
    }
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
