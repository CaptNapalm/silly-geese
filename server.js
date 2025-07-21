// File: server.js
// To run: `node server.js`
// Deploy easily on free platforms like Render, Railway, or Fly.io

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'reset.json');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Ensure reset file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ resetTime: Date.now() }));
}

// Endpoint to get reset time
app.get('/api/reset-time', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ resetTime: data.resetTime });
});

// Endpoint to update reset time
app.post('/api/reset-time', (req, res) => {
  const newTime = Date.now();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ resetTime: newTime }));
  res.json({ resetTime: newTime });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
Create a folder named "public" in the same directory as this file.
Place your HTML (from earlier) inside it as "index.html".
Update the HTML script to fetch reset time:

<script>
  let timer = 0;
  let resetTimestamp = 0;
  const timerDisplay = document.getElementById('timer');
  const resetButton = document.getElementById('reset');

  async function loadResetTime() {
    const res = await fetch('/api/reset-time');
    const data = await res.json();
    resetTimestamp = data.resetTime;
    updateTimer();
  }

  function updateTimer() {
    setInterval(() => {
      const seconds = Math.floor((Date.now() - resetTimestamp) / 1000);
      timerDisplay.textContent = seconds;
      document.title = `Silly goose behavior has been successfully avoided for ${seconds} seconds`;
    }, 1000);
  }

  resetButton.addEventListener('click', async () => {
    await fetch('/api/reset-time', { method: 'POST' });
    await loadResetTime();
  });

  loadResetTime();
</script>
*/
