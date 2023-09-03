const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
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
app.use(express.static(__dirname)); //css fix

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.send('Error fetching user.');
    } else {
      if (results.length === 0) {
        res.send('User not found.');
      } else {
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
          res.send('Login successful.');
          res.redirect('/submit');
        } else {
          res.send('Incorrect password.');
        }
      }
    }
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get('/submit', (req, res) => {
    // You can add authentication check here to ensure the user is logged in
    // For simplicity, we're assuming the user is authenticated
    res.sendFile(__dirname + '/submit.html');
  });
  
  app.post('/submit', (req, res) => {
    // You can add authentication check here to ensure the user is logged in
    // For simplicity, we're assuming the user is authenticated
    
    const userId = req.body.userId; // Replace with actual user ID
    const number = req.body.number;
    const date = req.body.date;
    
    const submissionData = {
      userId,
      number,
      date
    };
  
    const fileName = `submission_${userId}.json`;
  
    // Save submission data to a file on the server
    const fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(submissionData), (err) => {
      if (err) {
        console.error('Error saving data:', err);
        res.send('Error saving data.');
      } else {
        console.log('Data saved:', submissionData);
        res.send('Data saved successfully.');
      }
    });
  });
  app.use((req,res,next)=>{
    res.status(400).send('<h1>404 Not Found</h1>')
})
    