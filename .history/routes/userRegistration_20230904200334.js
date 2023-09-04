const bcrypt = require('bcrypt');
const db = require('../util/database');

function registerUser(name, email, password) {
  // Hash the password before saving it to the database
  return bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      return db.execute(sql, [name, email, hashedPassword]);
    })
    .then(([rows]) => {
      console.log('User registered:', rows);
      return rows;
    })
    .catch((err) => {
      console.error('Error registering user:', err);
      throw err;
    });
}

module.exports = {
  registerUser
};
