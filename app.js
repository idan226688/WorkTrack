const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userRegistration = require('./routes/userRegistration');
const db = require('./util/database'); 

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Authenticating with email and password
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.execute(sql, [email])
      .then(([rows]) => {
        if (rows.length === 0) {
          return done(null, false, { message: 'User not found.' });
        }
        const user = rows[0];
        return bcrypt.compare(password, user.password);
      })
      .then((match) => {
        if (match) {
          return done(null, user); // User authenticated
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      })
      .catch((err) => {
        return done(err);
      });
  }
));

// Serialize and deserialize user data for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.execute(sql, [id])
    .then(([rows]) => {
      if (rows.length === 0) {
        return done('User not found');
      }
      const user = rows[0];
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Login route using Passport.js for authentication
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/submit', // redirect on success
    failureRedirect: '/', // redirect on failure
    failureFlash: true
  })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Secure the /submit route with authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/submit', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/submit.html');
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(); // Passport.js function to log out the user
  res.redirect('/');
});

app.post('/submit', (req, res) => {
  const userId = req.body.userId; // replace with actual user ID
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

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.execute(checkEmailQuery, [email])
    .then(([rows]) => {
      if (rows.length > 0) {
        res.send('Email already exists.');
      } else {
        // If email doesn't exist, proceed with registration
        return userRegistration.registerUser(name, email, password);
      }
    })
    .then(() => {
      // Redirect to the login page after successful registration
      res.redirect('/login');
    })
    .catch((err) => {
      res.send('Error registering user.');
    });
});

//check users data at /view_users

// app.get('/view_users', (req, res) => {
//   const sql = 'SELECT id, name, email FROM users';
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching user data:', err);
//       res.status(500).json({ error: 'Error fetching user data.' });
//     } else {
//       res.status(200).json(results); // Send the data as JSON
//     }})
//     })
