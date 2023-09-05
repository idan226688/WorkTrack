const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userRegistration = require('./routes/userRegistration');
const loginRoute = require('./routes/login');
const SubmitRoute = require('./routes/submit');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
  console.log("hey");
});

app.get('/register', (req, res) => {
  console.log('Accessing /register route');
  res.sendFile(__dirname + '/views/register.html');
});

app.get('/submit', (req, res) => {
  res.sendFile(__dirname + '/views/submit.html');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

loginRoute.setupLoginRoute(app)
userRegistration.setupRegistrationRoute(app);
SubmitRoute.setupSubmitRoute(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});