const bcrypt = require('bcrypt');
const db = require('../util/database');

async function registerUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the email already exists in the database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      throw new Error('Email already exists.');
    }

    // Insert the user into the database
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    return { success: true, message: 'User registered successfully.' };
  } catch (error) {
    return { success: false, message: error.message || 'Error registering user.' };
  }
}

function setupRegistrationRoute(app) {
  app.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.send('Passwords do not match.');
    }

    const result = await registerUser(name, email, password);

    if (result.success) {
      res.redirect('/login');
    } else {
      res.send(result.message);
    }
  });
}

module.exports = {
  setupRegistrationRoute,
};
