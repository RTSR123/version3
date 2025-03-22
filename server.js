const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
  
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Error during login:', err.message);
        return res.json({ success: false, error: 'Database error. Please try again.' });
      }
      if (results.length === 0) {
        // Redirect to registration if the user is not found
        return res.redirect('/registration.html');
      }
      if (results[0].password === password) {
        return res.json({ success: true });
      }
      return res.json({ success: false, error: 'Invalid password' });
    });
  });
  

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
