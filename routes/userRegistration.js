const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'your_database_name'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

function registerUser(name, email, password, callback) {
  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      callback(err, null);
      return;
    }

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        callback(err, null);
      } else {
        console.log('User registered:', result);
        callback(null, result);
      }
    });
  });
}

module.exports = {
  registerUser
};
