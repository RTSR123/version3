require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.message);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// API - Register User
app.post('/register', async (req, res) => {
  const { name, email, password, age, gender, income, marital_status, disability_status } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (name, email, password, age, gender, income, marital_status, disability_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, email, hashedPassword, age, gender, income, marital_status, disability_status];

    db.query(sql, values, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error hashing password' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
