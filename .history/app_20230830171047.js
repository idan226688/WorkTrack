const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  const sql = 'INSERT INTO user_details (name, email) VALUES (?, ?)';
  connection.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      res.send('Error saving data.');
    } else {
      console.log('Data saved:', result);
      res.send('Data saved successfully.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
