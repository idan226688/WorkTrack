const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '*',
    database: 'employees'
  });

module.exports = pool.promise();