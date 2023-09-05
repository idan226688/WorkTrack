const db = require('../util/database'); // Import the database pool
const path = require('path');
const submitpath = path.join(__dirname, '..', '/pages/submit.html');

function setupSubmitRoute(app) {
  // Display the submission form
  app.get('/submit', (req, res) => {
    res.sendFile(submitpath);
  });

  // Handle form submission
  app.post('/submit', async (req, res) => {
    const { number, date, job } = req.body;

    // Prompt the user for confirmation
    res.send(
      `<html><body><form method="POST" action="/confirm-submit">
        <input type="hidden" name="number" value="${number}">
        <input type="hidden" name="date" value="${date}">
        <input type="hidden" name="job" value="${job}">
        Are you sure you want to submit this data?
        <button type="submit">Yes</button>
        <a href="/submit">No</a>
      </form></body></html>`
    );
  });

  // Handle confirmed form submission
  app.post('/confirm-submit', async (req, res) => {
    const userId = req.session.user.id; // Assuming you store user info in the session
    const { number, date, job } = req.body;

    try {
      // Insert the submission data into the database
      await db.query('INSERT INTO user_submissions (user_id, number, date, job) VALUES (?, ?, ?, ?)', [
        userId,
        number,
        date,
        job,
      ]);

      res.send('Submission successful. <a href="/history">View History</a>');
    } catch (error) {
      res.send('Error submitting data. <a href="/submit">Try Again</a>');
    }
  });
}

module.exports = {
  setupSubmitRoute,
};
