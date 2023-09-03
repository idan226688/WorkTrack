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
app.use(express.static(__dirname));

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
    // add authentication later
    res.sendFile(__dirname + '/submit.html');
  });
  
  app.post('/submit', (req, res) => {
    // add authentication later
    
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

// registration
const userRegistration = require('./routes/userRegistration'); // Import the module

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
  });
  
  app.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    //use the registerUser function from the module
    registration.registerUser(name, email, password, (err, result) => {
      if (err) {
        res.send('Error registering user.');
      } else {
        res.send('User registered successfully.');
      }
    });
  });

  //check users data at /view_users

  app.get('/view_users', (req, res) => {
    const sql = 'SELECT id, name, email FROM users';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Error fetching user data.' });
      } else {
        res.status(200).json(results); // Send the data as JSON
      }
    });
  });
  
  