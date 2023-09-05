const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../util/database');

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

module.exports = passport;