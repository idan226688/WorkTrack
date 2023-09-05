const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const db = require('../util/database');
const path = require('path');
const loginpath=path.join(__dirname, '..', '/pages/login.html');
async function loginUser(email, password) {
  try {
    // Check if the email exists in the database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      throw new Error('User not found.');
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return { success: true, message: 'Login successful.', user };
    } else {
      throw new Error('Incorrect password.');
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error logging in.' };
  }
}

function setupLoginRoute(app) {
  app.get('/', (req, res) => {
        res.sendFile(loginpath);
      });
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    if (result.success) {
      // Store user information in the session
      req.session.user = result.user;

      res.redirect('/submit'); // Redirect to the secured page
    } else {
      res.send(result.message); // Show error message
    }
  });
}

module.exports = {
  setupLoginRoute,
};
